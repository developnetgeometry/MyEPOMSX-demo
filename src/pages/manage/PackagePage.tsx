import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import DataTable from "@/components/shared/DataTable";
import ManageDialog from "@/components/manage/ManageDialog";
import { Column } from "@/components/shared/DataTable";
import * as z from "zod";
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

  // Convert systems data to options format for the dropdown
  const systemOptions = systems
    ? systems.map((system) => ({
        value: system.id.toString(),
        label: system.system_name || system.system_code,
      }))
    : [];

  // Convert package types data to options format for the dropdown
  const packageTypeOptions = packageTypes
    ? packageTypes.map((type) => ({
        value: type.id.toString(),
        label: type.name,
      }))
    : [];

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

  const handleSubmit = (values: any) => {
    if (isEditMode && currentItem) {
      // Update existing package
      const updatedPackage = {
        id: currentItem.id,
        package_no: values.packageNo,
        package_name: values.name,
        package_tag: values.tag,
        system_id: parseInt(values.systemId),
        package_type_id: parseInt(values.type),
        is_active: currentItem.is_active ?? true,
      };

      updatePackageMutation.mutate(updatedPackage as any, {
        onSuccess: () => {
          setIsDialogOpen(false);
          toast({
            title: "Package Updated",
            description: "Package has been updated successfully.",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to update package: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
            variant: "destructive",
          });
        },
      });
    } else {
      // Create new package
      const newPackage = {
        package_no: values.packageNo,
        package_name: values.name,
        package_tag: values.tag,
        system_id: parseInt(values.systemId),
        package_type_id: parseInt(values.type),
        is_active: true,
      };

      addPackageMutation.mutate(newPackage as any, {
        onSuccess: () => {
          setIsDialogOpen(false);
          toast({
            title: "Package Created",
            description: "New package has been created successfully.",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to create package: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
            variant: "destructive",
          });
        },
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
      onError: (error) => {
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
      accessorKey: "package_no", // Updated to match the API field
    },
    {
      id: "name",
      header: "Package Name",
      accessorKey: "package_name", // Updated to match the API field
    },
    {
      id: "tag",
      header: "Package Tag",
      accessorKey: "package_tag", // Updated to match the API field
    },
    {
      id: "systemName",
      header: "System Name",
      accessorKey: "system_name", // Assuming this comes from a join or is included in the response
    },
    {
      id: "type",
      header: "Package Type",
      accessorKey: "package_type", // Assuming this comes from a join or is included in the response
    },
  ];

  const formSchema = z.object({
    packageNo: z.string().min(1, "Package No is required"),
    name: z.string().min(1, "Package Name is required"),
    tag: z.string().min(1, "Package Tag is required"),
    systemId: z.string().min(1, "System is required"),
    type: z.string().min(1, "Package Type is required"),
  });

  const formFields = [
    { name: "packageNo", label: "Package No", type: "text" as const },
    { name: "name", label: "Package Name", type: "text" as const },
    { name: "tag", label: "Package Tag", type: "text" as const },
    {
      name: "systemId",
      label: "System",
      type: "select" as const,
      options: systemOptions,
    },
    {
      name: "type",
      label: "Package Type",
      type: "select" as const,
      options: packageTypeOptions,
    },
  ];

  // Prepare default values for edit mode
  const getDefaultValues = () => {
    if (isEditMode && currentItem) {
      return {
        packageNo: currentItem.package_no || "",
        name: currentItem.package_name || "",
        tag: currentItem.package_tag || "",
        systemId: currentItem.system_id ? currentItem.system_id.toString() : "",
        type: currentItem.package_type_id
          ? currentItem.package_type_id.toString()
          : "",
      };
    }
    return {
      packageNo: "",
      name: "",
      tag: "",
      systemId: "",
      type: "",
    };
  };

  // Ensure we're dealing with proper data mapping
  const formatDataForTable = (data: any[] | undefined) => {
    if (!data) return [];

    return data.map((item) => {
      // Find system name and package type from their IDs
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
        // Include original fields for editing
        system_id: item.system_id,
        package_type_id: item.package_type_id,
        is_active: item.is_active,
      };
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading packages...
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
            data={formatDataForTable(packages)}
            columns={columns}
            onEdit={handleEdit}
            onRowClick={handleRowClick}
            onDelete={(row) => handleDelete(Number(row.id))}
          />
        </CardContent>
      </Card>

      <ManageDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={isEditMode ? "Edit Package" : "Add New Package"}
        formSchema={formSchema}
        defaultValues={getDefaultValues()}
        formFields={formFields}
        onSubmit={handleSubmit}
        isEdit={isEditMode}
      />
    </div>
  );
};

export default PackagePage;
