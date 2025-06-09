import { supabase } from "@/integrations/supabase/client";
import { Project as DbProject } from "@/types/admin";

/**
 * Project utility functions for MyEPOMSX
 * Provides helper methods to work with projects and user-project assignments
 */

/**
 * Project type for utility functions - uses string IDs for compatibility
 */
export type Project = {
  id: string;
  name: string;
  project_code: string;
  project_name?: string | null;
};

/**
 * Convert database Project type to utility Project type (with string IDs)
 */
export function convertToProjectType(dbProject: DbProject): Project {
  return {
    id: dbProject.id.toString(),
    name: dbProject.project_name || dbProject.project_code || "Unnamed Project",
    project_code: dbProject.project_code || "",
    project_name: dbProject.project_name || null,
  };
}

/**
 * Fetch all available projects from the e_project table
 * @returns Array of projects or empty array on error
 */
export async function getAllProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from("e_project")
      .select("id, project_name, project_code")
      .order("project_name");

    if (error) {
      console.error("Error fetching projects:", error);
      return [];
    }

    return data.map((p) => ({
      id: p.id.toString(),
      name: p.project_name || p.project_code || "Unnamed Project",
      project_code: p.project_code || "",
      project_name: p.project_name || null,
    }));
  } catch (err) {
    console.error("Unexpected error fetching projects:", err);
    return [];
  }
}

/**
 * Fetch projects assigned to a specific user
 * @param userId User ID to fetch projects for
 * @returns Array of projects assigned to the user or empty array on error
 */
export async function getUserProjects(userId: string): Promise<Project[]> {
  try {
    // First get project IDs from user_projects
    const { data: userProjects, error: userProjectsError } = await supabase
      .from("user_projects")
      .select("project_id")
      .eq("user_id", userId);

    if (userProjectsError) {
      console.error("Error fetching user projects:", userProjectsError);
      return [];
    }

    if (!userProjects || userProjects.length === 0) {
      return [];
    }

    // Then fetch project details
    const projectIds = userProjects.map((p) => p.project_id);
    const { data: projects, error: projectsError } = await supabase
      .from("e_project")
      .select("id, project_name, project_code")
      .in("id", projectIds)
      .order("project_name");

    if (projectsError) {
      console.error("Error fetching project details:", projectsError);
      return [];
    }

    return projects.map((p) => ({
      id: p.id.toString(),
      name: p.project_name || p.project_code || "Unnamed Project",
      project_code: p.project_code || "",
      project_name: p.project_name || null,
    }));
  } catch (err) {
    console.error("Unexpected error fetching user projects:", err);
    return [];
  }
}

/**
 * Check if user is a project manager or admin
 * @param userId User ID to check
 * @returns Boolean indicating if user has elevated privileges
 */
export async function isUserManagerOrAdmin(userId: string): Promise<boolean> {
  try {
    // Cast the client to any to bypass type checking for this query
    const { data, error } = await (supabase as any)
      .from("profiles")
      .select("user_type_id, user_type:user_type_id(name)")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error checking user type:", error);
      return false;
    }

    const userType = data?.user_type?.name?.toLowerCase();
    return userType === "admin" || userType === "manager";
  } catch (err) {
    console.error("Unexpected error checking user role:", err);
    return false;
  }
}

/**
 * Assign a user to a project
 * @param userId User ID to assign
 * @param projectId Project ID to assign user to
 * @returns Success status and any error message
 */
export async function assignUserToProject(
  userId: string,
  projectId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if assignment already exists
    const { data: existing } = await supabase
      .from("user_projects")
      .select("*")
      .eq("user_id", userId)
      .eq("project_id", Number(projectId))
      .single();

    if (existing) {
      // Assignment already exists
      return { success: true };
    }

    // Create new assignment
    const { error } = await supabase.from("user_projects").insert({
      user_id: userId,
      project_id: Number(projectId),
    });

    if (error) {
      console.error("Error assigning user to project:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Unexpected error assigning user to project:", err);
    return { success: false, error: err.message || "Unknown error" };
  }
}

/**
 * Remove a user from a project
 * @param userId User ID to remove
 * @param projectId Project ID to remove user from
 * @returns Success status and any error message
 */
export async function removeUserFromProject(
  userId: string,
  projectId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("user_projects")
      .delete()
      .eq("user_id", userId)
      .eq("project_id", Number(projectId));

    if (error) {
      console.error("Error removing user from project:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Unexpected error removing user from project:", err);
    return { success: false, error: err.message || "Unknown error" };
  }
}
