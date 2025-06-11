import React, { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Loading from "@/components/shared/Loading";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  usePmTaskDetailData,
  insertTaskDetailData,
  updateTaskDetailData,
  deleteTaskDetailData,
} from "../hooks/pm/use-pm-task-detail-data";
import PmTaskDetailDialogForm from "./PmTaskDetailDialogForm";

interface PmTaskDetailTabProps {
  pmWoId: number; // Passed as a prop to this page
}

const PmTaskDetailTab: React.FC<PmTaskDetailTabProps> = ({ pmWoId }) => {
  const { data: tasks, isLoading, refetch } = usePmTaskDetailData(pmWoId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const { toast } = useToast();

  const handleAddNew = () => {
    setEditingTask(null);
    setIsDialogOpen(true);
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleDeleteTask = async (task: any) => {
    try {
      await deleteTaskDetailData(task.id);
      toast({
        title: "Success",
        description: "Task deleted successfully!",
        variant: "default",
      });
      refetch();
    } catch (error) {
      console.error("Failed to delete task data:", error);
      toast({
        title: "Error",
        description: "Failed to delete task data.",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingTask) {
        await updateTaskDetailData(editingTask.id, formData);
        toast({
          title: "Success",
          description: "Task updated successfully!",
          variant: "default",
        });
      } else {
        await insertTaskDetailData({ ...formData, pm_wo_id: pmWoId });
        toast({
          title: "Success",
          description: "Task added successfully!",
          variant: "default",
        });
      }
      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error("Failed to save task data:", error);
      toast({
        title: "Error",
        description: "Failed to save task data.",
        variant: "destructive",
      });
    }
  };

  const columns: Column[] = [
    { id: "sequence", header: "Task Sequence", accessorKey: "sequence" },
    { id: "task_list", header: "Task List", accessorKey: "task_list" },
  ];

  return (
    <div className="space-y-6 mt-6">
      <PageHeader
        title="Task Details"
        onAddNew={handleAddNew}
        addNewLabel="New Task"
      />

      {isLoading ? (
        <Loading />
      ) : (
        <DataTable
          columns={columns}
          data={tasks || []}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between w-full">
              <div>
                <DialogTitle>{editingTask ? "Edit Task" : "Add New Task"}</DialogTitle>
                <DialogDescription>
                  {editingTask
                    ? "Update the details of the task."
                    : "Fill in the details to add a new task."}
                </DialogDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <PmTaskDetailDialogForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
            initialData={editingTask}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PmTaskDetailTab;