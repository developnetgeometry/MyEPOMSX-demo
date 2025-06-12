import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, X } from "lucide-react";
import { System } from "@/types/manage";
import {
  useCreateSystem,
  useSystems,
  useDeleteSystem,
  useUpdateSystem,
} from "@/hooks/queries/useSystems";
import { useLoadingState } from "@/hooks/use-loading-state";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFacilityOptions } from "@/hooks/queries/usePMSchedule";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const systemFormSchema = z.object({
  facility_id: z.number().min(1, "Please select a facility"),
  system_code: z.string().min(1, "System code is required"),
  system_name: z.string().min(1, "System name is required"),
  is_active: z.boolean().default(true),
});

type SystemFormValues = {
  facility_id: number;
  system_code: string;
  system_name: string;
  is_active: boolean;
};

const SystemPage: React.FC = () => {
  const { data: facilities } = useFacilityOptions();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSystem, setNewSystem] = useState({
    system_code: "",
    system_name: "",
    is_active: true,
    facility_id: null,
    system_no: null,
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState<System | null>(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSystems, setFilteredSystems] = useState<System[]>([]);

  const { isLoading: isProcessing, withLoading } = useLoadingState();

  // Query to fetch systems
  const { data: systems, isLoading } = useSystems();
  const addSystemMutation = useCreateSystem();
  const updateSystemMutation = useUpdateSystem();
  const deleteSystemMutation = useDeleteSystem();

  const form = useForm<SystemFormValues>({
    resolver: zodResolver(systemFormSchema),
    defaultValues: {
      facility_id: null as unknown as number, // TypeScript workaround
      system_code: "",
      system_name: "",
      is_active: true,
    },
  });
  const facilityId = form.watch("facility_id");
  const systemCode = form.watch("system_code");

  // Compute system number
  const systemNumber = useMemo(() => {
    if (!facilityId || !systemCode) return "";

    const selectedFacility = facilities.find((f) => f.id === facilityId);
    if (!selectedFacility) return "";

    return `${selectedFacility.location_code}-${systemCode}`;
  }, [facilityId, systemCode, facilities]);

  useEffect(() => {
    if (!systems) return;

    let filtered = systems;
    if (searchTerm.trim()) {
      filtered = systems.filter(
        (item) =>
          item.system_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.system_code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSystems((prev) => {
      if (
        prev.length === filtered.length &&
        prev.every((v, i) => v.id === filtered[i].id)
      ) {
        return prev;
      }
      return filtered;
    });

    if (filtered.length === 0 && searchTerm.trim() !== "") {
      toast({
        title: "No matching systems found",
        description: "Please try a different search term.",
        variant: "destructive",
      });
    }
  }, [systems, searchTerm]);

  useEffect(() => {
    if (!isDialogOpen) {
      form.reset({
        facility_id: null as unknown as number,
        system_code: "",
        system_name: "",
        is_active: true,
      });
    }
    return () => {
      form.reset({
        facility_id: null as unknown as number,
        system_code: "",
        system_name: "",
        is_active: true,
      });
    };
  }, [isDialogOpen, form]);

  // Initialize form in edit mode
  useEffect(() => {
    if (isDialogOpen && isEditMode && currentItem) {
      form.reset({
        facility_id: currentItem.facility_id,
        system_code: currentItem.system_code,
        system_name: currentItem.system_name || "",
        is_active: currentItem.is_active,
      });
    }
  }, [isDialogOpen, isEditMode, currentItem]);

  const handleAddNew = () => {
    setIsEditMode(false);
    setCurrentItem(null);
    // Reset form to blank/default values before opening
    form.reset({
      facility_id: null as unknown as number,
      system_code: "",
      system_name: "",
      is_active: true,
    });
    setIsDialogOpen(true);
  };
  const handleEdit = (item: System) => {
    setIsEditMode(true);
    setCurrentItem(item);
    setNewSystem({
      system_code: item.system_code,
      system_name: item.system_name || "",
      is_active: item.is_active,
      facility_id: item.facility_id,
      system_no: item.system_no,
    });
    setIsDialogOpen(true);
  };

  // Handle search function
  const handleSearch = useCallback((query: string) => {
    setSearchTerm(query);
  }, []);

  const handleSubmit = async (values: SystemFormValues) => {
    withLoading(async () => {
      try {
        const systemData = {
          ...values,
          system_no: systemNumber,
        };

        if (isEditMode && currentItem) {
          await updateSystemMutation.mutateAsync({
            ...currentItem,
            ...systemData,
          });
          toast({ title: "System updated successfully" });
        } else {
          await addSystemMutation.mutateAsync(systemData);
          toast({ title: "System created successfully" });
        }

        setIsDialogOpen(false);
      } catch (error: any) {
        toast({
          title: isEditMode ? "Error updating system" : "Error creating system",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  const handleDelete = async (item: System) => {
    if (!window.confirm("Are you sure you want to delete this system?")) return;

    withLoading(async () => {
      try {
        await deleteSystemMutation.mutateAsync(item.id);
        toast({ title: "System deleted successfully" });
        queryClient.invalidateQueries({ queryKey: ["systems"] });
      } catch (error: any) {
        toast({
          title: "Error deleting system",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  const columns: Column[] = React.useMemo(
    () => [
      {
        id: "system_code",
        header: "System ID",
        accessorKey: "system_code",
      },
      {
        id: "system_name",
        header: "Name",
        accessorKey: "system_name",
      },
      {
        id: "system_no",
        header: "System Number",
        accessorKey: "system_no",
      },
      {
        id: "facility.location_name",
        header: "Location",
        accessorKey: "facility.location_name",
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Systems"
        subtitle="Manage plant systems and subsystems"
        onAddNew={handleAddNew}
        addNewLabel="Add System"
        onSearch={handleSearch}
      />

      <DataTable
        columns={columns}
        data={filteredSystems}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit System" : "Add New System"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the system details."
                : "Fill in the details to create a new system."}
            </DialogDescription>
          </DialogHeader>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => setIsDialogOpen(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>

          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Facility Selection */}
            <div>
              <Label htmlFor="facility_id">
                Location <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="facility_id"
                control={form.control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString() || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {facilities.map((facility) => (
                        <SelectItem
                          key={facility.id}
                          value={facility.id.toString()}
                        >
                          {facility.location_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.facility_id && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.facility_id.message}
                </p>
              )}
            </div>

            {/* System Code */}
            <div>
              <Label htmlFor="system_code">
                System Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="system_code"
                {...form.register("system_code")}
                placeholder="Enter system code"
                disabled={isEditMode}
                readOnly={isEditMode}
              />
              {form.formState.errors.system_code && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.system_code.message}
                </p>
              )}
            </div>

            {/* Computed System Number */}
            <div>
              <Label htmlFor="system_no">
                System Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="system_no"
                value={systemNumber}
                readOnly
                disabled
                placeholder="Will be generated automatically"
              />
            </div>

            {/* System Name */}
            <div>
              <Label htmlFor="system_name">
                System Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="system_name"
                {...form.register("system_name")}
                placeholder="Enter system name"
              />
              {form.formState.errors.system_name && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.system_name.message}
                </p>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-3">
              <Checkbox
                id="is_active"
                checked={form.watch("is_active")}
                onCheckedChange={(checked) =>
                  form.setValue("is_active", checked === true)
                }
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                Active
              </Label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditMode ? "Update System" : "Create System"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SystemPage;
