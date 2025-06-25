import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useImsDfSccSohicData = (imsGeneralId: number) => {
  return useQuery({
    queryKey: ["i-df-scc-sohic", imsGeneralId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("i_df_scc_sohic")
        .select(
          `id, inspection_efficiency_id, steelscontent_id, harness_brinnel,
          dfscc_sohic, ims_pof_assessment_id, h2s_in_water, ph,
          last_inspection_date, i_ims_protection_id, ims_general_id (id, pwht),
          ims_pof_assessment_id`
        )
        .eq("ims_general_id", imsGeneralId) // Fetch records based on ims_pof_assessment_id
        .single(); // Use single() to get a single record

      if (error) {
        console.error("Error fetching i_df_scc_sohic data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!imsGeneralId, // Only fetch if imsGeneralId is provided
  });
};

export const insertImsDfSccSohicData = async (dfSccSohicData: {
  inspection_efficiency_id?: number;
  steelscontent_id?: number;
  harness_brinnel?: number;
  dfscc_sohic?: number;
  ims_pof_assessment_id?: number;
  h2s_in_water?: number;
  ph?: number;
  i_ims_general_id?: number;
  last_inspection_date?: string; // Use ISO string format for dates
  i_ims_protection_id?: number;
}) => {
  try {
    const { data, error } = await supabase
      .from("i_df_scc_sohic")
      .insert([dfSccSohicData]);

    if (error) {
      console.error("Error inserting i_df_scc_sohic data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting i_df_scc_sohic data:", err);
    throw err;
  }
};

export const updateImsDfSccSohicData = async (
  id: number,
  updatedData: Partial<{
    inspection_efficiency_id?: number;
    steelscontent_id?: number;
    harness_brinnel?: number;
    dfscc_sohic?: number;
    ims_pof_assessment_id?: number;
    h2s_in_water?: number;
    ph?: number;
    i_ims_general_id?: number;
    last_inspection_date?: string; // Use ISO string format for dates
    i_ims_protection_id?: number;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("i_df_scc_sohic")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating i_df_scc_sohic data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating i_df_scc_sohic data:", err);
    throw err;
  }
};

export const deleteImsDfSccSohicData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("i_df_scc_sohic")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting i_df_scc_sohic data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting i_df_scc_sohic data:", err);
    throw err;
  }
};