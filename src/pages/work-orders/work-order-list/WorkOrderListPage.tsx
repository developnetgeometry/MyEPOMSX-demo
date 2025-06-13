import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import { useWorkOrderData } from "../hooks/use-work-order-data"; // Updated import
import Loading from "@/components/shared/Loading";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatDate } from "@/utils/formatters";

const WorkOrderListPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: workOrders, isLoading } = useWorkOrderData(); // Updated hook
  const [searchQuery, setSearchQuery] = useState("");

  const handleRowClick = (row: any) => {
    navigate(`/work-orders/work-order-list/${row.id}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredWorkOrders = useMemo(() => {
    if (!workOrders) return [];
    if (!searchQuery) return workOrders;
    const lower = searchQuery.toLowerCase();
    return workOrders.filter(
      (workOrder: any) =>
        workOrder.work_order_no?.toLowerCase().includes(lower) ||
        workOrder.description?.toLowerCase().includes(lower) ||
        workOrder.work_order_status_id?.name?.toString().includes(lower) ||
        workOrder.asset_id?.asset_no?.toString().includes(lower) ||
        workOrder.asset_id?.asset_name?.toString().includes(lower) ||
        workOrder.work_order_type?.name?.toLowerCase().includes(lower) ||
        workOrder.created_by?.full_name?.toLowerCase().includes(lower) ||
        workOrder.due_date?.toLowerCase().includes(lower)
    );
  }, [workOrders, searchQuery]);

  const columns: Column[] = [
    { id: "work_order_no", header: "Work Order No", accessorKey: "work_order_no" },
    { id: "description", header: "Description", accessorKey: "description" },
    { id: "work_order_type", header: "Work Order Type", accessorKey: "work_order_type.name" },
    {
      id: "work_order_status",
      header: "Status",
      accessorKey: "work_order_status_id.name", // Accessing the status ID
      cell: (value) => <StatusBadge status={value} />,
    },
    { id: "created_by", header: "Created By", accessorKey: "created_by.full_name" },
    { id: "asset", header: "Asset", accessorKey: "asset_id.asset_name" },
    { id: "due_date", header: "Due Date", accessorKey: "due_date", cell: (value: any) => formatDate(value) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Work Orders"
        addNewLabel="New Work Order"
        onSearch={handleSearch}
      />
      {/* <pre>{JSON.stringify(workOrders, null, 2)}</pre> */}

      {isLoading ? (
        <Loading />
      ) : (
        <DataTable
          columns={columns}
          data={filteredWorkOrders}
          onRowClick={handleRowClick}
          onIndex={true}
        />
      )}
    </div>
  );
};

export default WorkOrderListPage;