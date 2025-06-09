import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/utils/project-utils";

/**
 * Project data utilities for fetching and managing project-related data.
 * These utilities provide access to more complex project metrics, statistics,
 * and relationships beyond the basic project management functions.
 */

export type ProjectStat = {
  id: string;
  name: string;
  asset_count?: number;
  work_order_count?: number;
  user_count?: number;
  last_accessed?: string | null;
};

export type ProjectFilter = {
  status?: string;
  searchTerm?: string;
  sortBy?: "name" | "recent" | "assetCount" | "workOrderCount";
  limit?: number;
};

/**
 * Get statistics for a single project
 * @param projectId Project ID to get stats for
 * @returns Project statistics or null on error
 */
export async function getProjectStats(
  projectId: string
): Promise<ProjectStat | null> {
  try {
    // Get basic project info
    const { data: project, error } = await supabase
      .from("e_project")
      .select("id, project_name, project_code")
      .eq("id", projectId)
      .single();

    if (error || !project) {
      console.error("Error fetching project:", error);
      return null;
    }

    // Get asset count
    const { count: assetCount, error: assetError } = await supabase
      .from("e_assets")
      .select("id", { count: "exact", head: true })
      .eq("project_id", projectId);

    if (assetError) {
      console.error("Error counting assets:", assetError);
    }

    // Get work order count
    const { count: workOrderCount, error: woError } = await supabase
      .from("work_orders")
      .select("id", { count: "exact", head: true })
      .eq("project_id", projectId);

    if (woError) {
      console.error("Error counting work orders:", woError);
    }

    // Get user count
    const { data: users, error: userError } = await supabase
      .from("user_projects")
      .select("user_id", { count: "exact" })
      .eq("project_id", projectId);

    if (userError) {
      console.error("Error counting users:", userError);
    }

    return {
      id: project.id,
      name: project.project_name || project.project_code || "Unnamed Project",
      asset_count: assetCount || 0,
      work_order_count: workOrderCount || 0,
      user_count: users?.length || 0,
    };
  } catch (err) {
    console.error("Unexpected error getting project stats:", err);
    return null;
  }
}

/**
 * Find projects matching specified criteria
 * @param filter Filter criteria for projects
 * @returns Array of matching projects or empty array on error
 */
export async function findProjects(filter: ProjectFilter): Promise<Project[]> {
  try {
    let query = supabase
      .from("e_project")
      .select("id, project_name, project_code");

    // Apply status filter if provided
    if (filter.status) {
      query = query.eq("status", filter.status);
    }

    // Apply text search if provided
    if (filter.searchTerm) {
      query = query.or(
        `project_name.ilike.%${filter.searchTerm}%,project_code.ilike.%${filter.searchTerm}%`
      );
    }

    // Apply sorting
    if (filter.sortBy === "name") {
      query = query.order("project_name");
    } else if (filter.sortBy === "recent") {
      query = query.order("updated_at", { ascending: false });
    }

    // Apply limit if provided
    if (filter.limit) {
      query = query.limit(filter.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error finding projects:", error);
      return [];
    }

    return data.map((p) => ({
      id: p.id,
      name: p.project_name || p.project_code || "Unnamed Project",
      project_code: p.project_code || "",
      project_name: p.project_name || null,
    }));
  } catch (err) {
    console.error("Unexpected error finding projects:", err);
    return [];
  }
}

/**
 * Track project access for analytics
 * @param projectId Project ID that was accessed
 * @param userId User ID that accessed the project
 */
export async function trackProjectAccess(
  projectId: string,
  userId: string
): Promise<void> {
  try {
    await supabase.from("project_access_log").insert({
      project_id: projectId,
      user_id: userId,
      accessed_at: new Date().toISOString(),
    });
  } catch (err) {
    // Just log the error, don't fail the application for analytics
    console.error("Failed to log project access:", err);
  }
}
