import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

// Asset Tag options from e_asset_tag where is_active = true
export interface AssetTagOption {
  value: string;
  label: string;
  id: number;
}

export const useAssetTagOptions = () => {
  return useQuery<AssetTagOption[]>({
    queryKey: ["asset-tag-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_asset_tag")
        .select("id, name")
        .eq("is_active", true);
      if (error) throw new Error(error.message);
      return (
        data?.map((row) => ({
          value: row.id.toString(),
          label: row.name,
          id: row.id,
        })) || []
      );
    },
  });
};

// Asset Group options from e_asset_group
export interface AssetGroupOption {
  value: string;
  label: string;
  id: number;
}

export const useAssetGroupOptions = () => {
  return useQuery<AssetGroupOption[]>({
    queryKey: ["asset-group-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_asset_group")
        .select("id, name");
      if (error) throw new Error(error.message);
      return (
        data?.map((row) => ({
          value: row.id.toString(),
          label: row.name,
          id: row.id,
        })) || []
      );
    },
  });
};

// Asset Category groups and categories
export interface AssetCategoryGroup {
  id: number;
  name: string;
  categories: AssetCategoryOption[];
}

export interface AssetCategoryOption {
  value: string;
  label: string;
  id: number;
  asset_category_group_id: number;
}

// This hook fetches categories grouped by category groups
export const useAssetCategoryOptions = () => {
  return useQuery<AssetCategoryOption[]>({
    queryKey: ["asset-category-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_asset_category")
        .select("id, name, asset_category_group_id")
        .order("asset_category_group_id", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw new Error(error.message);
      return (
        data?.map((row) => ({
          value: row.id.toString(),
          label: row.name,
          id: row.id,
          asset_category_group_id: row.asset_category_group_id,
        })) || []
      );
    },
  });
};

// Optional: For getting category group names for grouping in UI
export const useAssetCategoryGroups = () => {
  return useQuery<Record<string, string>>({
    queryKey: ["asset-category-groups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_asset_category_group")
        .select("id, name");

      if (error) throw new Error(error.message);

      const groupMap: Record<string, string> = {};
      if (data) {
        data.forEach((group) => {
          groupMap[group.id] = group.name;
        });
      }

      return groupMap;
    },
  });
};

// Asset Type options from e_asset_type grouped by asset_type_group_id
export interface AssetTypeOption {
  value: string;
  label: string;
  id: number;
  asset_type_group_id: number;
}

export const useAssetTypeOptions = () => {
  return useQuery<AssetTypeOption[]>({
    queryKey: ["asset-type-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_asset_type")
        .select("id, name, asset_type_group_id")
        .order("asset_type_group_id", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw new Error(error.message);
      return (
        data?.map((row) => ({
          value: row.id.toString(),
          label: row.name,
          id: row.id,
          asset_type_group_id: row.asset_type_group_id,
        })) || []
      );
    },
  });
};

// For getting asset type group names
export const useAssetTypeGroups = () => {
  return useQuery<Record<string, string>>({
    queryKey: ["asset-type-groups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_asset_type_group")
        .select("id, name");

      if (error) throw new Error(error.message);

      const groupMap: Record<string, string> = {};
      if (data) {
        data.forEach((group) => {
          groupMap[group.id] = group.name;
        });
      }

      return groupMap;
    },
  });
};

// Asset Class options from e_asset_class
export interface AssetClassOption {
  value: string;
  label: string;
  id: number;
}

export const useAssetClassOptions = () => {
  return useQuery<AssetClassOption[]>({
    queryKey: ["asset-class-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_asset_class")
        .select("id, name");
      if (error) throw new Error(error.message);
      return (
        data?.map((row) => ({
          value: row.id.toString(),
          label: row.name,
          id: row.id,
        })) || []
      );
    },
  });
};

// Asset Manufacturer options from e_manufacturer
export interface ManufacturerOption {
  value: string;
  label: string;
  id: number;
}

