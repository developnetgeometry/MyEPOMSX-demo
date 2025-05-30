import React, { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import {
  useNewWorkFailureData,
  insertNewWorkFailureData,
  updateNewWorkFailureData,
  deleteNewWorkFailureData,
} from "@/components/work-orders/work-request/hooks/use-new-work-failure-data";
import FailureDialogForm from "./FailureDialogForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Loading from "@/components/shared/Loading";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
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

interface FailureTabProps {
  workRequestId: number;
}

const FailureTab: React.FC<FailureTabProps> = ({ workRequestId }) => {
  const { data: failures, isLoading, refetch } = useNewWorkFailureData(workRequestId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFailure, setEditingFailure] = useState<any | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [failureToDelete, setFailureToDelete] = useState<any | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const { toast } = useToast();

  const handleAddNew = () => {
    setEditingFailure(null);
    setIsDialogOpen(true);
  };

  const handleEditFailure = (failure: any) => {
    setEditingFailure(failure);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (failure: any) => {
    setFailureToDelete(failure);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (failureToDelete) {
      setIsDeleteLoading(true);
      try {
        await deleteNewWorkFailureData(failureToDelete.id);
        toast({
          title: "Success",
          description: "Failure record deleted successfully!",
          variant: "default",
        });
        refetch();
      } catch (error) {
        console.error("Failed to delete failure data:", error);
        toast({
          title: "Error",
          description: "Failed to delete failure data.",
          variant: "destructive",
        });
      } finally {
        setIsDeleteLoading(false);
        setDeleteDialogOpen(false);
        setFailureToDelete(null);
      }
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingFailure) {
        await updateNewWorkFailureData(editingFailure.id, formData);
        toast({
          title: "Success",
          description: "Failure record updated successfully!",
          variant: "default",
        });
      } else {
        await insertNewWorkFailureData({ ...formData, work_request_id: workRequestId });
        toast({
          title: "Success",
          description: "Failure record added successfully!",
          variant: "default",
        });
      }
      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error("Failed to save failure data:", error);
      toast({
        title: "Error",
        description: "Failed to save failure data.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 mt-6">
      <PageHeader
        title="Failure Impact Section"
        onAddNew={failures?.length >= 1 ? null : handleAddNew}
        addNewLabel="Add New Failure"
      />

      {isLoading ? (
        <Loading />
      ) : (
        <div className="space-y-4">
          {failures?.length === 0 ? (
            <p className="text-center text-gray-500">No failure records available</p>
          ) : (
            failures?.map((failure: any) => (
              <div
                key={failure?.id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <div className="flex gap-6 flex-wrap md:flex-nowrap">
                  {/* Failure Details */}
                  <div className="w-full md:w-1/2">
                    <h5 className="text-md font-semibold mb-2 text-xl">Failure Details</h5>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="font-medium text-gray-600">Safety</div>
                      <div className="text-gray-800">{failure?.safety?.trim() ? failure.safety : "-"}</div>

                      <div className="font-medium text-gray-600">Likelihood</div>
                      <div className="text-gray-800">{failure?.like_hood?.trim() ? failure.like_hood : "-"}</div>

                      <div className="font-medium text-gray-600">Action Taken</div>
                      <div className="text-gray-800">{failure?.action_taken?.trim() ? failure.action_taken : "-"}</div>

                      <div className="font-medium text-gray-600">Critical Rank</div>
                      <div className="text-gray-800">{failure?.critical_rank?.trim() ? failure.critical_rank : "-"}</div>

                      <div className="font-medium text-gray-600">Probability of Occurrence</div>
                      <div className="text-gray-800">{failure?.provability_occurrance?.trim() ? failure.provability_occurrance : "-"}</div>

                      <div className="font-medium text-gray-600">Environmental Consequences</div>
                      <div className="text-gray-800">{failure?.environment_consequences?.trim() ? failure.environment_consequences : "-"}</div>

                      <div className="font-medium text-gray-600">Has Consequence</div>
                      <div className="text-gray-800">{failure?.has_consequence?.trim() ? failure.has_consequence : "-"}</div>

                      <div className="font-medium text-gray-600">Corrective Action</div>
                      <div className="text-gray-800">{failure?.corrective_action?.trim() ? failure.corrective_action : "-"}</div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="w-full md:w-1/2">
                    <h5 className="text-md font-semibold mb-2 text-xl">Additional Details</h5>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="font-medium text-gray-600">Priority</div>
                      <div className="text-gray-800">{failure?.failure_priority_id?.name?.trim() ? failure.failure_priority_id.name : "-"}</div>

                      <div className="font-medium text-gray-600">Lost Time Incident</div>
                      <div className="text-gray-800">{failure?.lost_time_incident ? "Yes" : "No"}</div>

                      <div className="font-medium text-gray-600">Failure Shutdown</div>
                      <div className="text-gray-800">{failure?.failure_shutdown ? "Yes" : "No"}</div>

                      <div className="font-medium text-gray-600">Failure Type</div>
                      <div className="text-gray-800">{failure?.failure_type_id?.name?.trim() ? failure.failure_type_id.name : "-"}</div>
                    </div>
                  </div>

                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditFailure(failure)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(failure)}
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
                <DialogTitle>{editingFailure ? "Edit Failure" : "Add New Failure"}</DialogTitle>
                <DialogDescription>
                  {editingFailure
                    ? "Update the details of the failure."
                    : "Fill in the details to add a new failure."}
                </DialogDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <FailureDialogForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
            initialData={editingFailure}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this failure record.
            </AlertDialogDescription>
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

export default FailureTab;