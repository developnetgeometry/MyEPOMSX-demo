import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Loading from "@/components/shared/Loading";
import { useToast } from "@/hooks/use-toast";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatDate } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useWorkRequestData } from "../hooks/use-work-request-data";

const WorkRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: workRequests, isLoading, refetch } = useWorkRequestData();
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleRowClick = (row: any) => {
    navigate(`/work-orders/work-request/${row.id}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCreateNewWorkRequest = (assetId: number) => {
    navigate("/work-orders/work-request/new", {
      state: { asset_id: assetId },
    });
  };

  const filteredWorkRequests = useMemo(() => {
    if (!workRequests) return [];
    if (!searchQuery) return workRequests;
    const lower = searchQuery.toLowerCase();
    return workRequests.filter(
      (workRequest: any) =>
        workRequest.noWorkRequest?.toLowerCase().includes(lower) ||
        workRequest.status?.toLowerCase().includes(lower) ||
        workRequest.requestedBy?.toLowerCase().includes(lower) ||
        workRequest.workCenter?.toLowerCase().includes(lower) ||
        workRequest.workOrderNo?.toLowerCase().includes(lower) ||
        workRequest.asset_id?.asset_name?.toLowerCase().includes(lower) ||
        workRequest.work_request_date?.toLowerCase().includes(lower) ||
        workRequest.dateFinding?.toLowerCase().includes(lower)
    );
  }, [workRequests, searchQuery]);

  const columns: Column[] = [
    { id: "work_request_no", header: "Work Request No", accessorKey: "work_request_no" },
    { id: "description", header: "Description", accessorKey: "description" },
    {
      id: "cm_status",
      header: "Status",
      accessorKey: "cm_status_id.name", // Accessing the nested `name` field in `cm_status_id`
      cell: (value) => <StatusBadge status={value} />,
    },
    { id: "requested_by", header: "Requested By", accessorKey: "requested_by.full_name" },
    { id: "work_center", header: "Work Center", accessorKey: "work_center_id.name" }, // Accessing `name` in `work_center_id`
    { id: "work_order_no", header: "Work Order No", accessorKey: "wo_id.work_order_no" },
    { id: "work_order_status", header: "WO Status", accessorKey: "wo_id.work_order_status_id.name" },
    { id: "asset", header: "Asset", accessorKey: "asset_id.asset_name" }, // Accessing `asset_name` in `asset_id`
    { id: "request_date", header: "Request Date", accessorKey: "work_request_date", cell: (value: any) => formatDate(value) },
    { id: "maintenance_type", header: "Maintenance Type", accessorKey: "maintenance_type.name" }, // Accessing `name` in `maintenance_type`
    { id: "date_finding", header: "Date Finding", accessorKey: "date_finding", cell: (value: any) => formatDate(value) },
  ];
  return (
    <div className="space-y-6">
      {/* <pre>{JSON.stringify(workRequests, null, 2)}</pre> */}

      <PageHeader
        title="Work Requests"
        onAddNew={() => handleCreateNewWorkRequest(null)}
        addNewLabel="New Work Request"
        onSearch={handleSearch}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <DataTable
          columns={columns}
          data={filteredWorkRequests}
          onRowClick={handleRowClick}
          onIndex={true}
        />
      )}

    </div>
  );
};

export default WorkRequestPage;