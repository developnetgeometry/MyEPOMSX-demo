import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const usePmSchedPlanLabourData = (pmScheduleId: number) => {
  return useQuery({
    queryKey: ["e-pm-schedule-plan-labour-data", pmScheduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_pm_schedule_plan_labour")
        .select("id, employee_id (id, uid_employee, name), duration, pm_schedule_id")
        .eq("pm_schedule_id", pmScheduleId);

      if (error) {
        console.error("Error fetching e_pm_schedule_plan_labour data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!pmScheduleId, // Only fetch if pmScheduleId is provided
  });
};

export const insertPmSchedPlanLabourData = async (labourData: {
  employee_id: number | null;
  duration: number | null;
  pm_schedule_id: number;
}) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_schedule_plan_labour")
      .insert([labourData]);

    if (error) {
      console.error("Error inserting e_pm_schedule_plan_labour data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting e_pm_schedule_plan_labour data:", err);
    throw err;
  }
};

export const updatePmSchedPlanLabourData = async (
  id: number,
  updatedData: Partial<{
    employee_id: number | null;
    duration: number | null;
    pm_schedule_id: number;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_schedule_plan_labour")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating e_pm_schedule_plan_labour data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating e_pm_schedule_plan_labour data:", err);
    throw err;
  }
};

export const deletePmSchedPlanLabourData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_schedule_plan_labour")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting e_pm_schedule_plan_labour data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting e_pm_schedule_plan_labour data:", err);
    throw err;
  }
};