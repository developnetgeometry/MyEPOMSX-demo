import React, { act, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import DataTable, { Column } from "@/components/shared/DataTable";
import { Database } from "lucide-react";
import { itemsMaster } from "@/data/sampleData";
import { useItemMaster } from "@/hooks/queries/useItemsMaster";
import StatusBadge from "@/components/shared/StatusBadge";
import { ItemMasterWithRelations } from "@/types/manage";
import ManageDialog from "@/components/manage/ManageDialog";
import { z } from "zod";

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
  const [currentItem, setCurrentItem] =
    useState<ItemMasterWithRelations | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading, error } = useItemMaster();

  // Define columns for items master table
  const columns: Column[] = [
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
    // { id: "supplier", header: "Supplier", accessorKey: "supplier" },
    // { id: "uom", header: "UOM", accessorKey: "uom" },
    // {
    //   id: "price",
    //   header: "Price",
    //   accessorKey: "price",
    //   cell: (value) => <span>${value.toFixed(2)}</span>,
    // },
  ];

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
  
  const activeOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  const formFields = [
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
      type: "text" as const,
      placeholder: "Item Group",
    },
    {
      name: "item_category",
      label: "Category",
      type: "text" as const,
      placeholder: "Item Category",
    },
    {
      name: "item_type",
      label: "Type",
      type: "text" as const,
      placeholder: "Item Type",
    },
    {
      name: "item_manufacturer",
      label: "Manufacturer",
      type: "text" as const,
      placeholder: "Item Manufacturer",
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
      type: "text" as const,
      placeholder: "Item Unit",
    },
    {
      name: "item_criticality",
      label: "Criticality",
      type: "text" as const,
      placeholder: "Item Criticality",
    },
    {
      name: "is_active",
      label: "Active",
      type: "select" as const,
      options: activeOptions,
    },
  ];

  const handleAddNew = () => {
    setCurrentItem(null);
    setIsDialogOpen(true);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle view details
  const handleRowClick = (row: any) => {
    if (onRowClick) {
      onRowClick(row);
    } else {
      navigate(`/manage/items-master/${row.id}`);
    }
  };

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
          onSearch={handleSearch}
          onAddNew={handleAddNew}
          addNewLabel="Add New Item"
        />
      )}

      <Card>
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={data || []}
            onRowClick={handleRowClick}
          />
        </CardContent>
      </Card>

      <ManageDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Add New Item"
        formSchema={formSchema}
        defaultValues={currentItem || {}}
        formFields={formFields}
        onSubmit={() => {}}
      />
    </div>
  );
};

export default ItemsMasterPage;
