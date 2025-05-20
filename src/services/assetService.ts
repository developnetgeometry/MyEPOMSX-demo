import { supabase } from "@/lib/supabaseClient";
import { Asset, AssetDetailWithRelations, AssetWithRelations } from "@/types/manage";

export const assetService = {
  async getAssets(): Promise<Asset[]> {
    const { data, error } = await supabase
      .from("e_asset")
      .select("*")
      .order("asset_no");

    if (error) {
      throw new Error(`Error fetching assets: ${error.message}`);
    }

    return data || [];
  },

  async getAssetsWithRelations(): Promise<AssetWithRelations[]> {
    const { data, error } = await supabase
      .from("e_asset")
      .select(
        `
        *,
        facility:e_facility(*),
        system:e_system(*),
        package:e_package(*),
        asset_tag:e_asset_tag(*),
        asset_status:e_asset_status(*),
        asset_group:e_asset_group(*)
      `
      )
      .order("asset_no");

    if (error) {
      throw new Error(`Error fetching assets with relations: ${error.message}`);
    }

    return data || [];
  },

  async getAssetByIdWithRelations(id: number): Promise<AssetWithRelations> {
    const { data, error } = await supabase
      .from("e_asset")
      .select(`
        *,
        facility:e_facility(*),
        system:e_system(*),
        package:e_package(*),
        asset_tag:e_asset_tag(*),
        asset_status:e_asset_status(*),
        asset_group:e_asset_group(*),
        asset_installation:e_asset_installation(*),
        asset_detail:e_asset_detail(
          *,
          category:e_asset_category(*),
          type:e_asset_type(
            *,
            category:e_asset_category(*)
          ),
          manufacturer:e_manufacturer(*),
          area:e_asset_area(*),
          asset_class:e_asset_class(*),
          iot_sensor:e_iot_sensor(
            *,
            sensor_type:e_sensor_type(*),
            manufacturer:e_manufacturer(*),
            client:e_client(*)
          ),
          sce:e_asset_sce(*)
        )
      `)
      .eq("id", id)
      .single();
  
    if (error) {
      throw new Error(`Error fetching asset: ${error.message}`);
    }
  
    if (!data) {
      throw new Error(`Asset with id ${id} not found`);
    }

    return data;
  },
};
