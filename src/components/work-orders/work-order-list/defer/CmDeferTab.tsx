import React, { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import {
  useCmDeferData,
  insertCmDeferData,
  updateCmDeferData,
  deleteCmDeferData,
} from "../hooks/cm/use-cm-defer-data";
import DeferDialogForm from "./DeferDialogForm";
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
import { formatDate } from "@/utils/formatters";


interface CmDeferTabProps {
  cmGeneralId: number; // Passed as a prop to this page
}

const CmDeferTab: React.FC<CmDeferTabProps> = ({ cmGeneralId }) => {
  const { data: defers, isLoading, refetch } = useCmDeferData(cmGeneralId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDefer, setEditingDefer] = useState<any | null>(null);
  const { toast } = useToast();

  const handleAddNew = () => {
    setEditingDefer(null);
    setIsDialogOpen(true);
  };

  const handleEditDefer = (defer: any) => {
    setEditingDefer(defer);
    setIsDialogOpen(true);
  };

  const handleDeleteDefer = async (defer: any) => {
    try {
      await deleteCmDeferData(defer.id);
      toast({
        title: "Success",
        description: "Defer deleted successfully!",
        variant: "default",
      });
      refetch();
    } catch (error) {
      console.error("Failed to delete defer:", error);
      toast({
        title: "Error",
        description: "Failed to delete defer.",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingDefer) {
        await updateCmDeferData(editingDefer.id, formData);
        toast({
          title: "Success",
          description: "Defer updated successfully!",
          variant: "default",
        });
      } else {
        await insertCmDeferData({ ...formData, cm_general_id: cmGeneralId });
        toast({
          title: "Success",
          description: "Defer added successfully!",
          variant: "default",
        });
      }
      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error("Failed to save defer:", error);
      toast({
        title: "Error",
        description: "Failed to save defer.",
        variant: "destructive",
      });
    }
  };

  const columns: Column[] = [
    { id: "previous_due_date", header: "Previous Due Date", accessorKey: "previous_due_date", cell: (value: any) => formatDate(value) },
    { id: "new_due_date", header: "New Due Date", accessorKey: "new_due_date", cell: (value: any) => formatDate(value) },
    { id: "remarks", header: "Remarks", accessorKey: "remarks" },
    {
      id: "requested_by",
      header: "Requested By",
      accessorKey: "requested_by.full_name",
    },
  ];

  return (
    <div className="space-y-6 mt-6">
      <PageHeader
        title="Defers"
        onAddNew={handleAddNew}
        addNewLabel="New Defer"
      />

      {isLoading ? (
        <Loading />
      ) : (
        <DataTable
          columns={columns}
          data={defers || []}
          onEdit={handleEditDefer}
          onDelete={handleDeleteDefer}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between w-full">
              <div>
                <DialogTitle>{editingDefer ? "Edit Defer" : "Add New Defer"}</DialogTitle>
                <DialogDescription>
                  {editingDefer
                    ? "Update the details of the defer."
                    : "Fill in the details to add a new defer."}
                </DialogDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <DeferDialogForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
            initialData={editingDefer}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CmDeferTab;