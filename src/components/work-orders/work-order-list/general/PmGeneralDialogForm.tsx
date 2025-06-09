import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loading from "@/components/shared/Loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePriorityData } from "@/hooks/lookup/lookup-priority";

interface PmGeneralDialogFormProps {
  onSubmit: (formData: any) => Promise<void>;
  onCancel: () => void;
  initialData?: any | null;
}

const PmGeneralDialogForm: React.FC<PmGeneralDialogFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const { data: priorities } = usePriorityData();

  const [formData, setFormData] = useState({
    due_date: initialData?.due_date || "",
    is_active: initialData?.is_active || "",
    priority_id: initialData?.priority_id?.id || null,
    completed_by: initialData?.completed_by || null,
    closed_by: initialData?.closed_by || null,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            <Label htmlFor="due_date">Due Date</Label>
            <Input
              id="due_date"
              name="due_date"
              type="datetime-local"
              value={formData.due_date}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="is_active">Is Active</Label>
            <Input
              id="is_active"
              name="is_active"
              type="text"
              value={formData.is_active}
              onChange={handleInputChange}
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
            <Label htmlFor="completed_by">Completed By</Label>
            <Input
              id="completed_by"
              name="completed_by"
              type="text"
              value={formData.completed_by}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="closed_by">Closed By</Label>
            <Input
              id="closed_by"
              name="closed_by"
              type="text"
              value={formData.closed_by}
              onChange={handleInputChange}
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

export default PmGeneralDialogForm;