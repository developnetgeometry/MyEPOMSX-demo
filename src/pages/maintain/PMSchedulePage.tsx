import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Filter,
  Download,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import { useLoadingState } from "@/hooks/use-loading-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ManageDialog from "@/components/manage/ManageDialog";
import * as z from "zod";
import { formatCurrency, formatDate } from "@/utils/formatters";
import {
  useCreatePMSchedule,
  useDeletePMSchedule,
  useDisciplineOptions,
  useFrequencyOptions,
  useMaintenanceOptions,
  usePackageOptions,
  usePMSchedules,
  usePriorityOptions,
  useTaskOptions,
  useUpdatePMSchedule,
  useWorkCenterOptions,
} from "@/hooks/queries/usePMSchedule";
import StatusBadge from "@/components/shared/StatusBadge";
import { useAssets } from "@/hooks/queries/useAssets";
import { useToast } from "@/hooks/use-toast";

interface PMSchedule {
  id: string;
  pmNo: string;
  description: string;
  packageNo?: string;
  asset: string;
  tasks?: string;
  frequency: string;
  workCenter?: string;
  nextDueDate: string;
  status: string;
  manHour?: number;
  manPower?: number;
  duration?: number;
}

const PMSchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split("T")[0];
  });
  const [selectedAsset, setSelectedAsset] = useState<string>("all");
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [isCreatePMDialogOpen, setIsCreatePMDialogOpen] = useState(false);
  const { data: pmSchedules, isLoading, error } = usePMSchedules();
  const createPMScheduleMutation = useCreatePMSchedule();
  const deletePMScheduleMutation = useDeletePMSchedule();
  const [filteredPMSchedules, setFilteredPMSchedules] = useState(
    pmSchedules || []
  );

  useEffect(() => {
    setFilteredPMSchedules(pmSchedules || []);
  }, [pmSchedules]);

  // Loading states
  const { isLoading: isSearching, withLoading: withSearchLoading } =
    useLoadingState();
  const { isLoading: isGenerating, withLoading: withGenerateLoading } =
    useLoadingState();
  const { isLoading: isDeleting, withLoading: withDeleteLoading } =
    useLoadingState();
  const { isLoading: isCreatingPM, withLoading: withCreatePMLoading } =
    useLoadingState();

  // Define columns
  const columns: Column[] = [
    { id: "pm_no", header: "PM No", accessorKey: "pm_no" },
    {
      id: "pm_description",
      header: "Description",
      accessorKey: "pm_description",
    },
    {
      id: "package_id",
      header: "Package No",
      accessorKey: "package.package_no",
    },
    { id: "asset_id", header: "Asset", accessorKey: "asset.asset_name" },
    { id: "task_id", header: "Tasks", accessorKey: "task.task_name" },
    { id: "frequency_id", header: "Frequency", accessorKey: "frequency.name" },
    {
      id: "work_center_id",
      header: "Work Center",
      accessorKey: "work_center.name",
    },
    {
      id: "due_date",
      header: "Due Date",
      accessorKey: "due_date",
      cell: (value) => formatDate(value),
    },
    {
      id: "is_active",
      header: "Status",
      accessorKey: "is_active",
      cell: (value) =>
        value ? (
          <StatusBadge status="Active" />
        ) : (
          <StatusBadge status="Inactive" />
        ),
    },
  ];

  const { data: assets = [] } = useAssets();
  const { data: maintenance = [] } = useMaintenanceOptions();
  const { data: priority = [] } = usePriorityOptions();
  const { data: discipline = [] } = useDisciplineOptions();
  const { data: packages = [] } = usePackageOptions();
  const { data: workCenter = [] } = useWorkCenterOptions();
  const { data: frequency = [] } = useFrequencyOptions();
  const { data: task = [] } = useTaskOptions();

  // Asset options for the select dropdown
  const assetOptions = assets?.map((asset) => ({
    value: String(asset.id),
    label: asset.asset_name,
  }));

  const maintenanceOptions = maintenance?.map((item) => ({
    value: String(item.id),
    label: item.name,
  }));

  const priorityOptions = priority?.map((priority) => ({
    value: String(priority.id),
    label: priority.name,
  }));

  const disciplineOptions = discipline?.map((discipline) => ({
    value: String(discipline.id),
    label: discipline.name,
  }));

  const packageOptions = packages?.map((packages) => ({
    value: String(packages.id),
    label: packages.package_no,
  }));

  const workCenterOptions = workCenter?.map((workCenter) => ({
    value: String(workCenter.id),
    label: workCenter.name,
  }));

  const frequencyOptions = frequency?.map((frequency) => ({
    value: String(frequency.id),
    label: frequency.name,
  }));

  const taskOptions = task?.map((task) => ({
    value: String(task.id),
    label: task.task_name,
  }));

  // Generate sample PM schedules
  const generateSampleSchedules = () => {
    const frequencies = [
      "Weekly",
      "Monthly",
      "Quarterly",
      "Semi-Annually",
      "Annually",
    ];
    const statuses = ["Scheduled", "In Progress", "Completed", "Overdue"];

    // Generate random PM schedules
    const schedules: PMSchedule[] = Array.from({ length: 10 }, (_, i) => {
      const asset = assets[Math.floor(Math.random() * assets.length)];
      const frequency =
        frequencies[Math.floor(Math.random() * frequencies.length)];

      // Generate a random date between start and end date
      const startTimestamp = new Date(startDate).getTime();
      const endTimestamp = new Date(endDate).getTime();
      const randomTimestamp =
        startTimestamp + Math.random() * (endTimestamp - startTimestamp);
      const randomDate = new Date(randomTimestamp).toISOString().split("T")[0];

      return {
        id: `PM-${1000 + i}`,
        pmNo: `PM-${1000 + i}`,
        description: `Preventive Maintenance for ${asset.asset_name}`,
        asset: asset.asset_name,
        frequency,
        nextDueDate: randomDate,
        status: statuses[Math.floor(Math.random() * statuses.length)],
      };
    });

    // If asset filter is applied
    if (selectedAsset && selectedAsset !== "all") {
      const assetName =
        assetOptions.find((opt) => opt.label === selectedAsset)?.label || "";
      return schedules.filter((schedule) => schedule.asset === assetName);
    }

    return schedules;
  };

  const pmFormSchema = z.object({
    pm_no: z.string().min(1, "PM No is required"),
    due_date: z.string().min(1, "Due Date is required"),
    maintenance_id: z.string().min(1, "Maintenance is required"),
    is_active: z.boolean().default(true),
    priority_id: z.string().min(1, "Priority is required"),
    work_center_id: z.string().min(1, "Work Center is required"),
    discipline_id: z.string().min(1, "Discipline is required"),
    task_id: z.string().min(1, "Task is required"),
    frequency_id: z.string().min(1, "Frequency is required"),
    asset_id: z.string().min(1, "At least one asset is required"),
    pm_description: z.string().min(1, "Description is required"),
  });

  // Form fields for PM creation
  const pmFormFields = [
    { name: "pm_no", label: "PM No", type: "text" as const, required: true },
    {
      name: "due_date",
      label: "Due Date",
      type: "date" as const,
      required: true,
    },
    {
      name: "maintenance_id",
      label: "Maintenance",
      type: "select" as const,
      required: true,
      options: maintenanceOptions,
    },
    {
      name: "priority_id",
      label: "Priority",
      type: "select" as const,
      required: true,
      options: priorityOptions,
    },
    {
      name: "work_center_id",
      label: "Work Center",
      type: "select" as const,
      required: true,
      options: workCenterOptions,
    },
    {
      name: "package_id",
      label: "Package",
      type: "select" as const,
      required: true,
      options: packageOptions,
    },
    {
      name: "discipline_id",
      label: "Discipline",
      type: "select" as const,
      required: true,
      options: disciplineOptions,
    },
    {
      name: "task_id",
      label: "Task",
      type: "select" as const,
      required: true,
      options: taskOptions,
    },
    {
      name: "frequency_id",
      label: "Frequency",
      type: "select" as const,
      required: true,
      options: frequencyOptions,
    },
    {
      name: "asset_id",
      label: "Asset",
      type: "select" as const,
      options: assetOptions,
      required: true,
    },
    {
      name: "pm_description",
      label: "Description",
      type: "text" as const,
      required: true,
    },
  ];

  const pmDefaultValues = {
    pm_no: "",
    due_date: new Date().toISOString().split("T")[0],
    maintenance_id: "",
    is_active: true,
    priority_id: "",
    work_center_id: "",
    discipline_id: "",
    package_id: "",
    task_id: "",
    frequency_id: "",
    asset_id: "",
    pm_description: "",
  };

  const isDateInRange = (date: string, start: string, end: string) => {
    const dateObj = new Date(date);
    const startObj = new Date(start);
    const endObj = new Date(end);
    return dateObj >= startObj && dateObj <= endObj;
  };

  // Handlers
  // Updated handleSearch function with proper date filtering and defaults
  const handleSearch = async () => {
    // Determine effective start and end dates
    const effectiveStartDate =
      startDate || new Date().toISOString().split("T")[0]; // Default to today if not set
    const effectiveEndDate = endDate || null; // Keep null if not set

    // Only validate dates if both are provided
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      toast({
        title: "Error",
        description: "Start date must be before end date",
        variant: "destructive",
      });
      return;
    }

    await withSearchLoading(async () => {
      try {
        let filtered = pmSchedules || [];

        if (!startDate && !endDate) {
        } else {
          filtered = filtered.filter((schedule) => {
            if (!schedule.due_date) {
              return false;
            }

            const scheduleDate = new Date(schedule.due_date);
            const startDateObj = new Date(effectiveStartDate);

            if (!effectiveEndDate) {
              return scheduleDate >= startDateObj;
            }

            // Both dates are set, filter by range
            const endDateObj = new Date(effectiveEndDate);
            return scheduleDate >= startDateObj && scheduleDate <= endDateObj;
          });
        }

        if (selectedAsset && selectedAsset !== "all") {
          filtered = filtered.filter(
            (schedule) => String(schedule.asset_id) === selectedAsset
          );
        }

        setFilteredPMSchedules(filtered);

        toast({
          title: "Search completed",
          description: `Found ${filtered.length} PM schedule(s) matching your criteria.`,
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Search failed",
          description: "An error occurred while searching. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const handleGenerateSchedule = async () => {
    await withGenerateLoading(async () => {
      await generateSampleSchedules();
    });
  };

  const handleDelete = async (item: PMSchedule) => {
    withDeleteLoading(async () => {
      try {
        await deletePMScheduleMutation.mutateAsync(Number(item.id));
        toast({
          title: "PM Schedule deleted successfully",
          variant: "default",
        });
      } catch (error: any) {
        toast({
          title: "Error deleting PM Schedule",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  const handleRowClick = (row: PMSchedule) => {
    navigate(`/maintain/pm-schedule/${row.id}`);
  };

  // Fixed the handleCreatePM function
  const handleCreatePM = async (values: z.infer<typeof pmFormSchema>) => {
    try {
      await createPMScheduleMutation.mutateAsync({
        asset_id: Number(values.asset_id),
        discipline_id: Number(values.discipline_id),
        due_date: values.due_date,
        frequency_id: Number(values.frequency_id),
        is_active: Boolean(values.is_active),
        maintenance_id: Number(values.maintenance_id),
        pm_description: values.pm_description,
        pm_no: values.pm_no,
        priority_id: Number(values.priority_id),
        task_id: Number(values.task_id),
        work_center_id: Number(values.work_center_id),
      });

      toast({
        title: "PM Schedule created successfully",
        variant: "default",
      });

      setIsCreatePMDialogOpen(false); // Close dialog on success
    } catch (error: any) {
      toast({
        title: "Error creating PM Schedule",
        description: error?.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="PM Schedule"
        onSearch={(query) => console.log("Search:", query)}
      />

      <div className="bg-white p-4 rounded-md border shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Schedule Parameters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="startDate"
              className="text-sm font-medium text-gray-700"
            >
              Start Date
            </label>
            <div className="relative">
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={isSearching || isGenerating}
                className="pl-3 pr-8"
              />
              <Calendar
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="endDate"
              className="text-sm font-medium text-gray-700"
            >
              End Date
            </label>
            <div className="relative">
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={isSearching || isGenerating}
                className="pl-3 pr-8"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="asset"
              className="text-sm font-medium text-gray-700"
            >
              Asset (Optional)
            </label>
            <Select
              value={selectedAsset}
              onValueChange={setSelectedAsset}
              disabled={isSearching || isGenerating}
            >
              <SelectTrigger id="asset">
                <SelectValue placeholder="Select Asset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assets</SelectItem>
                {assetOptions.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleSearch}
            disabled={isSearching || isGenerating}
            className="flex items-center gap-2"
          >
            {isSearching ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Searching...
              </>
            ) : (
              <>
                <Filter className="h-4 w-4" /> Search
              </>
            )}
          </Button>

          <Button
            variant="outline"
            disabled={
              isSearching || isGenerating || createPMScheduleMutation.isPending
            }
            className="flex items-center gap-2"
            onClick={() => setIsCreatePMDialogOpen(true)}
          >
            <Plus className="h-4 w-4" /> Create PM Schedule
          </Button>

          <AlertDialog
            open={isGenerateDialogOpen}
            onOpenChange={setIsGenerateDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                disabled={isSearching || isGenerating}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Auto Generate
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Generate PM Schedule</AlertDialogTitle>
                <AlertDialogDescription>
                  This will create new preventive maintenance schedules for all
                  applicable assets in the system. Do you want to continue?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isGenerating}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleGenerateSchedule}
                  disabled={isGenerating}
                  className="flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Generating...
                    </>
                  ) : (
                    "Generate"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredPMSchedules}
        onDelete={handleDelete}
        onRowClick={handleRowClick}
      />

      {filteredPMSchedules.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No PM schedules found. Use the search filters above or generate a
            new schedule.
          </p>
        </div>
      )}

      <ManageDialog
        open={isCreatePMDialogOpen}
        onOpenChange={setIsCreatePMDialogOpen}
        title="Create PM Schedule"
        formSchema={pmFormSchema}
        defaultValues={pmDefaultValues}
        formFields={pmFormFields}
        onSubmit={handleCreatePM}
        isProcessing={createPMScheduleMutation.isPending}
      />
    </div>
  );
};

export default PMSchedulePage;
