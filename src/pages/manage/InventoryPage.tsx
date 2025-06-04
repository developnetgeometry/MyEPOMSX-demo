import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import DataTable, { Column } from '@/components/shared/DataTable';
import { Package } from 'lucide-react';
import { inventory } from '@/data/sampleData';
import ManageDialog from '@/components/manage/ManageDialog';
import { useToast } from '@/hooks/use-toast';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatCurrency } from '@/utils/formatters';

// Dummy data for dropdowns
const itemOptions = [
  { id: "1", name: 'Brake Pad Set' },
  { id: "2", name: 'Oil Filter' },
  { id: "3", name: 'Air Filter' },
  { id: "4", name: 'Spark Plug' },
  { id: "5", name: 'Windshield Wiper' },
];

const storeOptions = [
  { id: "1", name: 'Main Warehouse' },
  { id: "2", name: 'Service Center A' },
  { id: "3", name: 'Service Center B' },
];

const rackOptions = [
  { id: "1", name: 'Rack A-1' },
  { id: "2", name: 'Rack B-2' },
  { id: "3", name: 'Rack C-3' },
];

// Zod schema based on your table structure
const formSchema = z.object({
  item_master_id: z.string().min(1, 'Item is required'),
  store_id: z.string().min(1, 'Store is required'),
  open_balance: z.number().min(0, 'Must be positive').optional(),
  open_balance_date: z.string().optional(),
  min_level: z.number().min(0, 'Must be positive').optional(),
  max_level: z.number().min(0, 'Must be positive').optional(),
  reorder_table: z.number().min(0, 'Must be positive').optional(),
  unit_price: z.number().min(0, 'Must be positive').optional(),
  rack_id: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Form field configuration
const formFields = [
  {
    name: 'item_master_id',
    label: 'Item',
    type: 'select',
    options: itemOptions.map(item => ({ value: item.id, label: item.name })),
    placeholder: 'Select an item',
    required: true,
  },
  {
    name: 'store_id',
    label: 'Store',
    type: 'select',
    options: storeOptions.map(store => ({ value: store.id, label: store.name })),
    placeholder: 'Select a store',
    required: true,
  },
  {
    name: 'rack_id',
    label: 'Rack Location',
    type: 'select',
    options: rackOptions.map(rack => ({ value: rack.id, label: rack.name })),
    placeholder: 'Select a rack',
    required: false,
  },
  {
    name: 'open_balance',
    label: 'Opening Balance',
    type: 'number',
    placeholder: 'Enter quantity',
    required: false,
    isCurrencyField: true,
  },
  {
    name: 'open_balance_date',
    label: 'Balance Date',
    type: 'date',
    placeholder: 'Select date',
    required: false,
  },
  {
    name: 'min_level',
    label: 'Minimum Level',
    type: 'number',
    placeholder: 'Enter minimum stock',
    required: false,
  },
  {
    name: 'max_level',
    label: 'Maximum Level',
    type: 'number',
    placeholder: 'Enter maximum stock',
    required: false,
  },
  {
    name: 'reorder_table',
    label: 'Reorder Level',
    type: 'number',
    placeholder: 'Enter reorder point',
    required: false,
  },
  {
    name: 'unit_price',
    label: 'Unit Price',
    type: 'number',
    placeholder: 'Enter price per unit',
    required: false,
    isCurrencyField: true,
  },
];

const formDefaultValues: FormValues = {
  item_master_id: undefined,
  store_id: undefined,
  open_balance: undefined,
  open_balance_date: undefined,
  min_level: undefined,
  max_level: undefined,
  reorder_table: undefined,
  unit_price: undefined,
  rack_id: undefined,
};

interface InventoryPageProps {
  hideHeader?: boolean;
  onRowClick?: (row: any) => void;
}

const InventoryPage: React.FC<InventoryPageProps> = ({ hideHeader = false, onRowClick }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
  });

  // Sample columns for inventory items
  const columns: Column[] = [
    { id: 'id', header: 'ID', accessorKey: 'id' },
    { id: 'itemName', header: 'Item Name', accessorKey: 'itemName' },
    { id: 'store', header: 'Store', accessorKey: 'store' },
    { 
      id: 'balance', 
      header: 'Balance', 
      accessorKey: 'balance',
      cell: (value) => (
        <span className="font-medium">{value}</span>
      ) 
    },
    { 
      id: 'unitPrice', 
      header: 'Unit Price', 
      accessorKey: 'unitPrice',
      cell: (value) => (
        <span>{ formatCurrency(value) }</span>
      ) 
    },
    { 
      id: 'totalPrice', 
      header: 'Total Price', 
      accessorKey: 'totalPrice',
      cell: (value) => (
        <span>{ formatCurrency(value) }</span>
      ) 
    },
  ];

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle row click
  const handleRowClick = (row: any) => {
    if (onRowClick) {
      onRowClick(row);
    } else {
      navigate(`/manage/inventory/${row.id}`);
    }
  };

  const handleSubmit = async (payload: FormValues) => {
    try {
      // In a real app, you would make an API call here
      console.log('Form submitted:', payload);
      
      toast({
        title: 'Inventory Updated',
        description: 'Item has been added to inventory',
        variant: 'default',
      });
      
      // Close dialog and reset form
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not add inventory item',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {!hideHeader && (
        <PageHeader
          title="Inventory Management"
          subtitle="Manage spare parts inventory"
          icon={<Package className="h-6 w-6" />}
          onSearch={handleSearch}
          onAddNew={() => setIsDialogOpen(true)}
          addNewLabel="Add New Item"
        />
      )}
      
      <Card>
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={inventory}
            onRowClick={handleRowClick}
          />
        </CardContent>
      </Card>

      <ManageDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Add New Item"
        formSchema={formSchema}
        formFields={formFields}
        defaultValues={formDefaultValues}
        onSubmit={handleSubmit}
        form={form}
      />
    </div>
  );
};

export default InventoryPage;