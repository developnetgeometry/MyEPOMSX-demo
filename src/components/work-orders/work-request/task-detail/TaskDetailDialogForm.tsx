import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loading from "@/components/shared/Loading"; // Import the Loading component

interface TaskDetailDialogFormProps {
  onSubmit: (formData: any) => Promise<void>; // Assuming onSubmit is async
  onCancel: () => void;
  initialData?: any; // Optional initial data for editing
}

const TaskDetailDialogForm: React.FC<TaskDetailDialogFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    task_sequence: initialData?.task_sequence || "",
    task_list: initialData?.task_list || "",
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
      {isLoading ? ( // Show the Loading component if isLoading is true
        <Loading />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label htmlFor="task_sequence">Task Sequence</Label>
              <Input
                id="task_sequence"
                name="task_sequence"
                type="number"
                value={formData.task_sequence}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="task_list">Task List</Label>
              <Input
                id="task_list"
                name="task_list"
                value={formData.task_list}
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

export default TaskDetailDialogForm;