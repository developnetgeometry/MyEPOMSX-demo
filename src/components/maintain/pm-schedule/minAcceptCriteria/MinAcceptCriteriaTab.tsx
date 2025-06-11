import React, { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import {
  usePmSchedMinAcceptCriteriaData,
  insertPmSchedMinAcceptCriteriaData,
  updatePmSchedMinAcceptCriteriaData,
  deletePmSchedMinAcceptCriteriaData,
} from "../hooks/use-pm-sched-min-accept-criteria-data";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import PmMinAcceptCriteriaDialogForm from "@/components/work-orders/work-order-list/minAcceptCriteria/PmMinAcceptCriteriaDialogForm";

interface MinAcceptCriteriaTabProps {
  pmScheduleId: number; // Passed as a prop to this page
}

const MinAcceptCriteriaTab: React.FC<MinAcceptCriteriaTabProps> = ({ pmScheduleId }) => {
  const { data: criteriaList, isLoading, refetch } = usePmSchedMinAcceptCriteriaData(pmScheduleId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState<any | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [criteriaToDelete, setCriteriaToDelete] = useState<any | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const { toast } = useToast();

  const handleAddNew = () => {
    setEditingCriteria(null);
    setIsDialogOpen(true);
  };

  const handleEditCriteria = (criteria: any) => {
    setEditingCriteria(criteria);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (criteria: any) => {
    setCriteriaToDelete(criteria);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (criteriaToDelete) {
      setIsDeleteLoading(true);
      try {
        await deletePmSchedMinAcceptCriteriaData(criteriaToDelete.id);
        toast({
          title: "Success",
          description: "Criteria deleted successfully!",
          variant: "default",
        });
        refetch();
      } catch (error) {
        console.error("Failed to delete criteria data:", error);
        toast({
          title: "Error",
          description: "Failed to delete criteria data.",
          variant: "destructive",
        });
      } finally {
        setIsDeleteLoading(false);
        setDeleteDialogOpen(false);
        setCriteriaToDelete(null);
      }
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingCriteria) {
        await updatePmSchedMinAcceptCriteriaData(editingCriteria.id, formData);
        toast({
          title: "Success",
          description: "Criteria updated successfully!",
          variant: "default",
        });
      } else {
        await insertPmSchedMinAcceptCriteriaData({ ...formData, pm_schedule_id: pmScheduleId });
        toast({
          title: "Success",
          description: "Criteria added successfully!",
          variant: "default",
        });
      }
      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error("Failed to save criteria data:", error);
      toast({
        title: "Error",
        description: "Failed to save criteria data.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 mt-6">
      {(criteriaList &&
        <PageHeader
          title="Minimum Acceptance Criteria"
          onAddNew={criteriaList?.length >= 1 ? null : handleAddNew}
          addNewLabel="New Criteria"
        />
      )}
      {isLoading ? (
        <Loading />
      ) : (
        <div className="space-y-4">
          {criteriaList?.length === 0 ? (
            <p className="text-center text-gray-500">No criteria available</p>
          ) : (
            criteriaList?.map((criteria: any) => (
              <div
                key={criteria?.id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-md font-semibold mb-2">Criteria</h5>
                    <p>{criteria?.criteria || "-"}</p>
                  </div>
                  <div>
                    <h5 className="text-md font-semibold mb-2">Field Name</h5>
                    <p>{criteria?.field_name || "-"}</p>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCriteria(criteria)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(criteria)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between w-full">
              <div>
                <DialogTitle>
                  {editingCriteria ? "Edit Criteria" : "Add New Criteria"}
                </DialogTitle>
                <DialogDescription>
                  {editingCriteria
                    ? "Update the details of the criteria."
                    : "Fill in the details to add a new criteria."}
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

          <PmMinAcceptCriteriaDialogForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
            initialData={editingCriteria}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground"
              disabled={isDeleteLoading}
            >
              {isDeleteLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
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

export default MinAcceptCriteriaTab;