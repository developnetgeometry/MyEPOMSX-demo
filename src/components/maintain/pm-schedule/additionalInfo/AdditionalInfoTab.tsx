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
  usePmSchedAdditionalInfoData,
  insertPmSchedAdditionalInfoData,
  updatePmSchedAdditionalInfoData,
  deletePmSchedAdditionalInfoData,
} from "../hooks/use-pm-sched-additional-info-data";
import PmAdditionalInfoDialogForm from "@/components/work-orders/work-order-list/additionalInfo/PmAdditionalInfoDialogForm";

interface AdditionalInfoTabProps {
  pmScheduleId: number; // Passed as a prop to this page
}

const AdditionalInfoTab: React.FC<AdditionalInfoTabProps> = ({ pmScheduleId }) => {
  const { data: additionalInfo, isLoading, refetch } = usePmSchedAdditionalInfoData(pmScheduleId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInfo, setEditingInfo] = useState<any | null>(null);
  const { toast } = useToast();

  const handleAddNew = () => {
    setEditingInfo(null);
    setIsDialogOpen(true);
  };

  const handleEditInfo = (info: any) => {
    setEditingInfo(info);
    setIsDialogOpen(true);
  };

  const handleDeleteInfo = async (info: any) => {
    try {
      await deletePmSchedAdditionalInfoData(info.id);
      toast({
        title: "Success",
        description: "Additional info deleted successfully!",
        variant: "default",
      });
      refetch();
    } catch (error) {
      console.error("Failed to delete additional info data:", error);
      toast({
        title: "Error",
        description: "Failed to delete additional info data.",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (formData: { description: string }) => {
    try {
      if (editingInfo) {
        await updatePmSchedAdditionalInfoData(editingInfo.id, formData);
        toast({
          title: "Success",
          description: "Additional info updated successfully!",
          variant: "default",
        });
      } else {
        await insertPmSchedAdditionalInfoData({ ...formData, pm_schedule_id: pmScheduleId });
        toast({
          title: "Success",
          description: "Additional info added successfully!",
          variant: "default",
        });
      }
      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error("Failed to save additional info data:", error);
      toast({
        title: "Error",
        description: "Failed to save additional info data.",
        variant: "destructive",
      });
    }
  };

  const columns: Column[] = [
    { id: "description", header: "Description", accessorKey: "description" },
  ];

  return (
    <div className="space-y-6 mt-6">
      <PageHeader
        title="Additional Information"
        onAddNew={handleAddNew}
        addNewLabel="New Info"
      />

      {isLoading ? (
        <Loading />
      ) : (
        <DataTable
          columns={columns}
          data={additionalInfo || []}
          onEdit={handleEditInfo}
          onDelete={handleDeleteInfo}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between w-full">
              <div>
                <DialogTitle>
                  {editingInfo ? "Edit Additional Info" : "Add New Additional Info"}
                </DialogTitle>
                <DialogDescription>
                  {editingInfo
                    ? "Update the details of the additional info."
                    : "Fill in the details to add new additional info."}
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

          <PmAdditionalInfoDialogForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
            initialData={editingInfo}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdditionalInfoTab;