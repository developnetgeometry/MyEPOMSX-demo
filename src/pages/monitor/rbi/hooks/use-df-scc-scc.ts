import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useImsDfSccSccData = (rbiGeneralId: number) => {
  return useQuery({
    queryKey: ["i-df-scc-scc", rbiGeneralId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("i_df_scc_scc")
        .select(
          `id, inspection_efficiency_id (id, name), hardness_brinnel, dfsccfb, df_scc_scc,
          h2s_in_water, ph, last_inspection_date, ims_pof_assessment_id,
          ims_general_id (id, pwht)`
        )
        .eq("ims_rbi_general_id", rbiGeneralId) // Fetch records based on i_ims_general_id
        .single(); // Use single() to get a single record

      if (error) {
        console.error("Error fetching i_df_scc_scc data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!rbiGeneralId, // Only fetch if rbiGeneralId is provided
  });
};

export const insertImsDfSccSccData = async (dfSccSccData: {
  inspection_efficiency_id?: number;
  hardness_brinnel?: number;
  dfsccfb?: number;
  df_scc_scc?: number;
  h2s_in_water?: number;
  ph?: number;
  ims_general_id?: number;
  last_inspection_date?: string; // Use ISO string format for dates
  ims_pof_assessment_id?: number;
  ims_rbi_general_id?: number;
}) => {
  try {
    const { data, error } = await supabase
      .from("i_df_scc_scc")
      .insert([dfSccSccData]);

    if (error) {
      console.error("Error inserting i_df_scc_scc data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting i_df_scc_scc data:", err);
    throw err;
  }
};

export const updateImsDfSccSccData = async (
  id: number,
  updatedData: Partial<{
    inspection_efficiency_id?: number;
    hardness_brinnel?: number;
    dfsccfb?: number;
    df_scc_scc?: number;
    h2s_in_water?: number;
    ph?: number;
    ims_general_id?: number;
    last_inspection_date?: string; // Use ISO string format for dates
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("i_df_scc_scc")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating i_df_scc_scc data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating i_df_scc_scc data:", err);
    throw err;
  }
};

export const deleteImsDfSccSccData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("i_df_scc_scc")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting i_df_scc_scc data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting i_df_scc_scc data:", err);
    throw err;
  }
};