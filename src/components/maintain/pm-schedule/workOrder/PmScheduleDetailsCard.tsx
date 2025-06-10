import React from "react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/StatusBadge";

interface PmScheduleDetailsCardProps {
  pmScheduleDetail: any;
  onCreateWorkOrder: () => void;
}

const PmScheduleDetailsCard: React.FC<PmScheduleDetailsCardProps> = ({
  pmScheduleDetail,
  onCreateWorkOrder,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-blue-600 border-b pb-2">
        General Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-500">PM No</h4>
          <p className="text-base font-medium">{pmScheduleDetail?.pm_no}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">PM Description</h4>
          <p className="text-base">{pmScheduleDetail?.pm_description}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Package No</h4>
          <p className="text-base">{pmScheduleDetail?.package?.package_no}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Asset</h4>
          <p className="text-base">{pmScheduleDetail?.asset?.asset_name}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Tasks</h4>
          <p className="text-base">{pmScheduleDetail?.task?.task_name}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Frequency</h4>
          <p className="text-base">{pmScheduleDetail?.frequency?.name}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Work Center</h4>
          <p className="text-base">{pmScheduleDetail?.work_center?.name}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Status</h4>
          <StatusBadge
            status={pmScheduleDetail?.is_active ? "Active" : "Inactive"}
          />
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Due Date</h4>
          <p className="text-base">{pmScheduleDetail?.due_date}</p>
        </div>
        <Button className="w-1/2" onClick={onCreateWorkOrder}>
          Create Work Order
        </Button>
      </div>
    </div>
  );
};

export default PmScheduleDetailsCard;