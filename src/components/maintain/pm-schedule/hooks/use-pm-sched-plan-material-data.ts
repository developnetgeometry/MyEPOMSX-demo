import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const usePmSchedPlanMaterialData = (pmScheduleId: number) => {
  return useQuery({
    queryKey: ["e-pm-schedule-plan-material-data", pmScheduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_pm_schedule_plan_material")
        .select("id, pm_schedule_id, item_id (id, item_no, item_name), quantity")
        .eq("pm_schedule_id", pmScheduleId);

      if (error) {
        console.error("Error fetching e_pm_schedule_plan_material data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!pmScheduleId, // Only fetch if pmScheduleId is provided
  });
};

export const insertPmSchedPlanMaterialData = async (materialData: {
  pm_schedule_id: number | null;
  item_id: number | null;
  quantity: number | null;
}) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_schedule_plan_material")
      .insert([materialData]);

    if (error) {
      console.error("Error inserting e_pm_schedule_plan_material data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting e_pm_schedule_plan_material data:", err);
    throw err;
  }
};

export const updatePmSchedPlanMaterialData = async (
  id: number,
  updatedData: Partial<{
    pm_schedule_id: number | null;
    item_id: number | null;
    quantity: number | null;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_schedule_plan_material")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating e_pm_schedule_plan_material data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating e_pm_schedule_plan_material data:", err);
    throw err;
  }
};

export const deletePmSchedPlanMaterialData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_schedule_plan_material")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting e_pm_schedule_plan_material data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting e_pm_schedule_plan_material data:", err);
    throw err;
  }
};