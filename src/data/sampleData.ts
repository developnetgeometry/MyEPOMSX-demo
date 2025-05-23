export const assetDetails = {
  facilityLocation: "Central Processing Process",
  system: "Production",
  package: "V-110 Test Separator",
  parentAssetNo: "P-100",
  assetNo: "V-110",
  assetName: "Test Separator",
  assetTag: "TAG-001",
  assetStatus: "Active",
  commissioningDate: "01/01/2001",
  assetGroup: "Processing Vessels",
  // Asset Details
  category: "Equipment",
  type: "DRUM",
  manufacturer: "ABC Manufacturing",
  makerNo: "MK-12345",
  model: "Model X-900",
  serialNumber: "SN-78601",
  assetClass: "Vessel",
  drawingNo: "DWG-110-001",
  // Classification & Tags
  hCode: "HC-001",
  axis: "Vertical",
  specification: "ASME VIII",
  sensor: "PRE-110",
  ecClass: "Class 2",
  ecCertificate: "EC-2023-001",
  sceCode: true,
  criticality: true,
  active: true,
  integrity: false,
  reliability: true,
  // Mock subtable data
  childAssets: [{
    id: "1",
    assetNo: "V-110-1",
    name: "Pressure Gauge",
    type: "Instrument"
  }, {
    id: "2",
    assetNo: "V-110-2",
    name: "Level Transmitter",
    type: "Instrument"
  }],
  workOrders: [{
    id: "WO-001",
    date: "15/03/2025",
    type: "Corrective",
    status: "Completed"
  }, {
    id: "WO-002",
    date: "22/04/2025",
    type: "Preventive",
    status: "Planned"
  }]
};

// Sample inventory data
export const inventory = [
  {
    id: '1',
    itemName: 'Mechanical Seal',
    description: 'Pump mechanical seal',
    store: 'Main Warehouse',
    balance: 25,
    minLevel: 10,
    maxLevel: 50,
    reorderLevel: 15,
    unitPrice: 120.50,
    totalPrice: 3012.50,
    rackNo: 'A-101'
  },
  {
    id: '2',
    itemName: 'Bearing Assembly',
    description: 'Industrial bearing for pumps',
    store: 'Main Warehouse',
    balance: 18,
    minLevel: 5,
    maxLevel: 30,
    reorderLevel: 8,
    unitPrice: 85.75,
    totalPrice: 1543.50,
    rackNo: 'A-102'
  },
  {
    id: '3',
    itemName: 'Gasket Kit',
    description: 'Assorted gaskets for heat exchangers',
    store: 'Secondary Store',
    balance: 42,
    minLevel: 15,
    maxLevel: 60,
    reorderLevel: 20,
    unitPrice: 45.25,
    totalPrice: 1900.50,
    rackNo: 'B-201'
  },
  {
    id: '4',
    itemName: 'Control Valve',
    description: '2-inch control valve for process lines',
    store: 'Main Warehouse',
    balance: 8,
    minLevel: 3,
    maxLevel: 15,
    reorderLevel: 5,
    unitPrice: 350.00,
    totalPrice: 2800.00,
    rackNo: 'C-105'
  },
  {
    id: '5',
    itemName: 'Pressure Transmitter',
    description: 'Digital pressure transmitter 0-100 bar',
    store: 'Instrumentation Store',
    balance: 12,
    minLevel: 4,
    maxLevel: 20,
    reorderLevel: 6,
    unitPrice: 275.50,
    totalPrice: 3306.00,
    rackNo: 'D-301'
  }
];

// Sample facility locations data
export const facilityLocations = [
  {
    id: '1',
    code: 'FL-001',
    name: 'Main Processing Plant'
  },
  {
    id: '2',
    code: 'FL-002',
    name: 'Storage Facility'
  },
  {
    id: '3',
    code: 'FL-003',
    name: 'Administration Building'
  }
];

