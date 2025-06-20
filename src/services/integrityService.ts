import { supabase } from "@/lib/supabaseClient";

export interface IntegrityAsset {
  id: number;
  asset_no: string;
  asset_name: string | null;
  area: string | null;
  system: string | null;
  status: string | null;
  asset_detail_id: number;
  ims_asset_type_id: number;
}

export const integrityService = {
  /**
   * Fetch assets for integrity management based on ims_asset_type_id
   * @param imsAssetTypeId - 1 for pressure vessels, 2 for piping
   */
  async getIntegrityAssets(imsAssetTypeId: number): Promise<IntegrityAsset[]> {
    const { data, error } = await supabase
      .from("e_asset")
      .select(
        `
        id,
        asset_no,
        asset_name,
        asset_detail_id,
        asset_detail:e_asset_detail!asset_detail_id(
          id,
          area:e_asset_area(name),
          ims_general:i_ims_general!asset_detail_id(
            id,
            ims_asset_type_id
          )
        ),
        system:e_system(system_name),
        asset_status:e_asset_status(name)
      `
      )
      .not("asset_detail_id", "is", null)
      .order("asset_no");

    if (error) {
      throw new Error(`Error fetching integrity assets: ${error.message}`);
    }

    // Filter assets that have integrity records with the specified ims_asset_type_id
    const filteredData = (data || [])
      .filter((asset) => {
        const imsGeneral = asset.asset_detail?.ims_general;
        return (
          imsGeneral &&
          Array.isArray(imsGeneral) &&
          imsGeneral.length > 0 &&
          imsGeneral.some(
            (record: any) => record.ims_asset_type_id === imsAssetTypeId
          )
        );
      })
      .map((asset) => ({
        id: asset.id,
        asset_no: asset.asset_no,
        asset_name: asset.asset_name,
        area: asset.asset_detail?.area?.name || null,
        system: asset.system?.system_name || null,
        status: asset.asset_status?.name || null,
        asset_detail_id: asset.asset_detail_id,
        ims_asset_type_id: imsAssetTypeId,
      }));

    return filteredData;
  },

  /**
   * Get pressure vessel assets (ims_asset_type_id = 1)
   */
  async getPressureVesselAssets(): Promise<IntegrityAsset[]> {
    return this.getIntegrityAssets(1);
  },

  /**
   * Get piping assets (ims_asset_type_id = 2)
   */
  async getPipingAssets(): Promise<IntegrityAsset[]> {
    return this.getIntegrityAssets(2);
  },

  /**
   * Get integrity asset by ID with full details
   */
  async getIntegrityAssetById(id: number): Promise<IntegrityAsset | null> {
    const { data, error } = await supabase
      .from("e_asset")
      .select(
        `
        id,
        asset_no,
        asset_name,
        asset_detail_id,
        asset_detail:e_asset_detail!asset_detail_id(
          id,
          area:e_asset_area(name),
          ims_general:i_ims_general!asset_detail_id(
            id,
            ims_asset_type_id
          )
        ),
        system:e_system(system_name),
        asset_status:e_asset_status(name)
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error fetching integrity asset: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    const imsGeneral = data.asset_detail?.ims_general;
    const imsAssetTypeId =
      Array.isArray(imsGeneral) && imsGeneral.length > 0
        ? imsGeneral[0].ims_asset_type_id
        : null;

    return {
      id: data.id,
      asset_no: data.asset_no,
      asset_name: data.asset_name,
      area: data.asset_detail?.area?.name || null,
      system: data.system?.system_name || null,
      status: data.asset_status?.name || null,
      asset_detail_id: data.asset_detail_id,
      ims_asset_type_id: imsAssetTypeId || 0,
    };
  },
};
