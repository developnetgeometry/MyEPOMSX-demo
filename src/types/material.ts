import {
  AssetCategory,
  AssetType,
  Criticality,
  ItemGroup,
  Manufacturer,
  Unit,
} from "./manage";
import { Database } from "./supabase";

// BOM Assembly Types
export type BomAssembly = Database["public"]["Tables"]["e_bom_assembly"]["Row"];
export type BomAssemblyInsert =
  Database["public"]["Tables"]["e_bom_assembly"]["Insert"];
export type BomAssemblyUpdate =
  Database["public"]["Tables"]["e_bom_assembly"]["Update"];

export interface SparePart {
  id: number;
  bom_id: number;
  item_master_id: number;
  description: string | null;
  item_master?: {
    id: number;
    item_no: string;
    item_name: string;
    manufacturer_part_no: string;
    specification: string;
  };
}

export interface SparePartFormValues {
  item_master_id: number;
  description: string;
}

// Items Master Types
export interface ItemMaster {
  id: number;
  item_no: string;
  item_name: string;
  category_id: number;
  type_id: number;
  item_group_id: number;
  manufacturer_id: number;
  manufacturer_part_no: string;
  model_no: string;
  specification: string;
  unit_id: number;
  criticality_id: number;
  is_active: boolean;
}

export interface CreateItemMasterDTO {
  item_no: string;
  item_name: string;
  item_group: number;
  category_id: number;
  type_id: number;
  manufacturer: number;
  manufacturer_part_no: string;
  model_no: string;
  specification: string;
  unit_id: number;
  criticality_id: number;
  is_active: boolean;
}

export interface ItemMasterWithRelations extends ItemMaster {
  group?: ItemGroup | null;
  category?: AssetCategory | null;
  type?: AssetType | null;
  manufacturer?: Manufacturer | null;
  unit?: Unit | null;
  criticality?: Criticality | null;
}

export interface ItemMasterDetaiWithRelations extends ItemMaster {
  item_group?: ItemGroup | null;
  item_category?: AssetCategory | null;
  item_type?: AssetType | null;
  item_manufacturer?: Manufacturer | null;
  item_unit?: Unit | null;
  item_criticality?: Criticality | null;
}
