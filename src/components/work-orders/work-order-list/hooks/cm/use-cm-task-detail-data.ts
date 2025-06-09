import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useCmTaskDetailData = (cmGeneralId: number) => {
  return useQuery({
    queryKey: ["e-cm-task-detail", cmGeneralId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_cm_task_detail")
        .select("id, cm_general_id, task_sequence, task_list")
        .eq("cm_general_id", cmGeneralId)
        .order("task_sequence", { ascending: true });

      if (error) {
        console.error("Error fetching e_cm_task_detail data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!cmGeneralId, // Only fetch if cmGeneralId is provided
  });
};

export const insertTaskDetailData = async (taskDetailData: {
  cm_general_id: number;
  task_sequence: number;
  task_list: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("e_cm_task_detail")
      .insert([taskDetailData]);

    if (error) {
      console.error("Error inserting e_cm_task_detail data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting e_cm_task_detail data:", err);
    throw err;
  }
};

export const updateTaskDetailData = async (
  id: number,
  updatedData: Partial<{
    cm_general_id: number;
    task_sequence: number;
    task_list: string;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("e_cm_task_detail")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating e_cm_task_detail data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating e_cm_task_detail data:", err);
    throw err;
  }
};

export const deleteTaskDetailData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("e_cm_task_detail")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting e_cm_task_detail data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting e_cm_task_detail data:", err);
    throw err;
  }
};