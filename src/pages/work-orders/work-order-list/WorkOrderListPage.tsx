import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import DataTable, { Column } from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Sample data
const initialWorkOrders = [
  {
    id: '1',
    sl: 1,
    workOrderNo: 'WO-2023-0001',
    planDueDate: '2023-07-30',
    task: 'Pump Maintenance',
    pmNo: 'PM-2023-001',
    packageNo: 'PKG-001',
    assetNo: 'PUMP-001',
    frequency: 'Monthly',
    workType: 'Preventive',
    workCenter: 'Mechanical',
    woStatus: 'Open',
    description: 'Regular preventive maintenance for water pump',
  },
  {
    id: '2',
    sl: 2,
    workOrderNo: 'WO-2023-0002',
    planDueDate: '2023-08-05',
    task: 'Electrical Inspection',
    pmNo: 'PM-2023-002',
    packageNo: 'PKG-002',
    assetNo: 'ELEC-002',
    frequency: 'Quarterly',
    workType: 'Inspection',
    workCenter: 'Electrical',
    woStatus: 'In Progress',
    description: 'Electrical panel inspection and testing',
  },
  {
    id: '3',
    sl: 3,
    workOrderNo: 'WO-2023-0003',
    planDueDate: '2023-08-10',
    task: 'Valve Replacement',
    pmNo: '',
    packageNo: '',
    assetNo: 'VALVE-003',
    frequency: '',
    workType: 'Corrective',
    workCenter: 'Piping',
    woStatus: 'On Hold',
    description: 'Replace faulty pressure relief valve',
  },
  {
    id: '4',
    sl: 4,
    workOrderNo: 'WO-2023-0004',
    planDueDate: '2023-08-15',
    task: 'Sensor Calibration',
    pmNo: 'PM-2023-004',
    packageNo: 'PKG-003',
    assetNo: 'SENS-004',
    frequency: 'Semi-Annual',
    workType: 'Calibration',
    workCenter: 'Instrumentation',
    woStatus: 'Completed',
    description: 'Calibration of temperature and pressure sensors',
  },
  {
    id: '5',
    sl: 5,
    workOrderNo: 'WO-2023-0005',
    planDueDate: '2023-08-20',
    task: 'Belt Replacement',
    pmNo: 'PM-2023-005',
    packageNo: 'PKG-004',
    assetNo: 'CONV-005',
    frequency: 'Annual',
    workType: 'Preventive',
    workCenter: 'Mechanical',
    woStatus: 'Closed',
    description: 'Replace conveyor belt before end of service life',
  },
  {
    id: '6',
    sl: 6,
    workOrderNo: 'WO-2023-0006',
    planDueDate: '2023-08-25',
    task: 'HVAC Filter Change',
    pmNo: 'PM-2023-006',
    packageNo: 'PKG-005',
    assetNo: 'HVAC-006',
    frequency: 'Bi-Monthly',
    workType: 'Preventive',
    workCenter: 'HVAC',
    woStatus: 'Open',
    description: 'Replace air filters in HVAC system',
  },
];

