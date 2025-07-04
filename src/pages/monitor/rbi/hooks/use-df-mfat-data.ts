import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useImsDfMfatData = (rbiGeneralId: number) => {
  return useQuery({
    queryKey: ["i-df-mfat", rbiGeneralId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("i_df_mfat")
        .select(
          `id, previous_failure_id (id, name, value),
          visible_audible_shaking_id (id, name, value), shaking_frequency_id (id, name, value),
          cyclic_load_type_id (id, name, value), corrective_action_id (id, name, value),
          pipe_complexity_id (id, name, value), pipe_condition_id (id, name, value),
          joint_branch_design_id (id, name, value), brach_diameter_id (id, name, value), 
          dmfatfb, ims_pof_assessment_id,
          data_confidence_id, ims_general_id`
        )
        .eq("ims_rbi_general_id", rbiGeneralId) // Fetch records based on ims_pof_assessment_id
        .single(); // Use single() to get a single record

      if (error) {
        console.error("Error fetching i_df_mfat data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!rbiGeneralId, // Only fetch if rbiGeneralId is provided
  });
};

export const insertImsDfMfatData = async (dfMfatData: {
  previous_failure_id?: number;
  visible_audible_shaking_id?: number;
  shaking_frequency_id?: number;
  cyclic_load_type_id?: number;
  corrective_action_id?: number;
  pipe_complexity_id?: number;
  pipe_condition_id?: number;
  joint_branch_design_id?: number;
  brach_diameter_id?: number;
  dmfatfb?: number;
  ims_pof_assessment_id?: number;
  data_confidence_id?: number;
  ims_general_id?: number;
  ims_rbi_general_id?: number;
}) => {
  try {
    const { data, error } = await supabase
      .from("i_df_mfat")
      .insert([dfMfatData]);

    if (error) {
      console.error("Error inserting i_df_mfat data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting i_df_mfat data:", err);
    throw err;
  }
};

export const updateImsDfMfatData = async (
  id: number,
  updatedData: Partial<{
    previous_failure_id?: number;
    visible_audible_shaking_id?: number;
    shaking_frequency_id?: number;
    cyclic_load_type_id?: number;
    corrective_action_id?: number;
    pipe_complexity_id?: number;
    pipe_condition_id?: number;
    joint_branch_design_id?: number;
    brach_diameter_id?: number;
    dmfatfb?: number;
    ims_pof_assessment_id?: number;
    data_confidence_id?: number;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("i_df_mfat")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating i_df_mfat data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating i_df_mfat data:", err);
    throw err;
  }
};

export const deleteImsDfMfatData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("i_df_mfat")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting i_df_mfat data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting i_df_mfat data:", err);
    throw err;
  }
};