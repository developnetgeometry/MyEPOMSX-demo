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
import { Loader2, Wrench, X } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import SearchFilters from "@/components/shared/SearchFilters";
import useDebounce from "@/hooks/use-debounce";

// Form schema outside component
const systemFormSchema = z.object({
  facility_id: z.number().min(1, "Please select a facility"),
  system_code: z.string().min(1, "System code is required"),
  system_name: z.string().min(1, "System name is required"),
  is_active: z.boolean().default(true),
});

type SystemFormValues = z.infer<typeof systemFormSchema>;

const SystemPage: React.FC = () => {
  const { data: facilities } = useFacilityOptions();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState<System | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { isLoading: isProcessing, withLoading } = useLoadingState();

  // Queries
  const { data: systems, isLoading } = useSystems();
  const addSystemMutation = useCreateSystem();
  const updateSystemMutation = useUpdateSystem();
  const deleteSystemMutation = useDeleteSystem();

  // Form
  const form = useForm<SystemFormValues>({
    resolver: zodResolver(systemFormSchema),
    defaultValues: {
      facility_id: null as unknown as number,
      system_code: "",
      system_name: "",
      is_active: true,
    },
  });
  
  const facilityId = form.watch("facility_id");
  const systemCode = form.watch("system_code");

  // Memoized system number
  const systemNumber = useMemo(() => {
    if (!facilityId || !systemCode || !facilities) return "";
    
    const selectedFacility = facilities.find((f) => f.id === facilityId);
    return selectedFacility ? `${selectedFacility.location_code}-${systemCode}` : "";
  }, [facilityId, systemCode, facilities]);

  // Memoized columns
  const columns = useMemo<Column[]>(() => [
    {
      id: "system_code",
      header: "System Code",
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
  ], []);

  // Memoized filtered data
  const filteredSystems = useMemo(() => {
    if (!systems) return [];
    
    if (!debouncedSearchTerm.trim()) return systems;
    
    const lowerSearch = debouncedSearchTerm.toLowerCase();
    return systems.filter(item => 
      (item.system_name || "").toLowerCase().includes(lowerSearch) ||
      (item.system_code || "").toLowerCase().includes(lowerSearch)
    );
  }, [systems, debouncedSearchTerm]); 

  // Callbacks
  const handleAddNew = useCallback(() => {
    setIsEditMode(false);
    setCurrentItem(null);
    form.reset({
      facility_id: null as unknown as number,
      system_code: "",
      system_name: "",
      is_active: true,
    });
    setIsDialogOpen(true);
  }, [form]);

  const handleEdit = useCallback((item: System) => {
    setIsEditMode(true);
    setCurrentItem(item);
    setIsDialogOpen(true);
  }, []);

  const handleSubmit = useCallback(async (values: SystemFormValues) => {
    withLoading(async () => {
      try {
        const systemData: Omit<System, "id"> = {
          facility_id: values.facility_id,
          system_code: values.system_code,
          system_name: values.system_name,
          is_active: values.is_active,
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
  }, [currentItem, isEditMode, systemNumber, withLoading]);

  const handleDelete = useCallback(async (item: System) => {
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
  }, [withLoading]);

  const handleSearch = useCallback(() => {
    // Already handled in memoized filteredSystems
  }, []);

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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2">Loading systems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Systems"
        subtitle="Manage plant systems and subsystems"
        icon={<Wrench className="h-6 w-6" />}
        onAddNew={handleAddNew}
        addNewLabel="Add System"
      />

      <Card>
        <CardContent className="pt-6">
          <SearchFilters
            text="System"
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
          />

          <DataTable
            columns={columns}
            data={filteredSystems}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

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
                      {facilities?.map((facility) => (
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

export default React.memo(SystemPage);