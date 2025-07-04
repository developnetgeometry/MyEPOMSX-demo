import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useImsDfExtData = (rbiGeneralId: number) => {
  return useQuery({
    queryKey: ["i-df-ext", rbiGeneralId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("i_df_ext")
        .select(
          `id, last_inspection_date, new_coating_date, ims_pof_assessment_id,
          data_confidence_id, dfextcorrf, i_ims_protection_id(coating_quality_id),
          i_ims_design_id (ext_env_id, pipe_support, soil_water_interface, operating_temperature ),
          nextcorra, nextcorrb, nextcorrc, nextcorrd, ims_general_id, current_thickness`
        )
        .eq("ims_rbi_general_id", rbiGeneralId) // Fetch records based on ims_por_assessment_id
        .single(); // Use single() to get a single record

      if (error) {
        console.error("Error fetching i_df_ext data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!rbiGeneralId, // Only fetch if rbiGeneralId is provided
  });
};

export const insertImsDfExtData = async (dfExtData: {
  last_inspection_date?: string; // Use ISO string format for dates
  new_coating_date?: string; // Use ISO string format for dates
  ims_pof_assessment_id?: number;
  data_confidence_id?: number;
  dfextcorrf?: number;
  i_ims_protection_id?: number;
  i_ims_design_id?: number;
  nextcorra?: number;
  nextcorrb?: number;
  nextcorrc?: number;
  nextcorrd?: number;
  ims_general_id?: number;
  ims_rbi_general_id?: number;
  current_thickness?: number; // Optional, if you want to store the current thickness
}) => {
  try {
    const { data, error } = await supabase
      .from("i_df_ext")
      .insert([dfExtData]);

    if (error) {
      console.error("Error inserting i_df_ext data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting i_df_ext data:", err);
    throw err;
  }
};

export const updateImsDfExtData = async (
  id: number,
  updatedData: Partial<{
    last_inspection_date?: string; // Use ISO string format for dates
    new_coating_date?: string; // Use ISO string format for dates
    ims_por_assessment_id?: number;
    data_confidence_id?: number;
    dfextcorrf?: number;
    i_ims_protection_id?: number;
    i_ims_design_id?: number;
    nextcorra?: number;
    nextcorrb?: number;
    nextcorrc?: number;
    nextcorrd?: number;
    current_thickness?: number; // Optional, if you want to store the current thickness
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("i_df_ext")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating i_df_ext data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating i_df_ext data:", err);
    throw err;
  }
};

export const deleteImsDfExtData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("i_df_ext")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting i_df_ext data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting i_df_ext data:", err);
    throw err;
  }
};