// Sample systems data
export const systems = [
  {
    id: '1',
    systemNo: 'SYS-001',
    name: 'Cooling Water System',
    tag: 'CWS',
    facilityId: '1',
    facilityName: 'Main Processing Plant'
  },
  {
    id: '2',
    systemNo: 'SYS-002',
    name: 'HVAC System',
    tag: 'HVAC',
    facilityId: '1',
    facilityName: 'Main Processing Plant'
  },
  {
    id: '3',
    systemNo: 'SYS-003',
    name: 'Fire Protection System',
    tag: 'FPS',
    facilityId: '2',
    facilityName: 'Storage Facility'
  }
];

// Sample packages data
export const packages = [
  {
    id: '1',
    packageNo: 'PKG-001',
    name: 'Pump Package',
    tag: 'PP-001',
    systemId: '1',
    systemName: 'Cooling Water System',
    type: 'Mechanical'
  },
  {
    id: '2',
    packageNo: 'PKG-002',
    name: 'Control Panel',
    tag: 'CP-001',
    systemId: '1',
    systemName: 'Cooling Water System',
    type: 'Electrical'
  },
  {
    id: '3',
    packageNo: 'PKG-003',
    name: 'Air Handling Unit',
    tag: 'AHU-001',
    systemId: '2',
    systemName: 'HVAC System',
    type: 'Mechanical'
  }
];

// Sample assets data
export const assets = [
  {
    id: '1',
    assetNo: 'AST-001',
    name: 'Centrifugal Pump',
    packageId: '1',
    package: 'Pump Package',
    systemId: '1',
    system: 'Cooling Water System',
    facilityId: '1',
    facility: 'Main Processing Plant',
    assetTag: 'P-001',
    model: 'CP-5000',
    status: 'Active',
    sceCode: 'SC-001',
    criticalityCode: 'A',
    type: 'Mechanical'
  },
  {
    id: '2',
    assetNo: 'AST-002',
    name: 'Electric Motor',
    packageId: '1',
    package: 'Pump Package',
    systemId: '1',
    system: 'Cooling Water System',
    facilityId: '1',
    facility: 'Main Processing Plant',
    assetTag: 'EM-001',
    model: 'EM-3000',
    status: 'Active',
    sceCode: 'SC-002',
    criticalityCode: 'A',
    type: 'Electrical'
  },
  {
    id: '3',
    assetNo: 'AST-003',
    name: 'Control Valve',
    packageId: '2',
    package: 'Control Panel',
    systemId: '1',
    system: 'Cooling Water System',
    facilityId: '1',
    facility: 'Main Processing Plant',
    assetTag: 'CV-001',
    model: 'CV-500',
    status: 'Maintenance',
    sceCode: 'SC-003',
    criticalityCode: 'B',
    type: 'Instrumentation'
  },
  {
    id: '4',
    assetNo: 'AST-004',
    name: 'Chiller Unit',
    packageId: '3',
    package: 'Air Handling Unit',
    systemId: '2',
    system: 'HVAC System',
    facilityId: '1',
    facility: 'Main Processing Plant',
    assetTag: 'CU-001',
    model: 'CU-2000',
    status: 'Active',
    sceCode: 'SC-004',
    criticalityCode: 'B',
    type: 'Mechanical'
  },
  {
    id: '5',
    assetNo: 'AST-005',
    name: 'Fire Pump',
    packageId: '1',
    package: 'Pump Package',
    systemId: '3',
    system: 'Fire Protection System',
    facilityId: '2',
    facility: 'Storage Facility',
    assetTag: 'FP-001',
    model: 'FP-1000',
    status: 'Active',
    sceCode: 'SC-005',
    criticalityCode: 'A',
    type: 'Mechanical'
  }
];

