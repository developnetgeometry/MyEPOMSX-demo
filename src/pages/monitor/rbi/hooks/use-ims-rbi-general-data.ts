import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useImsRbiGeneralData = () => {
  return useQuery({
    queryKey: ["i-ims-rbi-general-data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("i_ims_rbi_general")
        .select(`
          id,
          created_at,
          rbi_no,
          pof_value,
          cof_value,
          risk_level,
          i_ims_general_id,
          asset_detail_id(
            id, type_id (name),
            e_asset!e_asset_detail_asset_id_fkey(
                asset_no,
                asset_name
            )
          )
        `)
        .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching i_ims_rbi_general data:", error);
        throw error;
      }

      return data;
    },
  });
};

export const useImsRbiGeneralDataById = (id: number) => {
  return useQuery({
    queryKey: ["i-ims-rbi-general-data", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("i_ims_rbi_general")
        .select(`
          id,
          created_at,
          rbi_no,
          pof_value,
          cof_value,
          risk_level,
          i_ims_general_id,
          asset_detail_id(
            id, type_id (name),
            e_asset!e_asset_detail_asset_id_fkey(
                asset_no,
                asset_name
            )
          )
        `)
        .eq("id", id) // Filter by the provided id
        .single(); // Fetch a single record

      if (error) {
        console.error("Error fetching i_ims_rbi_general data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!id, // Only fetch if id is provided
  });
};

export const insertImsRbiGeneralData = async (rbiGeneralData: {
  i_ims_general_id?: number;
  asset_detail_id?: number;
  asset_name?: string; // Added asset_name
  i_ims_design?: number;
  pof_value?: string;
  cof_finance_value?: number;
  cof_area_value?: number;
  risk_level?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("i_ims_rbi_general")
      .insert([rbiGeneralData])
      .select("id"); // Return the id of the newly inserted row

    if (error) {
      console.error("Error inserting i_ims_rbi_general data:", error);
      throw error;
    }

    return data?.[0]?.id; // Return the primary key (id) of the newly inserted row
  } catch (err) {
    console.error("Unexpected error inserting i_ims_rbi_general data:", err);
    throw err;
  }
};

export const updateImsRbiGeneralData = async (
  id: number,
  updatedData: Partial<{
    i_ims_general_id?: number;
    asset_detail_id?: number;
    asset_name?: string; // Added asset_name
    i_ims_design?: number;
    pof_value?: string;
    cof_finance_value?: number;
    cof_area_value?: number;
    risk_level?: string;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("i_ims_rbi_general")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating i_ims_rbi_general data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating i_ims_rbi_general data:", err);
    throw err;
  }
};
export const deleteImsRbiGeneralData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("i_ims_rbi_general")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting i_ims_rbi_general data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting i_ims_rbi_general data:", err);
    throw err;
  }
};