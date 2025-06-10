import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const usePmPlanLabourData = (pmWoId: number) => {
  return useQuery({
    queryKey: ["e-pm-plan-labour-data", pmWoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_pm_plan_labour")
        .select("id, employee_id (id, uid_employee, name), duration, pm_wo_id")
        .eq("pm_wo_id", pmWoId);

      if (error) {
        console.error("Error fetching e_pm_plan_labour data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!pmWoId, // Only fetch if pmWoId is provided
  });
};

export const insertPmPlanLabourData = async (labourData: {
  employee_id: number | null;
  duration: number | null;
  pm_wo_id: number;
}) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_plan_labour")
      .insert([labourData]);

    if (error) {
      console.error("Error inserting e_pm_plan_labour data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting e_pm_plan_labour data:", err);
    throw err;
  }
};

export const updatePmPlanLabourData = async (
  id: number,
  updatedData: Partial<{
    employee_id: number | null;
    duration: number | null;
    pm_wo_id: number;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_plan_labour")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating e_pm_plan_labour data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating e_pm_plan_labour data:", err);
    throw err;
  }
};

export const deletePmPlanLabourData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_plan_labour")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting e_pm_plan_labour data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting e_pm_plan_labour data:", err);
    throw err;
  }
};