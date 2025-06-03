import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loading from "@/components/shared/Loading"; // Import the Loading component
import { Textarea } from "@/components/ui/textarea";

interface CmFindingDialogFormProps {
  onSubmit: (formData: any) => Promise<void>; // Assuming onSubmit is async
  onCancel: () => void;
  initialData?: any; // Optional initial data for editing
}

const CmFindingDialogForm: React.FC<CmFindingDialogFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    wo_finding_failure: initialData?.wo_finding_failure || "",
    action_taken: initialData?.action_taken || "",
    corrective_action: initialData?.corrective_action || "",
  });

  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true
    try {
      await onSubmit(formData); // Wait for the onSubmit function to complete
    } finally {
      setIsLoading(false); // Set loading to false after submission
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isLoading ? ( // Show the Loading component if isLoading is true
        <Loading />
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="wo_finding_failure">Finding/Failure</Label>
            <Textarea
              id="wo_finding_failure"
              name="wo_finding_failure"
              value={formData.wo_finding_failure}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="action_taken">Action Taken</Label>
            <Textarea
              id="action_taken"
              name="action_taken"
              value={formData.action_taken}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="corrective_action">Corrective Action</Label>
            <Textarea
              id="corrective_action"
              name="corrective_action"
              value={formData.corrective_action}
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

export default CmFindingDialogForm;