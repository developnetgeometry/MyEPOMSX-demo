import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { Check, Loader2, PlusCircle, X } from "lucide-react";
import { User, UserProject } from "@/types/admin";
import {
  Project,
  getAllProjects,
  assignUserToProject,
  removeUserFromProject,
} from "@/utils/project-utils";

// Define a custom type for user project relations using the updated Project type
interface UserProjectWithRelations {
  id: string;
  user_id: string;
  project_id: string;
  user: User | null;
  project:
    | (Project & {
        description?: string | null;
        short_name?: string | null;
      })
    | null;
}

const ProjectAssignment: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [userProjects, setUserProjects] = useState<UserProjectWithRelations[]>(
    []
  );
  const [selectedTab, setSelectedTab] = useState<string>("by-user");

  // Form states
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedProject, setSelectedProject] = useState<
    | (Project & { description?: string | null; short_name?: string | null })
    | null
  >(null);
  const [assignedProjects, setAssignedProjects] = useState<
    (Project & { description?: string | null; short_name?: string | null })[]
  >([]);
  const [assignedUsers, setAssignedUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
    fetchProjects();
    fetchUserProjects();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Using the rpc call that we've created specifically for this purpose
      const { data, error } = await supabase.rpc(
        "get_users_for_project_assignment"
      );

      if (error) throw error;
      setUsers((data || []) as User[]);
    } catch (error: any) {
      // Try fallback to direct query if the RPC function doesn't exist
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, email, full_name")
          .order("full_name");

        if (error) throw error;
        setUsers((data || []) as User[]);
      } catch (innerError: any) {
        toast({
          title: "Error fetching users",
          description: innerError.message,
          variant: "destructive",
        });
        console.error("User fetch error:", innerError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      // Use the getAllProjects utility function to get all projects
      const allProjects = await getAllProjects();

      // Get additional details like purpose and short_name
      const { data, error } = await supabase
        .from("e_project")
        .select("id, project_name, project_code, project_purpose, short_name")
        .order("project_name");

      if (error) throw error;

      // Create a mapping of id to extended project data
      const projectDetailsMap = new Map();
      (data || []).forEach((p) => {
        projectDetailsMap.set(p.id.toString(), {
          description: p.project_purpose || null,
          short_name: p.short_name || null,
        });
      });

      // Enhance the projects with additional details
      const enhancedProjects = allProjects.map((p) => ({
        ...p,
        description: projectDetailsMap.get(p.id)?.description || null,
        short_name: projectDetailsMap.get(p.id)?.short_name || null,
      }));

      setProjects(enhancedProjects as any);
    } catch (error: any) {
      toast({
        title: "Error fetching projects",
        description: error.message,
        variant: "destructive",
      });
      console.error("Project fetch error:", error);
    }
  };

  const fetchUserProjects = async () => {
    setIsLoading(true);
    try {
      // Using an explicit join approach to ensure proper typings
      const { data, error } = await supabase.from("user_projects").select(`
          id, 
          user_id, 
          project_id,
          profiles!user_projects_user_id_fkey(id, full_name, email),
          e_project!user_projects_project_id_fkey(id, project_name, project_code, project_purpose, short_name)
        `);

      if (error) throw error;

      // Transform the data to match our expected format with user and project objects
      const transformedData = (data || []).map((up) => {
        // Ensure the types match our utility type
        return {
          id: up.id,
          user_id: up.user_id,
          project_id: up.project_id.toString(), // Convert to string to match our Project type
          user: up.profiles,
          project: {
            id: up.e_project.id.toString(), // Convert to string to match our Project type
            name: up.e_project.project_name || up.e_project.project_code,
            project_code: up.e_project.project_code || "",
            project_name: up.e_project.project_name,
            // Extended properties
            description: up.e_project.project_purpose,
            short_name: up.e_project.short_name,
          },
        };
      });

      setUserProjects(transformedData as UserProjectWithRelations[]);
    } catch (error: any) {
      // If the join approach fails, try a simpler query and construct the relations manually
      try {
        const { data: userProjectsData, error: userProjectsError } =
          await supabase.from("user_projects").select("*");

        if (userProjectsError) throw userProjectsError;

        if (userProjectsData?.length) {
          // Get all related users and projects in bulk
          const userIds = [
            ...new Set(userProjectsData.map((up) => up.user_id)),
          ];
          const projectIds = [
            ...new Set(userProjectsData.map((up) => up.project_id)),
          ];

          const [usersResult, projectsResult] = await Promise.all([
            supabase.from("profiles").select("*").in("id", userIds),
            supabase.from("e_project").select("*").in("id", projectIds),
          ]);

          if (usersResult.error) throw usersResult.error;
          if (projectsResult.error) throw projectsResult.error;

          // Create lookup maps
          const usersMap = new Map(
            usersResult.data.map((user) => [user.id, user])
          );
          const projectsMap = new Map(
            projectsResult.data.map((project) => [project.id, project])
          );

          // Construct the joined data
          const transformedData = userProjectsData.map((up) => {
            const user = usersMap.get(up.user_id);
            const project = projectsMap.get(Number(up.project_id));

            return {
              id: up.id,
              user_id: up.user_id,
              project_id: up.project_id.toString(), // Convert to string to match our Project type
              user: user || null,
              project: project
                ? {
                    id: project.id.toString(), // Convert to string to match our Project type
                    name: project.project_name || project.project_code,
                    project_code: project.project_code || "",
                    project_name: project.project_name,
                    // Extended properties
                    description: project.project_purpose,
                    short_name: project.short_name,
                  }
                : null,
            };
          });

          setUserProjects(transformedData as UserProjectWithRelations[]);
        } else {
          setUserProjects([]);
        }
      } catch (innerError: any) {
        toast({
          title: "Error fetching user projects",
          description: innerError.message,
          variant: "destructive",
        });
        console.error("User projects fetch error (fallback):", innerError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedUserId) {
      // Set selected user
      const user = users.find((u) => u.id === selectedUserId);
      setSelectedUser(user || null);

      // Find projects assigned to this user
      const userProjectAssignments = userProjects.filter(
        (up) => up.user_id === selectedUserId
      );

      // Extract project objects
      const assignedProjectsList = userProjectAssignments
        .filter((up) => up.project) // Ensure project exists
        .map((up) => up.project);

      setAssignedProjects(assignedProjectsList);
    } else {
      setSelectedUser(null);
      setAssignedProjects([]);
    }
  }, [selectedUserId, users, userProjects]);

  useEffect(() => {
    if (selectedProjectId !== null) {
      // Set selected project
      const project = projects.find((p) => p.id === selectedProjectId);
      setSelectedProject(project || null);

      // Find users assigned to this project
      const projectUserAssignments = userProjects.filter(
        (up) => up.project_id === selectedProjectId
      );

      // Extract user objects
      const assignedUsersList = projectUserAssignments
        .filter((up) => up.user) // Ensure user exists
        .map((up) => up.user);

      setAssignedUsers(assignedUsersList);
    } else {
      setSelectedProject(null);
      setAssignedUsers([]);
    }
  }, [selectedProjectId, projects, userProjects]);

  const handleAssignProject = async () => {
    if (!selectedUserId || selectedProjectId === null) return;

    setIsLoading(true);

    try {
      // Use our utility function to assign user to project
      const { success, error } = await assignUserToProject(
        selectedUserId,
        selectedProjectId.toString() // Convert to string as our utility expects string IDs
      );

      if (!success) {
        throw new Error(error || "Failed to assign user to project");
      }

      toast({
        title: "Assignment successful",
        description: "User has been assigned to the project.",
      });

      // Refresh data
      fetchUserProjects();
    } catch (error: any) {
      toast({
        title: "Assignment failed",
        description: error.message,
        variant: "destructive",
      });
      console.error("Assignment error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAssignment = async (
    userId: string,
    projectId: string | number
  ) => {
    setIsLoading(true);

    try {
      // Use our utility function to remove user from project
      const { success, error } = await removeUserFromProject(
        userId,
        projectId.toString() // Convert to string as our utility expects string IDs
      );

      if (!success) {
        throw new Error(error || "Failed to remove user from project");
      }

      toast({
        title: "Assignment removed",
        description: "User has been removed from the project.",
      });

      // Refresh data
      fetchUserProjects();
    } catch (error: any) {
      toast({
        title: "Removal failed",
        description: error.message,
        variant: "destructive",
      });
      console.error("Removal error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-6 w-[400px] mx-auto">
            <TabsTrigger value="by-user">Assign by User</TabsTrigger>
            <TabsTrigger value="by-project">Assign by Project</TabsTrigger>
          </TabsList>

          <TabsContent value="by-user">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="select-user">Select User</Label>
                  <Select
                    value={selectedUserId}
                    onValueChange={setSelectedUserId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedUser && (
                  <div className="space-y-2">
                    <Label>User Details</Label>
                    <div className="bg-muted p-3 rounded-md">
                      <p>
                        <strong>Name:</strong> {selectedUser.full_name}
                      </p>
                      <p>
                        <strong>Email:</strong> {selectedUser.email}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="select-project">Assign Project</Label>
                  <div className="flex space-x-2">
                    <div className="flex-grow">
                      <Select
                        value={
                          selectedProjectId !== null ? selectedProjectId : ""
                        }
                        onValueChange={(value) =>
                          setSelectedProjectId(value || null)
                        }
                        disabled={!selectedUserId || isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem
                              key={project.id}
                              value={String(project.id)}
                            >
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={handleAssignProject}
                      disabled={
                        !selectedUserId || !selectedProjectId || isLoading
                      }
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <PlusCircle className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {selectedUser && (
                  <div className="space-y-2">
                    <Label>Assigned Projects</Label>
                    <div className="bg-muted p-3 rounded-md min-h-[150px] max-h-[300px] overflow-y-auto">
                      {assignedProjects.length > 0 ? (
                        <div className="space-y-2">
                          {assignedProjects.map((project) => (
                            <div
                              key={project.id}
                              className="flex items-center justify-between bg-background p-2 rounded-md"
                            >
                              <div>
                                <p className="font-medium">{project.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {project.description}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleRemoveAssignment(
                                    selectedUserId,
                                    project.id
                                  )
                                }
                                disabled={isLoading}
                              >
                                <X className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground">
                          No projects assigned
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="by-project">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="select-project">Select Project</Label>
                  <Select
                    value={selectedProjectId !== null ? selectedProjectId : ""}
                    onValueChange={(value) =>
                      setSelectedProjectId(value || null)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={String(project.id)}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedProject && (
                  <div className="space-y-2">
                    <Label>Project Details</Label>
                    <div className="bg-muted p-3 rounded-md">
                      <p>
                        <strong>Name:</strong> {selectedProject.name}
                      </p>
                      <p>
                        <strong>Description:</strong>{" "}
                        {selectedProject.description || "N/A"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="select-user">Assign User</Label>
                  <div className="flex space-x-2">
                    <div className="flex-grow">
                      <Select
                        value={selectedUserId}
                        onValueChange={setSelectedUserId}
                        disabled={!selectedProjectId || isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a user" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.full_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={handleAssignProject}
                      disabled={
                        !selectedUserId || !selectedProjectId || isLoading
                      }
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <PlusCircle className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {selectedProject && (
                  <div className="space-y-2">
                    <Label>Assigned Users</Label>
                    <div className="bg-muted p-3 rounded-md min-h-[150px] max-h-[300px] overflow-y-auto">
                      {assignedUsers.length > 0 ? (
                        <div className="space-y-2">
                          {assignedUsers.map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center justify-between bg-background p-2 rounded-md"
                            >
                              <div>
                                <p className="font-medium">{user.full_name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {user.email}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleRemoveAssignment(
                                    user.id,
                                    selectedProjectId
                                  )
                                }
                                disabled={isLoading}
                              >
                                <X className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground">
                          No users assigned
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProjectAssignment;
