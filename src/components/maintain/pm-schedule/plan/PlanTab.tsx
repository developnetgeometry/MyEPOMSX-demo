import React, { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import {
  usePmSchedPlanLabourData,
  insertPmSchedPlanLabourData,
  updatePmSchedPlanLabourData,
  deletePmSchedPlanLabourData,
} from "../hooks/use-pm-sched-plan-labour-data";
import {
  usePmSchedPlanMaterialData,
  insertPmSchedPlanMaterialData,
  updatePmSchedPlanMaterialData,
  deletePmSchedPlanMaterialData,
} from "../hooks/use-pm-sched-plan-material-data";
import ActualLabourDialogForm from "@/components/work-orders/work-order-list/actual/ActualLabourDialogForm";
import ActualMaterialDialogForm from "@/components/work-orders/work-order-list/actual/ActualMaterialDialogForm";
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

interface PlanTabProps {
  pmScheduleId: number; // Passed as a prop to this page
  workCenterId: number; // WorkCenterId to fetch employee data
}

const PlanTab: React.FC<PlanTabProps> = ({ pmScheduleId, workCenterId }) => {
  const { data: labourData, isLoading: isLabourLoading, refetch: refetchLabour } =
    usePmSchedPlanLabourData(pmScheduleId);
  const { data: materialData, isLoading: isMaterialLoading, refetch: refetchMaterial } =
    usePmSchedPlanMaterialData(pmScheduleId);

  const [isLabourDialogOpen, setIsLabourDialogOpen] = useState(false);
  const [editingLabour, setEditingLabour] = useState<any | null>(null);

  const [isMaterialDialogOpen, setIsMaterialDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<any | null>(null);

  const { toast } = useToast();

  // Labour Handlers
  const handleAddNewLabour = () => {
    setEditingLabour(null);
    setIsLabourDialogOpen(true);
  };

  const handleEditLabour = (labour: any) => {
    setEditingLabour(labour);
    setIsLabourDialogOpen(true);
  };

  const handleDeleteLabour = async (labour: any) => {
    try {
      await deletePmSchedPlanLabourData(labour.id);
      toast({
        title: "Success",
        description: "Labour record deleted successfully!",
        variant: "default",
      });
      refetchLabour();
    } catch (error) {
      console.error("Failed to delete labour record:", error);
      toast({
        title: "Error",
        description: "Failed to delete labour record.",
        variant: "destructive",
      });
    }
  };

  const handleLabourFormSubmit = async (formData: any) => {
    try {
      if (editingLabour) {
        await updatePmSchedPlanLabourData(editingLabour.id, formData);
        toast({
          title: "Success",
          description: "Labour record updated successfully!",
          variant: "default",
        });
      } else {
        await insertPmSchedPlanLabourData({ ...formData, pm_schedule_id: pmScheduleId });
        toast({
          title: "Success",
          description: "Labour record added successfully!",
          variant: "default",
        });
      }
      setIsLabourDialogOpen(false);
      refetchLabour();
    } catch (error: any) {
      console.error("Failed to save labour record:", error);
      toast({
        title: "Error",
        description: "Failed to save labour record.",
        variant: "destructive",
      });
    }
  };

  // Material Handlers
  const handleAddNewMaterial = () => {
    setEditingMaterial(null);
    setIsMaterialDialogOpen(true);
  };

  const handleEditMaterial = (material: any) => {
    setEditingMaterial(material);
    setIsMaterialDialogOpen(true);
  };

  const handleDeleteMaterial = async (material: any) => {
    try {
      await deletePmSchedPlanMaterialData(material.id);
      toast({
        title: "Success",
        description: "Material record deleted successfully!",
        variant: "default",
      });
      refetchMaterial();
    } catch (error) {
      console.error("Failed to delete material record:", error);
      toast({
        title: "Error",
        description: "Failed to delete material record.",
        variant: "destructive",
      });
    }
  };

  const handleMaterialFormSubmit = async (formData: any) => {
    try {
      if (editingMaterial) {
        await updatePmSchedPlanMaterialData(editingMaterial.id, formData);
        toast({
          title: "Success",
          description: "Material record updated successfully!",
          variant: "default",
        });
      } else {
        await insertPmSchedPlanMaterialData({ ...formData, pm_schedule_id: pmScheduleId });
        toast({
          title: "Success",
          description: "Material record added successfully!",
          variant: "default",
        });
      }
      setIsMaterialDialogOpen(false);
      refetchMaterial();
    } catch (error: any) {
      console.error("Failed to save material record:", error);
      toast({
        title: "Error",
        description: "Failed to save material record.",
        variant: "destructive",
      });
    }
  };

  const labourColumns: Column[] = [
    { id: "employee_uid", header: "Employee ID", accessorKey: "employee_id.uid_employee" },
    { id: "employee_name", header: "Employee", accessorKey: "employee_id.name" },
    { id: "duration", header: "Duration", accessorKey: "duration" },
  ];

  const materialColumns: Column[] = [
    { id: "item_no", header: "Code", accessorKey: "item_id.item_no" },
    { id: "item_name", header: "Item", accessorKey: "item_id.item_name" },
    { id: "quantity", header: "Quantity", accessorKey: "quantity" },
  ];

  return (
    <div className="space-y-6 mt-6">
      <PageHeader
        title="Planned Labour Details"
        onAddNew={handleAddNewLabour}
        addNewLabel="New Labour"
      />

      {isLabourLoading ? (
        <Loading />
      ) : (
        <DataTable
          columns={labourColumns}
          data={labourData || []}
          onEdit={handleEditLabour}
          onDelete={handleDeleteLabour}
        />
      )}

      <PageHeader
        title="Planned Material Details"
        onAddNew={handleAddNewMaterial}
        addNewLabel="New Material"
      />

      {isMaterialLoading ? (
        <Loading />
      ) : (
        <DataTable
          columns={materialColumns}
          data={materialData || []}
          onEdit={handleEditMaterial}
          onDelete={handleDeleteMaterial}
        />
      )}

      <Dialog open={isLabourDialogOpen} onOpenChange={setIsLabourDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between w-full">
              <div>
                <DialogTitle>{editingLabour ? "Edit Labour" : "Add New Labour"}</DialogTitle>
                <DialogDescription>
                  {editingLabour
                    ? "Update the details of the labour record."
                    : "Fill in the details to add a new labour record."}
                </DialogDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsLabourDialogOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <ActualLabourDialogForm
            onSubmit={handleLabourFormSubmit}
            onCancel={() => setIsLabourDialogOpen(false)}
            initialData={editingLabour}
            workCenterId={workCenterId}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isMaterialDialogOpen} onOpenChange={setIsMaterialDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between w-full">
              <div>
                <DialogTitle>{editingMaterial ? "Edit Material" : "Add New Material"}</DialogTitle>
                <DialogDescription>
                  {editingMaterial
                    ? "Update the details of the material record."
                    : "Fill in the details to add a new material record."}
                </DialogDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsMaterialDialogOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <ActualMaterialDialogForm
            onSubmit={handleMaterialFormSubmit}
            onCancel={() => setIsMaterialDialogOpen(false)}
            initialData={editingMaterial}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlanTab;