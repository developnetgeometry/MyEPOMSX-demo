import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar, FileText, Settings } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";

const WorkOrderDetailDialog = ({
  isOpen,
  onClose,
  workOrderData,
}) => {
  if (!workOrderData) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in progress":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Work Order Details</DialogTitle>
            <div className="flex items-center gap-2">
              <StatusBadge status={workOrderData.status?.name || "Pending"} />
              <span className="text-sm text-muted-foreground">
                {workOrderData.work_order_no}
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Settings className="h-5 w-5 mr-2" /> General Information
              </h3>
              <div className="space-y-2 pl-7">
                <div className="flex">
                  <span className="font-medium w-32">Type:</span>
                  <span>{workOrderData.work_order_type?.name || "N/A"}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">Created At:</span>
                  <span>
                    {workOrderData.created_at
                      ? format(new Date(workOrderData.created_at), "PPp")
                      : "-"}
                  </span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">Due Date:</span>
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {workOrderData.due_date
                      ? format(new Date(workOrderData.due_date), "PP")
                      : "-"}
                  </span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">Completed At:</span>
                  <span>
                    {workOrderData.completed_at
                      ? format(new Date(workOrderData.completed_at), "PPp")
                      : "Not completed"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <FileText className="h-5 w-5 mr-2" /> Description
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 min-h-[150px]">
              {workOrderData.description || "No description provided"}
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkOrderDetailDialog;