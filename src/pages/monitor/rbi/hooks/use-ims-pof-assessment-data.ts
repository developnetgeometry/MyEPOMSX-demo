import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useImsPofAssessmentData = (imsGeneralId: number) => {
  return useQuery({
    queryKey: ["i-ims-pof-assessment-general", imsGeneralId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("i_ims_pof_assessment_general")
        .select(
          `id, asset_detail_id, coating_quality_id, cladding,
          nominal_thickness, current_thickness, description,
          ims_general_id, data_confidence_id`
        )
        .eq("ims_general_id", imsGeneralId)
        .single(); // Fetch a single record based on imsGeneralId

      if (error) {
        console.error("Error fetching i_ims_pof_assessment_general data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!imsGeneralId, // Only fetch if imsGeneralId is provided
  });
};

export const insertImsPofAssessmentData = async (assessmentData: {
  asset_detail_id?: number;
  coating_quality_id?: number;
  cladding?: boolean;
  nominal_thickness?: number;
  current_thickness?: number;
  description?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("i_ims_pof_assessment_general")
      .insert([assessmentData]);

    if (error) {
      console.error("Error inserting i_ims_pof_assessment_general data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting i_ims_pof_assessment_general data:", err);
    throw err;
  }
};

export const updateImsPofAssessmentData = async (
  id: number,
  updatedData: Partial<{
    asset_detail_id?: number;
    coating_quality_id?: number;
    cladding?: boolean;
    nominal_thickness?: number;
    current_thickness?: number;
    description?: string;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("i_ims_pof_assessment_general")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating i_ims_pof_assessment_general data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating i_ims_pof_assessment_general data:", err);
    throw err;
  }
};

export const deleteImsPofAssessmentData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("i_ims_pof_assessment_general")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting i_ims_pof_assessment_general data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting i_ims_pof_assessment_general data:", err);
    throw err;
  }
};