import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useImsRbiRiskIrpData = (rbiGeneralId: number) => {
  return useQuery({
    queryKey: ["i-ims-rbi-risk-irp", rbiGeneralId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("i_ims_rbi_risk_irp")
        .select(
          `id, dhtha, dbrit, dthin, dextd,
          dscc, dmfat, pof, cof_financial, cof_area, pof_value,
          risk_level, risk_ranking, asset_detail_id, ims_general_id`
        )
        .eq("ims_rbi_general_id", rbiGeneralId)
        .single();

      if (error) {
        console.error("Error fetching i_ims_rbi_risk_irp data:", error);
        throw error;
      }

      return data;
    },
    enabled: !!rbiGeneralId, // Only fetch if rbiGeneralId is provided
  });
};

export const insertImsRbiRiskIrpData = async (riskIrpData: {
  dhtha?: number;
  dbrit?: number;
  dthin?: number;
  dextd?: number;
  dscc?: number;
  dmfat?: number;
  pof?: number;
  cof_financial?: number;
  cof_area?: number;
  pof_value?: string;
  risk_level?: number;
  risk_ranking?: number;
  asset_detail_id?: number;
  ims_general_id?: number;
  ims_rbi_general_id?: number; // Optional, if not provided it will be set later
}) => {
  try {
    const { data, error } = await supabase
      .from("i_ims_rbi_risk_irp")
      .insert([riskIrpData]);

    if (error) {
      console.error("Error inserting i_ims_rbi_risk_irp data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting i_ims_rbi_risk_irp data:", err);
    throw err;
  }
};

export const updateImsRbiRiskIrpData = async (
  id: number,
  updatedData: Partial<{
    dhtha?: number;
    dbrit?: number;
    dthin?: number;
    dextd?: number;
    dscc?: number;
    dmfat?: number;
    pof?: number;
    cof_financial?: number;
    cof_area?: number;
    pof_value?: string;
    risk_level?: number;
    risk_ranking?: number;
    asset_detail_id?: number;
    ims_general_id?: number;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("i_ims_rbi_risk_irp")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating i_ims_rbi_risk_irp data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating i_ims_rbi_risk_irp data:", err);
    throw err;
  }
};

export const deleteImsRbiRiskIrpData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("i_ims_rbi_risk_irp")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting i_ims_rbi_risk_irp data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting i_ims_rbi_risk_irp data:", err);
    throw err;
  }
};