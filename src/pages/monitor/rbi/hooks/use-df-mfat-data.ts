import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useImsDfMfatData = (imsGeneralId: number) => {
  return useQuery({
    queryKey: ["i-df-mfat", imsGeneralId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("i_df_mfat")
        .select(
          `id, previous_failure_id, visible_audible_shaking_id, shaking_frequency_id,
          cyclic_load_type_id, corrective_action_id, pipe_complexity_id, pipe_condition_id,
          joint_branch_design_id, brach_diameter_id, dmfatfb, ims_pof_assessment_id,
          data_confidence_id, ims_general_id`
        )
        .eq("ims_general_id", imsGeneralId) // Fetch records based on ims_pof_assessment_id
        .single(); // Use single() to get a single record

      if (error) {
        console.error("Error fetching i_df_mfat data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!imsGeneralId, // Only fetch if imsGeneralId is provided
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