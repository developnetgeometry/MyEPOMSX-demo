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
import {
  useAssetOptions,
  useCreatePMSchedule,
  useDisciplineOptions,
  useFacilityOptions,
  useFrequencyOptions,
  useMaintenanceOptions,
  usePackageOptions,
  usePMGroupOptions,
  usePMSCEGroupOptions,
  usePriorityOptions,
  useSystemOptions,
  useTaskOptions,
  useWorkCenterOptions,
} from "@/hooks/queries/usePMSchedule";
import { useToast } from "@/hooks/use-toast";

interface PmSceGroup {
  id: number;
  sce_code: string;
}

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
  maintenanceId: z.string().min(1, "Maintenance is required"),
  systemId: z.string().optional(),
  packageId: z.string().min(1, "Package is required"),
  pmGroupId: z.string().optional(),
  pmSceGroupId: z.string().optional(),
  pmDescription: z.string().optional(),
  facilityId: z.string().min(1, "Facility is required"),
  serviceNotes: z.string().optional(),
  checksheetNotes: z.string().optional(),
  additionalInfo: z.string().optional(),
  selectedTasks: z.array(z.string()).min(1, "At least one task is required"),
});

type PMScheduleFormValues = z.infer<typeof pmScheduleSchema>;

const CreatePMSchedulePage = () => {
  const { data: tasks = [""], isLoading: tasksLoading } = useTaskOptions();
  const { data: priorities } = usePriorityOptions();
  const { data: workCenters } = useWorkCenterOptions();
  const { data: disciplines } = useDisciplineOptions();
  const { data: frequencies } = useFrequencyOptions();
  const { data: packages } = usePackageOptions();
  const { data: assets } = useAssetOptions();
  const { data: systems } = useSystemOptions();
  const { data: pmGroups } = usePMGroupOptions();
  const { data: pmSceGroups } = usePMSCEGroupOptions();
  const { data: maintenances } = useMaintenanceOptions();
  const { data: facilities } = useFacilityOptions();
  const { toast } = useToast();
  const createPMScheduleMutation = useCreatePMSchedule();

  const navigate = useNavigate();
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
  const [selectedPmSceGroupId, setSelectedPmSceGroupId] = useState("");
  // Watch selectedTasks to handle multi-select
  const selectedTasks = watch("selectedTasks");

  // Handle form submission
  const onSubmit = async (data: PMScheduleFormValues) => {
    // Transform data to snake_case and correct types
    const transformedData = {
      pm_no: data.pmNo,
      due_date: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      is_active: data.isActive,
      priority_id: Number(data.priorityId),
      work_center_id: Number(data.workCenterId),
      discipline_id: Number(data.disciplineId),
      maintenance_id: Number(data.maintenanceId),
      frequency_id: Number(data.frequencyId),
      asset_id: Number(data.assetId),
      system_id: data.systemId ? Number(data.systemId) : null,
      package_id: Number(data.packageId),
      pm_group_id: data.pmGroupId ? Number(data.pmGroupId) : null,
      pm_sce_group_id: data.pmSceGroupId ? Number(data.pmSceGroupId) : null,
      pm_description: data.pmDescription || null,
      facility_id: Number(data.facilityId),
      service_notes: data.serviceNotes || null,
      checksheet_notes: data.checksheetNotes || null,
      additional_info: data.additionalInfo || null,
      // For tasks, you'll need to create a junction table relationship
      // since your schema has a single task_id column
      task_id:
        data.selectedTasks.length > 0 ? Number(data.selectedTasks[0]) : null,
    };

    // Send to Supabase
    try {
      await createPMScheduleMutation.mutateAsync(transformedData, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "PM Schedule created successfully",
            variant: "default",
          });
        },
        onError: (error: any) => {
          console.log("Error creating PM Schedule:", error);
          toast({
            title: "Error creating PM Schedule",
            description: error?.message || "An error occurred",
            variant: "destructive",
          });
        },
      });
    } catch (error) {
      console.log("Error creating PM Schedule:", error);
      toast({
        title: "Error creating PM Schedule",
        description: error?.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  // Helper function to render error messages
  const renderError = (error: { message?: string }) => {
    return (
      error?.message && (
        <p className="mt-1 text-xs text-red-500">{error.message}</p>
      )
    );
  };

  if (tasksLoading) {
    return <div>Loading...</div>;
  }

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
                    {priorities?.map((priority) => (
                      <SelectItem key={priority.id} value={String(priority.id)}>
                        {priority.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {renderError(errors.priorityId)}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenanceId">
                  Maintenance<span className="text-red-500 ml-1">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setValue("maintenanceId", value)}
                >
                  <SelectTrigger
                    className={errors.maintenanceId ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select maintenance" />
                  </SelectTrigger>
                  <SelectContent>
                    {maintenances?.map((maintenance) => (
                      <SelectItem
                        key={maintenance.id}
                        value={String(maintenance.id)}
                      >
                        {maintenance.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {renderError(errors.maintenanceId)}
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
                    {workCenters?.map((center) => (
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
                    {disciplines?.map((discipline) => (
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
                    {frequencies?.map((frequency) => (
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
                  options={
                    tasks?.map((task) => ({
                      value: String(task.id),
                      label: task.task_name,
                    })) || []
                  }
                  selected={selectedTasks}
                  onChange={(selected) => setValue("selectedTasks", selected)}
                  placeholder="Select tasks"
                  className={errors.selectedTasks ? "border-red-500" : ""}
                />
                {renderError(errors.selectedTasks)}
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
                    {facilities?.map((facility) => (
                      <SelectItem key={facility.id} value={String(facility.id)}>
                        {facility.location_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {renderError(errors.facilityId)}
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
                    {assets?.map((asset) => (
                      <SelectItem key={asset.id} value={String(asset.id)}>
                        {asset.asset_name}
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
                    {systems?.map((system) => (
                      <SelectItem key={system.id} value={String(system.id)}>
                        {system.system_name}
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
                    {packages?.map((pkg) => (
                      <SelectItem key={pkg.id} value={String(pkg.id)}>
                        {pkg.package_name}
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
                    {pmGroups?.map((group) => (
                      <SelectItem key={group.id} value={String(group.id)}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pmSceGroupId">
                  PM SCE Code<span className="text-red-500 ml-1">*</span>
                </Label>
                <SearchableSelect
                  options={pmSceGroups || []}
                  value={selectedPmSceGroupId || null}
                  onChange={(selected) => {
                    const value = selected ? String(selected) : "";
                    setSelectedPmSceGroupId(value);
                    setValue("pmSceGroupId", value); // Still update the form for validation
                  }}
                  placeholder="Select PM SCE Code"
                  searchBy={(item: PmSceGroup) => [item.sce_code || ""].filter(Boolean)}
                  getLabel={(item: PmSceGroup) => item.sce_code || ""}
                  getValue={(item: PmSceGroup) => String(item.id)}
                  disabled={false}
                />
                {renderError(errors.pmSceGroupId)}
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

              {/* <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label htmlFor="serviceNotes">Service Notes</Label>
                <Textarea
                  id="serviceNotes"
                  placeholder="Enter any service notes..."
                  className="min-h-[100px]"
                  {...register("serviceNotes")}
                />
              </div> */}

              {/* <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label htmlFor="checksheetNotes">Checksheet Notes</Label>
                <Textarea
                  id="checksheetNotes"
                  placeholder="Enter checksheet notes..."
                  className="min-h-[100px]"
                  {...register("checksheetNotes")}
                />
              </div> */}

              {/* <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Enter any additional information..."
                  className="min-h-[100px]"
                  {...register("additionalInfo")}
                />
              </div> */}
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
