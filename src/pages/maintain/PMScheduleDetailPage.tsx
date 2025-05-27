
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Plus, Save, X, Trash2, ListOrdered, Wrench, FileText, Users, Calendar, Table } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';
import { Table as UITable, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useLoadingState } from '@/hooks/use-loading-state';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCreatePMScheduleCustomTask, useDeletePMScheduleCustomTask, usePMSchedule, usePMScheduleCustomTasks, useUpdatePMScheduleCustomTask } from '@/hooks/queries/usePMSchedule';
import { useTaskWithDetails } from '@/hooks/queries/useTasks';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

interface TaskDetail {
  id: number;
  description: string;
  seq: number;
  isEditing?: boolean;
  isCustom?: boolean;
  originalTaskDetailId?: number | null;
}

interface MinAcceptanceCriteria {
  id: number;
  fieldName: string;
  criteria: string;
  isEditing?: boolean;
}

interface ChecksheetItem {
  id: number;
  fieldName: string;
  attachment: string;
  isEditing?: boolean;
}

interface WorkOrder {
  id: string;
  workOrderNo: string;
  asset: string;
  status: string;
  planDueDate: string;
}

interface MaintainableGroupItem {
  id: number;
  asset: string;
  group: string;
}

interface PlanLabor {
  id: number;
  employee: string;
  duration: number;
  manPower: number;
}

interface PlanMaterial {
  id: number;
  material: string;
  quantity: number;
}

const PMScheduleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoading: isSaving, withLoading: withSavingLoading } = useLoadingState();
  const { isLoading: isDeleting, withLoading: withDeletingLoading } = useLoadingState();
  
  // Form modification tracking
  const [isFormModified, setIsFormModified] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('task-detail');
  const { toast } = useToast();
  const { data: pmScheduleDetail } = usePMSchedule(Number(id));
  
  const { data: tasks } = useTaskWithDetails(pmScheduleDetail?.task_id, {
    enabled: !!pmScheduleDetail?.task_id
  });

  const { data: PMTasks } = usePMScheduleCustomTasks(Number(id));
  const { mutate: createCustomTask } = useCreatePMScheduleCustomTask();
  const { mutate: updateCustomTask } = useUpdatePMScheduleCustomTask();
  const { mutate: deleteCustomTask } = useDeletePMScheduleCustomTask();

  const [taskDetails, setTaskDetails] = useState<TaskDetail[]>([]);

  useEffect(() => {
    // @ts-ignore
    if(!tasks?.details && !PMTasks) return;
    
    // @ts-ignore
    const templateTasks = tasks?.details?.map(task => ({
      id: task.id,
      seq: task.seq,
      description: task.task_list,
      isCustom: false,
      originalTaskDetailId: null
    })) || [];

    const scheduleCustomTasks = PMTasks?.map(task => ({
      id: task.id,
      description: task.task_list,
      is_custom: true,
      originalTaskDetailId: task.original_task_detail_id,
      seq: task.seq
    })) || [];
  
    setTaskDetails([...templateTasks, ...scheduleCustomTasks]);
  }, [tasks, PMTasks]);

  const [serviceNotes, setServiceNotes] = useState<string>(
    "Perform regular maintenance checks on the compressor unit. Ensure all connections are properly tightened and lubricated."
  );

  const [minAcceptanceCriteria, setMinAcceptanceCriteria] = useState<MinAcceptanceCriteria[]>([
    { id: 1, fieldName: "Pressure Reading", criteria: "Must be between 2.5-3.0 bar" },
    { id: 2, fieldName: "Temperature", criteria: "Not exceeding 65°C" },
    { id: 3, fieldName: "Vibration Level", criteria: "Below 2.5 mm/s" }
  ]);

  const [checksheetItems, setChecksheetItems] = useState<ChecksheetItem[]>([
    { id: 1, fieldName: "Pressure Test Report", attachment: "pressure-test-20240501.pdf" },
    { id: 2, fieldName: "Vibration Analysis", attachment: "vibration-analysis-20240501.xlsx" },
  ]);

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([
    { 
      id: "WO-1", 
      workOrderNo: "WO-CPP-24/00001", 
      asset: "Exchanger Unit", 
      status: "Execute",
      planDueDate: "15/06/2024"
    }
  ]);

  const [additionalInfo, setAdditionalInfo] = useState<string>(
    "This PM schedule is part of the quarterly maintenance program for critical heat exchangers. Follow standard safety protocols when accessing equipment."
  );

  const [maintainableGroups, setMaintainableGroups] = useState<MaintainableGroupItem[]>([
    { id: 1, asset: "Spare Part Module", group: "PC001-G1" },
    { id: 2, asset: "Control Unit", group: "CU002-G2" },
    { id: 3, asset: "Sensor Array", group: "SA003-G1" }
  ]);

  const [planLabor, setPlanLabor] = useState<PlanLabor[]>([
    { id: 1, employee: "Muhammad Izzat Imran bin Abdul Aziz", duration: 2, manPower: 1 },
    { id: 2, employee: "Zairy Juzairy Bin Zaki", duration: 2, manPower: 1 }
  ]);

  const [planMaterials, setPlanMaterials] = useState<PlanMaterial[]>([
    { id: 1, material: "CLAS2-Vending Machine", quantity: 1 },
    { id: 2, material: "LUB-001 High Temp Grease", quantity: 2 },
    { id: 3, material: "SEAL-120 O-Ring Kit", quantity: 5 }
  ]);
  
  // Make a copy of the original data for cancellation purposes
  const [originalTaskDetails, setOriginalTaskDetails] = useState<TaskDetail[]>([]);
  
  useEffect(() => {
    // Store a deep copy of the original data when the component mounts
    setOriginalTaskDetails(JSON.parse(JSON.stringify(taskDetails)));
    
    // Simulate loading data from API when ID changes
    const loadData = async () => {
      // In a real implementation, this would fetch data from the API
      console.log(`Loading PM Schedule with ID: ${id}`);
    };
    
    loadData();
  }, [id]);

  // Handle editing task detail row
  const startEditing = (id: number) => {
    setTaskDetails(taskDetails.map(task => 
      task.id === id ? { ...task, isEditing: true } : task
    ));
    setIsFormModified(true);
  };

  const updateTaskDescription = (id: number, description: string) => {
    setTaskDetails(taskDetails.map(task => {
      if (task.id === id) {
        // If this is a template task, create a custom copy
        if (!task.isCustom) {
          return {
            ...task,
            isCustom: true,
            description,
            isEditing: true
          };
        }
        return { ...task, description };
      }
      return task;
    }));
    setIsFormModified(true);
  };

  const stopEditing = (id: number) => {
    const updatedTasks = taskDetails.map(task => {
      if (task.id === id) {
        // Validate the description before saving
        if (!task.description || task.description.trim() === '') {
          toast({
            title: "Error",
            description: "Task description cannot be empty",
            variant: "destructive",
          });
          return task; // Keep in editing mode
        }
        return { ...task, isEditing: false };
      }
      return task;
    });
    
    setTaskDetails(updatedTasks);
  };

  const addTask = () => {
    const newId = Date.now(); // Use timestamp for temporary ID
    const newSeq = taskDetails.length > 0 
      ? Math.max(...taskDetails.map(t => t.seq)) + 1 
      : 1;
    
    setTaskDetails([
      ...taskDetails, 
      { 
        id: newId, 
        description: '',
        seq: newSeq,
        isEditing: true,
        isCustom: true // Mark as custom task
      }
    ]);
    setIsFormModified(true);
  };
  
  // Handle deleting a task
  const promptDeleteTask = (id: number) => {
    setTaskToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const confirmDeleteTask = () => {
    if (taskToDelete !== null) {
      withDeletingLoading(async () => {
        const taskToRemove = taskDetails.find(task => task.id === taskToDelete);
        if (!taskToRemove) return;
  
        // Delete from database if it's a custom task
        if (taskToRemove.isCustom) {
          await deleteCustomTask(taskToRemove.id);
        }
  
        // Remove the task and re-sequence remaining tasks
        const updatedTasks = taskDetails
          .filter(task => task.id !== taskToDelete)
          .map((task, index) => ({
            ...task,
            seq: index + 1 // Re-sequence starting from 1
          }));
  
        setTaskDetails(updatedTasks);
        setDeleteDialogOpen(false);
        setTaskToDelete(null);
        setIsFormModified(true);
        
        toast({
          title: "Success",
          description: "Task deleted successfully",
          variant: "default",
        });
      });
    }
  };

  // Handle saving changes
  const handleSave = () => {
    // Validate all tasks have descriptions before saving
    const hasEmptyTasks = taskDetails.some(task => !task.description || task.description.trim() === '');
    
    if (hasEmptyTasks) {
      toast({
        title: "Error",
        description: "All tasks must have descriptions",
        variant: "destructive",
      });
      return;
    }
    
    withSavingLoading(async () => {
      try {
        // First, delete all existing custom tasks for this schedule
        // @ts-ignore
        await supabase
          .from('e_pm_task_detail')
          .delete()
          .eq('pm_schedule_id', Number(id));
  
        // Then create/update all current tasks
        const savePromises = taskDetails.map(task => {
          // Skip saving template tasks (they're read-only)
          if (!task.isCustom) return Promise.resolve();
  
          return supabase
            .from('e_pm_task_detail')
            .upsert({
              id: task.id,
              pm_schedule_id: Number(id),
              task_list: task.description,
              sequence: task.seq,
              original_task_detail_id: task.originalTaskDetailId || null
            })
            .select()
            .single();
        });
  
        await Promise.all(savePromises);
  
        // Update all records to not be in editing mode
        setTaskDetails(taskDetails.map(task => ({ ...task, isEditing: false })));
        
        // Update the original data with the new version
        setOriginalTaskDetails(JSON.parse(JSON.stringify(taskDetails)));
        
        // Reset form modified flag
        setIsFormModified(false);
        
        // Show success message
        toast({
          title: "Success",
          description: "Tasks saved successfully",
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save tasks",
          variant: "destructive",
        });
        console.error("Save error:", error);
      }
    });
  };
  
  // Handle applying changes (save without navigating away)
  const handleApplyChanges = () => {
    handleSave();
  };
  
  // Handle canceling changes
  const handleCancel = () => {
    if (isFormModified) {
      // Restore the original data
      setTaskDetails(JSON.parse(JSON.stringify(originalTaskDetails)));
      setIsFormModified(false);
      toast({
        title: "Success",
        description: "Changes canceled",
        variant: "default",
      });
    }
    
    // Navigate back to PM Schedule list
    navigate('/maintain/pm-schedule');
  };
  
  // Handle tab changes
  const handleTabChange = (value: string) => {
    // Check for unsaved changes in current tab if needed
    setActiveTab(value);
  };

  // Handle service notes update
  const handleServiceNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setServiceNotes(event.target.value);
    setIsFormModified(true);
  };

  // Handle additional info update
  const handleAdditionalInfoChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAdditionalInfo(event.target.value);
    setIsFormModified(true);
  };

  // Check if any row is currently being edited
  const hasEditingRows = taskDetails.some(task => task.isEditing);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="PM Schedule Detail" 
        />
        <Button 
          variant="outline" 
          onClick={() => navigate('/maintain/pm-schedule')} 
          className="flex items-center gap-2"
          disabled={isSaving}
        >
          <ArrowLeft className="h-4 w-4" /> Back to PM Schedule
        </Button>
      </div>
      
      <Card>
        <CardContent className="pt-6 space-y-6">
          <h3 className="text-lg font-semibold text-blue-600 border-b pb-2">General Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500">PM No</h4>
              <p className="text-base font-medium">{pmScheduleDetail?.pm_no}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">PM Description</h4>
              <p className="text-base">{pmScheduleDetail?.pm_description}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Package No</h4>
              <p className="text-base">{pmScheduleDetail?.package.package_no}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Asset</h4>
              <p className="text-base">{pmScheduleDetail?.asset.asset_name}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Tasks</h4>
              <p className="text-base">{pmScheduleDetail?.task.task_name}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Frequency</h4>
              <p className="text-base">{pmScheduleDetail?.frequency.name}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Work Center</h4>
              <p className="text-base">{pmScheduleDetail?.work_center.name}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Status</h4>
              <StatusBadge status={pmScheduleDetail?.is_active ? "Active" : "Inactive"} />
            </div>
            
            {/* <div>
              <h4 className="text-sm font-medium text-gray-500">Man Hour</h4>
              <p className="text-base">{pmDetail.manHour}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Man Power</h4>
              <p className="text-base">{pmDetail.manPower}</p>
            </div> */}
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Due Date</h4>
              <p className="text-base">{formatDate(pmScheduleDetail?.due_date)}</p>
            </div>
            
            {/* <div>
              <h4 className="text-sm font-medium text-gray-500">Duration</h4>
              <p className="text-base">{pmDetail.duration} Days</p>
            </div> */}
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="border-b w-full justify-start rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger 
            value="task-detail"
            className="py-2.5 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:font-medium data-[state=active]:text-blue-600 flex items-center gap-2"
          >
            <ListOrdered className="h-4 w-4" />
            Task Detail
          </TabsTrigger>
          <TabsTrigger 
            value="service" 
            className="py-2.5 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:font-medium data-[state=active]:text-blue-600 flex items-center gap-2"
          >
            <Wrench className="h-4 w-4" />
            Service
          </TabsTrigger>
          <TabsTrigger 
            value="min-acceptance" 
            className="py-2.5 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:font-medium data-[state=active]:text-blue-600"
          >
            Min Acceptance Criteria
          </TabsTrigger>
          <TabsTrigger 
            value="checksheet" 
            className="py-2.5 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:font-medium data-[state=active]:text-blue-600 flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Checksheet
          </TabsTrigger>
          <TabsTrigger 
            value="work-order" 
            className="py-2.5 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:font-medium data-[state=active]:text-blue-600 flex items-center gap-2"
          >
            <Table className="h-4 w-4" />
            Work Order
          </TabsTrigger>
          <TabsTrigger 
            value="additional-info" 
            className="py-2.5 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:font-medium data-[state=active]:text-blue-600 flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Additional Info
          </TabsTrigger>
          <TabsTrigger 
            value="maintainable-group" 
            className="py-2.5 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:font-medium data-[state=active]:text-blue-600 flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Maintainable Group
          </TabsTrigger>
          <TabsTrigger 
            value="plan" 
            className="py-2.5 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:font-medium data-[state=active]:text-blue-600 flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Plan
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="task-detail" className="pt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-blue-600">Task Detail</h3>
                <Button 
                  onClick={addTask} 
                  className="flex items-center gap-2"
                  disabled={isSaving || hasEditingRows}
                >
                  <Plus className="h-4 w-4" /> Add Row
                </Button>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <UITable>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-[80px]">Seq</TableHead>
                      <TableHead>Action Description</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taskDetails.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>{task.seq}</TableCell>
                        <TableCell>
                          {task.isEditing ? (
                            <Input 
                              value={task.description} 
                              onChange={(e) => updateTaskDescription(task.id, e.target.value)} 
                              className="w-full"
                              autoFocus
                              placeholder="Enter task description"
                            />
                          ) : (
                            task.description || <span className="text-gray-400">No description</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {task.isEditing ? (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => stopEditing(task.id)}
                              >
                                <Save className="h-4 w-4 text-green-600" />
                              </Button>
                            ) : (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => startEditing(task.id)}
                                  disabled={isSaving || hasEditingRows}
                                >
                                  <Plus className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => promptDeleteTask(task.id)}
                                  disabled={isSaving || hasEditingRows}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {taskDetails.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">
                          No task details found. Add a new task to get started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </UITable>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="service" className="pt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-blue-600 mb-4">Service Notes</h3>
                <div className="space-y-4">
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="service-notes">Notes</Label>
                    <Textarea 
                      id="service-notes" 
                      value={serviceNotes} 
                      onChange={handleServiceNotesChange}
                      className="min-h-[200px]"
                      placeholder="Enter service notes here..."
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="min-acceptance" className="pt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-blue-600">Minimum Acceptance Criteria</h3>
              </div>
              <div className="border rounded-md overflow-hidden">
                <UITable>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Field Name</TableHead>
                      <TableHead>Min Acceptance Criteria</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {minAcceptanceCriteria.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.fieldName}</TableCell>
                        <TableCell>{item.criteria}</TableCell>
                      </TableRow>
                    ))}
                    {minAcceptanceCriteria.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2} className="h-24 text-center">
                          No minimum acceptance criteria found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </UITable>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="checksheet" className="pt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-blue-600">Checksheet</h3>
              </div>
              <div className="border rounded-md overflow-hidden">
                <UITable>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Field Name</TableHead>
                      <TableHead>Attachment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {checksheetItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.fieldName}</TableCell>
                        <TableCell>
                          <Button variant="link" className="p-0 h-auto text-blue-600">
                            {item.attachment}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {checksheetItems.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2} className="h-24 text-center">
                          No checksheet items found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </UITable>
              </div>
              <div className="mt-6">
                <div className="space-y-4">
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="checksheet-notes">Checksheet Notes</Label>
                    <Textarea 
                      id="checksheet-notes"
                      className="min-h-[150px]"
                      placeholder="Enter checksheet notes here..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="file-upload" className="block mb-2">Upload Attachment</Label>
                    <Input id="file-upload" type="file" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="work-order" className="pt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-blue-600">Work Orders</h3>
              </div>
              <div className="border rounded-md overflow-hidden">
                <UITable>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Work Order No</TableHead>
                      <TableHead>Asset</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Plan Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workOrders.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.workOrderNo}</TableCell>
                        <TableCell>{item.asset}</TableCell>
                        <TableCell>
                          <StatusBadge status={item.status} />
                        </TableCell>
                        <TableCell>{item.planDueDate}</TableCell>
                      </TableRow>
                    ))}
                    {workOrders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No work orders found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </UITable>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="additional-info" className="pt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-blue-600 mb-4">Additional Information</h3>
                <div className="space-y-4">
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="additional-info">Comments</Label>
                    <Textarea 
                      id="additional-info" 
                      value={additionalInfo} 
                      onChange={handleAdditionalInfoChange}
                      className="min-h-[200px]"
                      placeholder="Enter additional information here..."
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="maintainable-group" className="pt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-blue-600">Maintainable Group</h3>
              </div>
              <div className="border rounded-md overflow-hidden">
                <UITable>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Asset</TableHead>
                      <TableHead>Group</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {maintainableGroups.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.asset}</TableCell>
                        <TableCell>{item.group}</TableCell>
                      </TableRow>
                    ))}
                    {maintainableGroups.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2} className="h-24 text-center">
                          No maintainable groups found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </UITable>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="plan" className="pt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-blue-600">Plan Labor</h3>
                  </div>
                  <div className="border rounded-md overflow-hidden mb-8">
                    <UITable>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>Employee</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Man Power</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {planLabor.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.employee}</TableCell>
                            <TableCell>{item.duration}</TableCell>
                            <TableCell>{item.manPower}</TableCell>
                          </TableRow>
                        ))}
                        {planLabor.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={3} className="h-24 text-center">
                              No planned labor found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </UITable>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-blue-600">Plan Material</h3>
                  </div>
                  <div className="border rounded-md overflow-hidden">
                    <UITable>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>Material</TableHead>
                          <TableHead>Quantity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {planMaterials.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.material}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                          </TableRow>
                        ))}
                        {planMaterials.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={2} className="h-24 text-center">
                              No planned materials found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </UITable>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex items-center justify-end space-x-2 border-t pt-4">
        <Button 
          variant="outline" 
          onClick={handleCancel}
          disabled={isSaving}
        >
          <X className="h-4 w-4 mr-1" /> Cancel
        </Button>
        <Button 
          variant="outline" 
          onClick={handleApplyChanges}
          disabled={isSaving || !isFormModified}
        >
          {isSaving ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2" />
              Applying...
            </>
          ) : "Apply Changes"}
        </Button>
        <Button 
          onClick={handleSave}
          disabled={isSaving || !isFormModified}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Save
            </>
          )}
        </Button>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteTask} 
              className="bg-destructive text-destructive-foreground"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Deleting...
                </>
              ) : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PMScheduleDetailPage;
