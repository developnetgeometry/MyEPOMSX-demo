import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Plus,
  Save,
  X,
  Trash2,
  ListOrdered,
  Wrench,
  FileText,
  Users,
  Calendar,
  Table,
} from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useLoadingState } from "@/hooks/use-loading-state";
import {
  formatCurrency,
  formatDate,
  getFileNameFromPath,
} from "@/utils/formatters";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  useCreateWorkOrder,
  useDeletePMScheduleCustomTask,
  usePlanLabour,
  usePlanMaterial,
  usePMSchedule,
  usePMScheduleMaintainableGroups,
  usePMScheduleMinCriteria,
  useWorkOrderId,
} from "@/hooks/queries/usePMSchedule";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { MinAcceptanceCriteria } from "@/types/maintain";
import { FileUpload } from "@/components/ui/file-upload";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import WorkOrderDialogForm from "./WorkOrderDialogForm";
interface TaskDetail {
  id: number;
  description: string;
  seq: number;
  isEditing?: boolean;
  isCustom?: boolean;
  originalTaskDetailId?: number | null;
}

interface ChecksheetFile {
  url: string;
  name: string;
}

interface WorkOrder {
  id: string;
  work_order_no: string;
  asset: {
    asset_name: string;
  };
  is_active: string;
  due_date: string;
}

interface MaintainableGroupItem {
  id: number;
  asset: {
    asset_name: string;
  };
  group: {
    name: string;
  };
}

interface PlanLabor {
  id: number;
  employee: {
    name: string;
  };
  duration: number;
  manPower: number;
}

interface PlanMaterial {
  id: number;
  material: {
    item_name: string;
  };
  quantity: number;
}

const PMScheduleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoading: isSaving, withLoading: withSavingLoading } =
    useLoadingState();
  const { isLoading: isDeleting, withLoading: withDeletingLoading } =
    useLoadingState();

  // Form modification tracking
  const [isFormModified, setIsFormModified] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("task-detail");
  const { toast } = useToast();
  const { data: pmScheduleDetail } = usePMSchedule(Number(id));

  const { mutate: deleteCustomTask } = useDeletePMScheduleCustomTask();

  const [taskDetails, setTaskDetails] = useState<TaskDetail[]>([]);

  useEffect(() => {
    const loadTasks = async () => {
      if (!pmScheduleDetail?.task_id) return;

      try {
        const { data: existingCustomTasks, error: customTasksError } =
          // @ts-ignore
          await supabase
            .from("e_pm_task_detail")
            .select("*")
            .eq("pm_schedule_id", Number(id));

        if (customTasksError) throw customTasksError;

        if (existingCustomTasks && existingCustomTasks.length > 0) {
          const customTasks = existingCustomTasks.map((task) => ({
            id: task.id,
            description: task.task_list,
            seq: task.sequence,
            isCustom: true,
            originalTaskDetailId: task.original_task_detail_id,
          }));
          setTaskDetails(customTasks);
          return;
        }

        const { data: templateTasksData, error: templateError } = await supabase
          .from("e_task_detail")
          .select("*")
          .eq("task_id", pmScheduleDetail.task_id);

        if (templateError) throw templateError;

        if (templateTasksData && templateTasksData.length > 0) {
          const { data: newCustomTasks, error: insertError } = await supabase
            .from("e_pm_task_detail")
            .insert(
              templateTasksData.map((task) => ({
                pm_schedule_id: Number(id),
                task_list: task.task_list,
                sequence: task.seq,
                original_task_detail_id: task.id,
              }))
            )
            .select();

          if (insertError) throw insertError;

          const customTasks = newCustomTasks.map((task) => ({
            id: task.id,
            description: task.task_list,
            seq: task.sequence,
            isCustom: true,
            originalTaskDetailId: task.original_task_detail_id,
          }));

          setTaskDetails(customTasks);
        }
      } catch (error) {
        console.error("Error loading tasks:", error);
        toast({
          title: "Error",
          description: "Failed to load tasks",
          variant: "destructive",
        });
      }
    };

    loadTasks();
  }, [id, pmScheduleDetail?.task_id]);

  const [serviceNotes, setServiceNotes] = useState<string>("");

  useEffect(() => {
    if (pmScheduleDetail?.service_notes) {
      setServiceNotes(pmScheduleDetail.service_notes);
    }
  }, [pmScheduleDetail?.service_notes]);

  const { data: minAcceptanceCriterias = [] } = usePMScheduleMinCriteria(
    Number(id)
  );

  const [minAcceptanceCriteria, setMinAcceptanceCriteria] = useState<
    MinAcceptanceCriteria[]
  >([]);

  useEffect(() => {
    if (minAcceptanceCriterias) {
      setMinAcceptanceCriteria(minAcceptanceCriterias);
    }
  }, [minAcceptanceCriterias]);

  const [checkSheet, setCheckSheet] = useState<string>("");
  const [checksheetFile, setChecksheetFile] = useState<ChecksheetFile | null>(
    null
  );
  const [newChecksheetFile, setNewChecksheetFile] = useState<File | null>(null);

  useEffect(() => {
    if (pmScheduleDetail?.checksheet_attachment) {
      setChecksheetFile({
        url: pmScheduleDetail.checksheet_attachment,
        name: getFileNameFromPath(pmScheduleDetail.checksheet_attachment),
      });
    }
    if (pmScheduleDetail?.checksheet_notes) {
      setCheckSheet(pmScheduleDetail.checksheet_notes);
    }
  }, [pmScheduleDetail]);

  const { data: workOrdersData } = useWorkOrderId(Number(id));

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);

  useEffect(() => {
    if (workOrdersData) {
      setWorkOrders(workOrdersData);
    }
  }, [workOrdersData]);

  const [additionalInfo, setAdditionalInfo] = useState<string>("");

  useEffect(() => {
    if (pmScheduleDetail?.additional_info) {
      setAdditionalInfo(pmScheduleDetail.additional_info);
    }
  }, [pmScheduleDetail?.additional_info]);

  const { data: maintainableGroupsData } = usePMScheduleMaintainableGroups(
    Number(id)
  );

  const [maintainableGroups, setMaintainableGroups] = useState<
    MaintainableGroupItem[]
  >([]);

  useEffect(() => {
    if (maintainableGroupsData) {
      setMaintainableGroups(maintainableGroupsData);
    }
  });

  const maintainableGroup = maintainableGroups.map((group) => group);

  const { data: planLaborData } = usePlanLabour(Number(id));
  const [planLabor, setPlanLabor] = useState<PlanLabor[]>([]);

  useEffect(() => {
    if (planLaborData) {
      setPlanLabor(planLaborData);
    }
  }, [planLaborData]);

  const { data: planMaterialsData } = usePlanMaterial(Number(id));
  const [planMaterials, setPlanMaterials] = useState<PlanMaterial[]>([]);

  useEffect(() => {
    if (planMaterialsData) {
      setPlanMaterials(planMaterialsData);
    }
  });

  // Make a copy of the original data for cancellation purposes
  const [originalTaskDetails, setOriginalTaskDetails] = useState<TaskDetail[]>(
    []
  );

  // Handle editing task detail row
  const startEditing = (id: number) => {
    setTaskDetails(
      taskDetails.map((task) =>
        task.id === id ? { ...task, isEditing: true } : task
      )
    );
    setIsFormModified(true);
  };

  const updateTaskDescription = (id: number, description: string) => {
    setTaskDetails(
      taskDetails.map((task) => {
        if (task.id === id) {
          if (!task.isCustom) {
            return {
              ...task,
              isCustom: true,
              description,
              isEditing: true,
            };
          }
          return { ...task, description };
        }
        return task;
      })
    );
    if (activeTab === "task-detail") {
      setIsFormModified(true);
    }
  };

  const stopEditing = (id: number) => {
    const updatedTasks = taskDetails.map((task) => {
      if (task.id === id) {
        // Validate the description before saving
        if (!task.description || task.description.trim() === "") {
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
    const newSeq =
      taskDetails.length > 0
        ? Math.max(...taskDetails.map((t) => t.seq)) + 1
        : 1;

    setTaskDetails([
      ...taskDetails,
      {
        id: newId,
        description: "",
        seq: newSeq,
        isEditing: true,
        isCustom: true, // Mark as custom task
      },
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
        const taskToRemove = taskDetails.find(
          (task) => task.id === taskToDelete
        );
        if (!taskToRemove) return;

        // Delete from database if it's a custom task
        if (taskToRemove.isCustom) {
          await deleteCustomTask(taskToRemove.id);
        }

        // Remove the task and re-sequence remaining tasks
        const updatedTasks = taskDetails
          .filter((task) => task.id !== taskToDelete)
          .map((task, index) => ({
            ...task,
            seq: index + 1, // Re-sequence starting from 1
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
    withSavingLoading(async () => {
      try {
        if (activeTab === "task-detail") {
          // Save only tasks
          const customTasksToSave = taskDetails.filter((task) => task.isCustom);
          // @ts-ignore
          await supabase
            .from("e_pm_task_detail")
            .delete()
            .eq("pm_schedule_id", Number(id));

          await supabase.from("e_pm_task_detail").insert(
            customTasksToSave.map((task) => ({
              pm_schedule_id: Number(id),
              task_list: task.description,
              sequence: task.seq,
              original_task_detail_id: task.originalTaskDetailId,
            }))
          );

          // Update local task state
          setTaskDetails(
            taskDetails.map((task) => ({ ...task, isEditing: false }))
          );
          setOriginalTaskDetails(JSON.parse(JSON.stringify(taskDetails)));

          toast({
            title: "Success",
            description: "Tasks saved successfully",
            variant: "default",
          });
        } else if (activeTab === "service") {
          // Save only service notes
          const { error } = await supabase
            .from("e_pm_schedule")
            // @ts-ignore
            .update({ service_notes: serviceNotes })
            .eq("id", Number(id));

          if (error) throw error;

          toast({
            title: "Success",
            description: "Service notes saved successfully",
            variant: "default",
          });
        } else if (activeTab === "checksheet") {
          let attachmentUrl = checksheetFile?.url || null;

          // Handle file upload if a new file was selected
          if (newChecksheetFile) {
            const filePath = `pm-schedules/${id}/checksheets/${newChecksheetFile.name}`;

            // Upload the new file
            const { error: uploadError } = await supabase.storage
              .from("your-bucket-name")
              .upload(filePath, newChecksheetFile);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: urlData } = supabase.storage
              .from("your-bucket-name")
              .getPublicUrl(filePath);

            attachmentUrl = urlData.publicUrl;

            // Delete old file if it exists
            if (checksheetFile?.url) {
              const oldFilePath = checksheetFile.url.split("/").pop();
              if (oldFilePath) {
                await supabase.storage
                  .from("your-bucket-name")
                  .remove([oldFilePath]);
              }
            }
          } else if (!checksheetFile) {
            // If no file and no existing attachment, set to null
            attachmentUrl = null;
          }

          const { error } = await supabase
            .from("e_pm_schedule")
            .update({
              // @ts-ignore
              checksheet_notes: checkSheet,
              checksheet_attachment: attachmentUrl,
            })
            .eq("id", Number(id));

          if (error) throw error;

          // Update local state
          if (newChecksheetFile) {
            setChecksheetFile({
              url: attachmentUrl || "",
              name: newChecksheetFile.name,
            });
            setNewChecksheetFile(null);
          }

          toast({
            title: "Success",
            description: "Checksheet saved successfully",
            variant: "default",
          });
        } else if (activeTab === "additional-info") {
          const { error } = await supabase
            .from("e_pm_schedule")
            .update({
              // @ts-ignore
              additional_info: additionalInfo,
            })
            .eq("id", Number(id));

          if (error) throw error;

          toast({
            title: "Success",
            description: "Additional info saved successfully",
            variant: "default",
          });
        }

        setIsFormModified(false);
      } catch (error) {
        console.error("Save error:", error);
        toast({
          title: "Error",
          description: "Failed to save checksheet",
          variant: "destructive",
        });
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
    navigate("/maintain/pm-schedule");
  };

  // Handle tab changes
  const handleTabChange = (value: string) => {
    // Check for unsaved changes in current tab if needed
    setActiveTab(value);
  };

  // Handle service notes update
  const handleServiceNotesChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setServiceNotes(event.target.value);
    if (activeTab === "service") {
      setIsFormModified(true);
    }
  };

  const handleChecksheetChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCheckSheet(event.target.value);
    if (activeTab === "checksheet") {
      setIsFormModified(true);
    }
  };

  // Handle additional info update
  const handleAdditionalInfoChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setAdditionalInfo(event.target.value);
    setIsFormModified(true);
  };

  
  const initialWorkOrderData = {
    pm_schedule_id: pmScheduleDetail?.id || null,
    pm_description: pmScheduleDetail?.pm_description || "",
    maintenance_id: pmScheduleDetail?.maintenance_id || null,
    asset_id: pmScheduleDetail?.asset_id || null,
    facility_id: pmScheduleDetail?.facility_id || null,
    system_id: pmScheduleDetail?.system_id || null,
    package_id: pmScheduleDetail?.package_id || null,
    work_center_id: pmScheduleDetail?.work_center_id || null,
    work_order_date: new Date().toISOString().split('T')[0],
    due_date: pmScheduleDetail?.due_date || null,
    // Optional fields
    priority_id: pmScheduleDetail?.priority_id || null,
    discipline_id: pmScheduleDetail?.discipline_id || null,
    task_id: pmScheduleDetail?.task_id || null,
    frequency_id: pmScheduleDetail?.frequency_id || null,
    pm_group_id: pmScheduleDetail?.pm_group_id || null,
    asset_sce_code_id: pmScheduleDetail?.pm_sce_group_id || null
  };
  
  const { mutate: createWorkOrder } = useCreateWorkOrder();

  const handleCreateWorkOrderSubmit = async (formData: any) => {
    
    try {
      await createWorkOrder(formData);
      
      toast({
        title: "Success",
        description: "Work order created successfully",
        variant: "default",
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      throw error; // This will be caught in the WorkOrderDialogForm
    }
  };

  const handleCreateWorkOrder = () => {
    setIsDialogOpen(true);
  };
  // Check if any row is currently being edited
  const hasEditingRows = taskDetails.some((task) => task.isEditing);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="PM Schedule Detail" />
        <Button
          variant="outline"
          onClick={() => navigate("/maintain/pm-schedule")}
          className="flex items-center gap-2"
          disabled={isSaving}
        >
          <ArrowLeft className="h-4 w-4" /> Back to PM Schedule
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <h3 className="text-lg font-semibold text-blue-600 border-b pb-2">
            General Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500">PM No</h4>
              <p className="text-base font-medium">{pmScheduleDetail?.pm_no}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">
                PM Description
              </h4>
              <p className="text-base">{pmScheduleDetail?.pm_description}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Package No</h4>
              <p className="text-base">
                {pmScheduleDetail?.package?.package_no}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Asset</h4>
              <p className="text-base">{pmScheduleDetail?.asset?.asset_name}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Tasks</h4>
              <p className="text-base">{pmScheduleDetail?.task?.task_name}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Frequency</h4>
              <p className="text-base">{pmScheduleDetail?.frequency?.name}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Work Center</h4>
              <p className="text-base">{pmScheduleDetail?.work_center?.name}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Status</h4>
              <StatusBadge
                status={pmScheduleDetail?.is_active ? "Active" : "Inactive"}
              />
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
              <p className="text-base">
                {formatDate(pmScheduleDetail?.due_date)}
              </p>
            </div>

            {/* <div>
              <h4 className="text-sm font-medium text-gray-500">Duration</h4>
              <p className="text-base">{pmDetail.duration} Days</p>
            </div> */}

            <Button className="w-1/2" onClick={handleCreateWorkOrder}>
              Create Work Order
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
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
                <h3 className="text-lg font-semibold text-blue-600">
                  Task Detail
                </h3>
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
                      <TableHead className="w-[100px] text-right">
                        Actions
                      </TableHead>
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
                              onChange={(e) =>
                                updateTaskDescription(task.id, e.target.value)
                              }
                              className="w-full"
                              autoFocus
                              placeholder="Enter task description"
                            />
                          ) : (
                            task.description
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
                          No tasks found
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
                <h3 className="text-lg font-semibold text-blue-600 mb-4">
                  Service Notes
                </h3>
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
                <h3 className="text-lg font-semibold text-blue-600">
                  Minimum Acceptance Criteria
                </h3>
              </div>
              <div className="border rounded-md overflow-hidden">
                <UITable>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Aspect</TableHead>
                      <TableHead>Min Acceptance Criteria</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {minAcceptanceCriteria.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.field_name}</TableCell>
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
                <h3 className="text-lg font-semibold text-blue-600">
                  Checksheet
                </h3>
              </div>
              {/* <div className="border rounded-md overflow-hidden">
                <UITable>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Checksheet Notes</TableHead>
                      <TableHead>Attachment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {checksheets.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>
                          <Button variant="link" className="p-0 h-auto text-blue-600">
                            {getFileNameFromPath(item.file_path)}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {checksheets.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2} className="h-24 text-center">
                          No checksheet items found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </UITable>
              </div> */}
              <div className="mt-6">
                <div className="space-y-4">
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="checksheet-notes">Checksheet Notes</Label>
                    <Textarea
                      id="checksheet-notes"
                      className="min-h-[150px]"
                      placeholder="Enter checksheet notes here..."
                      onChange={handleChecksheetChange}
                      value={checkSheet}
                    />
                  </div>
                  <div>
                    <Label htmlFor="file-upload" className="block mb-2">
                      Attachment
                    </Label>
                    <FileUpload
                      id="checksheet-upload"
                      acceptedFileTypes=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                      maxSizeInMB={10}
                      buttonText="Upload Checksheet"
                      existingFile={checksheetFile}
                      onFilesSelected={(files) => {
                        if (files.length > 0) {
                          setNewChecksheetFile(files[0]);
                          setIsFormModified(true);
                        }
                      }}
                      onExistingFilesChange={(files) => {
                        // Handle removal of existing file
                        if (files.length === 0) {
                          setChecksheetFile(null);
                          setIsFormModified(true);
                        }
                      }}
                    />
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
                <h3 className="text-lg font-semibold text-blue-600">
                  Work Orders
                </h3>
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
                        <TableCell>{item.work_order_no}</TableCell>
                        <TableCell>{item.asset.asset_name}</TableCell>
                        <TableCell>
                          <StatusBadge
                            status={item.is_active ? "Active" : "Inactive"}
                          />
                        </TableCell>
                        <TableCell>{formatDate(item.due_date)}</TableCell>
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
                <h3 className="text-lg font-semibold text-blue-600 mb-4">
                  Additional Information
                </h3>
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
                <h3 className="text-lg font-semibold text-blue-600">
                  Maintainable Group
                </h3>
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
                    {maintainableGroup.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.asset.asset_name}</TableCell>
                        <TableCell>{item.group.name}</TableCell>
                      </TableRow>
                    ))}
                    {maintainableGroup.length === 0 && (
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
                    <h3 className="text-lg font-semibold text-blue-600">
                      Plan Labor
                    </h3>
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
                            <TableCell>{item.employee.name}</TableCell>
                            <TableCell>{item.duration}</TableCell>
                            <TableCell>1</TableCell>
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
                    <h3 className="text-lg font-semibold text-blue-600">
                      Plan Material
                    </h3>
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
                            <TableCell>{item.material.item_name}</TableCell>
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
        <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
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
          ) : (
            "Apply Changes"
          )}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[600px] md:max-w-[1200px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between w-full">
              <div>
                <DialogTitle>
                  Add Work Order
                </DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new work order.
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDialogOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <WorkOrderDialogForm
            onSubmit={handleCreateWorkOrderSubmit}
            onCancel={() => setIsDialogOpen(false)}
            initialData={initialWorkOrderData}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be
              undone.
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
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PMScheduleDetailPage;
