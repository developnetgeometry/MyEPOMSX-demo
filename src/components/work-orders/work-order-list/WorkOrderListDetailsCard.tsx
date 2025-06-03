import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Edit, Trash2 } from "lucide-react";
import Loading from "@/components/shared/Loading";

interface WorkOrderListDetailsCardProps {
    workOrder: any;
    isLoading: boolean;
    onEditClick?: () => void;
    onDeleteClick?: () => void;
}

const WorkOrderListDetailsCard: React.FC<WorkOrderListDetailsCardProps> = ({
    workOrder,
    isLoading,
    onEditClick,
    onDeleteClick,
}) => {
    if (isLoading) {
        return <Loading />;
    }

    if (!workOrder) {
        return null;
    }

    return (
        <Card>
            <CardContent className="pt-6 space-y-4">
                <div className="flex justify-end">
                    <div className="flex justify-end space-x-2">
                        {/* <Button
                            variant="destructive"
                            className="flex items-center gap-2"
                            onClick={onDeleteClick}
                        >
                            <Trash2 className="h-4 w-4" /> Delete
                        </Button> */}
                        <Button
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={onEditClick}
                        >
                            <Edit className="h-4 w-4" /> Edit
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label className="block text-sm font-medium text-gray-700">Work Order No</Label>
                        <Input
                            className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            value={workOrder.work_order_no ?? "N/A"}
                            readOnly
                        />
                    </div>
                    <div>
                        <Label className="block text-sm font-medium text-gray-700">Work Order Status</Label>
                        <Input
                            className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            value={workOrder.work_order_status_id?.name ?? "N/A"}
                            readOnly
                        />
                    </div>
                </div>
                <div className="md:col-span-2">
                    <div>
                        <Label className="block text-sm font-medium text-gray-700">Task</Label>
                        <Input
                            className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            value={
                                workOrder.task_id?.task_code && workOrder.task_id?.task_name
                                    ? `${workOrder.task_id.task_code} - ${workOrder.task_id.task_name}`
                                    : "N/A"
                            } readOnly
                        />
                    </div>
                </div>
                <div className="md:col-span-2">
                    <Label className="block text-sm font-medium text-gray-700">Description</Label>
                    <Textarea
                        className="cursor-default focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        value={workOrder.description ?? "N/A"}
                        readOnly
                    />
                </div>

            </CardContent>
        </Card>
    );
};

export default WorkOrderListDetailsCard;