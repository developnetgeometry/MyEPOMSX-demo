import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loading from "@/components/shared/Loading"; // Import the Loading component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmployeeByWorkCenterId } from "@/components/work-orders/work-order-list/hooks/use-employee-by-work-center-id";

interface ActualLabourDialogFormProps {
  onSubmit: (formData: any) => Promise<void>; // Assuming onSubmit is async
  onCancel: () => void;
  initialData?: any; // Optional initial data for editing
  workCenterId: number; // WorkCenterId to fetch employee data
}

const ActualLabourDialogForm: React.FC<ActualLabourDialogFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  workCenterId,
}) => {
  const { data: employees, isLoading: isEmployeeLoading } = useEmployeeByWorkCenterId(workCenterId);

  const [formData, setFormData] = useState({
    employee_id: initialData?.employee_id?.id ?? null,
    duration: initialData?.duration ?? 0,
  });

  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      {isLoading || isEmployeeLoading ? ( // Show the Loading component if isLoading is true
        <Loading />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee_id">Employee</Label>
              <Select
                value={formData.employee_id?.toString() || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, employee_id: parseInt(value) }))
                }
              >
                <SelectTrigger id="employee_id" className="w-full">
                  <SelectValue
                    placeholder="Select Employee"
                    defaultValue={
                      employees?.find((employee) => employee.id === formData.employee_id)?.name || ""
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {employees?.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id.toString()}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleInputChange}
                required
              />
            </div>
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

export default ActualLabourDialogForm;