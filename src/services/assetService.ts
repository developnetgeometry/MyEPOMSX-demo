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
      .order("created_at", { ascending: false });

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
        asset_no:
          asset.asset_no || asset.asset_tag?.name || `Asset ${asset.asset_no}`,
        type: "asset",
        children: [],
      });
    });

    return {
      facilities: Array.from(hierarchyMap.facilities.values()),
    };
  },

  async getAssetByIdWithRelations(id: number): Promise<AssetWithRelations> {
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
      asset_detail:e_asset_detail!asset_id(*,category:e_asset_category(*),type:e_asset_type(*),manufacturer:e_manufacturer(*),asset_class:e_asset_class(*),area:e_asset_area(*),iot_sensor:e_iot_sensor(name,sensor_type:e_sensor_type(name),manufacturer:e_manufacturer(name),client:e_client(name)))
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
      .select(
        `
        *,
        bom: bom_id(*),
        item_master: item_master_id(*, unit: unit_id(*))
      `
      )
      .eq("bom_id", bomId)
      .order("created_at", { ascending: true }); // Optional: add sorting

    if (error) {
      throw new Error(`Error fetching BOM items: ${error.message}`);
    }

    return data || [];
  },

  async getWorkOrdersByAssetId(assetId: number): Promise<any> {
    // @ts-ignore
    const { data, error } = await supabase
      .from("e_work_order")
      .select(
        `
        id,
        work_order_no,
        due_date,
        task:e_task!task_id(task_name),
        status:e_work_order_status!work_order_status_id(name)
      `
      )
      .eq("asset_id", assetId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Error fetching work orders: ${error.message}`);
    }

    return data || [];
  },

  async getAssetAttachments(assetId: number): Promise<any> {
    // @ts-ignore
    const { data, error } = await supabase
      .from("e_asset_attachment")
      .select("*")
      .eq("asset_id", assetId);

    if (error) {
      throw new Error(`Error fetching attachments: ${error.message}`);
    }

    return data || [];
  },

  async getAssetHierarchyNodeDetails(
    nodeType: string,
    nodeId: string | number
  ): Promise<any> {
    switch (nodeType) {
      case "facility":
        const { data: facilityData, error: facilityError } = await supabase
          .from("e_facility")
          .select("*")
          .eq("id", Number(nodeId))
          .single();

        if (facilityError) {
          throw new Error(
            `Error fetching facility details: ${facilityError.message}`
          );
        }

        return facilityData;

      case "system":
        const { data: systemData, error: systemError } = await supabase
          .from("e_system")
          .select("*")
          .eq("id", Number(nodeId))
          .single();

        if (systemError) {
          throw new Error(
            `Error fetching system details: ${systemError.message}`
          );
        }

        return systemData;

      case "package":
        const { data: packageData, error: packageError } = await supabase
          .from("e_package")
          .select(
            `
            *,
            assets:e_asset(
              id,
              asset_no,
              asset_name,
              commission_date,
              asset_status:e_asset_status(name),
              asset_detail:e_asset_detail!asset_id(
                specification,
                serial_number,
                model,
                maker_no,
                manufacturer:e_manufacturer(name),
                type:e_asset_type(name, category:e_asset_category(name)),
                asset_class:e_asset_class(name)
              )
            )
          `
          )
          .eq("id", Number(nodeId))
          .single();
        if (packageError) {
          throw new Error(
            `Error fetching package details: ${packageError.message}`
          );
        }

        return packageData;

      case "asset":
        const { data: assetData, error: assetError } = await supabase
          .from("e_asset")
          .select(
            `
            *,
            facility:e_facility(location_name),
            system:e_system(system_name),
            package:e_package(package_name),
            asset_tag:e_asset_tag(name),
            asset_status:e_asset_status(name),
            asset_group:e_asset_group(name),
            asset_sce:e_asset_sce(*),
            asset_installation:e_asset_installation(
              actual_installation_date,
              actual_startup_date,
              warranty_date,
              drawing_no,
              orientation,
              overall_height,
              overall_length,
              overall_width
            ),
            asset_detail:e_asset_detail!asset_id(
              *,
              specification,
              serial_number,
              model,
              maker_no,
              is_integrity,
              is_reliability,
              manufacturer:e_manufacturer(name),
              type:e_asset_type(name, category:e_asset_category(name)),
              asset_class:e_asset_class(name),
              area:e_asset_area(name)
            )
          `
          )
          .eq("id", Number(nodeId))
          .single();

        if (assetError) {
          throw new Error(
            `Error fetching asset details: ${assetError.message}`
          );
        }

        return assetData;

      default:
        throw new Error(`Unknown node type: ${nodeType}`);
    }
  },

  async getChildAssetsByParentId(parentAssetId: number) {
    // @ts-ignore
    const { data, error } = await supabase
      .from("e_asset")
      .select(
        `
        *,
        asset_detail:asset_detail_id(category:e_asset_category(name), type:e_asset_type(name), specification, serial_number, asset_class:e_asset_class(name)), status:e_asset_status(name), asset_tag:e_asset_tag(name)
        `
      )
      .eq("parent_asset_id", parentAssetId);

    if (error) {
      throw new Error(`Error fetching child assets: ${error.message}`);
    }

    return data || [];
  },

  async removeChildAsset(id: number) {
    const { error } = await supabase
      .from("e_asset")
      .update({
        parent_asset_id: null, // Remove the parent reference
      })
      .eq("id", id);

    if (error) {
      throw new Error(`Error removing child asset: ${error.message}`);
    }

    return true;
  },

  async removeBom(id: number) {
    // @ts-ignore
    const { error } = await supabase
      .from("e_asset_detail")
      .update({ bom_id: null })
      .eq("asset_id", Number(id));

    if (error) {
      throw new Error(`Error removing BOM: ${error.message}`);
    }

    return true;
  }
};
