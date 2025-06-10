import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loading from "@/components/shared/Loading";

interface PmMinAcceptCriteriaDialogFormProps {
  onSubmit: (formData: { criteria: string; field_name: string }) => Promise<void>;
  onCancel: () => void;
  initialData?: { criteria?: string; field_name?: string };
}

const PmMinAcceptCriteriaDialogForm: React.FC<PmMinAcceptCriteriaDialogFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    criteria: initialData?.criteria || "",
    field_name: initialData?.field_name || "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
          <div>
            <h3 className="text-lg font-semibold">Minimum Acceptance Criteria</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="criteria">Criteria</Label>
                <Input
                  id="criteria"
                  name="criteria"
                  value={formData.criteria}
                  onChange={handleInputChange}
                  placeholder="Enter criteria"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="field_name">Field Name</Label>
                <Input
                  id="field_name"
                  name="field_name"
                  value={formData.field_name}
                  onChange={handleInputChange}
                  placeholder="Enter field name"
                  required
                />
              </div>
            </div>
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

export default PmMinAcceptCriteriaDialogForm;