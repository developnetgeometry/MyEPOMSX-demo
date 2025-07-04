import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useImsDfExtClsccData = (imsGeneralId: number) => {
  return useQuery({
    queryKey: ["i-df-ext-clscc", imsGeneralId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("i_df_ext_clscc")
        .select(
          `id, last_inspection_date, new_coating_date, inspection_efficiency_id,
          ims_pof_asessment_id, data_confidence_id, df_ext_cl_scc,
          i_ims_protection_id (coating_quality_id), i_ims_design_id (ext_env_id), ims_general_id`
        )
        .eq("ims_general_id", imsGeneralId) // Fetch records based on ims_pof_asessment_id
        .single(); // Use single() to get a single record

      if (error) {
        console.error("Error fetching i_df_ext_clscc data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!imsGeneralId, // Only fetch if imsGeneralId is provided
  });
};

export const insertImsDfExtClsccData = async (dfExtClsccData: {
  last_inspection_date?: string; // Use ISO string format for dates
  new_coating_date?: string; // Use ISO string format for dates
  inspection_efficiency_id?: number;
  ims_pof_asessment_id?: number;
  data_confidence_id?: number;
  df_ext_cl_scc?: number;
  i_ims_protection_id?: number;
  i_ims_design_id?: number;
  ims_general_id?: number;
  ims_rbi_general_id?: number;
}) => {
  try {
    const { data, error } = await supabase
      .from("i_df_ext_clscc")
      .insert([dfExtClsccData]);

    if (error) {
      console.error("Error inserting i_df_ext_clscc data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting i_df_ext_clscc data:", err);
    throw err;
  }
};

export const updateImsDfExtClsccData = async (
  id: number,
  updatedData: Partial<{
    last_inspection_date?: string; // Use ISO string format for dates
    new_coating_date?: string; // Use ISO string format for dates
    inspection_efficiency?: number;
    ims_pof_asessment_id?: number;
    data_confidence_id?: number;
    df_ext_cl_scc?: number;
    i_ims_protection_id?: number;
    i_ims_design_id?: number;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("i_df_ext_clscc")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating i_df_ext_clscc data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating i_df_ext_clscc data:", err);
    throw err;
  }
};

export const deleteImsDfExtClsccData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("i_df_ext_clscc")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting i_df_ext_clscc data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting i_df_ext_clscc data:", err);
    throw err;
  }
};