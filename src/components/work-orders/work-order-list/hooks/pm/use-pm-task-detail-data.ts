import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const usePmTaskDetailData = (pmWoId: number) => {
  return useQuery({
    queryKey: ["e-pm-task-detail", pmWoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_pm_task_detail")
        .select("id, pm_wo_id, sequence, task_list")
        .eq("pm_wo_id", pmWoId)
        .order("sequence", { ascending: true });

      if (error) {
        console.error("Error fetching e_pm_task_detail data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!pmWoId, // Only fetch if pmWoId is provided
  });
};

export const insertTaskDetailData = async (taskDetailData: {
  pm_wo_id: number;
  sequence: number;
  task_list: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_task_detail")
      .insert([taskDetailData]);

    if (error) {
      console.error("Error inserting e_pm_task_detail data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting e_pm_task_detail data:", err);
    throw err;
  }
};

export const updateTaskDetailData = async (
  id: number,
  updatedData: Partial<{
    pm_wo_id: number;
    sequence: number;
    task_list: string;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_task_detail")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating e_pm_task_detail data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating e_pm_task_detail data:", err);
    throw err;
  }
};

export const deleteTaskDetailData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_task_detail")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting e_pm_task_detail data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting e_pm_task_detail data:", err);
    throw err;
  }
};