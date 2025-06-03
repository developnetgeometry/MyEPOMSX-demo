import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import Loading from "@/components/shared/Loading";
import { useWorkOrderStatusData } from "@/hooks/lookup/lookup-work-order-status";
import { useTask } from "@/hooks/lookup/lookup-task";
import { toast } from "@/hooks/use-toast";

interface WorkOrderListDialogFormProps {
  onSubmit: (formData: any) => Promise<void>;
  onCancel: () => void;
  initialData?: any | null;
}

const WorkOrderListDialogForm: React.FC<WorkOrderListDialogFormProps> = ({ onSubmit, onCancel, initialData = null }) => {
  const { data: workOrderStatuses } = useWorkOrderStatusData();
  const { data: tasks } = useTask();

  const [formData, setFormData] = useState({
    work_order_no: initialData?.work_order_no || "",
    work_order_status_id: initialData?.work_order_status_id?.id || null,
    task_id: initialData?.task_id?.id || null,
    description: initialData?.description || "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showValidationError = (description: string) => {
    toast({
      title: "Form Incomplete",
      description,
      variant: "destructive",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.work_order_no) return showValidationError("Work Order No is required");
    if (!formData.work_order_status_id) return showValidationError("Work Order Status is required");
    if (!formData.task_id) return showValidationError("Task is required");
    if (!formData.description) return showValidationError("Description is required");

    setIsLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="work_order_no">Work Order No<span className="text-red-500 ml-1">*</span></Label>
            <Input
              id="work_order_no"
              name="work_order_no"
              value={formData.work_order_no}
              onChange={handleInputChange}
              required
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="work_order_status_id">Work Order Status<span className="text-red-500 ml-1">*</span></Label>
            <Select
              value={formData.work_order_status_id?.toString() || ""}
              onValueChange={(value) => handleSelectChange("work_order_status_id", parseInt(value))}
              required
            >
              <SelectTrigger id="work_order_status_id" className="w-full">
                <SelectValue placeholder="Select Work Order Status" />
              </SelectTrigger>
              <SelectContent>
                {workOrderStatuses?.map((status) => (
                  <SelectItem key={status.id} value={status.id.toString()}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="task_id">Task<span className="text-red-500 ml-1">*</span></Label>
            <Select
              value={formData.task_id?.toString() || ""}
              onValueChange={(value) => handleSelectChange("task_id", parseInt(value))}
            >
              <SelectTrigger id="task_id" className="w-full">
                <SelectValue placeholder="Select Task" />
              </SelectTrigger>
              <SelectContent>
                {tasks?.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.task_code} - {item.task_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description<span className="text-red-500 ml-1">*</span></Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </>
      )}
    </form>
  );
};

export default WorkOrderListDialogForm;