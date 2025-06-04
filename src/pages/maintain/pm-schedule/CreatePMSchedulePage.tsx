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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

// Zod validation schema
const pmScheduleSchema = z.object({
  pmNo: z.string().min(1, "PM No is required"),
  dueDate: z.string().optional(),
  isActive: z.boolean().default(true),
  priorityId: z.string().min(1, "Priority is required"),
  workCenterId: z.string().min(1, "Work Center is required"),
  disciplineId: z.string().min(1, "Discipline is required"),
  frequencyId: z.string().min(1, "Frequency is required"),
  assetId: z.string().min(1, "Asset is required"),
  systemId: z.string().optional(),
  packageId: z.string().min(1, "Package is required"),
  pmGroupId: z.string().optional(),
  pmDescription: z.string().optional(),
  facilityId: z.string().min(1, "Facility is required"),
  serviceNotes: z.string().optional(),
  checksheetNotes: z.string().optional(),
  additionalInfo: z.string().optional(),
  selectedTasks: z.array(z.string()).min(1, "At least one task is required"),
});

type PMScheduleFormValues = z.infer<typeof pmScheduleSchema>;

const CreatePMSchedulePage = () => {
  const navigate = useNavigate();

  // Initialize react-hook-form with Zod resolver
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PMScheduleFormValues>({
    resolver: zodResolver(pmScheduleSchema),
    defaultValues: {
      isActive: true,
      selectedTasks: [],
    },
  });

  // Watch selectedTasks to handle multi-select
  const selectedTasks = watch("selectedTasks");

  // Handle form submission
  const onSubmit = (data: PMScheduleFormValues) => {
    console.log("Form data submitted:", data);
    // Here you would typically call an API to save the data
    navigate("/maintain/pm-schedule"); // Redirect after submission
  };

  // Helper function to render error messages
  const renderError = (error: { message?: string }) => {
    return (
      error?.message && (
        <p className="mt-1 text-xs text-red-500">{error.message}</p>
      )
    );
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Basic Information */}
              <div className="space-y-2">
                <Label htmlFor="pmNo">
                  PM No<span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="pmNo"
                  placeholder="PM001"
                  {...register("pmNo")}
                  className={errors.pmNo ? "border-red-500" : ""}
                />
                {renderError(errors.pmNo)}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <DateInput
                  id="dueDate"
                  onChange={(e) => setValue("dueDate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="isActive">Active Status</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("isActive", value === "true")
                  }
                  defaultValue="true"
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
                <Label htmlFor="priorityId">
                  Priority<span className="text-red-500 ml-1">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setValue("priorityId", value)}
                >
                  <SelectTrigger
                    className={errors.priorityId ? "border-red-500" : ""}
                  >
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
                {renderError(errors.priorityId)}
              </div>

              <div className="space-y-2">
                <Label htmlFor="workCenterId">
                  Work Center<span className="text-red-500 ml-1">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setValue("workCenterId", value)}
                >
                  <SelectTrigger
                    className={errors.workCenterId ? "border-red-500" : ""}
                  >
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
                {renderError(errors.workCenterId)}
              </div>

              <div className="space-y-2">
                <Label htmlFor="disciplineId">
                  Discipline<span className="text-red-500 ml-1">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setValue("disciplineId", value)}
                >
                  <SelectTrigger
                    className={errors.disciplineId ? "border-red-500" : ""}
                  >
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
                {renderError(errors.disciplineId)}
              </div>

              {/* Frequency and Tasks */}
              <div className="space-y-2">
                <Label htmlFor="frequencyId">
                  Frequency<span className="text-red-500 ml-1">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setValue("frequencyId", value)}
                >
                  <SelectTrigger
                    className={errors.frequencyId ? "border-red-500" : ""}
                  >
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
                {renderError(errors.frequencyId)}
              </div>

              <div className="space-y-2">
                <Label htmlFor="selectedTasks">
                  Tasks<span className="text-red-500 ml-1">*</span>
                </Label>
                <SimpleMultiSelect
                  options={mockData.tasks.map((task) => ({
                    value: String(task.id),
                    label: task.name,
                  }))}
                  selected={selectedTasks}
                  onChange={(selected) => setValue("selectedTasks", selected)}
                  placeholder="Select tasks"
                  className={errors.selectedTasks ? "border-red-500" : ""}
                />
                {renderError(errors.selectedTasks)}
              </div>

              {/* Asset and System */}
              <div className="space-y-2">
                <Label htmlFor="assetId">
                  Asset<span className="text-red-500 ml-1">*</span>
                </Label>
                <Select onValueChange={(value) => setValue("assetId", value)}>
                  <SelectTrigger
                    className={errors.assetId ? "border-red-500" : ""}
                  >
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
                {renderError(errors.assetId)}
              </div>

              <div className="space-y-2">
                <Label htmlFor="systemId">System</Label>
                <Select onValueChange={(value) => setValue("systemId", value)}>
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
                <Label htmlFor="packageId">
                  Package<span className="text-red-500 ml-1">*</span>
                </Label>
                <Select onValueChange={(value) => setValue("packageId", value)}>
                  <SelectTrigger
                    className={errors.packageId ? "border-red-500" : ""}
                  >
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
                {renderError(errors.packageId)}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pmGroupId">PM Group</Label>
                <Select onValueChange={(value) => setValue("pmGroupId", value)}>
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
                <Label htmlFor="facilityId">
                  Facility<span className="text-red-500 ml-1">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setValue("facilityId", value)}
                >
                  <SelectTrigger
                    className={errors.facilityId ? "border-red-500" : ""}
                  >
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
                {renderError(errors.facilityId)}
              </div>

              {/* Description and Notes */}
              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label htmlFor="pmDescription">PM Description</Label>
                <Textarea
                  id="pmDescription"
                  placeholder="Describe the maintenance schedule..."
                  className="min-h-[100px]"
                  {...register("pmDescription")}
                />
              </div>

              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label htmlFor="serviceNotes">Service Notes</Label>
                <Textarea
                  id="serviceNotes"
                  placeholder="Enter any service notes..."
                  className="min-h-[100px]"
                  {...register("serviceNotes")}
                />
              </div>

              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label htmlFor="checksheetNotes">Checksheet Notes</Label>
                <Textarea
                  id="checksheetNotes"
                  placeholder="Enter checksheet notes..."
                  className="min-h-[100px]"
                  {...register("checksheetNotes")}
                />
              </div>

              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Enter any additional information..."
                  className="min-h-[100px]"
                  {...register("additionalInfo")}
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Schedule"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePMSchedulePage;
