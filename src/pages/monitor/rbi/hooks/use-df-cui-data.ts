import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useImsDfCuiData = (imsGeneralId: number) => {
  return useQuery({
    queryKey: ["i-df-cui", imsGeneralId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("i_df_cui")
        .select(
          `id, last_inspection_date, new_coating_date, dfcuiff,
          ims_pof_assessment_id, data_confidence_id, cr_act,
          i_ims_protection_id(id, coating_quality_id, insulation_type_id, insulation_complexity_id, insulation_condition, design_fabrication_id, interface_id),
          i_ims_design_id (id, ext_env_id), ncuifa, ncuifb, ncuifc, ncuifd, ims_general_id`
        )
        .eq("ims_general_id", imsGeneralId) // Fetch records based on ims_pof_assessment_id
        .single(); // Use single() to get a single record

      if (error) {
        console.error("Error fetching i_df_cui data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!imsGeneralId, // Only fetch if imsGeneralId is provided
  });
};

export const insertImsDfCuiData = async (dfCuiData: {
  last_inspection_date?: string; // Use ISO string format for dates
  new_coating_date?: string; // Use ISO string format for dates
  dfcuiff?: number;
  ims_pof_assessment_id?: number;
  data_confidence_id?: number;
  i_ims_protection_id?: number;
  i_ims_design_id?: number;
  ncuifa?: number;
  ncuifb?: number;
  ncuifc?: number;
  ncuifd?: number;
  ims_general_id?: number; // Optional, if not provided it will be set later
  cr_act?: number; // Optional, if not provided it will be set later
  ims_rbi_general_id?: number; // Optional, if not provided it will be set later
}) => {
  try {
    const { data, error } = await supabase
      .from("i_df_cui")
      .insert([dfCuiData]);

    if (error) {
      console.error("Error inserting i_df_cui data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting i_df_cui data:", err);
    throw err;
  }
};

export const updateImsDfCuiData = async (
  id: number,
  updatedData: Partial<{
    last_inspection_date?: string; // Use ISO string format for dates
    new_coating_date?: string; // Use ISO string format for dates
    dfcuiff?: number;
    ims_pof_assessment_id?: number;
    data_confidence_id?: number;
    i_ims_protection_id?: number;
    i_ims_design_id?: number;
    ncuifa?: number;
    ncuifb?: number;
    ncuifc?: number;
    ncuifd?: number;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("i_df_cui")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating i_df_cui data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating i_df_cui data:", err);
    throw err;
  }
};

export const deleteImsDfCuiData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("i_df_cui")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting i_df_cui data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting i_df_cui data:", err);
    throw err;
  }
};