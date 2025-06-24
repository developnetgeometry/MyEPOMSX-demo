import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from "@/components/shared/StatusBadge";
import { ShieldAlertIcon } from "lucide-react";
import { useImsGeneralData } from "./hooks/use-ims-general-data";
import Loading from "@/components/shared/Loading";

const RBIAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: rbiData, isLoading, error } = useImsGeneralData();
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddNew = () => {
    navigate("/monitor/rbi-assessment/new");
  };

  const handleRowClick = (row: any) => {
    navigate(`/monitor/rbi-assessment/${row.id}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const getRiskRankColor = (rank: string) => {
    switch (rank) {
      case "Critical":
        return "bg-red-100 text-red-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredRbiData = useMemo(() => {
    if (!rbiData) return [];
    if (!searchQuery) return rbiData;

    const lower = searchQuery.toLowerCase();
    return rbiData.filter(
      (item: any) =>
        item.asset_no.toLowerCase().includes(lower) ||
        item.asset_name.toLowerCase().includes(lower) ||
        item.type_name.toLowerCase().includes(lower) ||
        item.PoF.toLowerCase().includes(lower) ||
        item.CoF.toString().includes(lower) ||
        item.Risk.toLowerCase().includes(lower)
    );
  }, [rbiData, searchQuery]);

  const columns: Column[] = [
    { id: "asset_no", header: "Asset No", accessorKey: "asset_detail.asset.asset_no" },
    { id: "asset_name", header: "Asset Name", accessorKey: "asset_detail.asset.asset_name" },
    { id: "type_name", header: "Type Name", accessorKey: "asset_detail.type.name" },
    { id: "PoF", header: "PoF", accessorKey: "PoF" },
    { id: "CoF", header: "CoF", accessorKey: "CoF" },
    { id: "Risk", header: "Risk", accessorKey: "Risk" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="RBI Assessment"
        subtitle="Risk-Based Inspection assessment management"
        icon={<ShieldAlertIcon className="h-6 w-6" />}
        onAddNew={handleAddNew}
        addNewLabel="New Assessment"
        onSearch={handleSearch}
      />
      {/* <pre>{JSON.stringify(rbiData, null, 2)}</pre> */}


      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <Loading />
          ) : (
            <DataTable
              columns={columns}
              data={filteredRbiData}
              onRowClick={handleRowClick}
              onIndex={true}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RBIAssessmentPage;