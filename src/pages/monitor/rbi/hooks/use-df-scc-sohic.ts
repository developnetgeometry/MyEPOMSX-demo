import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useImsDfSccSohicData = (rbiGeneralId: number) => {
  return useQuery({
    queryKey: ["i-df-scc-sohic", rbiGeneralId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("i_df_scc_sohic")
        .select(
          `id, inspection_efficiency_id (id, name), steelscontent_id, harness_brinnel,
          dfscc_sohic, ims_pof_assessment_id, h2s_in_water, ph,
          last_inspection_date, i_ims_protection_id, ims_general_id (id, pwht),
          ims_pof_assessment_id, online_monitor_id (id, name, value)`
        )
        .eq("ims_rbi_general_id", rbiGeneralId) // Fetch records based on ims_pof_assessment_id
        .single(); // Use single() to get a single record

      if (error) {
        console.error("Error fetching i_df_scc_sohic data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!rbiGeneralId, // Only fetch if rbiGeneralId is provided
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
  ims_general_id?: number;
  last_inspection_date?: string; // Use ISO string format for dates
  i_ims_protection_id?: number;
  ims_rbi_general_id?: number; // Optional, if not provided it will be set later
  online_monitor_id?: number; // Optional, if not provided it will be set later
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
    ims_general_id?: number;
    last_inspection_date?: string; // Use ISO string format for dates
    i_ims_protection_id?: number;
    online_monitor_id?: number; // Optional, if not provided it will be set later
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