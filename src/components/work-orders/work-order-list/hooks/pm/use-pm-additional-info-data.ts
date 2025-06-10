import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const usePmAdditionalInfoData = (pmWoId: number) => {
  return useQuery({
    queryKey: ["e-pm-additional-info", pmWoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_pm_additional_info")
        .select("id, pm_wo_id, description")
        .eq("pm_wo_id", pmWoId);

      if (error) {
        console.error("Error fetching e_pm_additional_info data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!pmWoId, // Only fetch if pmWoId is provided
  });
};

export const insertPmAdditionalInfoData = async (infoData: {
  pm_wo_id: number;
  description: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_additional_info")
      .insert([infoData]);

    if (error) {
      console.error("Error inserting e_pm_additional_info data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting e_pm_additional_info data:", err);
    throw err;
  }
};

export const updatePmAdditionalInfoData = async (
  id: number,
  updatedData: Partial<{
    pm_wo_id: number;
    description: string;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_additional_info")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating e_pm_additional_info data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating e_pm_additional_info data:", err);
    throw err;
  }
};

export const deletePmAdditionalInfoData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_additional_info")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting e_pm_additional_info data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting e_pm_additional_info data:", err);
    throw err;
  }
};