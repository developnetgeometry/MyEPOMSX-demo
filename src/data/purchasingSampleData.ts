
export interface Department {
  id: string;
  name: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  contact: string;
  address: string;
}

export interface PurchaseItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  uom: string; // Unit of measure
}

export interface PurchaseRequestData {
  id: string;
  requestNumber: string;
  date: string;
  department: string;
  requestedBy: string;
  requesterEmail: string;
  priority: 'low' | 'medium' | 'high';
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'PO created' | 'cancelled';
  items: PurchaseItem[];
  notes?: string;
  poNumber?: string; // If converted to PO
}

export interface PurchaseOrderData {
  id: string;
  poNumber: string;
  date: string;
  deliveryDate: string;
  vendor: string;
  vendorEmail: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'partial' | 'completed' | 'cancelled';
  items: PurchaseItem[];
  totalCost: number;
  terms?: string;
  notes?: string;
  requestId?: string; // If created from a request
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
}

export interface GoodsReceiveData {
  id: string;
  grNumber: string;
  poNumber: string;
  poId: string;
  vendor: string;
  deliveryDate: string;
  receivedBy: string;
  receiverEmail: string;
  status: 'pending' | 'partial' | 'completed';
  items: (PurchaseItem & {
    receivedQuantity: number;
    condition: 'good' | 'damaged';
    remarks?: string;
  })[];
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
}

// Sample data
export const departments: Department[] = [
  { id: '1', name: 'Engineering' },
  { id: '2', name: 'Operations' },
  { id: '3', name: 'Maintenance' },
  { id: '4', name: 'Administration' },
  { id: '5', name: 'HSE' }
];

export const vendors: Vendor[] = [
  {
    id: '1',
    name: 'ABC Supplies',
    email: 'sales@abcsupplies.com',
    contact: '+60123456789',
    address: '123 Main St, Kuala Lumpur'
  },
  {
    id: '2',
    name: 'XYZ Industrial',
    email: 'info@xyzindustrial.com',
    contact: '+60187654321',
    address: '456 Second Ave, Penang'
  },
  {
    id: '3',
    name: 'Global Equipment',
    email: 'sales@globalequip.com',
    contact: '+60135792468',
    address: '789 Third Rd, Johor Bahru'
  }
];

// Sample purchase requests
export const purchaseRequests: PurchaseRequestData[] = [
  {
    id: '1',
    requestNumber: 'PR-2025-001',
    date: '2025-01-02',
    department: 'Engineering',
    requestedBy: 'Ahmad Faiz',
    requesterEmail: 'ahmad.faiz@example.com',
    priority: 'high',
    status: 'PO created',
    poNumber: 'PO-2025-001',
    items: [
      {
        id: '1',
        name: 'Control Valve',
        description: '2" Control Valve, Model CV-200',
        quantity: 2,
        unitPrice: 1200.00,
        totalPrice: 2400.00,
        uom: 'Unit'
      },
      {
        id: '2',
        name: 'Pressure Transmitter',
        description: 'Pressure Transmitter, Range: 0-100 bar',
        quantity: 5,
        unitPrice: 850.00,
        totalPrice: 4250.00,
        uom: 'Unit'
      }
    ],
    notes: 'Urgent requirement for Plant Shutdown'
  },
  {
    id: '2',
    requestNumber: 'PR-2025-002',
    date: '2025-01-15',
    department: 'Maintenance',
    requestedBy: 'Siti Aminah',
    requesterEmail: 'siti.aminah@example.com',
    priority: 'medium',
    status: 'submitted',
    items: [
      {
        id: '3',
        name: 'Safety Gloves',
        description: 'Chemical Resistant Safety Gloves',
        quantity: 50,
        unitPrice: 15.00,
        totalPrice: 750.00,
        uom: 'Pair'
      },
      {
        id: '4',
        name: 'Safety Goggles',
        description: 'Anti-fog Safety Goggles',
        quantity: 30,
        unitPrice: 25.00,
        totalPrice: 750.00,
        uom: 'Unit'
      }
    ]
  },
  {
    id: '3',
    requestNumber: 'PR-2025-003',
    date: '2025-02-01',
    department: 'Operations',
    requestedBy: 'Rajesh Kumar',
    requesterEmail: 'rajesh.kumar@example.com',
    priority: 'low',
    status: 'draft',
    items: [
      {
        id: '5',
        name: 'Motor Oil',
        description: 'SAE 15W-40 Motor Oil',
        quantity: 20,
        unitPrice: 35.00,
        totalPrice: 700.00,
        uom: 'Liter'
      }
    ]
  }
];

