import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useGeneralMaintenanceData = () => {
  return useQuery({
    queryKey: ["e-general-maintenance-data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_general_maintenance")
        .select("id, name")
        .order("id");

      if (error) {
        console.error("Error fetching e_general_maintenance data:", error);
        throw error;
      }

      return data;
    },
  });
};

export const insertGeneralMaintenanceData = async (maintenanceData: {
  name: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("e_general_maintenance")
      .insert([maintenanceData]);

    if (error) {
      console.error("Error inserting e_general_maintenance data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting e_general_maintenance data:", err);
    throw err;
  }
};

export const updateGeneralMaintenanceData = async (
  id: number,
  updatedData: Partial<{
    name: string;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("e_general_maintenance")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating e_general_maintenance data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating e_general_maintenance data:", err);
    throw err;
  }
};

export const deleteGeneralMaintenanceData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("e_general_maintenance")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting e_general_maintenance data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting e_general_maintenance data:", err);
    throw err;
  }
};