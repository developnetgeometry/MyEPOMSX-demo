
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, PlusCircle, Search, ArrowUpDown } from 'lucide-react';
import { purchaseRequests } from '@/data/purchasingSampleData';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/purchasing/StatusBadge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DataTable, { Column } from './DataTable';

const PurchaseRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // Filter data based on search and status filter
  const filteredData = purchaseRequests.filter(req => {
    const matchesSearch = 
      req.requestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.requestedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus ? req.status === filterStatus : true;
    
    return matchesSearch && matchesStatus;
  });

  // Define columns for the data table
  const columns: Column[] = [
    {
      id: 'requestNumber',
      header: 'Request ID',
      accessorKey: 'requestNumber',
    },
    {
      id: 'date',
      header: 'Date',
      accessorKey: 'date',
    },
    {
      id: 'items',
      header: 'Items',
      accessorKey: 'items',
      cell: (value) => `${value.length} item(s)`,
    },
    {
      id: 'requestedBy',
      header: 'Requested By',
      accessorKey: 'requestedBy',
    },
    {
      id: 'department',
      header: 'Department',
      accessorKey: 'department',
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
              navigate(`/purchasing/request/${row.id}`);
            }}
          >
            View
          </Button>
          {row.status === 'draft' && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/purchasing/request/${row.id}/edit`);
              }}
            >
              Edit
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleRowClick = (row: any) => {
    navigate(`/purchasing/request/${row.id}`);
  };

  const handleCreateRequest = () => {
    navigate('/purchasing/request/new');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Request"
        subtitle="Manage purchase requests"
        icon={<ClipboardList className="h-6 w-6" />}
        onSearch={setSearchQuery}
        addNewLabel="+ New Request"
        onAddNew={handleCreateRequest}
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
                <DropdownMenuItem onClick={() => setFilterStatus('converted')}>
                  Converted
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('cancelled')}>
                  Cancelled
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button onClick={handleCreateRequest}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Purchase Request
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
          Showing {filteredData.length} of {purchaseRequests.length} purchase requests
        </CardFooter>
      </Card>
    </div>
  );
};

export default PurchaseRequestPage;
