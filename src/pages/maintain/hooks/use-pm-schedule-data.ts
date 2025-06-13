import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const usePmScheduleData = () => {
  return useQuery({
    queryKey: ["e-pm-schedule-data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_pm_schedule")
        .select(
          `id, pm_no, pm_description, due_date, is_active, 
          priority_id (id, name), 
          work_center_id (id, name, code), 
          discipline_id (id, name), 
          task_id (id, task_name), 
          frequency_id (id, name), 
          asset_id (id, asset_name), 
          system_id (id, system_name), 
          package_id (id, package_no, package_name), 
          pm_group_id (id, asset_detail_id), 
          pm_sce_group_id (id, sce_code, group_name), 
          facility_id (id, location_name),
          is_deleted`
        )
        .eq("is_deleted", false)
        .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching e_pm_schedule data:", error);
        throw error;
      }

      // Add index to each row (starting from 1)
      const indexedData = data?.map((item, index) => ({
        index: index + 1, // 1-based index
        ...item,
      }));

      return indexedData;
    },
  });
};

export const usePmScheduleDataById = (id: number) => {
  return useQuery({
    queryKey: ["e-pm-schedule-data-id", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_pm_schedule")
        .select(
          `id, pm_no, pm_description, due_date, is_active, 
          priority_id (id, name), 
          work_center_id (id, name, code), 
          discipline_id (id, name), 
          task_id (id, task_name), 
          frequency_id (id, name), 
          asset_id (id, asset_name), 
          system_id (id, system_name), 
          package_id (id, package_no, package_name), 
          pm_group_id (id, asset_detail_id), 
          pm_sce_group_id (id, sce_code, group_name), 
          facility_id (id, location_name),
          is_deleted`
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching e_pm_schedule data by ID:", error);
        throw error;
      }

      return data;
    },
    enabled: !!id, // Only fetch if ID is provided
  });
};

export const insertPmScheduleData = async (pmScheduleData: {
  pm_description?: string;
  due_date: string; // Use ISO string format for timestamps (required)
  is_active?: boolean;
  priority_id?: number;
  work_center_id?: number;
  discipline_id?: number;
  task_id?: number;
  frequency_id: number; // required
  asset_id?: number;
  system_id?: number;
  package_id?: number;
  pm_group_id?: number;
  pm_sce_group_id?: number;
  facility_id?: number;
}) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_schedule")
      .insert([pmScheduleData]);

    if (error) {
      console.error("Error inserting e_pm_schedule data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting e_pm_schedule data:", err);
    throw err;
  }
};

export const updatePmScheduleData = async (
  id: number,
  updatedData: Partial<{
    pm_description?: string;
    due_date?: string; // Use ISO string format for timestamps
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
    pm_sce_group_id?: number;
    facility_id?: number;
    is_deleted?: boolean;

  }>
) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_schedule")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating e_pm_schedule data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating e_pm_schedule data:", err);
    throw err;
  }
};

export const insertPmWorkOrderData = async (pmWorkOrderData: {
  due_date?: string; // Use ISO string format for timestamps
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
}) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_work_order")
      .insert([pmWorkOrderData]);

    if (error) {
      console.error("Error inserting e_pm_work_order data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting e_pm_work_order data:", err);
    throw err;
  }
};