// Sample purchase orders
export const purchaseOrders: PurchaseOrderData[] = [
  {
    id: '1',
    poNumber: 'PO-2025-001',
    date: '2025-01-05',
    deliveryDate: '2025-01-20',
    vendor: 'ABC Supplies',
    vendorEmail: 'sales@abcsupplies.com',
    status: 'completed',
    requestId: '1',
    items: [
      {
        id: '1',
        name: 'Control Valve',
        description: '2" Control Valve, Model CV-200',
        quantity: 2,
        unitPrice: 1200.00,
        totalPrice: 2400.00,
        uom: 'Unit'
      },
      {
        id: '2',
        name: 'Pressure Transmitter',
        description: 'Pressure Transmitter, Range: 0-100 bar',
        quantity: 5,
        unitPrice: 850.00,
        totalPrice: 4250.00,
        uom: 'Unit'
      }
    ],
    totalCost: 6650.00,
    terms: 'Net 30',
    attachments: [
      {
        id: '1',
        name: 'quotation_abc.pdf',
        type: 'application/pdf',
        url: '#'
      }
    ]
  },
  {
    id: '2',
    poNumber: 'PO-2025-002',
    date: '2025-01-25',
    deliveryDate: '2025-02-10',
    vendor: 'XYZ Industrial',
    vendorEmail: 'info@xyzindustrial.com',
    status: 'submitted',
    items: [
      {
        id: '3',
        name: 'Electric Motor',
        description: '10HP Electric Motor, 3-Phase',
        quantity: 1,
        unitPrice: 3500.00,
        totalPrice: 3500.00,
        uom: 'Unit'
      }
    ],
    totalCost: 3500.00,
    terms: 'Net 45'
  },
  {
    id: '3',
    poNumber: 'PO-2025-003',
    date: '2025-02-05',
    deliveryDate: '2025-02-15',
    vendor: 'Global Equipment',
    vendorEmail: 'sales@globalequip.com',
    status: 'draft',
    items: [
      {
        id: '4',
        name: 'Pipe Fittings',
        description: 'Assorted Pipe Fittings, Schedule 40',
        quantity: 100,
        unitPrice: 12.50,
        totalPrice: 1250.00,
        uom: 'Set'
      }
    ],
    totalCost: 1250.00,
    terms: 'Net 30'
  }
];

// Sample goods receive
export const goodsReceive: GoodsReceiveData[] = [
  {
    id: '1',
    grNumber: 'GR-2025-001',
    poNumber: 'PO-2025-001',
    poId: '1',
    vendor: 'ABC Supplies',
    deliveryDate: '2025-01-18',
    receivedBy: 'Tan Wei Ming',
    receiverEmail: 'tan.wm@example.com',
    status: 'completed',
    items: [
      {
        id: '1',
        name: 'Control Valve',
        description: '2" Control Valve, Model CV-200',
        quantity: 2,
        receivedQuantity: 2,
        condition: 'good',
        unitPrice: 1200.00,
        totalPrice: 2400.00,
        uom: 'Unit'
      },
      {
        id: '2',
        name: 'Pressure Transmitter',
        description: 'Pressure Transmitter, Range: 0-100 bar',
        quantity: 5,
        receivedQuantity: 5,
        condition: 'good',
        unitPrice: 850.00,
        totalPrice: 4250.00,
        uom: 'Unit'
      }
    ],
    attachments: [
      {
        id: '1',
        name: 'delivery_order_001.pdf',
        type: 'application/pdf',
        url: '#'
      },
      {
        id: '2',
        name: 'item_photo.jpg',
        type: 'image/jpeg',
        url: '#'
      }
    ]
  },
  {
    id: '2',
    grNumber: 'GR-2025-002',
    poNumber: 'PO-2025-002',
    poId: '2',
    vendor: 'XYZ Industrial',
    deliveryDate: '2025-02-08',
    receivedBy: 'Lee Chong Wei',
    receiverEmail: 'lee.cw@example.com',
    status: 'pending',
    items: [
      {
        id: '3',
        name: 'Electric Motor',
        description: '10HP Electric Motor, 3-Phase',
        quantity: 1,
        receivedQuantity: 0,
        condition: 'good',
        unitPrice: 3500.00,
        totalPrice: 3500.00,
        uom: 'Unit'
      }
    ]
  }
];
