import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import DataTable, { Column } from "@/components/shared/DataTable";
import { Database } from "lucide-react";
import { itemsMaster } from "@/data/sampleData";
import { useItemMaster } from "@/hooks/queries/useItemsMaster";
import StatusBadge from "@/components/shared/StatusBadge";

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

  const { data, isLoading, error } = useItemMaster();

  // Define columns for items master table
  const columns: Column[] = [
    { id: "item_no", header: "Item No", accessorKey: "item_no" },
    { id: "item_name", header: "Item Name", accessorKey: "item_name" },
    { id: "group", header: "Item Group", accessorKey: "group.name" },
    { id: "item_category", header: "Category", accessorKey: "item_category.name" },
    { id: "item_type", header: "Type", accessorKey: "item_type.name" },
    { id: "item_manufacturer", header: "Manufacturer", accessorKey: "item_manufacturer.name" },
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
      cell: (value) => value ? <StatusBadge status="Active" /> : <StatusBadge status="Inactive" />
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
          onAddNew={() => navigate("/manage/items-master/new")}
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
    </div>
  );
};

export default ItemsMasterPage;
