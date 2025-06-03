import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SimpleMultiSelect } from "@/components/ui/SimpleMultiSelect";
import {
  Select,
  SelectContent,
  SelectValue,
  SelectTrigger,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { DateInput } from "@/components/ui/date-input";

// Mock data for demonstration
const mockData = {
  priorities: [
    { id: 1, name: "High" },
    { id: 2, name: "Medium" },
    { id: 3, name: "Low" },
  ],
  workCenters: [
    { id: 1, name: "Work Center 1" },
    { id: 2, name: "Work Center 2" },
    { id: 3, name: "Work Center 3" },
  ],
  disciplines: [
    { id: 1, name: "Mechanical" },
    { id: 2, name: "Electrical" },
    { id: 3, name: "HVAC" },
  ],
  frequencies: [
    { id: 1, name: "Daily" },
    { id: 2, name: "Weekly" },
    { id: 3, name: "Monthly" },
    { id: 4, name: "Quarterly" },
    { id: 5, name: "Yearly" },
  ],
  assets: [
    { id: 1, name: "CNC Machine" },
    { id: 2, name: "Hydraulic Press" },
    { id: 3, name: "Conveyor System" },
  ],
  systems: [
    { id: 1, name: "Production Line" },
    { id: 2, name: "HVAC System" },
    { id: 3, name: "Electrical System" },
  ],
  packages: [
    { id: 1, name: "Basic Maintenance" },
    { id: 2, name: "Comprehensive Check" },
    { id: 3, name: "Full Overhaul" },
  ],
  pmGroups: [
    { id: 1, name: "Group A" },
    { id: 2, name: "Group B" },
    { id: 3, name: "Group C" },
  ],
  tasks: [
    { id: 1, name: "Inspect electrical connections" },
    { id: 2, name: "Lubricate moving parts" },
    { id: 3, name: "Check fluid levels" },
    { id: 4, name: "Test safety features" },
    { id: 5, name: "Clean and calibrate sensors" },
  ],
  facilities: [
    { id: 1, name: "Main Facility" },
    { id: 2, name: "North Building" },
    { id: 3, name: "Warehouse" },
  ],
};

const CreatePMSchedulePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pmNo: "",
    dueDate: "",
    isActive: true,
    priorityId: "",
    workCenterId: "",
    disciplineId: "",
    taskId: "",
    frequencyId: "",
    assetId: "",
    systemId: "",
    packageId: "",
    pmGroupId: "",
    pmDescription: "",
    facilityId: "",
    serviceNotes: "",
    checksheetNotes: "",
    additionalInfo: "",
    selectedTasks: [] as number[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTaskChange = (selected: number[]) => {
    setFormData((prev) => ({ ...prev, selectedTasks: selected }));
  };

  const handleDateChange = (date: string) => {
    setFormData((prev) => ({ ...prev, dueDate: date }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically call an API to save the data
    // navigate("/maintain/pm-schedule"); // Redirect after submission
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Create PM Schedule" />
        <Button
          variant="outline"
          onClick={() => navigate("/maintain/pm-schedule")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to PM Schedule
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <h3 className="text-lg font-semibold text-blue-600 border-b pb-2">
            Please fill in the details
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Basic Information */}
              <div className="space-y-2">
                <Label htmlFor="pmNo">
                  PM No<span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="pmNo"
                  name="pmNo"
                  value={formData.pmNo}
                  onChange={handleChange}
                  placeholder="PM001"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <DateInput
                  id="dueDate"
                  value={formData.dueDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="isActive">Active Status</Label>
                <Select
                  value={formData.isActive ? "true" : "false"}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: value === "true",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Priority and Work Center */}
              <div className="space-y-2">
                <Label htmlFor="priorityId">Priority</Label>
                <Select
                  value={formData.priorityId}
                  onValueChange={(value) =>
                    handleSelectChange("priorityId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockData.priorities.map((priority) => (
                      <SelectItem key={priority.id} value={String(priority.id)}>
                        {priority.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workCenterId">Work Center</Label>
                <Select
                  value={formData.workCenterId}
                  onValueChange={(value) =>
                    handleSelectChange("workCenterId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select work center" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockData.workCenters.map((center) => (
                      <SelectItem key={center.id} value={String(center.id)}>
                        {center.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="disciplineId">Discipline</Label>
                <Select
                  value={formData.disciplineId}
                  onValueChange={(value) =>
                    handleSelectChange("disciplineId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select discipline" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockData.disciplines.map((discipline) => (
                      <SelectItem
                        key={discipline.id}
                        value={String(discipline.id)}
                      >
                        {discipline.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Frequency and Tasks */}
              <div className="space-y-2">
                <Label htmlFor="frequencyId">Frequency</Label>
                <Select
                  value={formData.frequencyId}
                  onValueChange={(value) =>
                    handleSelectChange("frequencyId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockData.frequencies.map((frequency) => (
                      <SelectItem
                        key={frequency.id}
                        value={String(frequency.id)}
                      >
                        {frequency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="selectedTasks">Tasks</Label>
                <SimpleMultiSelect
                  options={mockData.tasks.map((task) => ({
                    value: String(task.id),
                    label: task.name,
                  }))}
                  selected={formData.selectedTasks.map(String)}
                  onChange={(selected) =>
                    handleTaskChange(selected.map(Number))
                  }
                  placeholder="Select tasks"
                />
              </div>

              {/* Asset and System */}
              <div className="space-y-2">
                <Label htmlFor="assetId">Asset</Label>
                <Select
                  value={formData.assetId}
                  onValueChange={(value) =>
                    handleSelectChange("assetId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockData.assets.map((asset) => (
                      <SelectItem key={asset.id} value={String(asset.id)}>
                        {asset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="systemId">System</Label>
                <Select
                  value={formData.systemId}
                  onValueChange={(value) =>
                    handleSelectChange("systemId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select system" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockData.systems.map((system) => (
                      <SelectItem key={system.id} value={String(system.id)}>
                        {system.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Package and PM Group */}
              <div className="space-y-2">
                <Label htmlFor="packageId">Package</Label>
                <Select
                  value={formData.packageId}
                  onValueChange={(value) =>
                    handleSelectChange("packageId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select package" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockData.packages.map((pkg) => (
                      <SelectItem key={pkg.id} value={String(pkg.id)}>
                        {pkg.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pmGroupId">PM Group</Label>
                <Select
                  value={formData.pmGroupId}
                  onValueChange={(value) =>
                    handleSelectChange("pmGroupId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select PM group" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockData.pmGroups.map((group) => (
                      <SelectItem key={group.id} value={String(group.id)}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="facilityId">Facility</Label>
                <Select
                  value={formData.facilityId}
                  onValueChange={(value) =>
                    handleSelectChange("facilityId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select facility" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockData.facilities.map((facility) => (
                      <SelectItem key={facility.id} value={String(facility.id)}>
                        {facility.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description and Notes */}
              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label htmlFor="pmDescription">PM Description</Label>
                <Textarea
                  id="pmDescription"
                  name="pmDescription"
                  value={formData.pmDescription}
                  onChange={handleChange}
                  placeholder="Describe the maintenance schedule..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label htmlFor="serviceNotes">Service Notes</Label>
                <Textarea
                  id="serviceNotes"
                  name="serviceNotes"
                  value={formData.serviceNotes}
                  onChange={handleChange}
                  placeholder="Enter any service notes..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label htmlFor="checksheetNotes">Checksheet Notes</Label>
                <Textarea
                  id="checksheetNotes"
                  name="checksheetNotes"
                  value={formData.checksheetNotes}
                  onChange={handleChange}
                  placeholder="Enter checksheet notes..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  placeholder="Enter any additional information..."
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate("/maintain/pm-schedule")}
              >
                Cancel
              </Button>
              <Button type="submit">Create Schedule</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePMSchedulePage;
