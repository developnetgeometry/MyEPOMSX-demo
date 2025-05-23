import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useNewWorkFailureData = (workRequestId: number) => {
  return useQuery({
    queryKey: ["e-new-work-failure", workRequestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_new_work_failure")
        .select(
          `id, safety, like_hood, action_taken, critical_rank, 
          provability_occurrance, environment_consequences, has_consequence, corrective_action,
          priority_id (id, name), 
          lost_time_incident, failure_shutdown, 
          failure_type_id (id, name)`
        )
        .eq("work_request_id", workRequestId)
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching e_new_work_failure data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!workRequestId, // Only fetch if workRequestId is provided
  });
};

export const insertNewWorkFailureData = async (failureData: {
  work_request_id: number;
  safety?: string;
  like_hood?: string;
  action_taken?: string;
  critical_rank?: number;
  provability_occurrance?: number;
  environment_consequences?: string;
  has_consequence?: string;
  corrective_action?: string;
  priority_id?: number;
  lost_time_incident?: boolean;
  failure_shutdown?: boolean;
  failure_type_id?: number;
}) => {
  try {
    const { data, error } = await supabase
      .from("e_new_work_failure")
      .insert([failureData]);

    if (error) {
      console.error("Error inserting e_new_work_failure data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting e_new_work_failure data:", err);
    throw err;
  }
};

export const updateNewWorkFailureData = async (
  id: number,
  updatedData: Partial<{
    safety?: string;
    like_hood?: string;
    action_taken?: string;
    critical_rank?: number;
    provability_occurrance?: number;
    environment_consequences?: string;
    has_consequence?: string;
    corrective_action?: string;
    priority_id?: number;
    lost_time_incident?: boolean;
    failure_shutdown?: boolean;
    failure_type_id?: number;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("e_new_work_failure")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating e_new_work_failure data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating e_new_work_failure data:", err);
    throw err;
  }
};

export const deleteNewWorkFailureData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("e_new_work_failure")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting e_new_work_failure data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting e_new_work_failure data:", err);
    throw err;
  }
};