
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, Package, Plus } from 'lucide-react';
import { inventory } from '@/data/sampleData';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { toast } from 'sonner';
import { formatCurrency } from '@/utils/formatters';

const InventoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inventory');
  
  // Find the inventory item in sample data
  const inventoryItem = inventory.find(item => item.id === id);
  
  // Sample data for tabs (in a real app, this would come from the database)
  const receiveData = [
    { id: '1', date: '2025-04-15', po: 'PO-2025-001', quantity: 5, totalPrice: 500, receiveBy: 'John Smith' },
    { id: '2', date: '2025-04-10', po: 'PO-2025-002', quantity: 3, totalPrice: 300, receiveBy: 'Jane Doe' },
  ];
  
  const issueData = [
    { id: '1', date: '2025-04-18', workOrderNo: 'WO-2025-001', quantity: 2, unitPrice: 100, total: 200, store: 'Main Store', issuanceName: 'Robert Johnson', remarks: 'Regular maintenance' },
    { id: '2', date: '2025-04-20', workOrderNo: 'WO-2025-002', quantity: 1, unitPrice: 100, total: 100, store: 'Main Store', issuanceName: 'Alice Brown', remarks: 'Emergency repair' },
  ];
  
  const returnData = [
    { id: '1', date: '2025-04-22', workOrder: 'WO-2025-001', quantity: 1, price: 100, total: 100, returnName: 'Robert Johnson', remarks: 'Unused item' },
  ];
  
  const adjustmentData = [
    { id: '1', date: '2025-04-25', quantity: 3, totalQuantity: 8, price: 100, total: 300, authorizedEmployee: 'Sarah Wilson', remarks: 'Inventory count adjustment' },
  ];
  
  const transferData = [
    { id: '1', fromStore: 'Main Store', toStore: 'Secondary Store', quantity: 2, price: 100, employee: 'Michael Davis', remarks: 'Store rebalancing', transferDate: '2025-04-26' },
  ];
  
  const transactionData = [
    { id: '1', particulars: 'Initial Stock', transactionDate: '2025-04-01', transactionNo: 'TRX-2025-001', quantity: 10, price: 100, total: 1000, store: 'Main Store', transactionUser: 'Admin', remarks: 'Opening balance' },
    { id: '2', particulars: 'Issue', transactionDate: '2025-04-18', transactionNo: 'TRX-2025-002', quantity: -2, price: 100, total: -200, store: 'Main Store', transactionUser: 'Robert Johnson', remarks: 'Regular maintenance' },
    { id: '3', particulars: 'Return', transactionDate: '2025-04-22', transactionNo: 'TRX-2025-003', quantity: 1, price: 100, total: 100, store: 'Main Store', transactionUser: 'Robert Johnson', remarks: 'Unused item' },
  ];
  
  if (!inventoryItem) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Inventory Item Not Found" 
          icon={<Package className="h-6 w-6" />}
        />
        <Button variant="outline" onClick={() => navigate('/manage/inventory')} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Inventory
        </Button>
      </div>
    );
  }

  // Function to handle adding new entries
  const handleAddNew = (tabName: string) => {
    toast.info(`Add new ${tabName} entry - This would open a form modal in a real application`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title={`Inventory Details: ${inventoryItem.itemName}`} 
          icon={<Package className="h-6 w-6" />}
        />
        <Button variant="outline" onClick={() => navigate('/manage/inventory')} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Inventory
        </Button>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="inventory" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="receive">Receive</TabsTrigger>
              <TabsTrigger value="issue">Issue</TabsTrigger>
              <TabsTrigger value="return">Return</TabsTrigger>
              <TabsTrigger value="adjustment">Adjustment</TabsTrigger>
              <TabsTrigger value="transfer">Transfer</TabsTrigger>
              <TabsTrigger value="transaction">Transaction</TabsTrigger>
            </TabsList>
            
            {/* Inventory Tab */}
            <TabsContent value="inventory">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Spare Part Name</h3>
                  <p className="text-base">{inventoryItem.itemName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Store</h3>
                  <p className="text-base">{inventoryItem.store}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Opening Balance Quantity</h3>
                  <p className="text-base">{inventoryItem.balance}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Opening Balance Date</h3>
                  <p className="text-base">2025-01-01</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Min Level</h3>
                  <p className="text-base">{inventoryItem.minLevel}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Max Level</h3>
                  <p className="text-base">{inventoryItem.maxLevel}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Reorder Level</h3>
                  <p className="text-base">{inventoryItem.reorderLevel}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Current Balance Quantity</h3>
                  <p className="text-base">{inventoryItem.balance}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Unit Price</h3>
                  <p className="text-base">{formatCurrency(inventoryItem.unitPrice)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Total Price</h3>
                  <p className="text-base">{formatCurrency(inventoryItem.totalPrice)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Rack No</h3>
                  <p className="text-base">{inventoryItem.rackNo}</p>
                </div>
              </div>
            </TabsContent>
            
            {/* Receive Tab */}
            <TabsContent value="receive">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Receive Records</h3>
                <Button onClick={() => handleAddNew('receive')} size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Add New
                </Button>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Receive Date</TableHead>
                      <TableHead>PO</TableHead>
                      <TableHead>Receiver Quantity</TableHead>
                      <TableHead>Total Price</TableHead>
                      <TableHead>Receive By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receiveData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.po}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.totalPrice)}</TableCell>
                        <TableCell>{item.receiveBy}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </TabsContent>
            
            {/* Issue Tab */}
            <TabsContent value="issue">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Issue Records</h3>
                <Button onClick={() => handleAddNew('issue')} size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Add New
                </Button>
              </div>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Work Order No</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Store</TableHead>
                      <TableHead>Issuance Name</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {issueData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.workOrderNo}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell>{formatCurrency(item.total)}</TableCell>
                        <TableCell>{item.store}</TableCell>
                        <TableCell>{item.issuanceName}</TableCell>
                        <TableCell>{item.remarks}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </TabsContent>
            
            {/* Return Tab */}
            <TabsContent value="return">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Return Records</h3>
                <Button onClick={() => handleAddNew('return')} size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Add New
                </Button>
              </div>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Work Order</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Return Name</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {returnData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.workOrder}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.price)}</TableCell>
                        <TableCell>{formatCurrency(item.total)}</TableCell>
                        <TableCell>{item.returnName}</TableCell>
                        <TableCell>{item.remarks}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </TabsContent>
            
            {/* Adjustment Tab */}
            <TabsContent value="adjustment">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Adjustment Records</h3>
                <Button onClick={() => handleAddNew('adjustment')} size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Add New
                </Button>
              </div>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Authorized Employee</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adjustmentData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.totalQuantity}</TableCell>
                        <TableCell>{formatCurrency(item.price)}</TableCell>
                        <TableCell>{formatCurrency(item.total)}</TableCell>
                        <TableCell>{item.authorizedEmployee}</TableCell>
                        <TableCell>{item.remarks}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </TabsContent>
            
            {/* Transfer Tab */}
            <TabsContent value="transfer">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Transfer Records</h3>
                <Button onClick={() => handleAddNew('transfer')} size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Add New
                </Button>
              </div>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>From Store</TableHead>
                      <TableHead>To Store</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Remarks</TableHead>
                      <TableHead>Transfer Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transferData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.fromStore}</TableCell>
                        <TableCell>{item.toStore}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.price)}</TableCell>
                        <TableCell>{item.employee}</TableCell>
                        <TableCell>{item.remarks}</TableCell>
                        <TableCell>{item.transferDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </TabsContent>
            
            {/* Transaction Tab */}
            <TabsContent value="transaction">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Transaction Records</h3>
                <Button onClick={() => handleAddNew('transaction')} size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Add New
                </Button>
              </div>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Particulars</TableHead>
                      <TableHead>Transaction Date</TableHead>
                      <TableHead>Transaction No</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Store</TableHead>
                      <TableHead>Transaction User</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactionData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.particulars}</TableCell>
                        <TableCell>{item.transactionDate}</TableCell>
                        <TableCell>{item.transactionNo}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.price)}</TableCell>
                        <TableCell>{formatCurrency(item.total)}</TableCell>
                        <TableCell>{item.store}</TableCell>
                        <TableCell>{item.transactionUser}</TableCell>
                        <TableCell>{item.remarks}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="flex justify-end pt-4 pb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/manage/inventory')}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default InventoryDetailPage;
