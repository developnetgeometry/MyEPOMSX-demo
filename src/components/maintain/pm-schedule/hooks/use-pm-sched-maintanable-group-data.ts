import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const usePmSchedMaintainableGroupData = (pmScheduleId: number) => {
  return useQuery({
    queryKey: ["e-pm-schedule-maintainable-group-data", pmScheduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_pm_schedule_maintainable_group")
        .select(`id, pm_schedule_id, asset_id (id, asset_no, asset_name), 
            group_id (id, name)`)
        .eq("pm_schedule_id", pmScheduleId);

      if (error) {
        console.error("Error fetching e_pm_schedule_maintainable_group data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!pmScheduleId, // Only fetch if pmScheduleId is provided
  });
};

export const insertPmSchedMaintainableGroupData = async (groupData: {
  pm_schedule_id: number;
  asset_id: number;
  group_id: number;
}) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_schedule_maintainable_group")
      .insert([groupData]);

    if (error) {
      console.error("Error inserting e_pm_schedule_maintainable_group data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting e_pm_schedule_maintainable_group data:", err);
    throw err;
  }
};

export const updatePmSchedMaintainableGroupData = async (
  id: number,
  updatedData: Partial<{
    asset_id: number;
    group_id: number;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_schedule_maintainable_group")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating e_pm_schedule_maintainable_group data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating e_pm_schedule_maintainable_group data:", err);
    throw err;
  }
};

export const deletePmSchedMaintainableGroupData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_schedule_maintainable_group")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting e_pm_schedule_maintainable_group data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting e_pm_schedule_maintainable_group data:", err);
    throw err;
  }
};