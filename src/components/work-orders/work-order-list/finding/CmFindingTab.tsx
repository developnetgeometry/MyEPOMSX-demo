import React, { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import {
  useCmFindingData,
  insertCmFindingData,
  updateCmFindingData,
  deleteCmFindingData,
} from "../hooks/use-cm-finding-data";
import CmFindingDialogForm from "./CmFindingDialogForm";
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

interface CmFindingTabProps {
  cmGeneralId: number; // Passed as a prop to this page
}

const CmFindingTab: React.FC<CmFindingTabProps> = ({ cmGeneralId }) => {
  const { data: findings, isLoading, refetch } = useCmFindingData(cmGeneralId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFinding, setEditingFinding] = useState<any | null>(null);
  const { toast } = useToast();

  const handleAddNew = () => {
    setEditingFinding(null);
    setIsDialogOpen(true);
  };

  const handleEditFinding = (finding: any) => {
    setEditingFinding(finding);
    setIsDialogOpen(true);
  };

  const handleDeleteFinding = async (finding: any) => {
    try {
      await deleteCmFindingData(finding.id);
      toast({
        title: "Success",
        description: "Finding deleted successfully!",
        variant: "default",
      });
      refetch();
    } catch (error) {
      console.error("Failed to delete finding:", error);
      toast({
        title: "Error",
        description: "Failed to delete finding.",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingFinding) {
        await updateCmFindingData(editingFinding.id, formData);
        toast({
          title: "Success",
          description: "Finding updated successfully!",
          variant: "default",
        });
      } else {
        await insertCmFindingData({ ...formData, cm_general_id: cmGeneralId });
        toast({
          title: "Success",
          description: "Finding added successfully!",
          variant: "default",
        });
      }
      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error("Failed to save finding:", error);
      toast({
        title: "Error",
        description: "Failed to save finding.",
        variant: "destructive",
      });
    }
  };

  const columns: Column[] = [
    { id: "wo_finding_failure", header: "Finding", accessorKey: "wo_finding_failure" },
    { id: "action_taken", header: "Action Taken", accessorKey: "action_taken" },
    { id: "corrective_action", header: "Corrective Action", accessorKey: "corrective_action" },
  ];

  return (
    <div className="space-y-6 mt-6">
      <PageHeader
        title="Findings"
        onAddNew={handleAddNew}
        addNewLabel="New Finding"
      />

      {isLoading ? (
        <Loading />
      ) : (
        <DataTable
          columns={columns}
          data={findings || []}
          onEdit={handleEditFinding}
          onDelete={handleDeleteFinding}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between w-full">
              <div>
                <DialogTitle>{editingFinding ? "Edit Finding" : "Add New Finding"}</DialogTitle>
                <DialogDescription>
                  {editingFinding
                    ? "Update the details of the finding."
                    : "Fill in the details to add a new finding."}
                </DialogDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <CmFindingDialogForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
            initialData={editingFinding}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CmFindingTab;