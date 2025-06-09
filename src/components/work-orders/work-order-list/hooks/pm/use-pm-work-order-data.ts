import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

// Fetch all PM Work Order records
export const usePmWorkOrderData = () => {
  return useQuery({
    queryKey: ["e-pm-work-order-data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_pm_work_order")
        .select(`id, due_date, maintenance_id (), is_active, priority_id,
          work_center_id, discipline_id, task_id, frequency_id, asset_id,
          system_id, package_id, pm_group_id, asset_sce_code_id,
          pm_description, pm_schedule_id, facility_id, completed
          _by, closed_by, created_by, created_at,
          updated_by, updated_at`)
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching e_pm_work_order data:", error);
        throw error;
      }

      return data;
    },
  });
};

// Fetch a single PM Work Order record by ID
export const usePmWorkOrderDataById = (id: number) => {
  return useQuery({
    queryKey: ["e-pm-work-order-data", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_pm_work_order")
        .select("*") // Fetch all columns
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching e_pm_work_order data by ID:", error);
        throw error;
      }

      return data;
    },
    enabled: !!id, // Only fetch if ID is provided
  });
};

// Update an existing PM Work Order record
export const updatePmWorkOrderData = async (
  id: number,
  updatedData: Partial<{
    due_date?: string; // ISO timestamp
    maintenance_id?: number;
    is_active?: boolean;
    priority_id?: number;
    work_center_id?: number;
    discipline_id?: number;
    task_id?: number;
    frequency_id?: number;
    asset_id?: number;
    system_id?: number;
    package_id?: number;
    pm_group_id?: number;
    asset_sce_code_id?: number;
    pm_description?: string;
    pm_schedule_id?: number;
    facility_id?: number;
    completed_by?: string; // UUID
    closed_by?: string; // UUID
    created_by?: string; // UUID
    created_at?: string; // ISO timestamp
    updated_by?: string; // UUID
    updated_at?: string; // ISO timestamp
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_work_order")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating e_pm_work_order data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating e_pm_work_order data:", err);
    throw err;
  }
};