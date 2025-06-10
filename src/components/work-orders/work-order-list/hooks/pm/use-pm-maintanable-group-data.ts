import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const usePmMaintainableGroupData = (pmWoId: number) => {
  return useQuery({
    queryKey: ["e-pm-maintainable-group-data", pmWoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_pm_maintainable_group")
        .select(`id, pm_wo_id, asset_id (id, asset_no, asset_name), 
            group_id (id, name)`)
        .eq("pm_wo_id", pmWoId);

      if (error) {
        console.error("Error fetching e_pm_maintainable_group data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!pmWoId, // Only fetch if pmWoId is provided
  });
};

export const insertPmMaintainableGroupData = async (groupData: {
  pm_wo_id: number;
  asset_id: number;
  group_id: number;
}) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_maintainable_group")
      .insert([groupData]);

    if (error) {
      console.error("Error inserting e_pm_maintainable_group data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting e_pm_maintainable_group data:", err);
    throw err;
  }
};

export const updatePmMaintainableGroupData = async (
  id: number,
  updatedData: Partial<{
    asset_id: number;
    group_id: number;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_maintainable_group")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating e_pm_maintainable_group data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating e_pm_maintainable_group data:", err);
    throw err;
  }
};

export const deletePmMaintainableGroupData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_maintainable_group")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting e_pm_maintainable_group data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting e_pm_maintainable_group data:", err);
    throw err;
  }
};