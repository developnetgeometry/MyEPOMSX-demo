import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import { Card, CardContent } from "@/components/ui/card";
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
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Box,
  Plus,
  Search,
  Filter,
  X,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useAssetData } from "@/hooks/lookup/looukp-asset";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  useInventoryGroups,
  useCreateInventoryGroup,
  useUpdateInventoryGroup,
  useDeleteInventoryGroup,
} from "@/hooks/queries/useInventoryGroups";
import {
  inventoryGroupValidationService,
  type ValidationError,
  type InventoryGroupFormData,
} from "@/services/inventoryGroupValidationService";

const InventoryGroupsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [formData, setFormData] = useState<InventoryGroupFormData>({
    asset_id: null,
    group_type: "",
    group_name: "",
    total_inventory: "",
    component_inventory: "",
    description: "",
    equipment_volume: "",
    representative_component: "",
    is_active: true,
  });

  // Get asset data from the hook
  const { data: assets = [], isLoading: isAssetsLoading } = useAssetData();

  // Fetch inventory groups data
  const {
    data: inventoryGroupsData,
    isLoading,
    refetch,
  } = useInventoryGroups({
    searchQuery: searchQuery.trim() || undefined,
    statusFilter: statusFilter !== "all" ? statusFilter : undefined,
  });

  const createInventoryGroupMutation = useCreateInventoryGroup();
  const updateInventoryGroupMutation = useUpdateInventoryGroup();
  const deleteInventoryGroupMutation = useDeleteInventoryGroup();

  // Process the real data for display
  const processedData = useMemo(() => {
    if (!inventoryGroupsData?.data) return [];

    return inventoryGroupsData.data.map((item) => ({
      ...item,
      asset_no: item.asset?.asset_no || "N/A",
      asset_name: item.asset?.asset_name || "N/A",
      // Map is_status to is_active for consistency with existing components
      is_active: item.is_status,
    }));
  }, [inventoryGroupsData]);

  // Table columns definition
  const columns: Column[] = [
    {
      id: "asset_no",
      header: "Asset Code",
      accessorKey: "asset_no",
    },
    {
      id: "asset_name",
      header: "Asset Name",
      accessorKey: "asset_name",
    },
    {
      id: "group_type",
      header: "Group Type",
      accessorKey: "group_type",
    },
    {
      id: "group_name",
      header: "Group Name",
      accessorKey: "group_name",
    },
    {
      id: "total_inventory",
      header: "Total Inventory",
      accessorKey: "total_inventory",
    },
    {
      id: "component_inventory",
      header: "Component Inventory",
      accessorKey: "component_inventory",
    },
    {
      id: "equipment_volume",
      header: "Equipment Volume",
      accessorKey: "equipment_volume",
      cell: (value: number) => (value ? `${value.toFixed(2)} L` : "N/A"),
    },
    {
      id: "representative_component",
      header: "Representative Component",
      accessorKey: "representative_component",
    },
    {
      id: "is_active",
      header: "Status",
      accessorKey: "is_active",
      cell: (value: boolean) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddNew = () => {
    setIsEditMode(false);
    setCurrentItem(null);
    setValidationErrors([]);
    setFormData({
      asset_id: null,
      group_type: "",
      group_name: "",
      total_inventory: "",
      component_inventory: "",
      description: "",
      equipment_volume: "",
      representative_component: "",
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    setIsEditMode(true);
    setCurrentItem(item);
    setValidationErrors([]);
    setFormData({
      asset_id: item.asset_detail_id,
      group_type: item.group_type || "",
      group_name: item.group_name || "",
      total_inventory: item.total_inventory?.toString() || "",
      component_inventory: item.component_inventory?.toString() || "",
      description: item.description || "",
      equipment_volume: item.equipment_volume?.toString() || "",
      representative_component: item.representative_component || "",
      is_active: item.is_status,
    });
    setIsDialogOpen(true);
  };

  const handleRowClick = (row: any) => {
    // Navigate to detail page if needed
    console.log("Row clicked:", row);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setValidationErrors([]);

    try {
      // Validate form data
      const validationResult =
        await inventoryGroupValidationService.validateForm(
          formData,
          isEditMode,
          currentItem?.id
        );

      if (!validationResult.isValid) {
        setValidationErrors(validationResult.errors);
        toast({
          title: "Validation Error",
          description: inventoryGroupValidationService.formatErrorsForDisplay(
            validationResult.errors
          ),
          variant: "destructive",
        });
        return;
      }

      // Prepare data for submission
      if (isEditMode && currentItem) {
        const updateData = {
          asset_detail_id: formData.asset_id!,
          group_type: formData.group_type.trim(),
          group_name: formData.group_name.trim(),
          total_inventory: parseInt(formData.total_inventory) || 0,
          component_inventory: parseInt(formData.component_inventory) || 0,
          description: formData.description.trim() || undefined,
          equipment_volume: parseFloat(formData.equipment_volume) || undefined,
          representative_component:
            formData.representative_component.trim() || undefined,
          is_status: formData.is_active,
          updated_by: user?.id || "",
        };

        await updateInventoryGroupMutation.mutateAsync({
          id: currentItem.id,
          data: updateData,
        });
      } else {
        const createData = {
          asset_detail_id: formData.asset_id!,
          group_type: formData.group_type.trim(),
          group_name: formData.group_name.trim(),
          total_inventory: parseInt(formData.total_inventory) || 0,
          component_inventory: parseInt(formData.component_inventory) || 0,
          description: formData.description.trim() || undefined,
          equipment_volume: parseFloat(formData.equipment_volume) || undefined,
          representative_component:
            formData.representative_component.trim() || undefined,
          is_status: formData.is_active,
          created_by: user?.id || "",
        };

        await createInventoryGroupMutation.mutateAsync(createData);
      }

      const action = isEditMode ? "updated" : "created";
      toast({
        title: "Success",
        description: `Inventory group ${action} successfully`,
      });

      setIsDialogOpen(false);
      resetForm();
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message ||
          `Failed to ${isEditMode ? "update" : "create"} inventory group`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      asset_id: null,
      group_type: "",
      group_name: "",
      total_inventory: "",
      component_inventory: "",
      description: "",
      equipment_volume: "",
      representative_component: "",
      is_active: true,
    });
    setValidationErrors([]);
    setCurrentItem(null);
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (item: any) => {
    if (
      !window.confirm(`Are you sure you want to delete "${item.group_name}"?`)
    ) {
      return;
    }

    try {
      await deleteInventoryGroupMutation.mutateAsync(item.id);

      toast({
        title: "Success",
        description: "Inventory group deleted successfully",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete inventory group",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific field validation error when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors((prev) =>
        prev.filter((error) => error.field !== name)
      );
    }

    // Real-time validation for certain fields
    if (name === "component_inventory" || name === "total_inventory") {
      const updatedFormData = { ...formData, [name]: value };
      const fieldError = inventoryGroupValidationService.validateField(
        name as keyof InventoryGroupFormData,
        value,
        updatedFormData
      );

      if (fieldError) {
        setValidationErrors((prev) => {
          const filtered = prev.filter(
            (error) => error.field !== fieldError.field
          );
          return [...filtered, fieldError];
        });
      }
    }
  };

  // Helper function to get field error
  const getFieldError = (fieldName: string): string | undefined => {
    return validationErrors.find((error) => error.field === fieldName)?.message;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Groups"
        subtitle="Manage and view grouped inventory items and their relationships"
        icon={<Box className="h-6 w-6" />}
        onSearch={handleSearch}
        onAddNew={handleAddNew}
        addNewLabel="Create Inventory Group"
      />

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by group name, type, asset, or component..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading inventory groups...</span>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={processedData}
              onRowClick={handleRowClick}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between w-full">
              <div>
                <DialogTitle>
                  {isEditMode
                    ? "Edit Inventory Group"
                    : "Create New Inventory Group"}
                </DialogTitle>
                <DialogDescription>
                  {isEditMode
                    ? "Update the inventory group details below."
                    : "Fill in the details to create a new inventory group."}
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDialogOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Asset Selection */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="asset_id">
                  Asset <span className="text-red-500">*</span>
                </Label>
                <SearchableSelect
                  options={assets}
                  value={formData.asset_id}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      asset_id: value as number,
                    }))
                  }
                  placeholder="Select an asset"
                  searchBy={(asset) => [asset.asset_no, asset.asset_name || ""]}
                  getLabel={(asset) =>
                    `${asset.asset_no} - ${asset.asset_name || "N/A"}`
                  }
                  getValue={(asset) => asset.id}
                  disabled={isAssetsLoading}
                />
                {getFieldError("asset_id") && (
                  <p className="text-sm text-red-500">
                    {getFieldError("asset_id")}
                  </p>
                )}
              </div>

              {/* Group Type */}
              <div className="space-y-2">
                <Label htmlFor="group_type">
                  Group Type <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="group_type"
                  name="group_type"
                  value={formData.group_type}
                  onChange={handleInputChange}
                  placeholder="e.g., Pressure Vessels, Heat Exchangers"
                  required
                  className={
                    getFieldError("group_type") ? "border-red-500" : ""
                  }
                />
                {getFieldError("group_type") && (
                  <p className="text-sm text-red-500">
                    {getFieldError("group_type")}
                  </p>
                )}
              </div>

              {/* Group Name */}
              <div className="space-y-2">
                <Label htmlFor="group_name">
                  Group Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="group_name"
                  name="group_name"
                  value={formData.group_name}
                  onChange={handleInputChange}
                  placeholder="e.g., Pressure Vessels Group A"
                  required
                  className={
                    getFieldError("group_name") ? "border-red-500" : ""
                  }
                />
                {getFieldError("group_name") && (
                  <p className="text-sm text-red-500">
                    {getFieldError("group_name")}
                  </p>
                )}
              </div>

              {/* Total Inventory */}
              <div className="space-y-2">
                <Label htmlFor="total_inventory">Total Inventory</Label>
                <Input
                  id="total_inventory"
                  name="total_inventory"
                  type="number"
                  min="0"
                  value={formData.total_inventory}
                  onChange={handleInputChange}
                  placeholder="0"
                  className={
                    getFieldError("total_inventory") ? "border-red-500" : ""
                  }
                />
                {getFieldError("total_inventory") && (
                  <p className="text-sm text-red-500">
                    {getFieldError("total_inventory")}
                  </p>
                )}
              </div>

              {/* Component Inventory */}
              <div className="space-y-2">
                <Label htmlFor="component_inventory">Component Inventory</Label>
                <Input
                  id="component_inventory"
                  name="component_inventory"
                  type="number"
                  min="0"
                  value={formData.component_inventory}
                  onChange={handleInputChange}
                  placeholder="0"
                  className={
                    getFieldError("component_inventory") ? "border-red-500" : ""
                  }
                />
                {getFieldError("component_inventory") && (
                  <p className="text-sm text-red-500">
                    {getFieldError("component_inventory")}
                  </p>
                )}
              </div>

              {/* Equipment Volume */}
              <div className="space-y-2">
                <Label htmlFor="equipment_volume">Equipment Volume (L)</Label>
                <Input
                  id="equipment_volume"
                  name="equipment_volume"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.equipment_volume}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className={
                    getFieldError("equipment_volume") ? "border-red-500" : ""
                  }
                />
                {getFieldError("equipment_volume") && (
                  <p className="text-sm text-red-500">
                    {getFieldError("equipment_volume")}
                  </p>
                )}
              </div>

              {/* Representative Component */}
              <div className="space-y-2">
                <Label htmlFor="representative_component">
                  Representative Component
                </Label>
                <Input
                  id="representative_component"
                  name="representative_component"
                  value={formData.representative_component}
                  onChange={handleInputChange}
                  placeholder="e.g., V-110A"
                  className={
                    getFieldError("representative_component")
                      ? "border-red-500"
                      : ""
                  }
                />
                {getFieldError("representative_component") && (
                  <p className="text-sm text-red-500">
                    {getFieldError("representative_component")}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter description of the inventory group"
                  className={`w-full border border-gray-300 rounded-md px-3 py-2 text-sm min-h-[80px] resize-y ${
                    getFieldError("description") ? "border-red-500" : ""
                  }`}
                  rows={3}
                />
                {getFieldError("description") && (
                  <p className="text-sm text-red-500">
                    {getFieldError("description")}
                  </p>
                )}
              </div>

              {/* Active Status */}
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        is_active: checked === true,
                      }))
                    }
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditMode ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryGroupsPage;