const WorkOrderListPage: React.FC = () => {
  const navigate = useNavigate();
  const [workOrders, setWorkOrders] = useState(initialWorkOrders);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    sl: 0,
    workOrderNo: '',
    planDueDate: '',
    task: '',
    pmNo: '',
    packageNo: '',
    assetNo: '',
    frequency: '',
    workType: '',
    workCenter: '',
    woStatus: '',
    description: '',
  });

  const handleAddNew = () => {
    setIsEditMode(false);
    setFormData({
      id: `${workOrders.length + 1}`,
      sl: workOrders.length + 1,
      workOrderNo: `WO-2023-${String(workOrders.length + 1).padStart(4, '0')}`,
      planDueDate: '',
      task: '',
      pmNo: '',
      packageNo: '',
      assetNo: '',
      frequency: '',
      workType: 'Preventive',
      workCenter: '',
      woStatus: 'Open',
      description: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (row: any) => {
    setIsEditMode(true);
    setFormData({
      ...row
    });
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditMode) {
      setWorkOrders(prev => 
        prev.map(item => item.id === formData.id ? formData : item)
      );
    } else {
      setWorkOrders(prev => [...prev, formData]);
    }
    
    setIsDialogOpen(false);
  };

  const handleRowClick = (row: any) => {
    navigate(`/work-orders/work-order-list/${row.id}`);
  };

  const columns: Column[] = [
    { id: 'sl', header: 'SL#', accessorKey: 'sl' },
    { id: 'workOrderNo', header: 'Work Order No', accessorKey: 'workOrderNo' },
    { id: 'planDueDate', header: 'Plan Due Date', accessorKey: 'planDueDate' },
    { id: 'task', header: 'Task', accessorKey: 'task' },
    { id: 'pmNo', header: 'PM No', accessorKey: 'pmNo' },
    { id: 'packageNo', header: 'Package No', accessorKey: 'packageNo' },
    { id: 'assetNo', header: 'Asset No', accessorKey: 'assetNo' },
    { id: 'frequency', header: 'Frequency', accessorKey: 'frequency' },
    { id: 'workType', header: 'Work Type', accessorKey: 'workType' },
    { id: 'workCenter', header: 'Work Center', accessorKey: 'workCenter' },
    { 
      id: 'woStatus', 
      header: 'WO Status', 
      accessorKey: 'woStatus',
      cell: (value) => <StatusBadge status={value} />
    },
    { id: 'description', header: 'Description', accessorKey: 'description' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Work Order List" 
        onAddNew={handleAddNew}
        addNewLabel="+ New Work Order"
        onSearch={(query) => console.log('Search:', query)}
      />
      
      <DataTable 
        columns={columns}
        data={workOrders}
        onEdit={handleEdit}
        onRowClick={handleRowClick}
      />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Edit Work Order' : 'Create New Work Order'}
            </DialogTitle>
            <DialogDescription>
              Fill in the work order details. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workOrderNo">Work Order No</Label>
                <Input
                  id="workOrderNo"
                  name="workOrderNo"
                  value={formData.workOrderNo}
                  onChange={handleInputChange}
                  readOnly={isEditMode}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="planDueDate">Plan Due Date</Label>
                <Input
                  id="planDueDate"
                  name="planDueDate"
                  type="date"
                  value={formData.planDueDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="task">Task</Label>
                <Input
                  id="task"
                  name="task"
                  value={formData.task}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assetNo">Asset No</Label>
                <Input
                  id="assetNo"
                  name="assetNo"
                  value={formData.assetNo}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pmNo">PM No</Label>
                <Input
                  id="pmNo"
                  name="pmNo"
                  value={formData.pmNo}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="packageNo">Package No</Label>
                <Input
                  id="packageNo"
                  name="packageNo"
                  value={formData.packageNo}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  name="frequency"
                  value={formData.frequency}
                  onValueChange={(value) => handleSelectChange('frequency', value)}
                >
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Bi-Weekly">Bi-Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Bi-Monthly">Bi-Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Semi-Annual">Semi-Annual</SelectItem>
                    <SelectItem value="Annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workType">Work Type</Label>
                <Select
                  name="workType"
                  value={formData.workType}
                  onValueChange={(value) => handleSelectChange('workType', value)}
                >
                  <SelectTrigger id="workType">
                    <SelectValue placeholder="Select work type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Preventive">Preventive</SelectItem>
                    <SelectItem value="Corrective">Corrective</SelectItem>
                    <SelectItem value="Inspection">Inspection</SelectItem>
                    <SelectItem value="Calibration">Calibration</SelectItem>
                    <SelectItem value="Modification">Modification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workCenter">Work Center</Label>
                <Select
                  name="workCenter"
                  value={formData.workCenter}
                  onValueChange={(value) => handleSelectChange('workCenter', value)}
                >
                  <SelectTrigger id="workCenter">
                    <SelectValue placeholder="Select work center" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mechanical">Mechanical</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Instrumentation">Instrumentation</SelectItem>
                    <SelectItem value="HVAC">HVAC</SelectItem>
                    <SelectItem value="Piping">Piping</SelectItem>
                    <SelectItem value="Civil">Civil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="woStatus">WO Status</Label>
                <Select
                  name="woStatus"
                  value={formData.woStatus}
                  onValueChange={(value) => handleSelectChange('woStatus', value)}
                >
                  <SelectTrigger id="woStatus">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter work order description"
                  rows={3}
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkOrderListPage;
