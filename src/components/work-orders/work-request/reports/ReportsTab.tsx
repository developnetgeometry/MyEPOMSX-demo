import React, { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import {
  useWorkRequestReportData,
  insertWorkRequestReportData,
  updateWorkRequestReportData,
  deleteWorkRequestReportData,
} from "../hooks/use-work-request-report-data";
import ReportsDialogForm from "./ReportsDialogForm";
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
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ReportsTabProps {
  workRequestId: number; // Passed as a prop to this page
  cmStatusId: number;
}

const ReportsTab: React.FC<ReportsTabProps> = ({ workRequestId, cmStatusId }) => {
  const { data: reports, isLoading, refetch } = useWorkRequestReportData(workRequestId);
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
        await deleteWorkRequestReportData(reportToDelete.id);
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
        await updateWorkRequestReportData(editingReport.id, formData);
        toast({
          title: "Success",
          description: "Report updated successfully!",
          variant: "default",
        });
      } else {
        await insertWorkRequestReportData({ ...formData, work_request_id: workRequestId });
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
      {/* <pre>{JSON.stringify(reports, null, 2)}</pre> */}
      {(reports &&
        <PageHeader
          title="Reports"
          onAddNew={cmStatusId == 3 ? null : reports?.length >= 1 ? null : handleAddNew}
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
                <div className="flex gap-6 flex-wrap md:flex-nowrap">

                  <div className="flex gap-6 flex-wrap md:flex-nowrap">
                    {/* Environment Detail */}
                    <div className="w-full md:w-1/2">
                      <h5 className="text-md font-semibold mb-2 text-xl">Environment Detail</h5>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="font-medium text-gray-600">Weather Condition</div>
                        <div className="text-gray-800 break-words whitespace-pre-wrap">{report?.weather_condition ?? "-"}</div>

                        <div className="font-medium text-gray-600">Visibility</div>
                        <div className="text-gray-800 break-words whitespace-pre-wrap">{report?.visibility ?? "-"}</div>

                        <div className="font-medium text-gray-600">Wind Speed & Direction</div>
                        <div className="text-gray-800 break-words whitespace-pre-wrap">{report?.wind_speed_direction ?? "-"}</div>

                        <div className="font-medium text-gray-600">Sea Well</div>
                        <div className="text-gray-800 break-words whitespace-pre-wrap">{report?.sea_well ?? "-"}</div>

                        <div className="font-medium text-gray-600">Alarm Trigger</div>
                        <div className="text-gray-800 break-words whitespace-pre-wrap">{report?.alarm_trigger ?? "-"}</div>

                        <div className="font-medium text-gray-600">Time Failed</div>
                        <div className="text-gray-800 break-words whitespace-pre-wrap">{report?.time_failed ?? "-"}</div>

                        <div className="font-medium text-gray-600">Time Resume</div>
                        <div className="text-gray-800 break-words whitespace-pre-wrap">{report?.time_resume ?? "-"}</div>

                        <div className="font-medium text-gray-600">Shift</div>
                        <div className="text-gray-800 break-words whitespace-pre-wrap">{report?.shift ?? "-"}</div>

                        <div className="font-medium text-gray-600">Redundant</div>
                        <div className="text-gray-800 break-words whitespace-pre-wrap">{report?.redundant ?? "-"}</div>

                        <div className="font-medium text-gray-600">Other Detail</div>
                        <div className="text-gray-800 break-words whitespace-pre-wrap">{report?.other_detail ?? "-"}</div>

                        <div className="font-medium text-gray-600">Shutdown Type</div>
                        <div className="text-gray-800 break-words whitespace-pre-wrap">{report?.shutdown_type_id?.name ?? "-"}</div>
                      </div>
                    </div>

                    {/* Operation Detail */}
                    <div className="w-full md:w-1/2">
                      <h5 className="text-md font-semibold mb-2 text-xl">Operation Detail</h5>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="font-medium text-gray-600">Service Asset</div>
                        <div className="text-gray-800 break-words whitespace-pre-wrap">{report?.service_asset ?? "-"}</div>

                        <div className="font-medium text-gray-600">Pressure</div>
                        <div className="text-gray-800 break-words whitespace-pre-wrap">{report?.pressure ?? "-"}</div>

                        <div className="font-medium text-gray-600">Temperature</div>
                        <div className="text-gray-800 break-words whitespace-pre-wrap">{report?.temp ?? "-"}</div>

                        <div className="font-medium text-gray-600">Operating History</div>
                        <div className="text-gray-800 break-words whitespace-pre-wrap">{report?.operating_history ?? "-"}</div>

                        <div className="font-medium text-gray-600">Time in Service (hr)</div>
                        <div className="text-gray-800 break-words whitespace-pre-wrap">{report?.time_in_servicehr ?? "-"}</div>

                        <div className="font-medium text-gray-600">Material Class</div>
                        <div className="text-gray-800 break-words whitespace-pre-wrap">{report?.material_class_id?.name ?? "-"}</div>

                        <div className="font-medium text-gray-600">Design Code</div>
                        <div className="text-gray-800 break-words whitespace-pre-wrap">{report?.design_code ?? "-"}</div>
                      </div>
                    </div>
                  </div>


                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  {(cmStatusId !== 3 &&
                    <>
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
                    </>
                  )}
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

          <ReportsDialogForm
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
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this report.
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

export default ReportsTab;