export const useManufacturerOptions = () => {
  return useQuery<ManufacturerOption[]>({
    queryKey: ["manufacturer-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_manufacturer")
        .select("id, name");
      if (error) throw new Error(error.message);
      return (
        data?.map((row) => ({
          value: row.id.toString(),
          label: row.name,
          id: row.id,
        })) || []
      );
    },
  });
};

// Asset Area options from e_asset_area
export interface AssetAreaOption {
  value: string;
  label: string;
  id: number;
}

export const useAssetAreaOptions = () => {
  return useQuery<AssetAreaOption[]>({
    queryKey: ["asset-area-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_asset_area")
        .select("id, name");
      if (error) throw new Error(error.message);
      return (
        data?.map((row) => ({
          value: row.id.toString(),
          label: row.name,
          id: row.id,
        })) || []
      );
    },
  });
};

// Asset Sensor options from e_iot_sensor
export interface AssetSensorOption {
  value: string;
  label: string;
  id: number;
}

export const useAssetSensorOptions = () => {
  return useQuery<AssetSensorOption[]>({
    queryKey: ["asset-sensor-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_iot_sensor")
        .select("id, name");
      if (error) throw new Error(error.message);
      return (
        data?.map((row) => ({
          value: row.id.toString(),
          label: row.name,
          id: row.id,
        })) || []
      );
    },
  });
};

// Criticality options from e_criticality
export interface CriticalityOption {
  value: string;
  label: string;
  id: number;
}

export const useCriticalityOptions = () => {
  return useQuery<CriticalityOption[]>({
    queryKey: ["criticality-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_criticality")
        .select("id, name")
        .order("name", { ascending: true });
      if (error) throw new Error(error.message);
      return (
        data?.map((row) => ({
          value: row.id.toString(),
          label: row.name,
          id: row.id,
        })) || []
      );
    },
  });
};

// SCE Code options from e_asset_sce
export interface SCEOption {
  value: string;
  label: string;
  id: number;
  sce_code: string;
  group_name: string;
}

export const useSCEOptions = () => {
  return useQuery<SCEOption[]>({
    queryKey: ["sce-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_asset_sce")
        .select("id, sce_code, group_name")
        .order("sce_code", { ascending: true });
      if (error) throw new Error(error.message);
      return (
        data?.map((row) => ({
          value: row.id.toString(),
          label: `${row.sce_code} - ${row.group_name || ""}`,
          id: row.id,
          sce_code: row.sce_code,
          group_name: row.group_name,
        })) || []
      );
    },
  });
};

// Asset options with component type information for IMS forms
export interface AssetWithComponentTypeOption {
  value: string;
  label: string;
  id: number;
  asset_detail_id: number;
  component_type?: string;
  area?: string;
  system?: string;
  equipment_tag?: string;
}

export const useAssetWithComponentTypeOptions = () => {
  return useQuery<AssetWithComponentTypeOption[]>({
    queryKey: ["asset-with-component-type-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_asset")
        .select(
          `
          id,
          asset_no,
          asset_name,
          asset_detail_id,
          system_id,
          asset_detail:e_asset_detail!e_asset_asset_detail_id_fkey(
            id,
            type_id,
            area_id,
            type:e_asset_type(
              id,
              name
            ),
            area:e_asset_area(
              id,
              name
            )
          ),
          system:e_system(
            id,
            system_name
          )
        `
        )
        .not("asset_detail_id", "is", null)
        .order("asset_no");

      if (error) throw new Error(error.message);

      return (
        data?.map((row) => ({
          value: row.id.toString(),
          label: `${row.asset_no} - ${row.asset_name}`,
          id: row.id,
          asset_detail_id: row.asset_detail_id,
          component_type: row.asset_detail?.type?.name || "",
          area: row.asset_detail?.area?.name || "",
          system: row.system?.system_name || "",
          equipment_tag: row.asset_no || "",
        })) || []
      );
    },
  });
};
