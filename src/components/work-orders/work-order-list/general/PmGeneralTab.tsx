import React, { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import {
  usePmWorkOrderDataById,
  updatePmWorkOrderData,
} from "../hooks/pm/use-pm-work-order-data";
import PmGeneralDialogForm from "./PmGeneralDialogForm";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PmGeneralTabProps {
  pmWoId: number; // Passed as a prop to this page
}

const PmGeneralTab: React.FC<PmGeneralTabProps> = ({ pmWoId }) => {
  const { data: pmWorkOrder, isLoading, refetch } = usePmWorkOrderDataById(pmWoId);
  console.log(pmWorkOrder);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleEditClick = () => {
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      await updatePmWorkOrderData(pmWoId, formData);
      toast({
        title: "Success",
        description: "PM Work Order updated successfully!",
        variant: "default",
      });
      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error("Failed to update PM Work Order data:", error);
      toast({
        title: "Error",
        description: "Failed to update PM Work Order data.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 mt-6">
      <PageHeader title="PM Work Order" />
      {isLoading ? (
        <Loading />
      ) : (
        <div className="space-y-4">
          <div className="border rounded-lg p-4 shadow-sm bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700">Maintenance Type</Label>
                <Input
                  className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={pmWorkOrder.maintenance_id?.name ?? "N/A"}
                  readOnly
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">Due Date</Label>
                <Input
                  className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={
                    pmWorkOrder.due_date
                      ? new Date(pmWorkOrder.due_date).toLocaleDateString("en-GB").replace(/\//g, "-")
                      : "N/A"
                  }
                  readOnly
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">Priority</Label>
                <Input
                  className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={pmWorkOrder.priority_id?.name ?? "N/A"}
                  readOnly
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">Work Center</Label>
                <Input
                  className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={pmWorkOrder.work_center_id?.name ?? "N/A"}
                  readOnly
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">Facility</Label>
                <Input
                  className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={pmWorkOrder.facility_id?.location_name ?? "N/A"}
                  readOnly
                />
              </div>
                <div className="md:col-span-2">
                <Label className="block text-sm font-medium text-gray-700">PM Description</Label>
                <Textarea
                  className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={pmWorkOrder.pm_description ?? "N/A"}
                  readOnly
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" size="sm" onClick={handleEditClick}>
                Edit
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between w-full">
              <div>
                <DialogTitle>Edit PM Work Order</DialogTitle>
                <DialogDescription>Update the details of PM Work Order.</DialogDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <PmGeneralDialogForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
            initialData={pmWorkOrder}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PmGeneralTab;