import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

// Fetch all CM General records
export const useCmGeneralData = () => {
  return useQuery({
    queryKey: ["e-cm-general-data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_cm_general")
        .select(
          `id, priority_id (id, name), work_center_id (id, code, name), 
          facility_id (id, location_code, location_name), system_id (id, system_name), 
          package_id (id, package_no, package_name), asset_id (id, asset_name), 
          completed_by, closed_by, date_finding, target_start_date, target_end_date, 
          asset_available_time, requested_by, approved_by, cm_sce_code (id, cm_group_name, cm_sce_code), 
          due_date, downtime, work_request_id, created_by, created_at, updated_by, updated_at`
        )
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching e_cm_general data:", error);
        throw error;
      }

      return data;
    },
  });
};

// Fetch a single CM General record by ID
export const useCmGeneralDataById = (id: number) => {
  return useQuery({
    queryKey: ["e-cm-general-data", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_cm_general")
        .select(
          `id, priority_id (id, name), work_center_id (id, code, name), 
          facility_id (id, location_code, location_name), system_id (id, system_name), 
          package_id (id, package_no, package_name), asset_id (id, asset_name), 
          completed_by, closed_by, date_finding, target_start_date, target_end_date, 
          asset_available_time, requested_by, approved_by, cm_sce_code (id, cm_group_name, cm_sce_code), 
          due_date, downtime, work_request_id, created_by, created_at, updated_by, updated_at`
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching e_cm_general data by ID:", error);
        throw error;
      }

      return data;
    },
    enabled: !!id, // Only fetch if ID is provided
  });
};

// Update an existing CM General record
export const updateCmGeneralData = async (
  id: number,
  updatedData: Partial<{
    priority_id?: number;
    work_center_id?: number;
    facility_id?: number;
    system_id?: number;
    package_id?: number;
    asset_id?: number;
    completed_by?: string; // UUID
    closed_by?: string; // UUID
    date_finding?: string; // ISO timestamp
    target_start_date?: string; // ISO timestamp
    target_end_date?: string; // ISO timestamp
    asset_available_time?: string; // ISO timestamp
    requested_by?: string; // UUID
    approved_by?: string; // UUID
    cm_sce_code?: number;
    due_date?: string; // ISO timestamp
    downtime?: number;
    work_request_id?: number;
    created_by?: string; // UUID
    created_at?: string; // ISO timestamp
    updated_by?: string; // UUID
    updated_at?: string; // ISO timestamp
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("e_cm_general")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating e_cm_general data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating e_cm_general data:", err);
    throw err;
  }
};
