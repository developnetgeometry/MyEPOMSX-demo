import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useCmFindingData = (cmGeneralId: number) => {
  return useQuery({
    queryKey: ["e-cm-finding-data", cmGeneralId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_cm_finding")
        .select("id, wo_finding_failure, action_taken, corrective_action, cm_general_id")
        .eq("cm_general_id", cmGeneralId);

      if (error) {
        console.error("Error fetching e_cm_finding data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!cmGeneralId, // Only fetch if cmGeneralId is provided
  });
};

export const insertCmFindingData = async (findingData: {
  wo_finding_failure: string | null;
  action_taken: string | null;
  corrective_action: string | null;
  cm_general_id: number;
}) => {
  try {
    const { data, error } = await supabase
      .from("e_cm_finding")
      .insert([findingData]);

    if (error) {
      console.error("Error inserting e_cm_finding data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting e_cm_finding data:", err);
    throw err;
  }
};

export const updateCmFindingData = async (
  id: number,
  updatedData: Partial<{
    wo_finding_failure: string | null;
    action_taken: string | null;
    corrective_action: string | null;
    cm_general_id: number;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("e_cm_finding")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating e_cm_finding data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating e_cm_finding data:", err);
    throw err;
  }
};

export const deleteCmFindingData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("e_cm_finding")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting e_cm_finding data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting e_cm_finding data:", err);
    throw err;
  }
};