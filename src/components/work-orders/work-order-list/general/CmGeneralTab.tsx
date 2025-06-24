import React, { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import {
  useCmGeneralDataById,
  updateCmGeneralData,
} from "../hooks/cm/use-cm-general-data";
import CmGeneralDialogForm from "./CmGeneralDialogForm";
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

interface CmGeneralTabProps {
  cmGeneralId: number; // Passed as a prop to this page
}

const CmGeneralTab: React.FC<CmGeneralTabProps> = ({ cmGeneralId }) => {
  const { data: cmGeneral, isLoading, refetch } = useCmGeneralDataById(cmGeneralId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleEditClick = () => {
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      await updateCmGeneralData(cmGeneralId, formData);
      toast({
        title: "Success",
        description: "CM General updated successfully!",
        variant: "default",
      });
      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error("Failed to update CM General data:", error);
      toast({
        title: "Error",
        description: "Failed to update CM General data.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 mt-6">
      <PageHeader title="CM General" />
      {isLoading ? (
        <Loading />
      ) : (
        <div className="space-y-4">
          <div className="border rounded-lg p-4 shadow-sm bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700">Priority</Label>
                <Input
                  className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={cmGeneral.priority_id?.name ?? "N/A"}
                  readOnly
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">Facility</Label>
                <Input
                  className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={cmGeneral.facility_id?.location_name ?? "N/A"}
                  readOnly
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">System</Label>
                <Input
                  className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={cmGeneral.system_id?.system_name ?? "N/A"}
                  readOnly
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">Package</Label>
                <Input
                  className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={cmGeneral.package_id?.package_name ?? "N/A"}
                  readOnly
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">Asset</Label>
                <Input
                  className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={cmGeneral.asset_id?.asset_name ?? "N/A"}
                  readOnly
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">Due Date</Label>
                <Input
                  className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={
                    cmGeneral.due_date
                      ? new Date(cmGeneral.due_date).toLocaleDateString("en-GB").replace(/\//g, "-")
                      : "N/A"
                  }
                  readOnly
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">Downtime (hour/s)</Label>
                <Input
                  className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={cmGeneral.downtime?.toFixed(1) ?? "N/A"}
                  readOnly
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">Date Finding</Label>
                <Input
                  className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={cmGeneral.date_finding ?? "N/A"}
                  readOnly
                />
              </div>
            </div>
            <div className="md:col-span-2 mt-4">
              <Label className="block text-sm font-medium text-gray-700">CM SCE Code</Label>
              <Input
                className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={
                  cmGeneral.cm_sce_code
                    ? `${cmGeneral.cm_sce_code.cm_sce_code} - ${cmGeneral.cm_sce_code.cm_group_name}`
                    : "N/A"
                }
                readOnly
              />
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
                <DialogTitle>Edit CM General</DialogTitle>
                <DialogDescription>Update the details of CM General.</DialogDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <CmGeneralDialogForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
            initialData={cmGeneral}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CmGeneralTab;