// Sample asset hierarchy data
export const assetHierarchy = {
  facilities: [
    {
      id: '1',
      name: 'Main Processing Plant',
      type: 'facility',
      children: [
        {
          id: '1',
          name: 'Cooling Water System',
          type: 'system',
          children: [
            {
              id: '1',
              name: 'Pump Package',
              type: 'package',
              children: [
                {
                  id: '1',
                  name: 'Centrifugal Pump',
                  type: 'asset',
                  children: []
                },
                {
                  id: '2',
                  name: 'Electric Motor',
                  type: 'asset',
                  children: []
                }
              ]
            },
            {
              id: '2',
              name: 'Control Panel',
              type: 'package',
              children: [
                {
                  id: '3',
                  name: 'Control Valve',
                  type: 'asset',
                  children: []
                }
              ]
            }
          ]
        },
        {
          id: '2',
          name: 'HVAC System',
          type: 'system',
          children: [
            {
              id: '3',
              name: 'Air Handling Unit',
              type: 'package',
              children: [
                {
                  id: '4',
                  name: 'Chiller Unit',
                  type: 'asset',
                  children: []
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'Storage Facility',
      type: 'facility',
      children: [
        {
          id: '3',
          name: 'Fire Protection System',
          type: 'system',
          children: [
            {
              id: '1',
              name: 'Pump Package',
              type: 'package',
              children: [
                {
                  id: '5',
                  name: 'Fire Pump',
                  type: 'asset',
                  children: []
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// Sample BOM assembly data
export const bomAssemblies = [
  { id: '1', code: 'BOM-001', name: 'Pump Assembly' },
  { id: '2', code: 'BOM-002', name: 'Motor Assembly' },
  { id: '3', code: 'BOM-003', name: 'Control Valve Assembly' }
];

// Sample spare parts data
export const spareParts = [
  { id: '1', bomAssemblyId: '1', name: 'Impeller', description: 'Pump impeller component' },
  { id: '2', bomAssemblyId: '1', name: 'Shaft', description: 'Pump shaft component' },
  { id: '3', bomAssemblyId: '1', name: 'Bearings', description: 'Pump bearings' },
  { id: '4', bomAssemblyId: '2', name: 'Rotor', description: 'Motor rotor assembly' },
  { id: '5', bomAssemblyId: '2', name: 'Stator', description: 'Motor stator assembly' },
  { id: '6', bomAssemblyId: '3', name: 'Valve Stem', description: 'Control valve stem' },
  { id: '7', bomAssemblyId: '3', name: 'Actuator', description: 'Pneumatic actuator' }
];

// Sample items master data
export const itemsMaster = [
  { 
    id: '1', 
    itemsNo: 'ITM-001', 
    name: 'Bearing Assembly',
    category: 'Mechanical',
    type: 'Spare Part',
    manufacturer: 'SKF',
    supplier: 'Industrial Supply Co.',
    uom: 'EA',
    price: 120.75,
    manufacturerPartsNo: 'SKF-BA-2023'
  },
  { 
    id: '2', 
    itemsNo: 'ITM-002', 
    name: 'Mechanical Seal',
    category: 'Mechanical',
    type: 'Consumable',
    manufacturer: 'John Crane',
    supplier: 'Sealing Solutions Ltd',
    uom: 'EA',
    price: 95.50,
    manufacturer_part_no: 'JC-MS-4456'
  },
  { 
    id: '3', 
    itemsNo: 'ITM-003', 
    name: 'Lubricant Oil',
    category: 'Consumable',
    type: 'Lubricant',
    manufacturer: 'Mobil',
    supplier: 'Oil Distributors Inc',
    uom: 'L',
    price: 12.25,
    manufacturerPartsNo: 'MO-LUB-5500'
  },
  { 
    id: '4', 
    itemsNo: 'ITM-004', 
    name: 'Control Valve',
    category: 'Instrumentation',
    type: 'Valve',
    manufacturer: 'Fisher',
    supplier: 'Valve Supply Co',
    uom: 'EA',
    price: 450.00,
    manufacturerPartsNo: 'FSH-CV-8800'
  },
  { 
    id: '5', 
    itemsNo: 'ITM-005', 
    name: 'Pressure Gauge',
    category: 'Instrumentation',
    type: 'Measurement',
    manufacturer: 'Wika',
    supplier: 'Instrument Solutions',
    uom: 'EA',
    price: 85.25,
    manufacturerPartsNo: 'WK-PG-3344'
  }
];
