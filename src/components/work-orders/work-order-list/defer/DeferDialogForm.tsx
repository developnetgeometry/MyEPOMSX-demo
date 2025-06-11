import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loading from "@/components/shared/Loading";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useProfilesById } from "@/components/work-orders/work-order-list/hooks/use-profile-by-id";

interface DeferDialogFormProps {
  onSubmit: (formData: any) => Promise<void>;
  onCancel: () => void;
  initialData?: any;
}

const DeferDialogForm: React.FC<DeferDialogFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const { profile, loading: isProfileLoading } = useAuth();
  const { data: profiles, isLoading: isProfilesLoading } = useProfilesById(profile?.id || "");

const [formData, setFormData] = useState({
  previous_due_date: initialData?.previous_due_date
    ? new Date(initialData.previous_due_date).toISOString().split("T")[0]
    : null,
  remarks: initialData?.remarks || "",
  new_due_date: initialData?.new_due_date
    ? new Date(initialData.new_due_date).toISOString().split("T")[0]
    : null,
  requested_by: initialData?.requested_by?.id || profile?.id || "",
});

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, requested_by: value }));
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

  if (isProfileLoading || isProfilesLoading) {
    return <Loading />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="requested_by">Requested By</Label>
            <Select
              value={formData.requested_by}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger id="requested_by" className="w-full">
                <SelectValue placeholder="Select Requested By" />
              </SelectTrigger>
              <SelectContent>
                {profiles?.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.full_name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="previous_due_date">Previous Due Date</Label>
            <Input
              id="previous_due_date"
              name="previous_due_date"
              type="date"
              value={formData.previous_due_date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new_due_date">New Due Date</Label>
            <Input
              id="new_due_date"
              name="new_due_date"
              type="date"
              value={formData.new_due_date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              name="remarks"
              value={formData.remarks}
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

export default DeferDialogForm;