import React, { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import {
  deletePmChecksheetData,
  insertPmChecksheetData,
  updatePmChecksheetData,
  usePmChecksheetData,
} from "../hooks/pm/use-pm-checksheet-data";
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
import AttachmentDialogForm from "../../work-request/attachment/AttachmentDialogForm";

interface PmChecksheetTabProps {
  pmWoId: number; // Passed as a prop to this page
}

const PmChecksheetTab: React.FC<PmChecksheetTabProps> = ({ pmWoId }) => {
  const { data: checksheets, isLoading, refetch } = usePmChecksheetData(pmWoId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingChecksheet, setEditingChecksheet] = useState<any | null>(null);
  const { toast } = useToast();

  const handleAddNew = () => {
    setEditingChecksheet(null);
    setIsDialogOpen(true);
  };

  const handleEditChecksheet = (checksheet: any) => {
    setEditingChecksheet(checksheet);
    setIsDialogOpen(true);
  };

  const handleDeleteChecksheet = async (checksheet: any) => {
    try {
      await deletePmChecksheetData(checksheet.id);
      toast({
        title: "Success",
        description: "Checksheet deleted successfully!",
        variant: "default",
      });
      refetch();
    } catch (error) {
      console.error("Failed to delete checksheet data:", error);
      toast({
        title: "Error",
        description: "Failed to delete checksheet data.",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (formData: { file: File; description?: string }) => {
    try {
      if (editingChecksheet) {
        await updatePmChecksheetData(editingChecksheet.id, {
          description: formData.description,
        });
        toast({
          title: "Success",
          description: "Checksheet updated successfully!",
          variant: "default",
        });
      } else {
        await insertPmChecksheetData({
          file: formData.file,
          description: formData.description,
          pm_wo_id: pmWoId,
        });
        toast({
          title: "Success",
          description: "Checksheet added successfully!",
          variant: "default",
        });
      }
      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error("Failed to save checksheet data:", error);
      toast({
        title: "Error",
        description: "Failed to save checksheet data.",
        variant: "destructive",
      });
    }
  };

  const columns: Column[] = [
    { id: "file_path", header: "File", accessorKey: "file_path", cell: (value) => <a href={value} target="_blank" rel="noopener noreferrer">View</a> },
    { id: "description", header: "Description", accessorKey: "description" },
  ];

  return (
    <div className="space-y-6 mt-6">
      <PageHeader
        title="Checksheet"
        onAddNew={handleAddNew}
        addNewLabel="New Checksheet"
      />

      {isLoading ? (
        <Loading />
      ) : (
        <DataTable
          columns={columns}
          data={checksheets || []}
          onEdit={handleEditChecksheet}
          onDelete={handleDeleteChecksheet}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between w-full">
              <div>
                <DialogTitle>
                  {editingChecksheet ? "Edit Checksheet" : "Add New Checksheet"}
                </DialogTitle>
                <DialogDescription>
                  {editingChecksheet
                    ? "Update the details of the checksheet."
                    : "Fill in the details to add a new checksheet."}
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

          <AttachmentDialogForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
            initialData={editingChecksheet}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PmChecksheetTab;