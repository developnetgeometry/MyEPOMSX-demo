import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const usePmActualMaterialData = (pmWoId: number) => {
  return useQuery({
    queryKey: ["e-pm-actual-material-data", pmWoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_pm_actual_material")
        .select("id, pm_wo_id, item_id(id, item_no, item_name), quantity")
        .eq("pm_wo_id", pmWoId);

      if (error) {
        console.error("Error fetching e_pm_actual_material data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!pmWoId, // Only fetch if pmWoId is provided
  });
};

export const insertPmActualMaterialData = async (materialData: {
  pm_wo_id: number | null;
  item_id: number | null;
  quantity: number | null;
}) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_actual_material")
      .insert([materialData]);

    if (error) {
      console.error("Error inserting e_pm_actual_material data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting e_pm_actual_material data:", err);
    throw err;
  }
};

export const updatePmActualMaterialData = async (
  id: number,
  updatedData: Partial<{
    pm_wo_id: number | null;
    item_id: number | null;
    quantity: number | null;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_actual_material")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating e_pm_actual_material data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating e_pm_actual_material data:", err);
    throw err;
  }
};

export const deletePmActualMaterialData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_actual_material")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting e_pm_actual_material data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting e_pm_actual_material data:", err);
    throw err;
  }
};