import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loading from "@/components/shared/Loading"; // Import the Loading component
import { useClientData } from "../hooks/use-client-data";
import { useProjectTypeData } from "@/hooks/lookup/lookup-project_type";
import { Textarea } from "@/components/ui/textarea";

interface ProjectDialogFormProps {
  onSubmit: (formData: any) => Promise<void>; // Assuming onSubmit is async
  onCancel: () => void;
  initialData?: any; // Optional initial data for editing
}

const ProjectDialogForm: React.FC<ProjectDialogFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const { data: clients } = useClientData();
  const { data: projectTypes } = useProjectTypeData();
  const [formData, setFormData] = useState({
    project_code: initialData?.project_code || "",
    client_id: initialData?.client_id || "",
    project_type: initialData?.project_type?.id || "",
    project_name: initialData?.project_name || "",
    short_name: initialData?.short_name || "",
    start_date: initialData?.start_date
      ? new Date(initialData.start_date).toISOString().split("T")[0] // Format to YYYY-MM-DD
      : "",
    end_date: initialData?.end_date
      ? new Date(initialData.end_date).toISOString().split("T")[0] // Format to YYYY-MM-DD
      : "",
    fund_code: initialData?.fund_code || "",
    project_purpose: initialData?.project_purpose || "",
    remark: initialData?.remark || "",
    latitude: initialData?.latitude || "",
    longitude: initialData?.longitude || "",
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project_code">Project Code</Label>
              <Input
                id="project_code"
                name="project_code"
                value={formData.project_code}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client_id">Client</Label>
              <Select
                value={formData.client_id?.toString()}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, client_id: value }))}>
                <SelectTrigger id="client_id" className="w-full">
                  <SelectValue placeholder="Select Client" />
                </SelectTrigger>
                <SelectContent>
                  {clients?.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {`${client.code} - ${client.name}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="project_name">Project Name</Label>
              <Input
                id="project_name"
                name="project_name"
                value={formData.project_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="short_name">Short Name</Label>
              <Input
                id="short_name"
                name="short_name"
                value={formData.short_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project_type">Project Type</Label>
              <Select
                value={formData.project_type?.toString()} // Ensure this is the ID of the project type
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, project_type: parseInt(value) })) // Store the ID as a number
                }
              >
                <SelectTrigger id="project_type" className="w-full">
                  <SelectValue
                    placeholder="Select Project Type"
                    defaultValue={projectTypes?.find((type) => type.id === formData.project_type)?.name || ""}
                  />
                </SelectTrigger>
                <SelectContent>
                  {projectTypes?.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fund_code">Fund Code</Label>
              <Input
                id="fund_code"
                name="fund_code"
                value={formData.fund_code}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="project_purpose">Project Purpose</Label>
              <Textarea
                id="project_purpose"
                name="project_purpose"
                value={formData.project_purpose}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="remark">Remark</Label>
              <Textarea
                id="remark"
                name="remark"
                value={formData.remark}
                onChange={handleInputChange}
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

export default ProjectDialogForm;