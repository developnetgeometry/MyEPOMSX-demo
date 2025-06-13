import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash2 } from "lucide-react";
import Loading from "@/components/shared/Loading";

interface PmScheduleDetailsCardProps {
  pmScheduleDetail: any;
  isLoading: boolean;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  onSubmitCreateWoIndi?: () => void;

}

const PmScheduleDetailsCard: React.FC<PmScheduleDetailsCardProps> = ({
  pmScheduleDetail,
  isLoading,
  onEditClick,
  onDeleteClick,
  onSubmitCreateWoIndi,
}) => {
  if (isLoading) {
    return <Loading />;
  }

  if (!pmScheduleDetail) {
    return null;
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={onEditClick}
          >
            <Edit className="h-4 w-4" /> Edit
          </Button>
          <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={onDeleteClick}
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="block text-sm font-medium text-gray-700">PM No</Label>
            <Input
              className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={pmScheduleDetail.pm_no ?? "N/A"}
              readOnly
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">PM Description</Label>
            <Input
              className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={pmScheduleDetail.pm_description ?? "N/A"}
              readOnly
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">Due Date</Label>
            <Input
              className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={
                pmScheduleDetail.due_date
                  ? new Date(pmScheduleDetail.due_date).toLocaleDateString("en-GB").replace(/\//g, "-")
                  : "N/A"
              }
              readOnly
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">Priority</Label>
            <Input
              className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={pmScheduleDetail.priority_id?.name ?? "N/A"}
              readOnly
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">Work Center</Label>
            <Input
              className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={pmScheduleDetail.work_center_id?.name ?? "N/A"}
              readOnly
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">Discipline</Label>
            <Input
              className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={pmScheduleDetail.discipline_id?.name ?? "N/A"}
              readOnly
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">Task</Label>
            <Input
              className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={pmScheduleDetail.task_id?.task_name ?? "N/A"}
              readOnly
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">Frequency</Label>
            <Input
              className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={pmScheduleDetail.frequency_id?.name ?? "N/A"}
              readOnly
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">Asset</Label>
            <Input
              className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={pmScheduleDetail.asset_id?.asset_name ?? "N/A"}
              readOnly
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">System</Label>
            <Input
              className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={pmScheduleDetail.system_id?.system_name ?? "N/A"}
              readOnly
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">Package</Label>
            <Input
              className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={pmScheduleDetail.package_id?.package_name ?? "N/A"}
              readOnly
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">PM Group</Label>
            <Input
              className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={pmScheduleDetail.pm_group_id?.asset_detail_id ?? "N/A"}
              readOnly
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">PM SCE Group</Label>
            <Input
              className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={
                pmScheduleDetail.pm_sce_group_id
                  ? `${pmScheduleDetail.pm_sce_group_id.sce_code} - ${pmScheduleDetail.pm_sce_group_id.group_name}`
                  : "N/A"
              }
              readOnly
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700">Facility</Label>
            <Input
              className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={pmScheduleDetail.facility_id?.location_name ?? "N/A"}
              readOnly
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={onSubmitCreateWoIndi}>Create Work Order</Button>
              </TooltipTrigger>
              <TooltipContent>
                Create Work Order based on this PM Schedule
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

        </div>
      </CardContent>
    </Card>
  );
};

export default PmScheduleDetailsCard;