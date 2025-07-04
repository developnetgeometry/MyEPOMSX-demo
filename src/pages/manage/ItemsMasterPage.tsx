import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import DataTable, { Column } from "@/components/shared/DataTable";
import { Database } from "lucide-react";
import { useAddItemMaster, useItemMaster } from "@/hooks/queries/useItemsMaster";
import StatusBadge from "@/components/shared/StatusBadge";
import { ItemMasterWithRelations } from "@/types/material";
import ManageDialog from "@/components/manage/ManageDialog";
import { z } from "zod";
import { createUniqueOptions } from "@/utils/dropdown";
import { useLoadingState } from "@/hooks/use-loading-state";
import { toast } from "@/hooks/use-toast";
import SearchFilters from "@/components/shared/SearchFilters";
import useDebounce from "@/hooks/use-debounce"; // Import the debounce hook

interface ItemsMasterPageProps {
  hideHeader?: boolean;
  onRowClick?: (row: any) => void;
}

const ItemsMasterPage: React.FC<ItemsMasterPageProps> = ({
  hideHeader = false,
  onRowClick,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // Add debounced search term
  const [currentItem, setCurrentItem] =
    useState<ItemMasterWithRelations | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading, error } = useItemMaster();
  const { withLoading } = useLoadingState();
  const addItemMasterMutation = useAddItemMaster();
  
  // Memoized filtered data
  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!debouncedSearchQuery.trim()) return data;
    
    const lowerSearch = debouncedSearchQuery.toLowerCase();
    return data.filter(item => 
      (item.item_no || "").toLowerCase().includes(lowerSearch) ||
      (item.item_name || "").toLowerCase().includes(lowerSearch)
    );
  }, [data, debouncedSearchQuery]);

  // Define columns for items master table
  const columns: Column[] = useMemo(() => [
    { id: "item_no", header: "Item No", accessorKey: "item_no" },
    { id: "item_name", header: "Item Name", accessorKey: "item_name" },
    { id: "group", header: "Item Group", accessorKey: "group.name" },
    {
      id: "item_category",
      header: "Category",
      accessorKey: "item_category.name",
    },
    { id: "item_type", header: "Type", accessorKey: "item_type.name" },
    {
      id: "item_manufacturer",
      header: "Manufacturer",
      accessorKey: "item_manufacturer.name",
    },
    {
      id: "manufacturer_part_no",
      header: "Manufacturer Part No",
      accessorKey: "manufacturer_part_no",
    },
    { id: "model_no", header: "Model No", accessorKey: "model_no" },
    {
      id: "specification",
      header: "Specification",
      accessorKey: "specification",
    },
    { id: "item_unit", header: "Unit", accessorKey: "item_unit.name" },
    {
      id: "item_criticality",
      header: "Criticality",
      accessorKey: "item_criticality.name",
    },
    {
      id: "is_active",
      header: "Active",
      accessorKey: "is_active",
      cell: (value) =>
        value ? (
          <StatusBadge status="Active" />
        ) : (
          <StatusBadge status="Inactive" />
        ),
    },
  ], []);

  const formSchema = z.object({
    item_no: z.string().min(1, "Item No. is required"),
    item_name: z.string().min(1, "Item Name is required"),
    group: z.string().min(1, "Item Group is required"),
    item_category: z.string().min(1, "Item Category is required"),
    item_type: z.string().min(1, "Item Type is required"),
    item_manufacturer: z.string().min(1, "Item Manufacturer is required"),
    manufacturer_part_no: z.string().min(1, "Item Manufacturer Part No. is required"),
    model_no: z.string().min(1, "Model No. is required"),
    specification: z.string(),
    item_unit: z.string().min(1, "Item Unit is required"),
    item_criticality: z.string().min(1, "Item Criticality is required"),
    is_active: z.string().min(1, "Item active status is required"),
  });
  
  const groupOptions = useMemo(() => createUniqueOptions(data, 'group'), [data]);
  const categoryOptions = useMemo(() => createUniqueOptions(data, 'item_category'), [data]);
  const typeOptions = useMemo(() => createUniqueOptions(data, 'item_type'), [data]);
  const manufacturerOptions = useMemo(() => createUniqueOptions(data, 'item_manufacturer'), [data]);
  const unitOptions = useMemo(() => createUniqueOptions(data, 'item_unit'), [data]);
  const criticalityOptions = useMemo(() => createUniqueOptions(data, 'item_criticality'), [data]);

  const activeOptions = [
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" },
  ];

  const emptyDefaultValues = {
    item_no: "",
    item_name: "",
    group: "",
    item_category: "",
    item_type: "",
    item_manufacturer: "",
    manufacturer_part_no: "",
    model_no: "",
    specification: "",
    item_unit: "",
    item_criticality: "",
    is_active: "",
  };

  const formFields = useMemo(() => [
    {
      name: "item_no",
      label: "Item No",
      type: "text" as const,
      placeholder: "Item No",
    },
    {
      name: "item_name",
      label: "Item Name",
      type: "text" as const,
      placeholder: "Item Name",
    },
    {
      name: "group",
      label: "Item Group",
      type: "select" as const,
      options: groupOptions,
    },
    {
      name: "item_category",
      label: "Category",
      type: "select" as const,
      options: categoryOptions,
    },
    {
      name: "item_type",
      label: "Type",
      type: "select" as const,
      options: typeOptions
    },
    {
      name: "item_manufacturer",
      label: "Manufacturer",
      type: "select" as const,
      options: manufacturerOptions
    },
    {
      name: "manufacturer_part_no",
      label: "Manufacturer Part No",
      type: "text" as const,
      placeholder: "Item Manufacturer Part No",
    },
    {
      name: "model_no",
      label: "Model No",
      type: "text" as const,
      placeholder: "Model No",
    },
    {
      name: "specification",
      label: "Specification",
      type: "text" as const,
      placeholder: "Specification",
    },
    {
      name: "item_unit",
      label: "Unit",
      type: "select" as const,
      options: unitOptions
    },
    {
      name: "item_criticality",
      label: "Criticality",
      type: "select" as const,
      options: criticalityOptions
    },
    {
      name: "is_active",
      label: "Active",
      type: "select" as const,
      options: activeOptions,
    },
  ], [groupOptions, categoryOptions, typeOptions, manufacturerOptions, unitOptions, criticalityOptions]);

  const handleAddNew = () => {
    navigate("/manage/items-master/add");
  };

  const handleSubmit = async (values: any) => {
    withLoading(async () => {
      try {
        await addItemMasterMutation.mutateAsync({
          item_no: values.item_no,
          item_name: values.item_name,
          item_group: Number(values.group),
          category_id: Number(values.item_category),
          type_id: Number(values.item_type),
          manufacturer: Number(values.item_manufacturer),
          manufacturer_part_no: values.manufacturer_part_no,
          model_no: values.model_no,
          specification: values.specification,
          unit_id: Number(values.item_unit),
          criticality_id: Number(values.item_criticality),
          is_active: Boolean(values.is_active)
        });
        toast({
          title: "Item added successfully",
          variant: "default",
        });
      } catch (error: any) {
        toast({
          title: "Error adding item master",
          description: error.message,
          variant: "destructive",
        });
      }
    })
  }

  // Handle search - no-op since filtering is automatic
  const handleSearch = () => {
    // Already handled by debouncedSearchQuery
  };

  // Handle view details
  const handleRowClick = useCallback((row: any) => {
    if (onRowClick) {
      onRowClick(row);
    } else {
      navigate(`/manage/items-master/${row.id}`);
    }
  }, [navigate, onRowClick]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      {!hideHeader && (
        <PageHeader
          title="Items Master"
          subtitle="Manage inventory items master data"
          icon={<Database className="h-6 w-6" />}
          onAddNew={handleAddNew}
          addNewLabel="Add New Item"
        />
      )}

      <Card>
        <CardContent className="p-6">
          <SearchFilters
            searchTerm={searchQuery}
            setSearchTerm={setSearchQuery}
            handleSearch={handleSearch}
            text="Items Master"
          />
          <DataTable
            columns={columns}
            data={filteredData}
            onRowClick={handleRowClick}
          />
        </CardContent>
      </Card>

      <ManageDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Add New Item"
        formSchema={formSchema}
        defaultValues={currentItem || emptyDefaultValues}
        formFields={formFields}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ItemsMasterPage;