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
  Trash,
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
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();


const { data: disciplineOptions = [], isLoading: isLoadingDiscipline } = useDisciplineOptions();


// Define form schema for validation
const taskFormSchema = z.object({
  taskCode: z.string().min(1, "Task code is required"),
  taskName: z.string().min(1, "Task name is required"),
  discipline: z.string().min(1, "Discipline is required"),
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

  // Filter tasks based on search term
  const filteredTasks = tasks?.filter(task => 
    task.task_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.task_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.discipline?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
          <Input 
            placeholder="Search tasks..." 
            className="pl-9 w-full" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleAddNew} className="whitespace-nowrap">
            <Plus className="mr-2 h-4 w-4" />
            Create New Task
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
            Task Templates
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center">
            <Check className="mr-2 h-4 w-4" />
            Active Tasks
          </TabsTrigger>
          <TabsTrigger value="archived" className="flex items-center">
            <X className="mr-2 h-4 w-4" />
            Archived
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-0">
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                    Task Code
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                    Task Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                    Discipline
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.map((task) => (
                  <tr 
                    key={task.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(task)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{task.task_code}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{task.task_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{task.discipline?.name || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        task.is_active 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {task.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.updated_at ? new Date(task.updated_at).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {/* <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(task);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button> */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicate(task);
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(String(task.id));
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredTasks.length === 0 && (
              <div className="text-center py-10">
                <div className="text-gray-500">No tasks found</div>
                {searchTerm && (
                  <Button 
                    variant="ghost" 
                    className="mt-2"
                    onClick={() => setSearchTerm("")}
                  >
                    Clear search
                  </Button>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="active" className="mt-0">
          <div className="text-center py-10 text-gray-500">
            No active tasks found.
          </div>
        </TabsContent>

        <TabsContent value="archived" className="mt-0">
          <div className="text-center py-10 text-gray-500">
            No archived tasks found.
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
            is_active: String(currentTask.is_active)
          }
          :
          {
          taskCode: "",
          taskName: "",
          discipline: "1",
          is_active: "true",
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