import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, PlusCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import DataTable from "@/components/shared/DataTable";
import {
  useAddDetailToTask,
  useDeleteTaskDetail,
  useDisciplineOptions,
  useTaskWithDetails,
  useUpdateTask,
  useUpdateTaskDetail,
} from "@/hooks/queries/useTasks";
import { useToast } from "@/hooks/use-toast";
import { TaskDetailCreate } from "@/types/maintain";
import ManageDialog from "@/components/manage/ManageDialog";

const TaskLibraryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("task");
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [editingDetail, setEditingDetail] = useState<TaskDetailCreate | null>(
    null
  );
  const { toast } = useToast();
  const { data: taskData, isLoading, error } = useTaskWithDetails(Number(id));
  const { data: disciplineOptions, isLoading: isLoadingDiscipline } =
    useDisciplineOptions();
  const sequences = taskData?.details || [];

  const updateTaskMutation = useUpdateTask();
  const addDetailToTaskMutation = useAddDetailToTask();
  const updateTaskDetailMutation = useUpdateTaskDetail();
  const deleteTaskDetailMutation = useDeleteTaskDetail();

  const sequenceColumns = [
    { id: "seq", header: "Seq", accessorKey: "seq" },
    { id: "taskList", header: "Task List", accessorKey: "task_list" },
  ];

  // Form validation schema
  const taskFormSchema = z.object({
    task_code: z.string().min(1, { message: "Task Code is required" }),
    task_name: z.string().min(1, { message: "Task Name is required" }),
    discipline_id: z.string().min(1, { message: "Discipline is required" }),
    is_active: z.boolean().default(true),
  });

  const taskDetailSchema = z.object({
    task_list: z.string().min(1, "Task description is required"),
  });

  const taskDetailFormFields = [
    {
      name: "task_list",
      label: "Task Description",
      type: "text" as const,
      required: true,
    },
  ];

  // Initialize form
  const form = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      task_code: "",
      task_name: "",
      discipline_id: "",
      is_active: true,
    },
  });

  // Reset form when taskData is available
  useEffect(() => {
    if (taskData) {
      form.reset({
        task_code: taskData.task_code,
        task_name: taskData.task_name,
        discipline_id: String(taskData.discipline_id),
        is_active: taskData.is_active,
      });
    }
  }, [taskData, form]);

  const onSubmit = async (values: z.infer<typeof taskFormSchema>) => {
    try {
      await updateTaskMutation.mutateAsync({
        id: Number(id),
        task_code: values.task_code,
        task_name: values.task_name,
        discipline_id: Number(values.discipline_id),
        is_active: Boolean(values.is_active),
        updated_at: new Date(),
      });
      toast({
        title: "Success",
        description: "Task updated successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleAddSequence = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Calculate next sequence number
    const nextSeq =
      sequences.length > 0 ? Math.max(...sequences.map((s) => s.seq)) + 1 : 1;

    setEditingDetail({
      task_id: Number(id),
      seq: nextSeq,
      task_list: "",
      created_at: new Date(),
      updated_at: new Date(),
    });
    setIsDetailDialogOpen(true);
  };

  const handleEditSequence = (row: any) => {
    setEditingDetail({
      ...row,
      task_id: Number(id),
    });
    setIsDetailDialogOpen(true);
  };

  const handleSubmitDetail = async (
    values: z.infer<typeof taskDetailSchema>
  ) => {
    try {
      const isEditMode = editingDetail && editingDetail.id;

      if (isEditMode) {
        await updateTaskDetailMutation.mutateAsync({
          id: editingDetail.id,
          task_list: values.task_list,
          updated_at: new Date(),
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Task detail updated successfully",
              variant: "default",
            });
          },
          onError: (error) => {
            toast({
              title: "Error",
              description:
                error instanceof Error ? error.message : "An error occurred",
              variant: "destructive",
            });
          },
        }
      );
      } else {
        const nextSeq =
          sequences.length > 0
            ? Math.max(...sequences.map((s) => s.seq)) + 1
            : 1;
        await addDetailToTaskMutation.mutateAsync(
          {
            task_id: Number(id),
            seq: nextSeq,
            task_list: values.task_list,
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            onSuccess: () => {
              toast({
                title: "Success",
                description: "Task detail created successfully",
                variant: "default",
              });
            },
            onError: (error) => {
              toast({
                title: "Error",
                description:
                  error instanceof Error ? error.message : "An error occurred",
                variant: "destructive",
              });
            },
          }
        );
      }

      setIsDetailDialogOpen(false);
      setEditingDetail(null);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSequence = async (row: any) => {
    try {
      await deleteTaskDetailMutation.mutateAsync(row.id);
      toast({
        title: "Success",
        description: "Task detail deleted successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  // const handleRowClick = (row: any) => {
  //   // Handle row click - could be used for selecting a row
  //   console.log("Row clicked:", row);
  //   const isSelected = selectedRows.some((item) => item.id === row.id);

  //   if (isSelected) {
  //     setSelectedRows(selectedRows.filter((item) => item.id !== row.id));
  //   } else {
  //     setSelectedRows([...selectedRows, row]);
  //   }
  // };

  if (isLoading || isLoadingDiscipline) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Task Detail" />
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/maintain/task-library")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Task Library
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task: {taskData.task_name}</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs
                defaultValue="task"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="grid w-full md:w-[400px] grid-cols-2">
                  <TabsTrigger value="task">Task</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>

                <TabsContent value="task" className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="task_code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Task Code</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="task_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Task Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="discipline_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discipline</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select discipline" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {disciplineOptions?.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={String(option.value)}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="is_active"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Active</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="pt-4">
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddSequence}
                        className="flex items-center gap-2"
                      >
                        <PlusCircle className="h-4 w-4" /> Add Row
                      </Button>
                    </div>

                    <DataTable
                      columns={sequenceColumns}
                      data={sequences}
                      onEdit={handleEditSequence}
                      onDelete={handleDeleteSequence}
                    />

                    <div className="text-sm text-gray-600">
                      Total Rows Selected: {selectedRows.length}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/maintain/task-library")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Apply Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <ManageDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        title={editingDetail?.id ? "Edit Task Detail" : "Add New Task Detail"}
        formSchema={taskDetailSchema}
        defaultValues={
          editingDetail || {
            seq:
              sequences.length > 0
                ? Math.max(...sequences.map((s) => s.seq)) + 1
                : 1,
            task_list: "",
          }
        }
        formFields={taskDetailFormFields}
        onSubmit={handleSubmitDetail}
        isEdit={!!editingDetail?.id}
      />
    </div>
  );
};

export default TaskLibraryDetailPage;
