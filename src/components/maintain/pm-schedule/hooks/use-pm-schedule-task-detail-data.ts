import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const usePmScheduleTaskDetailData = (pmScheduleId: number) => {
  return useQuery({
    queryKey: ["e-pm-schedule-task-detail", pmScheduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_pm_schedule_task_detail")
        .select("id, pm_schedule_id, sequence, task_list")
        .eq("pm_schedule_id", pmScheduleId)
        .order("sequence", { ascending: true });

      if (error) {
        console.error("Error fetching e_pm_schedule_task_detail data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!pmScheduleId, // Only fetch if pmScheduleId is provided
  });
};

export const insertPmScheduleTaskDetailData = async (taskDetailData: {
  pm_schedule_id: number;
  sequence: number;
  task_list: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_schedule_task_detail")
      .insert([taskDetailData]);

    if (error) {
      console.error("Error inserting e_pm_schedule_task_detail data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting e_pm_schedule_task_detail data:", err);
    throw err;
  }
};

export const updatePmScheduleTaskDetailData = async (
  id: number,
  updatedData: Partial<{
    pm_schedule_id: number;
    sequence: number;
    task_list: string;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_schedule_task_detail")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating e_pm_schedule_task_detail data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating e_pm_schedule_task_detail data:", err);
    throw err;
  }
};

export const deletePmScheduleTaskDetailData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_schedule_task_detail")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting e_pm_schedule_task_detail data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting e_pm_schedule_task_detail data:", err);
    throw err;
  }
};