import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loading from "@/components/shared/Loading";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useGeneralMaintenanceData,
  insertGeneralMaintenanceData,
  updateGeneralMaintenanceData,
  deleteGeneralMaintenanceData,
} from "../hooks/pm/use-general-maintenance-data";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";

interface GeneralMaintenanceDialogFormProps {
  onCancel: () => void;
}

const GeneralMaintenanceDialogForm: React.FC<GeneralMaintenanceDialogFormProps> = ({ onCancel }) => {
  const { data: generalMaintenances, refetch, isLoading } = useGeneralMaintenanceData();

  const [formData, setFormData] = useState({ name: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [maintenanceToDelete, setMaintenanceToDelete] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdate = async () => {
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateGeneralMaintenanceData(editingId, formData);
      } else {
        await insertGeneralMaintenanceData(formData);
      }
      setFormData({ name: "" });
      setEditingId(null);
      await refetch();
    } catch (error) {
      console.error("Error saving general maintenance data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (id: number, name: string) => {
    setEditingId(id);
    setFormData({ name });
  };

  const handleDeleteClick = (id: number) => {
    setMaintenanceToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (maintenanceToDelete !== null) {
      setIsSubmitting(true);
      try {
        await deleteGeneralMaintenanceData(maintenanceToDelete);
        await refetch();
      } catch (error) {
        console.error("Error deleting general maintenance data:", error);
      } finally {
        setIsSubmitting(false);
        setDeleteDialogOpen(false);
        setMaintenanceToDelete(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">General Maintenance Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter maintenance name"
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              onClick={handleAddOrUpdate}
              disabled={isSubmitting || !formData.name.trim()}
            >
              {editingId ? "Update" : "Add"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
          <div className="space-y-4">
            <Label>Existing General Maintenances</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generalMaintenances?.map((maintenance) => (
                <div
                  key={maintenance.id}
                  className="flex items-center justify-between border p-2 rounded"
                >
                  <span>{maintenance.name}</span>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleEdit(maintenance.id, maintenance.name)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteClick(maintenance.id)}
                      disabled={isSubmitting}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription></AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
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

export default GeneralMaintenanceDialogForm;