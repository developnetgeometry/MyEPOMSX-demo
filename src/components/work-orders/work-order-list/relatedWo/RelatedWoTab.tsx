import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import { userWorkOrderDataByAsset } from "@/pages/work-orders/hooks/use-work-order-data";
import Loading from "@/components/shared/Loading";

interface RelatedWoTabProps {
  assetId: number; // Passed as a prop to this page
}

const RelatedWoTab: React.FC<RelatedWoTabProps> = ({ assetId }) => {
  const navigate = useNavigate();
  const { data: workOrders, isLoading} = userWorkOrderDataByAsset(assetId);

  const handleRowClick = (row: any) => {
    navigate(`/work-orders/work-order-list/${row.id}`);
  };

  const columns: Column[] = [
    { id: "work_order_no", header: "Work Order No", accessorKey: "work_order_no" },
    { id: "description", header: "Description", accessorKey: "description" },
    { id: "work_order_type.name", header: "Type", accessorKey: "work_order_type.name" },
    { id: "work_order_status_id.name", header: "Status", accessorKey: "work_order_status_id.name" },
    { id: "due_date", header: "Due Date", accessorKey: "due_date" },
  ];

  return (
    <div className="space-y-6 mt-6">
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