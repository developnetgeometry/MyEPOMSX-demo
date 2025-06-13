import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import { useWorkCenterData, insertWorkCenterData, updateWorkCenterData, deleteWorkCenterData } from "../hooks/use-work-center-data";
import WorkCenterDialogForm from "./WorkCenterDialogForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Loading from "@/components/shared/Loading";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/utils/formatters";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const WorkCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: workCenters, isLoading, refetch } = useWorkCenterData();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWorkCenter, setEditingWorkCenter] = useState<any | null>(null);
  const { toast } = useToast();

  const handleRowClick = (row: any) => {
    navigate(`/admin/setup/work-center/${row.id}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddNew = () => {
    setEditingWorkCenter(null);
    setIsDialogOpen(true);
  };

  const handleEditWorkCenter = (workCenter: any) => {
    setEditingWorkCenter(workCenter);
    setIsDialogOpen(true);
  };

  const handleDeleteWorkCenter = async (workCenter: any) => {
    try {
      await deleteWorkCenterData(workCenter.id);
      toast({
        title: "Success",
        description: "Work Center deleted successfully!",
        variant: "default",
      });
      refetch();
    } catch (error) {
      console.error("Failed to delete work center data:", error);
      toast({
        title: "Error",
        description: "Failed to delete work center data.",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingWorkCenter) {
        await updateWorkCenterData(editingWorkCenter.id, formData);
        toast({
          title: "Success",
          description: "Work Center updated successfully!",
          variant: "default",
        });
      } else {
        await insertWorkCenterData(formData);
        toast({
          title: "Success",
          description: "Work Center added successfully!",
          variant: "default",
        });
      }
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Failed to save work center data:", error);
      toast({
        title: "Error",
        description: "Failed to save work center data.",
        variant: "destructive",
      });
    }
  };

  const filteredWorkCenters = useMemo(() => {
    if (!workCenters) return [];
    if (!searchQuery) return workCenters;
    const lower = searchQuery.toLowerCase();
    return workCenters.filter(
      (workCenter: any) =>
        workCenter.code?.toLowerCase().includes(lower) ||
        workCenter.name?.toLowerCase().includes(lower) ||
        workCenter.type?.toLowerCase().includes(lower) ||
        workCenter.remark?.toLowerCase().includes(lower) ||
        workCenter.effective_date?.toLowerCase().includes(lower)
    );
  }, [workCenters, searchQuery]);

  const columns: Column[] = [
    { id: "code", header: "Work Center Code", accessorKey: "code" },
    { id: "name", header: "Work Center Name", accessorKey: "name" },
    { id: "type", header: "Type", accessorKey: "type" },
    { id: "effective_date", header: "Effective Date", accessorKey: "effective_date", cell: (value: any) => formatDate(value) },
    { id: "remark", header: "Remark", accessorKey: "remark" },
    {
      id: "is_active",
      header: "Status",
      accessorKey: "is_active",
      cell: (value: any) => (
        <StatusBadge
          status={value ? "Active" : "Inactive"}
          className="capitalize"
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Work Center Setup"
        onAddNew={handleAddNew}
        addNewLabel="New Work Center"
        onSearch={handleSearch}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <DataTable
          columns={columns}
          data={filteredWorkCenters}
          onRowClick={handleRowClick}
          onEdit={handleEditWorkCenter}
          onDelete={handleDeleteWorkCenter}
          onIndex={true}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between w-full">
              <div>
                <DialogTitle>{editingWorkCenter ? "Edit Work Center" : "Add New Work Center"}</DialogTitle>
                <DialogDescription>
                  {editingWorkCenter
                    ? "Update the details of the work center."
                    : "Fill in the details to add a new work center."}
                </DialogDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <WorkCenterDialogForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
            initialData={editingWorkCenter}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkCenterPage;