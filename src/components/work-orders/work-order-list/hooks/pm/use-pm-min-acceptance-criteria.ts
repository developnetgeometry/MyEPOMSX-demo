import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const usePmMinAcceptanceCriteria = (pmWoId: number) => {
  return useQuery({
    queryKey: ["e-pm-min-acceptance-criteria", pmWoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_pm_min_acceptance_criteria")
        .select("id, pm_wo_id, criteria, field_name")
        .eq("pm_wo_id", pmWoId);

      if (error) {
        console.error("Error fetching e_pm_min_acceptance_criteria data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!pmWoId, // Only fetch if pmWoId is provided
  });
};

export const insertMinAcceptanceCriteriaData = async (criteriaData: {
  pm_wo_id: number;
  criteria: string;
  field_name: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_min_acceptance_criteria")
      .insert([criteriaData]);

    if (error) {
      console.error("Error inserting e_pm_min_acceptance_criteria data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting e_pm_min_acceptance_criteria data:", err);
    throw err;
  }
};

export const updateMinAcceptanceCriteriaData = async (
  id: number,
  updatedData: Partial<{
    pm_wo_id: number;
    criteria: string;
    field_name: string;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_min_acceptance_criteria")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating e_pm_min_acceptance_criteria data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating e_pm_min_acceptance_criteria data:", err);
    throw err;
  }
};

export const deleteMinAcceptanceCriteriaData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_min_acceptance_criteria")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting e_pm_min_acceptance_criteria data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting e_pm_min_acceptance_criteria data:", err);
    throw err;
  }
};