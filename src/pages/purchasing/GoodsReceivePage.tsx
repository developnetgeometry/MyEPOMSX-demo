
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, PlusCircle, Search, ArrowUpDown } from 'lucide-react';
import { goodsReceive } from '@/data/purchasingSampleData';
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

const GoodsReceivePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // Filter data based on search and status filter
  const filteredData = goodsReceive.filter(gr => {
    const matchesSearch = 
      gr.grNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gr.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gr.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus ? gr.status === filterStatus : true;
    
    return matchesSearch && matchesStatus;
  });

  // Define columns for the data table
  const columns: Column[] = [
    {
      id: 'grNumber',
      header: 'GR Number',
      accessorKey: 'grNumber',
    },
    {
      id: 'poNumber',
      header: 'PO Number',
      accessorKey: 'poNumber',
      cell: (value, row) => (
        <Button 
          variant="link" 
          className="p-0 h-auto"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/purchasing/orders/${row.poId}`);
          }}
        >
          {value}
        </Button>
      ),
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
      id: 'receivedBy',
      header: 'Received By',
      accessorKey: 'receivedBy',
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
              navigate(`/purchasing/goods-receive/${row.id}`);
            }}
          >
            View
          </Button>
          {row.status === 'pending' && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/purchasing/goods-receive/${row.id}/receive`);
              }}
            >
              Receive
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleRowClick = (row: any) => {
    navigate(`/purchasing/goods-receive/${row.id}`);
  };

  const handleCreateGoodsReceive = () => {
    navigate('/purchasing/goods-receive/new');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Goods Receive"
        subtitle="Manage incoming deliveries"
        icon={<Truck className="h-6 w-6" />}
        onSearch={setSearchQuery}
        addNewLabel="+ New Receipt"
        onAddNew={handleCreateGoodsReceive}
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
                <DropdownMenuItem onClick={() => setFilterStatus('pending')}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('partial')}>
                  Partial
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('completed')}>
                  Completed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button onClick={handleCreateGoodsReceive}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Goods Receipt
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
          Showing {filteredData.length} of {goodsReceive.length} goods receipts
        </CardFooter>
      </Card>
    </div>
  );
};

export default GoodsReceivePage;
