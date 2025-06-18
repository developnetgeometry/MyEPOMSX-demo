export type SelectQueryError = {
  error: true;
} & String;

export interface Facility {
  id: number;
  location_code: string;
  location_name: string | null;
  is_active: boolean | null;
  project_id: number | null;
  // Add related data
  project?: Project | null;
}

// Project Related Types
export interface Client {
  id: number;
  code: string;
  type: string | null;
  name: string | null;
  onboard_date: string | null; // ISO date string format
  office_no: string | null;
  email: string | null;
}

export interface ProjectType {
  id: number;
  name: string;
}

export interface Project {
  id: number;
  project_code: string;
  client_id: number | null;
  project_type: number | null;
  project_name: string | null;
  short_name: string | null;
  start_date: string | null; // ISO date string format
  end_date: string | null; // ISO date string format
  fund_code: string | null;
  project_purpose: string | null;
  remark: string | null;
  longitude: string | null;
  latitude: string | null;
  // Related data
  client?: Client | null;
  type?: ProjectType | null;
}

// System Types
export interface System {
  id: number;
  facility_id?: number | null;
  system_code: string;
  system_no: string | null;
  system_name: string | null;
  is_active: boolean | null;
  // Add related data
  facility?: {
    location_name?: string;
    location_code?: string;
  };
}

// Package Types
export interface PackageType {
  id: number;
  name: string;
  is_active?: boolean | null;
}

export interface Package {
  id: number;
  package_no: string;
  package_name: string | null;
  package_tag: string | null;
  system_id: number | null;
  package_type_id: number | null;
  is_active?: boolean | null;
  // Related data
  package_type?: PackageType | null;
  system?: System | null;
}

export interface PackageData {
  id: number;
  package_no: string;
  package_name: string | null;
  package_tag: string | null;
  system_id: number | null;
  package_type_id: number | null;
  is_active: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface AssetTag {
  id: number;
  name: string;
  is_active: boolean;
}

export interface AssetStatus {
  id: number;
  name: string;
  is_active: boolean;
}

export interface AssetGroup {
  id: number;
  name: string | null;
  is_active: boolean | null;
}

// Asset Types
export interface Asset {
  id: number;
  facility_id: number | null;
  system_id: number | null;
  package_id: number | null;
  asset_no: string;
  asset_name: string | null;
  asset_tag_id: number | null;
  status_id: number | null;
  asset_group_id: number | null;
  commission_date: string | null;
}

// Core Tables
export interface AssetCategory { id: number; name: string; }
export interface AssetType { id: number; asset_category_id?: number | null; name: string | null; category?: AssetCategory | null; }
export interface Manufacturer { id: number; name: string; }
export interface AssetArea { id: number; name: string; }
export interface AssetClass { id: number; name: string; }
export interface SensorType { id: number; name: string; }
export interface AssetSce { id: number; group_name: string; sce_code: string; }
export interface Unit{ id: number; name: string; }
export interface Criticality{ id: number; name: string; }
export interface ItemGroup{ id: number; name: string; }

export interface Client {
  id: number;
  code: string;
  type: string | null;
  name: string | null;
  onboard_date: string | null;
  office_no: string | null;
  email: string | null;
}

// IoT Sensor with relations
export interface IotSensor {
  id: number;
  name: string | null;
  sensor_type_id: number | null;
  description: string | null;
  manufacturer_id: number | null;
  model: string | null;
  calibration_date: string | null;
  client_id: number | null;
  sensor_type?: SensorType | null;
  manufacturer?: Manufacturer | null;
  client?: Client | null;
}

export interface AssetInstallation {
  id?: number;
  actual_installation_date: string | null;
  actual_startup_date: string | null;
  description: string;
  drawing_no: string;
  asset_id: number | null;
  ex_certificate: string;
  ex_class: string;
  intermittent_service: string | null ;
  isolation_service_class_id: number | null;
  isolation_system_desc: string;
  detection_system_desc: string;
  detection_service_class_id: number | null;
  orientation: string | null;
  overall_height: number | null;
  overall_length: number | null;
  overall_width: number | null;
  warranty_date: string | null;
}

export interface AssetDetail {
  id: number;
  category_id: number | null;
  type_id: number | null;
  manufacturer_id: number | null;
  maker_no: string | null;
  model: string | null;
  hs_code: string | null;
  serial_number: string | null;
  area_id: number | null;
  asset_class_id: number | null;
  specification: string | null;
  is_integrity: boolean | null;
  is_reliability: boolean | null;
  is_active: boolean | null;
  iot_sensor_id: number | null;
  asset_id: number | null;
}

export interface AssetDetailWithRelations extends AssetDetail {
  category?: AssetCategory | null;
  type?: AssetType | null;
  manufacturer?: Manufacturer | null;
  area?: AssetArea | null;
  bom_id?: number | null;
  asset_class?: AssetClass | null;
  iot_sensor?: IotSensor | null;
  child_assets?: ChildAssets[] | null;
}

export interface AssetWithRelations extends Asset {
  facility?: Facility | null;
  system?: System | null;
  package?: Package | null;
  asset_tag?: AssetTag | null;
  asset_status?: AssetStatus | null;
  asset_group?: AssetGroup | null;
  asset_installation?: AssetInstallation[] | null;
  asset_detail?: AssetDetailWithRelations | null;
  asset_sce?: AssetSce[] | null;
}

export interface ChildAssets {
  id: number;
  asset_no: string;
  asset_name: string | null;
  asset_tag_id: number | null;
  status_id: number | null;
  asset_group_id: number | null;
  commission_date: string | null;
}

export interface BOMTab {
  id: number;
  part_no: string;
  part_name: string;
  quantity: number;
  unit: string;
  remarks: string;
}

export interface AssetHierarchyNode {
  id: string;
  name?: string;
  asset_no?: string;
  type: 'facility' | 'system' | 'package' | 'asset';
  children: AssetHierarchyNode[];
}

export type CreateAssetDTO = Omit<Asset, 'id'>;
export type UpdateAssetDTO = Partial<Omit<Asset, 'id'>>;



// Inventory Types
export interface Inventory {
  id: string;
  store: string;
  rackNo: string;
  itemsNo: string;
  itemName: string;
  manufacturerPartsNo: string;
  manufacturer: string;
  type: string;
  category: string;
  description: string;
  minLevel: number;
  maxLevel: number;
  reorderLevel: number;
  balance: number;
  unitPrice: number;
  totalPrice: number;
}
