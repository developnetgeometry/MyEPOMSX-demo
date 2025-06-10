import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import { userWorkOrderDataByAsset } from "@/pages/work-orders/hooks/use-work-order-data";
import Loading from "@/components/shared/Loading";
import { formatDate } from "@/utils/formatters";
import { useQueryClient } from "@tanstack/react-query";

interface RelatedWoTabProps {
  assetId: number; // Passed as a prop to this page
}

const RelatedWoTab: React.FC<RelatedWoTabProps> = ({ assetId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: workOrders, isLoading } = userWorkOrderDataByAsset(assetId);

  const handleRowClick = (row: any) => {
    queryClient.invalidateQueries({ queryKey: ["e-new-work-request-data", row.id] });
    navigate(`/work-orders/work-order-list/${row.id}`);
  };

  const columns: Column[] = [
    { id: "work_order_no", header: "Work Order No", accessorKey: "work_order_no" },
    { id: "description", header: "Description", accessorKey: "description" },
    { id: "work_order_type.name", header: "Type", accessorKey: "work_order_type.name" },
    { id: "work_order_status_id.name", header: "Status", accessorKey: "work_order_status_id.name" },
    { id: "due_date", header: "Due Date", accessorKey: "due_date", cell: (value: any) => formatDate(value) },
  ];

  return (
    <div className="space-y-6 mt-6">
      {/* <pre>{JSON.stringify(workOrders, null, 2)}</pre> */}

      <PageHeader title="Related Work Orders" />

      {isLoading ? (
        <Loading />
      ) : (
        <DataTable
          columns={columns}
          data={workOrders || []}
          onRowClick={handleRowClick}
        />
      )}
    </div>
  );
};

export default RelatedWoTab;