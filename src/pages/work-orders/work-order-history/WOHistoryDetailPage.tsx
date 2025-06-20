import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import { useWoPmScheduleByGenerateId } from "../hooks/use-wo-generate-history.data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Loading from "@/components/shared/Loading";
import { formatDate } from "@/utils/formatters";
import { useQueryClient } from "@tanstack/react-query";

const WoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: woPmScheduleData, isLoading } = useWoPmScheduleByGenerateId(Number(id));

  const handleRowClick = (row: any) => {
    queryClient.invalidateQueries({ queryKey: ["e-new-work-request-data", row.wo_id.id] });
    navigate(`/work-orders/work-order-list/${ row.wo_id.id}`);
  };

  const columns: Column[] = [
    { id: "wo_no", header: "Work Order No", accessorKey: "wo_id.work_order_no" },
    { id: "description", header: "Description", accessorKey: "wo_id.description" },
    { id: "pm_schedule", header: "PM Schedule No", accessorKey: "pm_schedule_id.pm_no" },
    { id: "due_date", header: "Due Date", accessorKey: "due_date", cell: (value: any) => formatDate(value) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title={`Work Order Generate Detail`} />
        <Button
          variant="outline"
          onClick={() => navigate("/work-orders/wo-history")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to History
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Work Order Generate Details</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loading />
          ) : (
            <DataTable
              columns={columns}
              data={woPmScheduleData || []}
              onRowClick={handleRowClick}
              onIndex={true}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WoDetailPage;