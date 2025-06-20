import React, { useMemo, useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { useNavigate } from 'react-router-dom';
import DataTable, { Column } from "@/components/shared/DataTable";
import { usePmWoGenerateHistory } from "../hooks/use-wo-generate-history.data";
import { useWoHistoryCounts } from "../hooks/use-wo-generate-history.data";
import Loading from "@/components/shared/Loading";
import { formatDate } from "@/utils/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WoHistoryPage: React.FC = () => {
  const { data: pmWoGenerateHistory, isLoading } = usePmWoGenerateHistory();
  const { data: historyCounts, isLoading: isCountsLoading } = useWoHistoryCounts();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRowClick = (row: any) => {
    navigate(`/work-orders/wo-history/${row.id}`);
  };

  const filteredHistory = useMemo(() => {
    if (!pmWoGenerateHistory) return [];
    if (!searchQuery) return pmWoGenerateHistory;
    const lower = searchQuery.toLowerCase();
    return pmWoGenerateHistory.filter(
      (history: any) =>
        history.created_by?.full_name?.toLowerCase().includes(lower) ||
        history.start_date?.toLowerCase().includes(lower) ||
        history.end_date?.toLowerCase().includes(lower) ||
        history.is_individual?.toString().toLowerCase().includes(lower)
    );
  }, [pmWoGenerateHistory, searchQuery]);

  const columns: Column[] = [
    { id: "created_at", header: "Created At", accessorKey: "created_at", cell: (value: any) => formatDate(value) },
    { id: "created_by", header: "Created By", accessorKey: "created_by.full_name" },
    { id: "pm_schedule", header: "PM Schedule No", accessorKey: "pm_schedule_id.pm_no" },
    { id: "start_date", header: "Start Date", accessorKey: "start_date", cell: (value: any) => formatDate(value) },
    { id: "end_date", header: "End Date", accessorKey: "end_date", cell: (value: any) => formatDate(value) },
    { id: "wo_count", header: "Work Order Count", accessorKey: "wo_count" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Work Order Generate History"
        onSearch={handleSearch}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total PM Schedules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{historyCounts?.pmScheduleCount ?? "0"}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Work Orders Generated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{historyCounts?.workOrderTotal ?? "0"}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total CM Work Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{historyCounts?.workOrderCm ?? "0"}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total PM Work Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{historyCounts?.workOrderPm ?? "0"}</div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <DataTable
          columns={columns}
          data={filteredHistory}
          onRowClick={handleRowClick}
          onIndex={true}
        />
      )}
    </div>
  );
};

export default WoHistoryPage;
