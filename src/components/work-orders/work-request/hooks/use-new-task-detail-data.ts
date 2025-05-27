import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useNewTaskDetailData = (newWorkRequestId: number) => {
  return useQuery({
    queryKey: ["e-new-work-task-detail", newWorkRequestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_new_work_task_detail")
        .select("id, new_work_request_id, task_sequence, task_list")
        .eq("new_work_request_id", newWorkRequestId)
        .order("task_sequence", { ascending: true });

      if (error) {
        console.error("Error fetching e_new_work_task_detail data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!newWorkRequestId, // Only fetch if newWorkRequestId is provided
  });
};

export const insertTaskDetailData = async (taskDetailData: {
  new_work_request_id: number;
  task_sequence: number;
  task_list: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("e_new_work_task_detail")
      .insert([taskDetailData]);

    if (error) {
      console.error("Error inserting e_new_work_task_detail data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting e_new_work_task_detail data:", err);
    throw err;
  }
};

export const updateTaskDetailData = async (
  id: number,
  updatedData: Partial<{
    new_work_request_id: number;
    task_sequence: number;
    task_list: string;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("e_new_work_task_detail")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating e_new_work_task_detail data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating e_new_work_task_detail data:", err);
    throw err;
  }
};

export const deleteTaskDetailData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("e_new_work_task_detail")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting e_new_work_task_detail data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting e_new_work_task_detail data:", err);
    throw err;
  }
};