import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2 } from "lucide-react";
import Loading from "@/components/shared/Loading";

interface WorkRequestDetailsCardProps {
  workRequest: any;
  isLoading: boolean;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  onSubmitToNRQ?: () => void;
  onSubmitToReupdate?: () => void;
  onSubmitWoRaised?: () => void;
  onSubmitToWO?: () => void;
}

const WorkRequestDetailsCard: React.FC<WorkRequestDetailsCardProps> = ({
  workRequest,
  isLoading,
  onEditClick,
  onDeleteClick,
  onSubmitToNRQ,
  onSubmitToReupdate,
  onSubmitWoRaised,
  onSubmitToWO,
}) => {
  if (isLoading) {
    return <Loading />;
  }

  if (!workRequest) {
    return null;
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex justify-end">
          {((workRequest.cm_status_id?.id === 1 || workRequest.cm_status_id?.id === -1) &&
            <div className="flex justify-end space-x-2">
              <Button
                variant="destructive"
                className="flex items-center gap-2"
                onClick={onDeleteClick}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={onEditClick}
              >
                <Edit className="h-4 w-4" /> Edit
              </Button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="block text-sm font-medium text-gray-700">Work Request No</Label>
            <Input className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" value={workRequest.work_request_no ?? "N/A"} readOnly />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">CM Status</Label>
            <Input className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" value={workRequest.cm_status_id?.name ?? "N/A"} readOnly />
          </div>
        </div>
        <div className="md:col-span-2">
          <Label className="block text-sm font-medium text-gray-700">Description</Label>
          <Textarea className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" value={workRequest.description ?? "N/A"} readOnly />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <Label className="block text-sm font-medium text-gray-700">Work Request Date</Label>
              <Input className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={
                  workRequest.work_request_date
                    ? new Date(workRequest.work_request_date).toLocaleDateString("en-GB").replace(/\//g, "-")
                    : "N/A"
                }
                readOnly
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700">Target Due Date</Label>
              <Input className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={
                  workRequest.target_due_date
                    ? new Date(workRequest.target_due_date).toLocaleDateString("en-GB").replace(/\//g, "-")
                    : "N/A"
                }
                readOnly
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700">Facility</Label>
              <Input className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" value={workRequest.facility_id?.location_name ?? "N/A"} readOnly />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700">System</Label>
              <Input className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" value={workRequest.system_id?.system_name ?? "N/A"} readOnly />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700">Package</Label>
              <Input className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" value={workRequest.package_id?.package_name ?? "N/A"} readOnly />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700">Asset</Label>
              <Input className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" value={workRequest.asset_id?.asset_name ?? "N/A"} readOnly />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label className="block text-sm font-medium text-gray-700">CM SEC Code</Label>
              <Input className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={
                  workRequest.cm_sce_code
                    ? `${workRequest.cm_sce_code.cm_sce_code} - ${workRequest.cm_sce_code.cm_group_name}`
                    : "N/A"
                }
                readOnly
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700">Work Center</Label>
              <Input className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" value={workRequest.work_center_id?.name ?? "N/A"} readOnly />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700">Maintenance Type</Label>
              <Input className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" value={workRequest.maintenance_type?.name ?? "N/A"} readOnly />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700">Requested By</Label>
              <Input className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" value={workRequest.requested_by ?? "N/A"} readOnly />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700">Priority</Label>
              <Input className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" value={workRequest.priority_id?.name ?? "N/A"} readOnly />
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <Label className="block text-sm font-medium text-gray-700">Finding Incident Details</Label>
          <Textarea className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" value={workRequest.finding_detail ?? "N/A"} readOnly />
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              className="cursor-default"
              checked={workRequest.anomaly_report ?? false}
            />
            <Label className="text-sm font-medium text-gray-700">Anomaly Report</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              className="cursor-default"
              checked={workRequest.quick_incident_report ?? false}
            />
            <Label className="text-sm font-medium text-gray-700">Quick Incident Report</Label>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <TooltipProvider>

            {((workRequest.cm_status_id?.id === 1 || workRequest.cm_status_id?.id === -1) &&
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={onSubmitToNRQ}>Submit</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {workRequest.cm_status_id?.id === 1
                      ? `Change from "Draft" to "NRQ"`
                      : `Change from "Reupdate" to "NRQ"`}
                  </TooltipContent>
                </Tooltip>
              </>
            )}
            {(workRequest.cm_status_id?.id === 2 &&
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="destructive" onClick={onSubmitToReupdate}>Reject</Button>
                  </TooltipTrigger>
                  <TooltipContent>Change from "NRQ" to "Reupdate. <br />Technician need to re-review</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={onSubmitWoRaised}>Approve</Button>
                  </TooltipTrigger>
                  <TooltipContent>Change from "Draft" to "WO Raised"</TooltipContent>
                </Tooltip>
              </>
            )}
            {((workRequest.cm_status_id?.id === 3 && workRequest.is_work_order_created === false) &&
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={onSubmitToWO}>Submit</Button>
                  </TooltipTrigger>
                  <TooltipContent>Create New Work Order</TooltipContent>
                </Tooltip>
              </>
            )}
          </TooltipProvider>

        </div>

      </CardContent>
    </Card>
  );
};

export default WorkRequestDetailsCard;