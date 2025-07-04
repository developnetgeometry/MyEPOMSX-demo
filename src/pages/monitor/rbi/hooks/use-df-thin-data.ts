import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useImsDfThinData = (rbiGeneralId: number) => {
  return useQuery({
    queryKey: ["i-df-thin", rbiGeneralId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("i_df_thin")
        .select(
          `id, last_inspection_date, data_confidence_id, nthin_a, nthin_b,
          nthin_c, nthin_d, agerc, ims_pof_assessment_id, dfthinfb, ims_general_id,
          cr_act, i_ims_design_id, new_coating_date, current_thickness`
        )
        .eq("ims_rbi_general_id", rbiGeneralId) // Fetch records based on ims_pof_assessment_id
        .single(); // Use single() to get a single record

      if (error) {
        console.error("Error fetching i_df_thin data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!rbiGeneralId, // Only fetch if rbiGeneralId is provided
  });
};

export const insertImsDfThinData = async (dfThinData: {
  last_inspection_date?: string; // Use ISO string format for timestamps
  data_confidence_id?: number;
  nthin_a?: number;
  nthin_b?: number;
  nthin_c?: number;
  nthin_d?: number;
  new_coating_date?: string; // Use ISO string format for timestamps
  agerc?: string; // Use ISO string format for timestamps
  ims_pof_assessment_id?: number;
  dfthinfb?: number;
  ims_general_id?: number; // Optional, if you want to associate with a specific ims_general_id
  cr_act?: number;
  ims_rbi_general_id?: number;
  current_thickness?: number; // Optional, if you want to store the current thickness
}) => {
  try {
    const { data, error } = await supabase
      .from("i_df_thin")
      .insert([dfThinData]);

    if (error) {
      console.error("Error inserting i_df_thin data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting i_df_thin data:", err);
    throw err;
  }
};

export const updateImsDfThinData = async (
  id: number,
  updatedData: Partial<{
    last_inspection_date?: string; // Use ISO string format for timestamps
    data_confidence_id?: number;
    nthin_a?: number;
    nthin_b?: number;
    nthin_c?: number;
    nthin_d?: number;
    last_coating_date?: string; // Use ISO string format for timestamps
    agerc?: string; // Use ISO string format for timestamps
    ims_pof_assessment_id?: number;
    dfthinfb?: number;
    current_thickness?: number; // Optional, if you want to store the current thickness
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("i_df_thin")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating i_df_thin data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating i_df_thin data:", err);
    throw err;
  }
};

export const deleteImsDfThinData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("i_df_thin")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting i_df_thin data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting i_df_thin data:", err);
    throw err;
  }
};