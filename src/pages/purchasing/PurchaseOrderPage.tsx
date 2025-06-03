
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, PlusCircle, ArrowUpDown } from 'lucide-react';
import { purchaseOrders } from '@/data/purchasingSampleData';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import DataTable, { Column } from './DataTable';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/purchasing/StatusBadge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const PurchaseOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // Filter data based on search and status filter
  const filteredData = purchaseOrders.filter(order => {
    const matchesSearch = 
      order.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus ? order.status === filterStatus : true;
    
    return matchesSearch && matchesStatus;
  });

  // Define columns for the data table
  const columns: Column[] = [
    {
      id: 'poNumber',
      header: 'PO Number',
      accessorKey: 'poNumber',
    },
    {
      id: 'date',
      header: 'PO Date',
      accessorKey: 'date',
    },
    {
      id: 'vendor',
      header: 'Vendor',
      accessorKey: 'vendor',
    },
    {
      id: 'deliveryDate',
      header: 'Delivery Date',
      accessorKey: 'deliveryDate',
    },
    {
      id: 'totalCost',
      header: 'Total Cost',
      accessorKey: 'totalCost',
      cell: (value) => `RM ${value.toFixed(2)}`,
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: (value) => <StatusBadge status={value} />,
    },
    {
      id: 'actions',
      header: 'Actions',
      accessorKey: 'id',
      cell: (_, row) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/purchasing/orders/${row.id}`);
            }}
          >
            View
          </Button>
          {(row.status === 'draft') && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/purchasing/orders/${row.id}/edit`);
              }}
            >
              Edit
            </Button>
          )}
          {row.status === 'draft' && (
            <Button
              variant="default"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                // Handle submit action
              }}
            >
              Submit
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleRowClick = (row: any) => {
    navigate(`/purchasing/orders/${row.id}`);
  };

  const handleCreateOrder = () => {
    navigate('/purchasing/orders/new');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Orders"
        subtitle="Manage purchase orders"
        icon={<FileText className="h-6 w-6" />}
        onSearch={setSearchQuery}
        addNewLabel="+ New PO"
        onAddNew={handleCreateOrder}
      />

      <Card>
        <div className="p-4 flex flex-wrap gap-4 justify-between items-center border-b">
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  {filterStatus ? `Status: ${filterStatus}` : 'Filter by Status'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterStatus(null)}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('draft')}>
                  Draft
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('submitted')}>
                  Submitted
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('approved')}>
                  Approved
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('partial')}>
                  Partially Received
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('completed')}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('cancelled')}>
                  Cancelled
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button onClick={handleCreateOrder}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Purchase Order
          </Button>
        </div>
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={filteredData}
            onRowClick={handleRowClick}
          />
        </CardContent>
        <CardFooter className="border-t p-4 text-sm text-gray-500">
          Showing {filteredData.length} of {purchaseOrders.length} purchase orders
        </CardFooter>
      </Card>
    </div>
  );
};

export default PurchaseOrderPage;
