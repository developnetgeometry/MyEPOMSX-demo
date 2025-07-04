import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useImsCofAssessmentCofProdData = (rbiGeneralId: number) => {
  return useQuery({
    queryKey: ["i-ims-cof-assessment-cof-prod", rbiGeneralId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("i_ims_cof_assessment_cof_prod")
        .select(
          "id, outagemult, injcost, envcost, fracevap, volenv, fcenviron, fc, asset_detail_id, ims_general_id, lra_prod"
        )
        .eq("ims_rbi_general_id", rbiGeneralId) // Fetch records based on ims_general_id
        .single();

      if (error) {
        console.error("Error fetching i_ims_cof_assessment_cof_prod data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!rbiGeneralId, // Only fetch if rbiGeneralId is provided
  });
};

export const insertImsCofAssessmentCofProdData = async (assessmentData: {
  outagemult?: number;
  injcost?: number;
  envcost?: number;
  fracevap?: number;
  volenv?: number;
  fcenviron?: number;
  fc?: number;
  asset_detail_id?: number;
  ims_general_id?: number;
  ims_rbi_general_id?: number; // Optional, if not provided it will be set later
  lra_prod?: number; // Optional, if not provided it will be set later
}) => {
  try {
    const { data, error } = await supabase
      .from("i_ims_cof_assessment_cof_prod")
      .insert([assessmentData]);

    if (error) {
      console.error("Error inserting i_ims_cof_assessment_cof_prod data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting i_ims_cof_assessment_cof_prod data:", err);
    throw err;
  }
};

export const updateImsCofAssessmentCofProdData = async (
  id: number,
  updatedData: Partial<{
    outagemult?: number;
    injcost?: number;
    envcost?: number;
    fracevap?: number;
    volenv?: number;
    fcenviron?: number;
    fc?: number;
    asset_detail_id?: number;
    ims_general_id?: number;
    ims_rbi_general_id?: number; // Optional, if not provided it will be set later
    lra_prod?: number; // Optional, if not provided it will be set later
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("i_ims_cof_assessment_cof_prod")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating i_ims_cof_assessment_cof_prod data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating i_ims_cof_assessment_cof_prod data:", err);
    throw err;
  }
};

export const deleteImsCofAssessmentCofProdData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("i_ims_cof_assessment_cof_prod")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting i_ims_cof_assessment_cof_prod data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting i_ims_cof_assessment_cof_prod data:", err);
    throw err;
  }
};