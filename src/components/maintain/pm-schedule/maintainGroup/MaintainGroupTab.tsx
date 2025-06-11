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
  usePmSchedMaintainableGroupData,
  insertPmSchedMaintainableGroupData,
  updatePmSchedMaintainableGroupData,
  deletePmSchedMaintainableGroupData,
} from "../hooks/use-pm-sched-maintanable-group-data";
import MaintainGroupDialogForm from "./MaintainGroupDialogForm";

interface MaintainGroupTabProps {
  pmScheduleId: number; // Passed as a prop to this page
}

const MaintainGroupTab: React.FC<MaintainGroupTabProps> = ({ pmScheduleId }) => {
  const { data: maintainableGroups, isLoading, refetch } = usePmSchedMaintainableGroupData(pmScheduleId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any | null>(null);
  const { toast } = useToast();

  const handleAddNew = () => {
    setEditingGroup(null);
    setIsDialogOpen(true);
  };

  const handleEditGroup = (group: any) => {
    setEditingGroup(group);
    setIsDialogOpen(true);
  };

  const handleDeleteGroup = async (group: any) => {
    try {
      await deletePmSchedMaintainableGroupData(group.id);
      toast({
        title: "Success",
        description: "Maintainable group deleted successfully!",
        variant: "default",
      });
      refetch();
    } catch (error) {
      console.error("Failed to delete maintainable group data:", error);
      toast({
        title: "Error",
        description: "Failed to delete maintainable group data.",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingGroup) {
        await updatePmSchedMaintainableGroupData(editingGroup.id, formData);
        toast({
          title: "Success",
          description: "Maintainable group updated successfully!",
          variant: "default",
        });
      } else {
        await insertPmSchedMaintainableGroupData({ ...formData, pm_schedule_id: pmScheduleId });
        toast({
          title: "Success",
          description: "Maintainable group added successfully!",
          variant: "default",
        });
      }
      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error("Failed to save maintainable group data:", error);
      toast({
        title: "Error",
        description: "Failed to save maintainable group data.",
        variant: "destructive",
      });
    }
  };

  const columns: Column[] = [
    {
      id: "asset_id",
      header: "Asset",
      accessorKey: "asset_id.asset_name",
    },
    {
      id: "group_id",
      header: "Group",
      accessorKey: "group_id.name",
    },
  ];

  return (
    <div className="space-y-6 mt-6">
      <PageHeader
        title="Maintainable Groups"
        onAddNew={handleAddNew}
        addNewLabel="New Group"
      />

      {isLoading ? (
        <Loading />
      ) : (
        <DataTable
          columns={columns}
          data={maintainableGroups || []}
          onEdit={handleEditGroup}
          onDelete={handleDeleteGroup}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between w-full">
              <div>
                <DialogTitle>
                  {editingGroup ? "Edit Maintainable Group" : "Add New Maintainable Group"}
                </DialogTitle>
                <DialogDescription>
                  {editingGroup
                    ? "Update the details of the maintainable group."
                    : "Fill in the details to add a new maintainable group."}
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

          <MaintainGroupDialogForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
            initialData={editingGroup}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaintainGroupTab;