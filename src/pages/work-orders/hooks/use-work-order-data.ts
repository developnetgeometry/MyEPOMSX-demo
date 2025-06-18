import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

// Fetch all work orders
export const useWorkOrderData = () => {
  return useQuery({
    queryKey: ["e-work-order-data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_work_order")
        .select(
          `id, work_order_type (id, name), pm_work_order_id, work_order_status_id (id, name),
          description, work_order_no, cm_work_order_id, created_at, completed_at, created_by (id, email, full_name), 
          updated_by, updated_at, asset_id (asset_no, asset_name),
          task_id (id, task_code, task_name), due_date`
        )
        .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching e_work_order data:", error);
        throw error;
      }

      return data;
    },
  });
};

// Fetch a single work order by ID
export const useWorkOrderDataById = (id: number) => {
  return useQuery({
    queryKey: ["e-work-order-data-id", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_work_order")
        .select(
          `id, work_order_type, pm_work_order_id (id, pm_schedule_id, work_center_id), work_order_status_id (id, name), description, 
          work_order_no, cm_work_order_id (id, work_center_id, work_request_id), created_at, completed_at, created_by, 
          updated_by, updated_at, asset_id, task_id (id, task_code,task_name), due_date`
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching e_work_order data by ID:", error);
        throw error;
      }

      return data;
    },
    enabled: !!id, // Only fetch if ID is provided
  });
};

// Insert a new work order
export const insertWorkOrderData = async (workOrderData: {
  work_order_type?: number;
  pm_work_order_id?: number;
  work_order_status_id?: number;
  description?: string;
  cm_work_order_id?: number;
  created_at?: string; // Use ISO string format for timestamps
  completed_at?: string; // Use ISO string format for timestamps
  created_by?: string; // UUID
  updated_by?: string; // UUID
  updated_at?: string; // Use ISO string format for timestamps
  asset_id?: number;
  task_id?: number;
  due_date?: string; // Use ISO string format for dates
}) => {
  try {

    const { data, error } = await supabase
      .from("e_work_order")
      .insert([workOrderData]);

    if (error) {
      console.error("Error inserting e_work_order data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting e_work_order data:", err);
    throw err;
  }
};

// Update an existing work order
export const updateWorkOrderData = async (
  id: number,
  updatedData: Partial<{
    work_order_type?: number;
    pm_work_order_id?: number;
    work_order_status_id?: number;
    description?: string;
    work_order_no?: string;
    cm_work_order_id?: number;
    created_at?: string; // Use ISO string format for timestamps
    completed_at?: string; // Use ISO string format for timestamps
    created_by?: string; // UUID
    updated_by?: string; // UUID
    updated_at?: string; // Use ISO string format for timestamps
    asset_id?: number;
    task_id?: number;
    due_date?: string; // Use ISO string format for dates
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("e_work_order")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating e_work_order data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating e_work_order data:", err);
    throw err;
  }
};

// Delete a work order
export const deleteWorkOrderData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("e_work_order")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting e_work_order data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting e_work_order data:", err);
    throw err;
  }
};

export const userWorkOrderDataByAsset = (assetId: number) => {
  return useQuery({
    queryKey: ["e-work-order-data-by-asset", assetId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_work_order")
        .select(
          `id, work_order_type (id, name), pm_work_order_id, work_order_status_id (id, name),
          description, work_order_no, cm_work_order_id (id, downtime), created_at, completed_at, created_by, 
          updated_by, updated_at, asset_id (asset_no, asset_name),
          task_id (id, task_code, task_name), due_date`
        )
        .eq("asset_id", assetId)
        .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching e_work_order data by asset ID:", error);
        throw error;
      }

      return data;
    },
    enabled: !!assetId, // Only fetch if assetId is provided
  });
};