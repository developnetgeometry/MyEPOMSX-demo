import React, { useState, useEffect, useMemo } from "react";
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
  const navigate = useNavigate();
  const { toast } = useToast();

  // Use the custom hooks
  const { data: packages, isLoading, error } = usePackages();
  const { data: systems, isLoading: isLoadingSystems } = useSystems();
  const { data: packageTypes, isLoading: isLoadingPackageTypes } =
    usePackageTypes();

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

  // Watch form values for package number computation
  const systemId = form.watch("systemId");
  const tag = form.watch("tag");
  const packageTypeId = form.watch("type");

  // Compute package number
  const computedPackageNo = useMemo(() => {
    if (!systemId || !tag || !packageTypeId || !systems || !packageTypes) {
      return "";
    }

    // Find selected system
    const selectedSystem = systems.find((s) => s.id.toString() === systemId);
    if (!selectedSystem) {
      return "";
    }

    // Remove the facility requirement - just check if system exists
    // if (!selectedSystem || !selectedSystem.facility) {
    //   return "";
    // }

    // Find selected package type
    const selectedPackageType = packageTypes.find(
      (t) => t.id.toString() === packageTypeId
    );
    if (!selectedPackageType) {
      return "";
    }

    // Map package type to abbreviation
    let typeAbbreviation = "";
    if (selectedPackageType.name === "Package") {
      typeAbbreviation = "PKG";
    } else if (selectedPackageType.name === "Assembly") {
      typeAbbreviation = "ASY";
    } else {
      typeAbbreviation = selectedPackageType.name.substring(0, 3).toUpperCase();
    }

    return `${selectedSystem.system_code}-${tag}-${typeAbbreviation}`;
  }, [systemId, tag, packageTypeId, systems, packageTypes]);

  // Convert systems data to options format for the dropdown
  const systemOptions = useMemo(() => {
    return systems
      ? systems.map((system) => ({
          value: system.id.toString(),
          label: system.system_name || system.system_code,
          facilityCode: system.facility?.location_code || "",
        }))
      : [];
  }, [systems]);

  // Convert package types data to options format for the dropdown
  const packageTypeOptions = useMemo(() => {
    return packageTypes
      ? packageTypes.map((type) => ({
          value: type.id.toString(),
          label: type.name,
        }))
      : [];
  }, [packageTypes]);

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
  }, [isDialogOpen, isEditMode, currentItem]);

  const handleAddNew = () => {
    setIsEditMode(false);
    setCurrentItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: PackageData) => {
    setIsEditMode(true);
    setCurrentItem(item);
    setIsDialogOpen(true);
  };

  const handleRowClick = (row: PackageData) => {
    navigate(`/manage/package/${row.id}`);
  };

  const handleSubmit = async (values: FormValues) => {
    const transformedValues = {
      package_no: computedPackageNo,
      package_name: values.name,
      package_tag: values.tag,
      system_id: parseInt(values.systemId),
      package_type_id: parseInt(values.type),
      is_active: isEditMode && currentItem ? currentItem.is_active : true,
      created_at: isEditMode && currentItem ? currentItem.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    try {

      if (isEditMode && currentItem) {
        // Update existing package
        await updatePackageMutation.mutateAsync({
          ...currentItem,
          ...transformedValues,
        });
        toast({
          title: "Package Updated",
          description: "Package has been updated successfully.",
        });
      } else {
        // Create new package
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
        description: `Failed to ${isEditMode ? "update" : "create"} package: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: number) => {
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
  };

  const columns: Column[] = [
    {
      id: "packageNo",
      header: "Package No",
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
  ];

  // Format data for table
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading packages:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Package"
        icon={<Package className="h-6 w-6" />}
        onAddNew={handleAddNew}
      />

      <Card>
        <CardContent className="pt-6">
          <DataTable
            data={formattedData}
            columns={columns}
            onEdit={handleEdit}
            onRowClick={handleRowClick}
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

export default PackagePage;
