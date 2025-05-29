import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Check,
  List,
  Plus,
  Pencil,
  X,
  Search,
  Copy,
  Loader2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
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
import { createTaskDTO, Task } from "@/types/maintain";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, useDisciplineOptions } from "@/hooks/queries/useTasks";
import ManageDialog from "@/components/manage/ManageDialog";
import * as z from "zod";


const TaskLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: tasks, isLoading, error } = useTasks();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState("templates");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const { toast } = useToast();


const { data: disciplineOptions = [], isLoading: isLoadingDiscipline } = useDisciplineOptions();


// Define form schema for validation
const taskFormSchema = z.object({
  taskCode: z.string().min(1, "Task code is required"),
  taskName: z.string().min(1, "Task name is required"),
  discipline: z.string().min(1, "Discipline is required"),
  // counter: z.number().min(0, "Counter must be positive"),
  // noManPower: z.number().min(0, "Man power must be positive"),
  // manHour: z.number().min(0, "Man hour must be positive"),
  // totalHourRequire: z.number().min(0, "Total hours must be positive"),
  is_active: z.string(),
});

// Define form fields configuration
const taskFormFields = [
  {
    name: "taskCode",
    label: "Task Code",
    type: "text" as const,
    required: true,
    section: "main" as const,
  },
  // {
  //   name: "counter",
  //   label: "Counter",
  //   type: "number" as const,
  //   required: true,
  //   section: "main" as const,
  //   width: "half" as const,
  // },
  {
    name: "taskName",
    label: "Task Name",
    type: "text" as const,
    required: true,
    section: "main" as const,
  },
  {
    name: "discipline",
    label: "Discipline",
    type: "select" as const,
    required: true,
    options: isLoadingDiscipline 
    ? [] 
    : disciplineOptions?.map((option) => ({
        value: String(option.value),
        label: option.label,
      })) || [],
    section: "main" as const,
  },
  // {
  //   name: "noManPower",
  //   label: "No Man Power",
  //   type: "number" as const,
  //   required: true,
  //   section: "main" as const,
  //   width: "half" as const,
  // },
  // {
  //   name: "manHour",
  //   label: "Man Hour",
  //   type: "number" as const,
  //   required: true,
  //   section: "main" as const,
  //   width: "half" as const,
  // },
  // {
  //   name: "totalHourRequire",
  //   label: "Total Hour Require",
  //   type: "number" as const,
  //   required: true,
  //   section: "main" as const,
  // },
  {
    name: "is_active",
    label: "Active",
    type: "select" as const,
    section: "main" as const,
    options: [
      { value: "true", label: "Active" },
      { value: "false", label: "Inactive" },
    ],
  },
];

  const handleAddNew = () => {
    setIsEditMode(false);
    setCurrentTask(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (task: Task) => {
    setIsEditMode(true);
    setCurrentTask(task);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (values: z.infer<typeof taskFormSchema>) => {
    try {
      if (isEditMode && currentTask) {
        await updateTaskMutation.mutateAsync({ 
            id: currentTask.id,
            task_code: values.taskCode,
            task_name: values.taskName,
            discipline_id: Number(values.discipline),
            is_active: Boolean(values.is_active),
            updated_at: new Date(),
         });
        toast({
          title: "Success",
          description: "Task updated successfully",
          variant: "default",
        });
      } else {
        await createTaskMutation.mutateAsync({
          task_code: values.taskCode,
          task_name: values.taskName,
          discipline_id: Number(values.discipline),
          is_active: Boolean(values.is_active),
          created_at: new Date(),
          updated_at: new Date(),
        } as createTaskDTO);
        toast({
          title: "Success",
          description: "Task created successfully",
          variant: "default",
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleRowClick = (task: Task) => {
    navigate(`/maintain/task-library/${task.id}`);
  };

  const handleDuplicate = async (task: Task) => {
    try {
      const newTask = {
        id: undefined,
        task_code: `COPY-${task.task_code}`,
        task_name: task.task_name,
        discipline_id: task.discipline_id,
        is_active: task.is_active,
      };
      await createTaskMutation.mutateAsync(newTask);
      toast({
        title: "Success",
        description: "Task duplicated successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to duplicate task",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTaskMutation.mutateAsync(Number(taskToDelete));
      toast({
        title: "Success",
        description: "Task deleted successfully",
        variant: "default",
      });
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const renderTaskCard = (task: Task) => (
    <Card
      key={task.id}
      className="w-full hover:shadow-md transition-shadow duration-300 cursor-pointer"
      onClick={() => handleRowClick(task)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-gray-500 mb-1">
              {task.discipline.name}
            </div>
            <CardTitle className="text-lg font-medium">
              {task.task_name}
            </CardTitle>
          </div>
          <div className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded">
            {task.task_code}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-gray-400">
          Last updated: {new Date(task.updated_at || "").toLocaleDateString()}
        </div>
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-gray-600 hover:text-gray-900"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(task);
            }}
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-gray-600 hover:text-gray-900"
              onClick={(e) => {
                e.stopPropagation();
                handleDuplicate(task);
              }}
            >
              <Copy className="h-4 w-4 mr-1" />
              Duplicate
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-red-600 hover:text-red-800 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                confirmDelete(String(task.id));
              }}
            >
              <X className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="mr-2 animate-spin" /> Loading...
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Task Library</h1>
        <p className="text-muted-foreground">
          Standard procedures and inspection checklists
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search checklists..." className="pl-9 w-full" />
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleAddNew} className="whitespace-nowrap">
            <Plus className="mr-2 h-4 w-4" />
            Create Tasklist
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="templates"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="templates" className="flex items-center">
            <List className="mr-2 h-4 w-4" />
            Checklist Templates
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center">
            <Check className="mr-2 h-4 w-4" />
            Active Checklists
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center">
            <Check className="mr-2 h-4 w-4" />
            Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks?.map((task) => (
              <div key={task.id}>
                {renderTaskCard(task)}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="mt-0">
          <div className="text-center py-10 text-gray-500">
            No active checklists found.
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
          <div className="text-center py-10 text-gray-500">
            No completed checklists found.
          </div>
        </TabsContent>
      </Tabs>

      <ManageDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={isEditMode ? "Edit Task" : "Create New Task"}
        formSchema={taskFormSchema}
        defaultValues={isEditMode && currentTask
          ? {
            taskCode: currentTask.task_code,
            taskName: currentTask.task_name,
            discipline: String(currentTask.discipline_id),
            is_active: String(currentTask.is_active,)
          }
          :
          {
          taskCode: "",
          taskName: "",
          discipline: "1",
          is_active: undefined,
        }}
        formFields={taskFormFields}
        onSubmit={handleSubmit}
        isEdit={isEditMode}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              selected task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TaskLibraryPage;