import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const usePmSchedMinAcceptCriteriaData = (pmScheduleId: number) => {
  return useQuery({
    queryKey: ["e-pm-schedule-min-acceptance-criteria", pmScheduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_pm_schedule_min_acceptance_criteria")
        .select("id, pm_schedule_id, criteria, field_name")
        .eq("pm_schedule_id", pmScheduleId);

      if (error) {
        console.error("Error fetching e_pm_schedule_min_acceptance_criteria data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!pmScheduleId, // Only fetch if pmScheduleId is provided
  });
};

export const insertPmSchedMinAcceptCriteriaData = async (criteriaData: {
  pm_schedule_id: number;
  criteria: string;
  field_name: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_schedule_min_acceptance_criteria")
      .insert([criteriaData]);

    if (error) {
      console.error("Error inserting e_pm_schedule_min_acceptance_criteria data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting e_pm_schedule_min_acceptance_criteria data:", err);
    throw err;
  }
};

export const updatePmSchedMinAcceptCriteriaData = async (
  id: number,
  updatedData: Partial<{
    pm_schedule_id: number;
    criteria: string;
    field_name: string;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_schedule_min_acceptance_criteria")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating e_pm_schedule_min_acceptance_criteria data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating e_pm_schedule_min_acceptance_criteria data:", err);
    throw err;
  }
};

export const deletePmSchedMinAcceptCriteriaData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_schedule_min_acceptance_criteria")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting e_pm_schedule_min_acceptance_criteria data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting e_pm_schedule_min_acceptance_criteria data:", err);
    throw err;
  }
};