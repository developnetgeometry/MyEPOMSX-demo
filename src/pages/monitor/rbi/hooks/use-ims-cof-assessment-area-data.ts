import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useImsCofAssessmentCofAreaData = (rbiGeneralId: number) => {
  return useQuery({
    queryKey: ["i-ims-cof-assessment-cof-area", rbiGeneralId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("i_ims_cof_assessment_cof_area")
        .select(
          `id, iso_sys_id (id, name), det_sys_id (id, name),
          mitigation_system_id, ideal_gas_specific_heat_eq (id, name),
          ca_cmdflam, ca_injflam, asset_detail_id, ims_service_id,
          ims_general_id`
        )
        .eq("ims_rbi_general_id", rbiGeneralId) // Fetch records based on ims_general_id
        .single(); // Use single() to get a single record

      if (error) {
        console.error("Error fetching i_ims_cof_assessment_cof_area data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!rbiGeneralId, // Only fetch if rbiGeneralId is provided
  });
};

export const insertImsCofAssessmentCofAreaData = async (assessmentData: {
  iso_sys_id?: number;
  det_sys_id?: number;
  mitigation_system_id?: number;
  ideal_gas_specific_heat_eq?: number;
  ca_cmdflam?: number;
  ca_injflam?: number;
  asset_detail_id?: number;
  ims_service_id?: number;
  ims_general_id?: number;
  ims_rbi_general_id?: number; // Optional, if not provided it will be set later
}) => {
  try {
    const { data, error } = await supabase
      .from("i_ims_cof_assessment_cof_area")
      .insert([assessmentData]);

    if (error) {
      console.error("Error inserting i_ims_cof_assessment_cof_area data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting i_ims_cof_assessment_cof_area data:", err);
    throw err;
  }
};

export const updateImsCofAssessmentCofAreaData = async (
  id: number,
  updatedData: Partial<{
    iso_sys_id?: number;
    det_sys_id?: number;
    mitigation_system_id?: number;
    ideal_gas_specific_heat_eq?: number;
    ca_cmdflam?: number;
    ca_injflam?: number;
    asset_detail_id?: number;
    ims_service_id?: number;
    ims_general_id?: number;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("i_ims_cof_assessment_cof_area")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating i_ims_cof_assessment_cof_area data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating i_ims_cof_assessment_cof_area data:", err);
    throw err;
  }
};

export const deleteImsCofAssessmentCofAreaData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("i_ims_cof_assessment_cof_area")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting i_ims_cof_assessment_cof_area data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting i_ims_cof_assessment_cof_area data:", err);
    throw err;
  }
};