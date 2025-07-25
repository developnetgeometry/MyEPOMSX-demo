import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from "@/components/shared/StatusBadge";
import { ShieldAlertIcon } from "lucide-react";
import Loading from "@/components/shared/Loading";
import { useImsRbiGeneralData } from "./hooks/use-ims-rbi-general-data";
import SearchFilters from "@/components/shared/SearchFilters";
import useDebounce from "@/hooks/use-debounce";

const RBIAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: rbiData, isLoading, error } = useImsRbiGeneralData();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const handleAddNew = () => {
    navigate("/monitor/rbi-assessment/new");
  };

  const handleRowClick = (row: any) => {
    navigate(`/monitor/rbi-assessment/${row.id}`);
  };

  const handleSearch = () => {

  };

  const getRiskRankColor = (rank: string) => {
    switch (rank) {
      case "VERY HIGH":
        return "bg-red-100 text-red-800";
      case "HIGH":
        return "bg-orange-100 text-orange-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredData = useMemo(() => {
    if (!rbiData) return [];
    if(!debouncedSearchQuery.trim()) return rbiData;

    const lowerSearch = debouncedSearchQuery.toLowerCase();
    return rbiData.filter(
      (rbi) =>
        rbi.rbi_no?.toLowerCase().includes(lowerSearch) ||
        rbi.asset_detail_id.e_asset.asset_no?.toLowerCase().includes(lowerSearch) ||
        rbi.asset_detail_id.e_asset.asset_name?.toLowerCase().includes(lowerSearch) ||
        rbi.asset_detail_id.type_id.name?.toLowerCase().includes(lowerSearch)
    );
  }, [rbiData, debouncedSearchQuery]);

  const columns: Column[] = [
    { id: "rbi_no", header: "RBI No", accessorKey: "rbi_no" },
    {
      id: "created_at",
      header: "Created At",
      accessorKey: "created_at",
      cell: (value) =>
        value
          ? new Date(value).toLocaleString("en-MY", {
            timeZone: "Asia/Kuala_Lumpur",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
          : "-",
    },
    { id: "asset_no", header: "Asset No", accessorKey: "asset_detail_id.e_asset.asset_no" },
    { id: "asset_name", header: "Asset Name", accessorKey: "asset_detail_id.e_asset.asset_name" },
    { id: "type_name", header: "Type Name", accessorKey: "asset_detail_id.type_id.name" },
    { id: "PoF", header: "PoF", accessorKey: "pof_value" },
    { id: "CoF", header: "CoF", accessorKey: "cof_value" },
    {
      id: "Risk",
      header: "Risk",
      accessorKey: "risk_level",
      cell: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskRankColor(value)}`}>
          {value}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="RBI Assessment"
        subtitle="Risk-Based Inspection assessment management"
        icon={<ShieldAlertIcon className="h-6 w-6" />}
        onAddNew={handleAddNew}
        addNewLabel="New Assessment"
      />
      {/* <pre>{JSON.stringify(rbiData, null, 2)}</pre> */}


      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <Loading />
          ) : (
            <>
            <SearchFilters
              text="RBI"
              searchTerm={searchQuery}
              setSearchTerm={setSearchQuery}
              handleSearch={handleSearch}
              />

            <DataTable
              columns={columns}
              data={filteredData}
              onRowClick={handleRowClick}
              onIndex={true}
            />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RBIAssessmentPage;