import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

type Project = {
  id: string;
  name: string;
  route?: string;
  project_code?: string;
  short_name?: string;
  project_purpose?: string;
};

type ProjectContextType = {
  currentProject: Project | null;
  setCurrentProject: (project: Project) => void;
  projects: Project[];
  loading: boolean;
  error: string | null;
};

const defaultContext: ProjectContextType = {
  currentProject: null,
  setCurrentProject: () => {},
  projects: [],
  loading: false,
  error: null,
};

const PROJECT_STORAGE_KEY = "myepomsx_current_project";

const ProjectContext = createContext<ProjectContextType>(defaultContext);

export const useProject = () => {
  console.log("useProject hook called");
  const context = useContext(ProjectContext);
  console.log("useProject context value:", context);
  return context;
};

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  console.log("🔥 ProjectProvider component initialized");

  const { user } = useAuth();
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log(
    "ProjectProvider rendered, user exists:",
    !!user,
    "user ID:",
    user?.id
  );

  const fetchUserProjects = async () => {
    console.log("=== fetchUserProjects called ===");
    console.log("User object:", user);
    console.log("User ID:", user?.id);

    if (!user) {
      console.log("No user found, clearing projects");
      setProjects([]);
      setCurrentProject(null);
      return;
    }

    setLoading(true);
    setError(null);
    console.log("Starting to fetch projects for user:", user.id);

    try {
      // First, let's check if user_projects table has data for this user
      console.log("Checking user_projects table...");
      const { data: userProjectsCheck, error: userProjectsError } =
        await supabase.from("user_projects").select("*").eq("user_id", user.id);

      console.log("User projects check result:", userProjectsCheck);
      console.log("User projects check error:", userProjectsError);

      if (userProjectsError) {
        console.error("Error checking user_projects:", userProjectsError);
      }

      // Use the exact SQL structure you provided
      console.log("Fetching projects with relations...");
      const { data, error: fetchError } = await supabase
        .from("user_projects")
        .select(
          `
          project_id,
          e_project!inner (
            id,
            project_name,
            project_code,
            short_name,
            project_purpose
          )
        `
        )
        .eq("user_id", user.id);

      console.log("Raw fetch result:", { data, error: fetchError });

      if (fetchError) {
        console.error("Error fetching user projects:", fetchError);
        setError(fetchError.message);
        return;
      }

      console.log("Fetched user projects data:", data);

      // Transform the data to match our Project type
      const userProjects: Project[] = (data || [])
        .map((item: any) => {
          console.log("Processing item:", item);

          if (!item.e_project) {
            console.warn("Missing e_project data for item:", item);
            return null;
          }

          return {
            id: item.e_project.id.toString(),
            name: item.e_project.project_name || "Unnamed Project",
            project_code: item.e_project.project_code,
            short_name: item.e_project.short_name,
            project_purpose: item.e_project.project_purpose,
          };
        })
        .filter(Boolean); // Remove null entries

      console.log("Transformed projects:", userProjects);

      setProjects(userProjects);

      // Set the first project as current if no current project is set
      if (userProjects.length > 0 && !currentProject) {
        console.log("Setting current project to:", userProjects[0]);
        setCurrentProject(userProjects[0]);
      } else if (userProjects.length === 0) {
        console.log("No projects found for user");
        setCurrentProject(null);
      }
    } catch (err) {
      console.error("Unexpected error fetching projects:", err);
      setError("Failed to fetch projects");
    } finally {
      setLoading(false);
      console.log("=== fetchUserProjects completed ===");
    }
  };

  // Let's also add a function to check if projects exist in e_project table
  const checkProjectsExist = async () => {
    try {
      console.log("Checking if projects exist in database...");
      const { data: allProjects, error } = await supabase
        .from("e_project")
        .select("id, project_name, project_code")
        .limit(5);

      console.log("All projects in database (first 5):", allProjects);

      if (error) {
        console.error("Error fetching all projects:", error);
      }
    } catch (err) {
      console.error("Error checking projects exist:", err);
    }
  };

  useEffect(() => {
    console.log("=== ProjectProvider useEffect triggered ===");
    console.log("User in effect:", user);
    console.log("User ID in effect:", user?.id);
    console.log("User email in effect:", user?.email);

    // Add a small delay to ensure auth is fully settled
    const timer = setTimeout(() => {
      console.log("Timer triggered, calling functions...");
      checkProjectsExist(); // Check if projects exist in database
      fetchUserProjects();
    }, 100);

    return () => {
      console.log("ProjectProvider useEffect cleanup");
      clearTimeout(timer);
    };
  }, [user?.id]); // Changed dependency to be more specific

  const value = {
    currentProject,
    setCurrentProject,
    projects,
    loading,
    error,
  };

  console.log("ProjectProvider rendering with value:", value);

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};
