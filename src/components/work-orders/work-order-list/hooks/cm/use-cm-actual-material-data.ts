import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useCmActualMaterialData = (cmGeneralId: number) => {
  return useQuery({
    queryKey: ["e-cm-actual-material-data", cmGeneralId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_cm_actual_material")
        .select("id, cm_general_id, item_id(id, item_no, item_name), quantity")
        .eq("cm_general_id", cmGeneralId);

      if (error) {
        console.error("Error fetching e_cm_actual_material data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!cmGeneralId, // Only fetch if cmGeneralId is provided
  });
};

export const insertCmActualMaterialData = async (materialData: {
  cm_general_id: number | null;
  item_id: number | null;
  quantity: number | null;
}) => {
  try {
    const { data, error } = await supabase
      .from("e_cm_actual_material")
      .insert([materialData]);

    if (error) {
      console.error("Error inserting e_cm_actual_material data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting e_cm_actual_material data:", err);
    throw err;
  }
};

export const updateCmActualMaterialData = async (
  id: number,
  updatedData: Partial<{
    cm_general_id: number | null;
    item_id: number | null;
    quantity: number | null;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("e_cm_actual_material")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating e_cm_actual_material data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating e_cm_actual_material data:", err);
    throw err;
  }
};

export const deleteCmActualMaterialData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("e_cm_actual_material")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting e_cm_actual_material data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting e_cm_actual_material data:", err);
    throw err;
  }
};