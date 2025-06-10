import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const usePmDeferData = (pmWoId: number) => {
  return useQuery({
    queryKey: ["e-pm-defer-data", pmWoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_pm_defer")
        .select(
          "id, pm_wo_id, previous_due_date, requested_by (id, email, full_name), remarks, new_due_date"
        )
        .eq("pm_wo_id", pmWoId);

      if (error) {
        console.error("Error fetching e_pm_defer data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!pmWoId, // Only fetch if pmWoId is provided
  });
};

export const insertPmDeferData = async (deferData: {
  pm_wo_id: number;
  previous_due_date: string | null;
  requested_by: string | null;
  remarks: string | null;
  new_due_date: string | null;
}) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_defer")
      .insert([deferData]);

    if (error) {
      console.error("Error inserting e_pm_defer data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting e_pm_defer data:", err);
    throw err;
  }
};

export const updatePmDeferData = async (
  id: number,
  updatedData: Partial<{
    pm_wo_id: number;
    previous_due_date: string | null;
    requested_by: string | null;
    remarks: string | null;
    new_due_date: string | null;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_defer")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating e_pm_defer data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating e_pm_defer data:", err);
    throw err;
  }
};

export const deletePmDeferData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_defer")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting e_pm_defer data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting e_pm_defer data:", err);
    throw err;
  }
};