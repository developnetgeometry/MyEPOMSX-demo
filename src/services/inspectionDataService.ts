import { supabase } from "@/lib/supabaseClient";

export const inspectionDataService = {
  async getInspectionDataList() {
    const { data, error } = await supabase
      .from("i_inspection_data")
      .select(
        `
        id,
        created_at,
        ltcr,
        stcr,
        inspection_strategy,
        remaining_life,
        is_active,
        asset_detail: e_asset_detail!asset_detail_id (
          id,
          asset: e_asset!asset_id (asset_no, asset_name)
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching i_inspection_data data:", error);
      throw error;
    }

    return (data || []).map((item) => ({
      id: item.id,
      assetNo: item.asset_detail?.asset?.asset_no ?? "",
      assetName: item.asset_detail?.asset?.asset_name ?? "",
      ltcr: item.ltcr ?? 0,
      stcr: item.stcr ?? 0,
      inspectionStrategy: item.inspection_strategy ?? "",
      remainingLife: item.remaining_life ?? 0,
      isActive: item.is_active ?? true,
    }));
  },

  async getInspectionData(id: number) {
    const { data, error } = await supabase
      .from("i_inspection_data")
      .select(
        `
        id,
        created_at,
        ltcr,
        stcr,
        inspection_strategy,
        inspection_request,
        remaining_life,
        is_active,
        created_at,
        updated_at,
        asset_detail: e_asset_detail!asset_detail_id (
          id,
          asset: e_asset!asset_id (asset_no, asset_name)
        )
      `
      )
      .eq("id", id)
      .order("created_at", { ascending: false })
      .single();

    if (error) {
      console.error("Error fetching i_inspection_data data:", error);
      throw error;
    }

    return data;
  },

  async createInspectionData(formData: any) {
    const { error } = await supabase.from("i_inspection_data").insert(formData);

    if (error) {
      console.error("Error creating i_inspection_data:", error);
      throw error;
    }
  },

  async updateInspectionData(id: number, formData: any) {
    const { error } = await supabase
      .from("i_inspection_data")
      .update(formData)
      .eq('id', id);

    if (error) {
      console.error("Error updating i_inspection_data:", error);
      throw error;
    }
  },

  async getAssetDetailOptionsWithAssetName() {
    const { data, error } = await supabase
      .from("e_asset")
      .select("id, asset_no, asset_name")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching e_asset_detail data:", error);
      throw error;
    }

    return (data || []).map((item) => ({
      value: item.id,
      label: item.asset_name,
    }));
  },
};
