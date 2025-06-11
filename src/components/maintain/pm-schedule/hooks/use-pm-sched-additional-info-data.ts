import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const usePmSchedAdditionalInfoData = (pmScheduleId: number) => {
  return useQuery({
    queryKey: ["e-pm-schedule-additional-info", pmScheduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_pm_schedule_additional_info")
        .select("id, pm_schedule_id, description")
        .eq("pm_schedule_id", pmScheduleId);

      if (error) {
        console.error("Error fetching e_pm_schedule_additional_info data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!pmScheduleId, // Only fetch if pmScheduleId is provided
  });
};

export const insertPmSchedAdditionalInfoData = async (infoData: {
  pm_schedule_id: number;
  description: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_schedule_additional_info")
      .insert([infoData]);

    if (error) {
      console.error("Error inserting e_pm_schedule_additional_info data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting e_pm_schedule_additional_info data:", err);
    throw err;
  }
};

export const updatePmSchedAdditionalInfoData = async (
  id: number,
  updatedData: Partial<{
    pm_schedule_id: number;
    description: string;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_schedule_additional_info")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating e_pm_schedule_additional_info data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating e_pm_schedule_additional_info data:", err);
    throw err;
  }
};

export const deletePmSchedAdditionalInfoData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_schedule_additional_info")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting e_pm_schedule_additional_info data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting e_pm_schedule_additional_info data:", err);
    throw err;
  }
};