import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loading from "@/components/shared/Loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePriorityData } from "@/hooks/lookup/lookup-priority";

interface CmGeneralDialogFormProps {
  onSubmit: (formData: any) => Promise<void>;
  onCancel: () => void;
  initialData?: any | null;
}

const CmGeneralDialogForm: React.FC<CmGeneralDialogFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const { data: priorities } = usePriorityData();

  const [formData, setFormData] = useState({
    priority_id: initialData?.priority_id?.id || null,
    due_date: initialData?.due_date
      ? new Date(initialData.due_date).toISOString().split("T")[0]
      : null,
    work_order_no: initialData?.work_order_no || "",
    downtime: initialData?.downtime || "",
    asset_available_time: initialData?.asset_available_time || "",
    target_start_date: initialData?.target_start_date || "",
    target_end_date: initialData?.target_end_date || "",
    date_finding: initialData?.date_finding
      ? new Date(initialData.date_finding).toISOString().split("T")[0]
      : null,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="work_order_no">Work Order No</Label>
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
            <Label htmlFor="priority_id">Priority</Label>
            <Select
              value={formData.priority_id?.toString() || ""}
              onValueChange={(value) => handleSelectChange("priority_id", parseInt(value))}
            >
              <SelectTrigger id="priority_id" className="w-full">
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent>
                {priorities?.map((priority) => (
                  <SelectItem key={priority.id} value={priority.id.toString()}>
                    {priority.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="downtime">Downtime</Label>
            <Input
              id="downtime"
              name="downtime"
              type="number"
              value={formData.downtime}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="asset_available_time">Asset Available Time</Label>
            <Input
              id="asset_available_time"
              name="asset_available_time"
              type="datetime-local"
              value={formData.asset_available_time}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target_start_date">Target Start Date</Label>
            <Input
              id="target_start_date"
              name="target_start_date"
              type="datetime-local"
              value={formData.target_start_date}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target_end_date">Target End Date</Label>
            <Input
              id="target_end_date"
              name="target_end_date"
              type="datetime-local"
              value={formData.target_end_date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="due_date">Due Date</Label>
            <Input
              id="due_date"
              name="due_date"
              type="date"
              value={formData.due_date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="due_date">Finding Date</Label>
            <Input
              id="date_finding"
              name="date_finding"
              type="date"
              value={formData.date_finding}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex justify-end space-x-2 mt-6">
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

export default CmGeneralDialogForm;