import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import { useQueryClient } from "@tanstack/react-query";
import {
  usePmScheduleData,
  insertPmScheduleData
} from "../hooks/use-pm-schedule-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Loading from "@/components/shared/Loading";
import { useToast } from "@/hooks/use-toast";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatDate } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import PMScheduleDialogForm from "./PMScheduleDialogForm";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { createWorkOrderMany } from "../hooks/use-pm-work-generate";

const PMSchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: pmSchedules, isLoading, refetch } = usePmScheduleData();
  const { user, loading: authLoading } = useAuth();
  const [start_date, setStartDate] = useState<string | null>(null);
  const [end_date, setEndDate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any | null>(null);
  const { toast } = useToast();


  const handleRowClick = (row: any) => {
    navigate(`/maintain/pm-schedule/${row.id}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddNew = () => {
    setEditingSchedule(null);
    setIsDialogOpen(true);
  };


  const handleFormSubmit = async (formData: any) => {
    try {
      await insertPmScheduleData(formData);
      toast({
        title: "Success",
        description: "PM Schedule added successfully!",
        variant: "default",
      });

      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Failed to save PM Schedule data:", error);
      toast({
        title: "Error",
        description: "Failed to save PM Schedule data.",
        variant: "destructive",
      });
    }
  };

const { filteredSchedules, readyToGenerateCount } = useMemo(() => {
  if (!pmSchedules) return { filteredSchedules: [], readyToGenerateCount: 0 };

  let filtered = pmSchedules;

  // Filter by search query
  if (searchQuery) {
    const lower = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (schedule: any) =>
        schedule.pm_no?.toLowerCase().includes(lower) ||
        schedule.pm_description?.toLowerCase().includes(lower) ||
        schedule.asset_id?.asset_name?.toLowerCase().includes(lower) ||
        schedule.work_center_id?.name?.toLowerCase().includes(lower) ||
        schedule.frequency_id?.name?.toLowerCase().includes(lower)
    );
  }

  // Filter by start_date, end_date, and is_active = true
  if (start_date || end_date) {
    filtered = filtered.filter((schedule: any) => {
      const dueDate = new Date(schedule.due_date).getTime();
      const startDate = start_date ? new Date(start_date).getTime() : null;
      const endDate = end_date ? new Date(end_date).getTime() : null;

      const isWithinDateRange =
        (startDate && endDate && dueDate >= startDate && dueDate <= endDate) ||
        (startDate && dueDate >= startDate) ||
        (endDate && dueDate <= endDate);

      return schedule.is_active && isWithinDateRange; // Ensure is_active is true
    });
  }

  // Count PM Schedules ready to be generated
  const readyToGenerateCount = filtered.filter(
    (schedule: any) => schedule.is_active && !schedule.is_deleted
  ).length;

  return { filteredSchedules: filtered, readyToGenerateCount };
}, [pmSchedules, searchQuery, start_date, end_date]);

  const handleCreateWoMany = async () => {
    if (!start_date || !end_date) {
      toast({
        title: "Error",
        description: "Please enter both Start Date and End Date.",
        variant: "destructive",
      });
      return;
    }

    try {
      const pm_schedule_ids = filteredSchedules
        .map((schedule: any) => schedule.id)
        .filter((id: number | null) => id !== null); // Filter out null values

      const frequency_ids = filteredSchedules
        .map((schedule: any) => schedule.frequency_id?.id)
        .filter((id: number | null) => id !== null); // Filter out null values

      const due_dates = filteredSchedules
        .map((schedule: any) => schedule.due_date)
        .filter((due_date: string | null) => due_date !== null); // Filter out null values

      if (pm_schedule_ids.length === 0) {
        toast({
          title: "Error",
          description: "No valid PM Schedules found to create work orders.",
          variant: "destructive",
        });
        return;
      }

      await createWorkOrderMany({
        start_date,
        end_date,
        created_by: user.id, // Use the logged-in user's ID
        pm_schedule_ids,
        frequency_ids,
        due_dates, // Include due_dates in the payload
      });

      toast({
        title: "Success",
        description: "Work orders created successfully!",
        variant: "default",
      });

      refetch(); // Refresh the PM Schedules data
      queryClient.invalidateQueries({ queryKey: ["e-work-order-data"] });
      queryClient.invalidateQueries({ queryKey: ["e-pm-schedule-data"] });
    } catch (error) {
      console.error("Failed to create work orders:", error);
      toast({
        title: "Error",
        description: "Failed to create work orders.",
        variant: "destructive",
      });
    }
  };

  const columns: Column[] = [
    { id: "pm_no", header: "PM No", accessorKey: "pm_no" },
    { id: "pm_description", header: "Description", accessorKey: "pm_description" },
    { id: "asset", header: "Asset", accessorKey: "asset_id.asset_name" },
    { id: "work_center", header: "Work Center", accessorKey: "work_center_id.name" },
    { id: "frequency", header: "Frequency", accessorKey: "frequency_id.name" },
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
        value ? <StatusBadge status="Active" /> : <StatusBadge status="Inactive" />,
    },
  ];

  return (
    <div className="space-y-6">

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
                value={start_date || ""}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-3 pr-8"
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
                value={end_date || ""}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-3 pr-8"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {(end_date || start_date) && (
            <div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                }}
              >
                <X className="h-4 w-4 mr-1 text-white" />
                Clear Dates
              </Button>
            </div>
          )}
        </div>
        <div className="flex gap-2">

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleCreateWoMany}
          >
            <Plus className="h-4 w-4" /> Create Work Order
          </Button>
        </div>

        <div className="text-sm font-medium text-gray-700">
          PM Schedules ready to be generated: {readyToGenerateCount}
        </div>
      </div>
      {/* <pre>{JSON.stringify(filteredSchedules, null, 2)}</pre> */}


      <PageHeader
        title="PM Schedules"
        onAddNew={handleAddNew}
        addNewLabel="New PM Schedule"
        onSearch={handleSearch}
      />

      {(isLoading || authLoading) ? (
        <Loading />
      ) : (
        <DataTable
          columns={columns}
          data={filteredSchedules}
          onRowClick={handleRowClick}
          onIndex={true}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between w-full">
              <div>
                <DialogTitle>
                  {editingSchedule ? "Edit PM Schedule" : "Add New PM Schedule"}
                </DialogTitle>
                <DialogDescription>
                  {editingSchedule
                    ? "Update the details of the PM Schedule."
                    : "Fill in the details to add a new PM Schedule."}
                </DialogDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <PMScheduleDialogForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
            initialData={editingSchedule}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PMSchedulePage;