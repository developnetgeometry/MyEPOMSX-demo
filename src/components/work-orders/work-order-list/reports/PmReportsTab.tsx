import React, { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import {
  usePmReportData,
  insertPmReportData,
  updatePmReportData,
  deletePmReportData,
} from "../hooks/pm/use-pm-report-data";
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
import PmReportsDialogForm from "./PmReportsDialogForm";

interface PmReportsTabProps {
  pmWoId: number; // Passed as a prop to this page
}

const PmReportsTab: React.FC<PmReportsTabProps> = ({ pmWoId }) => {
  const { data: reports, isLoading, refetch } = usePmReportData(pmWoId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<any | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<any | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const { toast } = useToast();

  const handleAddNew = () => {
    setEditingReport(null);
    setIsDialogOpen(true);
  };

  const handleEditReport = (report: any) => {
    setEditingReport(report);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (report: any) => {
    setReportToDelete(report);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (reportToDelete) {
      setIsDeleteLoading(true);
      try {
        await deletePmReportData(reportToDelete.id);
        toast({
          title: "Success",
          description: "Report deleted successfully!",
          variant: "default",
        });
        refetch();
      } catch (error) {
        console.error("Failed to delete report data:", error);
        toast({
          title: "Error",
          description: "Failed to delete report data.",
          variant: "destructive",
        });
      } finally {
        setIsDeleteLoading(false);
        setDeleteDialogOpen(false);
        setReportToDelete(null);
      }
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingReport) {
        await updatePmReportData(editingReport.id, formData);
        toast({
          title: "Success",
          description: "Report updated successfully!",
          variant: "default",
        });
      } else {
        await insertPmReportData({ ...formData, pm_wo_id: pmWoId });
        toast({
          title: "Success",
          description: "Report added successfully!",
          variant: "default",
        });
      }
      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error("Failed to save report data:", error);
      toast({
        title: "Error",
        description: "Failed to save report data.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 mt-6">
      {(reports &&
        <PageHeader
          title="Reports"
          onAddNew={reports?.length >= 1 ? null : handleAddNew}
          addNewLabel="New Report"
        />
      )}
      {isLoading ? (
        <Loading />
      ) : (
        <div className="space-y-4">
          {reports?.length === 0 ? (
            <p className="text-center text-gray-500">No report available</p>
          ) : (
            reports?.map((report: any) => (
              <div
                key={report?.id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-md font-semibold mb-2">SCE Result</h5>
                    <p>{report?.sce_result || "-"}</p>
                  </div>
                  <div>
                    <h5 className="text-md font-semibold mb-2">Equipment Status</h5>
                    <p>{report?.equipment_status || "-"}</p>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <h5 className="text-md font-semibold mb-2">Detail Description</h5>
                    <p>{report?.detail_description || "-"}</p>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <h5 className="text-md font-semibold mb-2">General Maintenances</h5>
                    <p>{report?.general_maintenances?.join(", ") || "-"}</p>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditReport(report)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(report)}
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
                <DialogTitle>{editingReport ? "Edit Report" : "Add New Report"}</DialogTitle>
                <DialogDescription>
                  {editingReport
                    ? "Update the details of the report."
                    : "Fill in the details to add a new report."}
                </DialogDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <PmReportsDialogForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
            initialData={editingReport}
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

export default PmReportsTab;