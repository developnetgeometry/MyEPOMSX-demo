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
import {
  User,
  Project,
  UserProject,
  UserProjectWithRelations,
} from "@/types/admin";

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
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [assignedProjects, setAssignedProjects] = useState<Project[]>([]);
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
      const { data, error } = await supabase
        .from("e_project") // Use the actual table name from the database
        .select("id, project_name, project_code, project_purpose, short_name")
        .order("project_name");

      if (error) throw error;

      // Map to the Project interface, using project_name as name for UI compatibility
      const projectsData = (data || []).map((p) => ({
        id: p.id,
        name: p.project_name || p.project_code, // Use project_name if available, fallback to code
        description: p.project_purpose || null,
        project_code: p.project_code,
        project_name: p.project_name,
        short_name: p.short_name,
      }));

      setProjects(projectsData as Project[]);
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
        // Ensure the types are explicitly converted as needed
        return {
          id: up.id,
          user_id: up.user_id,
          project_id: Number(up.project_id), // Ensure it's a number
          user: up.profiles,
          project: {
            id: Number(up.e_project.id), // Ensure it's a number
            name: up.e_project.project_name || up.e_project.project_code,
            description: up.e_project.project_purpose,
            project_code: up.e_project.project_code,
            project_name: up.e_project.project_name,
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
              project_id: Number(up.project_id),
              user: user || null,
              project: project
                ? {
                    id: Number(project.id),
                    name: project.project_name || project.project_code,
                    description: project.project_purpose,
                    project_code: project.project_code,
                    project_name: project.project_name,
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
      // Our assign_user_to_project function already checks for duplicate assignments internally
      // and handles all the type conversions properly
      const { error } = await supabase.rpc("assign_user_to_project", {
        p_user_id: selectedUserId,
        p_project_id: selectedProjectId,
      });

      // If the RPC function doesn't exist, try a direct query with correct types
      if (error && error.message.includes("function does not exist")) {
        // First check if assignment already exists to avoid duplicate entries
        const { data: existingAssignment, error: checkError } = await supabase
          .from("user_projects")
          .select("id")
          .match({
            user_id: selectedUserId,
            project_id: selectedProjectId,
          })
          .maybeSingle();

        if (checkError) throw checkError;

        if (existingAssignment) {
          toast({
            title: "Already assigned",
            description: "This user is already assigned to this project.",
            variant: "default",
          });
          setIsLoading(false);
          return;
        }

        // Direct insert using the correct types
        const { error: insertError } = await supabase
          .from("user_projects")
          .insert({
            user_id: selectedUserId,
            project_id: selectedProjectId, // This is now correctly typed as a number
            created_at: new Date().toISOString(),
          });

        if (insertError) throw insertError;
      } else if (error) {
        throw error;
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

  const handleRemoveAssignment = async (userId: string, projectId: number) => {
    setIsLoading(true);

    try {
      // Call the RPC function if it exists
      const { error } = await supabase.rpc("remove_user_from_project", {
        p_user_id: userId,
        p_project_id: projectId,
      });

      // Fallback to direct delete if the RPC doesn't exist
      if (error && error.message.includes("function does not exist")) {
        const { error: deleteError } = await supabase
          .from("user_projects")
          .delete()
          .match({
            user_id: userId,
            project_id: projectId,
          });

        if (deleteError) throw deleteError;
      } else if (error) {
        throw error;
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
                    <Select
                      value={
                        selectedProjectId !== null
                          ? String(selectedProjectId)
                          : ""
                      }
                      onValueChange={(value) =>
                        setSelectedProjectId(value ? Number(value) : null)
                      }
                      disabled={!selectedUserId || isLoading}
                      className="flex-grow"
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
                    value={
                      selectedProjectId !== null
                        ? String(selectedProjectId)
                        : ""
                    }
                    onValueChange={(value) =>
                      setSelectedProjectId(value ? Number(value) : null)
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
                    <Select
                      value={selectedUserId}
                      onValueChange={setSelectedUserId}
                      disabled={!selectedProjectId || isLoading}
                      className="flex-grow"
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
