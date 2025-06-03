import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loading from "@/components/shared/Loading";
import { useNewWorkFailureTypeData } from "@/hooks/lookup/lookup-new-work-failure-type";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFailurePriorityData } from "@/hooks/lookup/lookup-failure-priority";
import { Checkbox } from "@/components/ui/checkbox";

interface FailureDialogFormProps {
  onSubmit: (formData: any) => Promise<void>;
  onCancel: () => void;
  initialData?: any;
}

const FailureDialogForm: React.FC<FailureDialogFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const { data: failurePriorities } = useFailurePriorityData();
  const { data: failureTypes } = useNewWorkFailureTypeData();

  const [formData, setFormData] = useState({
    safety: initialData?.safety || "",
    like_hood: initialData?.like_hood || "",
    action_taken: initialData?.action_taken || "",
    critical_rank: initialData?.critical_rank || null,
    provability_occurrance: initialData?.provability_occurrance || null,
    environment_consequences: initialData?.environment_consequences || "",
    has_consequence: initialData?.has_consequence || "",
    corrective_action: initialData?.corrective_action || "",
    failure_priority_id: initialData?.failure_priority_id?.id || null,
    lost_time_incident: initialData?.lost_time_incident || false,
    failure_shutdown: initialData?.failure_shutdown || false,
    failure_type_id: initialData?.failure_type_id?.id || null,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
            <h3 className="text-lg font-semibold">Failure Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="safety">Safety</Label>
                <Input
                  id="safety"
                  name="safety"
                  value={formData.safety || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="like_hood">Likelihood</Label>
                <Input
                  id="like_hood"
                  name="like_hood"
                  value={formData.like_hood || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="action_taken">Action Taken</Label>
                <Input
                  id="action_taken"
                  name="action_taken"
                  value={formData.action_taken || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="critical_rank">Critical Rank</Label>
                <Input
                  id="critical_rank"
                  name="critical_rank"
                  type="number"
                  value={formData.critical_rank || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provability_occurrance">Probability of Occurrence</Label>
                <Input
                  id="provability_occurrance"
                  name="provability_occurrance"
                  type="number"
                  value={formData.provability_occurrance || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="environment_consequences">Environmental Consequences</Label>
                <Input
                  id="environment_consequences"
                  name="environment_consequences"
                  value={formData.environment_consequences || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="has_consequence">Has Consequence</Label>
                <Input
                  id="has_consequence"
                  name="has_consequence"
                  value={formData.has_consequence || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="corrective_action">Corrective Action</Label>
                <Input
                  id="corrective_action"
                  name="corrective_action"
                  value={formData.corrective_action || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority_id">Priority</Label>
                <Select
                  value={formData.failure_priority_id?.toString() || ""} // Ensure the value is a string
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, failure_priority_id: parseInt(value) })) // Store the ID as a number
                  }
                >
                  <SelectTrigger id="priority_id" className="w-full">
                    <SelectValue
                      placeholder="Select priority"
                      defaultValue={
                        failurePriorities?.find((priority) => priority.id === formData.failure_priority_id)?.name || ""
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {failurePriorities?.map((priority) => (
                      <SelectItem key={priority.id} value={priority.id.toString()}>
                        {priority.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="failure_type_id">Failure Type</Label>
                <Select
                  value={formData.failure_type_id?.toString() || ""} // Ensure the value is a string
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, failure_type_id: parseInt(value) })) // Store the ID as a number
                  }
                >
                  <SelectTrigger id="failure_type_id" className="w-full">
                    <SelectValue
                      placeholder="Select Failure Type"
                      defaultValue={
                        failureTypes?.find((type) => type.id === formData.failure_type_id)?.name || ""
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {failureTypes?.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="lost_time_incident">Lost Time Incident</Label>
                  <Checkbox
                    id="lost_time_incident"
                    checked={formData.lost_time_incident || false}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        lost_time_incident: checked === true, // Ensure the value is a boolean
                      }))
                    }
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="failure_shutdown">Failure Shutdown</Label>
                  <Checkbox
                    id="failure_shutdown"
                    checked={formData.failure_shutdown || false}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        failure_shutdown: checked === true, // Ensure the value is a boolean
                      }))
                    }
                  />
                </div>
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

export default FailureDialogForm;