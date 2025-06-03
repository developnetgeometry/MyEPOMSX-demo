import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useCmDeferData = (cmGeneralId: number) => {
  return useQuery({
    queryKey: ["e-cm-defer-data", cmGeneralId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_cm_defer")
        .select(
          "id, cm_general_id, previous_due_date, requested_by, remarks, new_due_date"
        )
        .eq("cm_general_id", cmGeneralId);

      if (error) {
        console.error("Error fetching e_cm_defer data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!cmGeneralId, // Only fetch if cmGeneralId is provided
  });
};

export const insertCmDeferData = async (deferData: {
  cm_general_id: number;
  previous_due_date: string | null;
  requested_by: string | null;
  remarks: string | null;
  new_due_date: string | null;
}) => {
  try {
    const { data, error } = await supabase
      .from("e_cm_defer")
      .insert([deferData]);

    if (error) {
      console.error("Error inserting e_cm_defer data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting e_cm_defer data:", err);
    throw err;
  }
};

export const updateCmDeferData = async (
  id: number,
  updatedData: Partial<{
    cm_general_id: number;
    previous_due_date: string | null;
    requested_by: string | null;
    remarks: string | null;
    new_due_date: string | null;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("e_cm_defer")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating e_cm_defer data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating e_cm_defer data:", err);
    throw err;
  }
};

export const deleteCmDeferData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("e_cm_defer")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting e_cm_defer data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting e_cm_defer data:", err);
    throw err;
  }
};