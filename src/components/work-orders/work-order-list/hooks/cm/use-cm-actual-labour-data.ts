import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useCmActualLabourData = (cmGeneralId: number) => {
  return useQuery({
    queryKey: ["e-cm-actual-labour-data", cmGeneralId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_cm_actual_labour")
        .select("id, employee_id (id, uid_employee, name), duration, cm_general_id")
        .eq("cm_general_id", cmGeneralId);

      if (error) {
        console.error("Error fetching e_cm_actual_labour data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!cmGeneralId, // Only fetch if cmGeneralId is provided
  });
};

export const insertCmActualLabourData = async (labourData: {
  employee_id: number | null;
  duration: number | null;
  cm_general_id: number;
}) => {
  try {
    const { data, error } = await supabase
      .from("e_cm_actual_labour")
      .insert([labourData]);

    if (error) {
      console.error("Error inserting e_cm_actual_labour data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting e_cm_actual_labour data:", err);
    throw err;
  }
};

export const updateCmActualLabourData = async (
  id: number,
  updatedData: Partial<{
    employee_id: number | null;
    duration: number | null;
    cm_general_id: number;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("e_cm_actual_labour")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating e_cm_actual_labour data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating e_cm_actual_labour data:", err);
    throw err;
  }
};

export const deleteCmActualLabourData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("e_cm_actual_labour")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting e_cm_actual_labour data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting e_cm_actual_labour data:", err);
    throw err;
  }
};