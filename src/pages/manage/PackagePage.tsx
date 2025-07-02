import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import DataTable from "@/components/shared/DataTable";
import { Column } from "@/components/shared/DataTable";
import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  usePackages,
  useAddPackage,
  useUpdatePackage,
  useDeletePackage,
  useSystems,
  usePackageTypes,
} from "@/hooks/queries/usePackages";
import { useToast } from "@/components/ui/use-toast";
import { PackageData } from "@/types/manage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import SearchFilters from "@/components/shared/SearchFilters";
import useDebounce from "@/hooks/use-debounce";

// Define form schema with Zod
const formSchema = z.object({
  name: z.string().min(1, "Package Name is required"),
  tag: z.string().min(1, "Package Tag is required"),
  systemId: z.string().min(1, "System is required"),
  type: z.string().min(1, "Package Type is required"),
});

type FormValues = z.infer<typeof formSchema>;

const PackagePage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState<PackageData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [facilityCode, setFacilityCode] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Use the custom hooks
  const { data: packages, isLoading, error } = usePackages();
  const { data: systems } = useSystems();
  const { data: packageTypes } = usePackageTypes();

  const addPackageMutation = useAddPackage();
  const updatePackageMutation = useUpdatePackage();
  const deletePackageMutation = useDeletePackage();

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      tag: "",
      systemId: "",
      type: "",
    },
  });

  // Watch form values
  const systemId = form.watch("systemId");
  const tag = form.watch("tag");
  const packageTypeId = form.watch("type");

  // Memoize options
  const systemOptions = useMemo(() => {
    return (
      systems?.map((system) => ({
        value: system.id.toString(),
        label: system.system_name || system.system_code,
        facilityCode: system.facility?.location_code || "",
      })) || []
    );
  }, [systems]);

  const packageTypeOptions = useMemo(() => {
    return (
      packageTypes?.map((type) => ({
        value: type.id.toString(),
        label: type.name,
      })) || []
    );
  }, [packageTypes]);

  // Compute package number
  const computedPackageNo = useMemo(() => {
    if (!systemId || !tag || !packageTypeId || !facilityCode) return "";

    // Map package type to abbreviation
    let typeAbbreviation = "PKG";
    const selectedPackageType = packageTypeOptions.find(
      (t) => t.value === packageTypeId
    );

    if (selectedPackageType) {
      if (selectedPackageType.label === "Assembly") {
        typeAbbreviation = "ASY";
      } else {
        typeAbbreviation = selectedPackageType.label
          .substring(0, 3)
          .toUpperCase();
      }
    }

    return `${facilityCode}-${tag}-${typeAbbreviation}`;
  }, [systemId, tag, packageTypeId, packageTypeOptions, facilityCode]);

  // Memoize columns
  const columns = useMemo<Column[]>(
    () => [
      {
        id: "packageNo",
        header: "Package Code",
        accessorKey: "package_no",
      },
      {
        id: "name",
        header: "Package Name",
        accessorKey: "package_name",
      },
      {
        id: "tag",
        header: "Package Tag",
        accessorKey: "package_tag",
      },
      {
        id: "systemName",
        header: "System Name",
        accessorKey: "system_name",
      },
      {
        id: "type",
        header: "Package Type",
        accessorKey: "package_type",
      },
    ],
    []
  );

  // Memoize formatted data
  const formattedData = useMemo(() => {
    if (!packages) return [];

    return packages.map((item) => {
      const systemName =
        systemOptions.find((s) => s.value === item.system_id?.toString())
          ?.label || "Unknown System";
      const packageType =
        packageTypeOptions.find(
          (t) => t.value === item.package_type_id?.toString()
        )?.label || "Unknown Type";

      return {
        id: item.id,
        package_no: item.package_no || "",
        package_name: item.package_name || "",
        package_tag: item.package_tag || "",
        system_name: systemName,
        package_type: packageType,
        system_id: item.system_id,
        package_type_id: item.package_type_id,
        is_active: item.is_active,
      };
    });
  }, [packages, systemOptions, packageTypeOptions]);

  // Memoize filtered data
  const filteredData = useMemo(() => {
    if (!formattedData) return [];
    if (!debouncedSearchTerm.trim()) return formattedData;

    const lowerSearch = debouncedSearchTerm.toLowerCase();
    return formattedData.filter(
      (item) =>
        (item.package_name || "").toLowerCase().includes(lowerSearch) ||
        (item.package_no || "").toLowerCase().includes(lowerSearch)
    );
  }, [formattedData, debouncedSearchTerm]);

  // Fetch facility code when system changes
  useEffect(() => {
    if (!systemId || !systems) {
      setFacilityCode("");
      return;
    }

    const fetchFacilityCode = async () => {
      try {
        const selectedSystem = systems.find(
          (s) => s.id.toString() === systemId
        );
        if (!selectedSystem || !selectedSystem.facility_id) return;

        const { data } = await supabase
          .from("e_facility")
          .select("location_code")
          .eq("id", selectedSystem.facility_id)
          .single();

        setFacilityCode(data?.location_code || "");
      } catch (error) {
        console.error("Error fetching facility code:", error);
        setFacilityCode("");
      }
    };

    fetchFacilityCode();
  }, [systemId, systems]);

  // Initialize form in edit mode
  useEffect(() => {
    if (isDialogOpen && isEditMode && currentItem) {
      form.reset({
        name: currentItem.package_name || "",
        tag: currentItem.package_tag || "",
        systemId: currentItem.system_id ? currentItem.system_id.toString() : "",
        type: currentItem.package_type_id
          ? currentItem.package_type_id.toString()
          : "",
      });
    } else if (isDialogOpen && !isEditMode) {
      form.reset();
    }
  }, [isDialogOpen, isEditMode, currentItem, form]);

  // Callbacks
  const handleAddNew = useCallback(() => {
    setIsEditMode(false);
    setCurrentItem(null);
    form.reset();
    setIsDialogOpen(true);
  }, [form]);

  const handleEdit = useCallback((item: PackageData) => {
    setIsEditMode(true);
    setCurrentItem(item);
    setIsDialogOpen(true);
  }, []);

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      try {
        const transformedValues = {
          package_no: computedPackageNo,
          package_name: values.name,
          package_tag: values.tag,
          system_id: parseInt(values.systemId),
          package_type_id: parseInt(values.type),
          is_active: isEditMode && currentItem ? currentItem.is_active : true,
          created_at:
            isEditMode && currentItem
              ? currentItem.created_at
              : new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        if (isEditMode && currentItem) {
          await updatePackageMutation.mutateAsync({
            ...currentItem,
            ...transformedValues,
          });
          toast({
            title: "Package Updated",
            description: "Package has been updated successfully.",
          });
        } else {
          await addPackageMutation.mutateAsync(transformedValues);
          toast({
            title: "Package Created",
            description: "New package has been created successfully.",
          });
        }

        setIsDialogOpen(false);
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to ${
            isEditMode ? "update" : "create"
          } package: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          variant: "destructive",
        });
      }
    },
    [isEditMode, currentItem, computedPackageNo]
  );

  const handleDelete = useCallback((id: number) => {
    deletePackageMutation.mutate(id, {
      onSuccess: () => {
        toast({
          title: "Package Deleted",
          description: "Package has been deleted successfully.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: `Failed to delete package: ${error.message}`,
          variant: "destructive",
        });
      },
    });
  }, []);

  const handleSearch = useCallback(() => {
    // Already handled in memoized filteredData
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-red-500 text-center p-8">
        Error loading packages:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Package"
        icon={<Package className="h-6 w-6" />}
        onAddNew={handleAddNew}
        addNewLabel="Add Package"
      />

      <Card>
        <CardContent className="pt-6">
          <SearchFilters
            text="Package"
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
          />

          <DataTable
            data={filteredData}
            columns={columns}
            onEdit={handleEdit}
            onDelete={(row) => handleDelete(Number(row.id))}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Package" : "Add New Package"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the package details."
                : "Fill in the details to create a new package."}
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
            {/* Package Number (computed) */}
            <div>
              <Label htmlFor="packageNo">Package Number</Label>
              <Input
                id="packageNo"
                value={computedPackageNo}
                readOnly
                disabled
                placeholder="Will be generated automatically"
              />
            </div>

            {/* System Selection */}
            <div>
              <Label htmlFor="systemId">
                System <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="systemId"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select system" />
                    </SelectTrigger>
                    <SelectContent>
                      {systemOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.systemId && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.systemId.message}
                </p>
              )}
            </div>

            {/* Package Tag */}
            <div>
              <Label htmlFor="tag">
                Package Tag <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tag"
                {...form.register("tag")}
                placeholder="Enter package tag"
                readOnly={isEditMode}
                disabled={isEditMode}
              />
              {form.formState.errors.tag && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.tag.message}
                </p>
              )}
            </div>

            {/* Package Type Selection */}
            <div>
              <Label htmlFor="type">
                Package Type <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="type"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select package type" />
                    </SelectTrigger>
                    <SelectContent>
                      {packageTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.type && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.type.message}
                </p>
              )}
            </div>

            {/* Package Name */}
            <div>
              <Label htmlFor="name">
                Package Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Enter package name"
              />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditMode ? "Update Package" : "Create Package"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default React.memo(PackagePage);
