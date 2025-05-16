// Facility Location Types
export interface Facility {
  id: number;
  location_code: string;
  location_name: string | null;
  is_active: boolean | null;
  project_id: number | null;
}

export interface System {
  id: number;
  facility_id?: number | null;
  system_code: string;
  system_no: string | null;
  system_name: string | null;
  is_active: boolean | null;
}

// Package Types
export interface Package {
  id: string;
  packageNo: string;
  name: string;
  tag: string;
  systemId: string;
  systemName?: string;
  type: string;
}

// Asset Types
export interface Asset {
  id: string;
  assetNo: string;
  name: string;
  packageId: string;
  package?: string;
  systemId: string;
  system?: string;
  facilityId: string;
  facility?: string;
  assetTag: string;
  model: string;
  status: string;
  sceCode: string;
  criticalityCode: string;
}

// BOM Assembly Types
export interface BomAssembly {
  id: string;
  code: string;
  name: string;
}

export interface SparePart {
  id: string;
  bomAssemblyId: string;
  name: string;
  description: string;
}

// Items Master Types
export interface ItemsMaster {
  id: string;
  itemsNo: string;
  name: string;
  manufacturerPartsNo?: string; // Make this optional to support both property names
  manufacturer_part_no?: string; // Alternative property name
  manufacturer: string;
  type: string;
  category: string;
  // Add support for other fields in sample data
  supplier?: string;
  uom?: string;
  price?: number;
}

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
