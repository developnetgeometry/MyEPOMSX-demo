import { supabase } from "@/lib/supabaseClient";
import {
  Asset,
  AssetDetailWithRelations,
  AssetHierarchyNode,
  AssetWithRelations,
} from "@/types/manage";

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
      asset_group:e_asset_group(*),
      asset_sce:e_asset_sce(*)
    `
      )
      .order("asset_no");

    if (error) {
      throw new Error(`Error fetching assets with relations: ${error.message}`);
    }

    return data || [];
  },

  async getAssetHierarchy(): Promise<{ facilities: AssetHierarchyNode[] }> {
    const assetWithRelations = await this.getAssetsWithRelations();

    const hierarchyMap = {
      facilities: new Map<string, AssetHierarchyNode>(),
      systems: new Map<string, AssetHierarchyNode>(),
      packages: new Map<string, AssetHierarchyNode>(),
    };

    assetWithRelations.forEach((asset) => {
      const facility = asset.facility;
      const system = asset.system;
      const pkg = asset.package;

      if (!facility || !system || !pkg) return;

      if (!hierarchyMap.facilities.has(facility.id)) {
        hierarchyMap.facilities.set(facility.id, {
          id: facility.id,
          name: facility.location_name,
          type: "facility",
          children: [],
        });
      }

      const facilityNode = hierarchyMap.facilities.get(facility.id)!;
      let systemNode = facilityNode.children.find((s) => s.id === system.id);

      if (!systemNode) {
        systemNode = {
          id: system.id,
          name: system.system_name,
          type: "system",
          children: [],
        };
        facilityNode.children.push(systemNode);
      }
      let packageNode = systemNode.children.find((p) => p.id === pkg.id);

      if (!packageNode) {
        packageNode = {
          id: pkg.id,
          name: pkg.package_name,
          type: "package",
          children: [],
        };
        systemNode.children.push(packageNode);
      }

      packageNode.children.push({
        id: asset.id,
        name: asset.name || asset.asset_tag?.name || `Asset ${asset.asset_no}`,
        type: "asset",
        children: [],
      });
    });

    return {
      facilities: Array.from(hierarchyMap.facilities.values()),
    };
  },

  async getAssetByIdWithRelations(id: number): Promise<AssetWithRelations> {
    // @ts-ignore
    const { data, error } = await supabase
      .from("e_asset")
      .select(
        `
        *,
        facility:e_facility(*),
        asset_sce:e_asset_sce(*),
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
          child_assets:e_asset_detail!parent_asset_id(
            *,
            asset:e_asset(
              *,
              facility:e_facility(*),
              asset_sce:e_asset_sce(*),
              system:e_system(*),
              package:e_package(*),
              asset_tag:e_asset_tag(*),
              asset_status:e_asset_status(*),
              asset_group:e_asset_group(*),
              asset_installation:e_asset_installation(*)
            ),
            type:e_asset_type(
              *
            )
          )
        )
      `
      )
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

  async getItemsByBomId(bomId: number): Promise<any> {
    const { data, error } = await supabase
      .from("e_spare_parts")
      .select(`
        *,
        item_master: item_master_id(*, unit: unit_id(*))
      `)
      .eq("bom_id", bomId)
      .order('created_at', { ascending: true }); // Optional: add sorting
  
    if (error) {
      throw new Error(`Error fetching BOM items: ${error.message}`);
    }
  
    return data || [];
  }
};
