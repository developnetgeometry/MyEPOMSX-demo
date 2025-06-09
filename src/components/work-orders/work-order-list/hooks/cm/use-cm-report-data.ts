import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useCmReportData = (cmGeneralId: number) => {
  return useQuery({
    queryKey: ["e-cm-report", cmGeneralId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_cm_report")
        .select(
          `id, weather_condition, visibility, wind_speed_direction,
          sea_well, alarm_trigger, 
          shutdown_type_id (id, name), 
          time_failed, time_resume, shift, redundant, other_detail,
          service_asset, pressure, temp, operating_history,
          time_in_servicehr, 
          material_class_id (id, name),
          design_code, cm_general_id`
        )
        .eq("cm_general_id", cmGeneralId)
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching e_cm_report data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!cmGeneralId,
  });
};

export const insertCmReportData = async (reportData: {
  cm_general_id: number;
  weather_condition?: string;
  visibility?: string;
  wind_speed_direction?: string;
  sea_well?: string;
  alarm_trigger?: string;
  shutdown_type_id?: number;
  time_failed?: string;
  time_resume?: string;
  shift?: string;
  redundant?: string;
  other_detail?: string;
  service_asset?: string;
  pressure?: number;
  temp?: number;
  operating_history?: number;
  time_in_servicehr?: number;
  material_class_id?: number;
  design_code?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("e_cm_report")
      .insert([reportData]);

    if (error) {
      console.error("Error inserting e_cm_report data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting e_cm_report data:", err);
    throw err;
  }
};

export const updateCmReportData = async (
  id: number,
  updatedData: Partial<{
    weather_condition?: string;
    visibility?: string;
    wind_speed_direction?: string;
    sea_well?: string;
    alarm_trigger?: string;
    shutdown_type_id?: number;
    time_failed?: string;
    time_resume?: string;
    shift?: string;
    redundant?: string;
    other_detail?: string;
    service_asset?: string;
    pressure?: number;
    temp?: number;
    operating_history?: number;
    time_in_servicehr?: number;
    material_class_id?: number;
    design_code?: string;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("e_cm_report")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating e_cm_report data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating e_cm_report data:", err);
    throw err;
  }
};

export const deleteCmReportData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("e_cm_report")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting e_cm_report data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting e_cm_report data:", err);
    throw err;
  }
};