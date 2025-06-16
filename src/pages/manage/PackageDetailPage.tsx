import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Package as PackageIcon, Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  usePackage,
  useSystem,
  usePackageTypes,
  useUpdatePackage,
} from "@/hooks/queries/usePackages";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { z } from "zod";
import ManageDialog from "@/components/manage/ManageDialog";

const PackageDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const packageId = id ? parseInt(id) : 0;
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch package data with usePackage hook
  const {
    data: packageData,
    isLoading: isPackageLoading,
    error: packageError,
  } = usePackage(packageId);

  // Fetch system data based on the system_id from the package
  const { data: systemData, isLoading: isSystemLoading } = useSystem(
    packageData?.system_id || 0
  );

  // Fetch all package types to display the name instead of just the ID
  const { data: packageTypes, isLoading: isTypesLoading } = usePackageTypes();

  // Update package mutation
  const updatePackageMutation = useUpdatePackage();

  // Handle errors
  React.useEffect(() => {
    if (packageError) {
      toast({
        title: "Error",
        description: "Failed to load package details",
        variant: "destructive",
      });
      navigate("/manage/package");
    }
  }, [packageError, navigate, toast]);

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleUpdateSubmit = async (values: any) => {
    if (!packageData) return;

    try {
      await updatePackageMutation.mutateAsync({
        ...packageData,
        package_no: values.package_no,
        package_name: values.package_name,
        package_tag: values.package_tag,
        system_id: parseInt(values.system_id),
        package_type_id: parseInt(values.package_type_id),
      });

      toast({
        title: "Success",
        description: "Package updated successfully",
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      toast({
        title: "Error Updating Package",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Get the package type name from the ID
  const getPackageTypeName = () => {
    if (!packageData || !packageTypes) return "Loading...";
    const packageType = packageTypes.find(
      (type) => type.id === packageData.package_type_id
    );
    return packageType?.name || "Unknown";
  };

  // Define form schema for validation
  const formSchema = z.object({
    package_no: z.string().min(1, "Package Code is required"),
    package_name: z.string().min(1, "Package Name is required"),
    package_tag: z.string().optional(),
    system_id: z.string().min(1, "System is required"),
    package_type_id: z.string().min(1, "Package Type is required"),
  });

  if (isPackageLoading) {
    return <LoadingSkeleton />;
  }

  if (!packageData) {
    return <div>Package Code found</div>;
  }

  // Generate system options for the dropdown
  const systemOptions = systemData
    ? [{ value: String(systemData.id), label: systemData.system_name }]
    : [];

  // Generate package type options for the dropdown
  const packageTypeOptions = packageTypes
    ? packageTypes.map((type) => ({ value: String(type.id), label: type.name }))
    : [];

  // Define form fields for the dialog
  const formFields = [
    {
      name: "package_no",
      label: "Package Code",
      type: "text" as const,
    },
    {
      name: "package_name",
      label: "Package Name",
      type: "text" as const,
    },
    {
      name: "package_tag",
      label: "Package Tag",
      type: "text" as const,
    },
    {
      name: "system_id",
      label: "System",
      type: "select" as const,
      options: systemOptions,
    },
    {
      name: "package_type_id",
      label: "Package Type",
      type: "select" as const,
      options: packageTypeOptions,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title={`Package: ${packageData.package_name}`}
          subtitle={`No: ${packageData.package_no}`}
          icon={<PackageIcon className="h-6 w-6" />}
        />
        <Button
          variant="outline"
          onClick={() => navigate("/manage/package")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Packages
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Field</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="w-[100px] text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Package Code</TableCell>
                <TableCell>{packageData.package_no}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={handleEdit}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Package Name</TableCell>
                <TableCell>{packageData.package_name}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={handleEdit}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Package Tag</TableCell>
                <TableCell>{packageData.package_tag || "N/A"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={handleEdit}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">System Name</TableCell>
                <TableCell>
                  {isSystemLoading ? (
                    <Skeleton className="h-4 w-24" />
                  ) : (
                    systemData?.system_name || "Unknown"
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={handleEdit}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Package Type</TableCell>
                <TableCell>
                  {isTypesLoading ? (
                    <Skeleton className="h-4 w-24" />
                  ) : (
                    getPackageTypeName()
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={handleEdit}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <ManageDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Edit Package"
        formSchema={formSchema}
        defaultValues={{
          package_no: packageData.package_no,
          package_name: packageData.package_name,
          package_tag: packageData.package_tag || "",
          system_id: String(packageData.system_id),
          package_type_id: String(packageData.package_type_id),
        }}
        formFields={formFields}
        onSubmit={handleUpdateSubmit}
        isEdit={true}
        isProcessing={updatePackageMutation.isPending}
      />
    </div>
  );
};

// Loading skeleton component for better UX
const LoadingSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Field</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="w-[100px] text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full max-w-md" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PackageDetailPage;
