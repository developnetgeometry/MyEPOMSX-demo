import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const usePmReportData = (pmWoId: number) => {
  return useQuery({
    queryKey: ["e-pm-report-data", pmWoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_pm_report")
        .select("id, pm_wo_id, sce_result, detail_description, equipment_status, general_maintenances")
        .eq("pm_wo_id", pmWoId);

      if (error) {
        console.error("Error fetching e_pm_report data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!pmWoId, // Only fetch if pmWoId is provided
  });
};

export const insertPmReportData = async (reportData: {
  pm_wo_id: number | null;
  sce_result: string | null;
  detail_description: string | null;
  equipment_status: string | null;
  general_maintenances: string[] | null;
}) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_report")
      .insert([reportData]);

    if (error) {
      console.error("Error inserting e_pm_report data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting e_pm_report data:", err);
    throw err;
  }
};

export const updatePmReportData = async (
  id: number,
  updatedData: Partial<{
    pm_wo_id: number | null;
    sce_result: string | null;
    detail_description: string | null;
    equipment_status: string | null;
    general_maintenances: string[] | null;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_report")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating e_pm_report data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating e_pm_report data:", err);
    throw err;
  }
};

export const deletePmReportData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("e_pm_report")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting e_pm_report data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting e_pm_report data:", err);
    throw err;
  }
};