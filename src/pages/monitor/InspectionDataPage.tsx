import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClipboardList, Search, Filter } from "lucide-react";
import { useInspectionDataList } from "@/hooks/queries/useInspectionData";

const InspectionDataPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: inspectionDataList, isLoading } = useInspectionDataList();
  
  const [inspectionData, setInspectionData] = useState(inspectionDataList || []);
  const [filteredData, setFilteredData] = useState(inspectionDataList || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (inspectionDataList) {
      setInspectionData(inspectionDataList);
      setFilteredData(inspectionDataList);
    }
  }, [inspectionDataList]);

  const handleAddNew = () => {
    navigate("/monitor/inspection-data/new");
  };

  const handleRowClick = (row: any) => {
    navigate(`/monitor/inspection-data/${row.id}`);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters(value, statusFilter);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    applyFilters(searchTerm, value);
  };

  const applyFilters = (search: string, status: string) => {
    let filtered = inspectionData;

    // Apply search filter
    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.assetNo.toLowerCase().includes(search.toLowerCase()) ||
          item.assetName.toLowerCase().includes(search.toLowerCase()) ||
          item.inspectionStrategy.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply status filter
    if (status !== "all") {
      filtered = filtered.filter((item) =>
        status === "active" ? item.isActive : !item.isActive
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Function to get appropriate color class based on remaining life
  const getRemainingLifeColor = (life: number) => {
    if (life < 5) return "text-red-600 font-semibold";
    if (life < 10) return "text-orange-600 font-medium";
    return "text-green-600";
  };

  // Function to get appropriate color class based on corrosion rate
  const getCorrosionRateColor = (rate: number) => {
    if (rate > 0.2) return "text-red-600";
    if (rate > 0.1) return "text-orange-600";
    return "text-green-600";
  };

  const columns: Column[] = [
    { id: "assetNo", header: "Asset Code", accessorKey: "assetNo" },
    { id: "assetName", header: "Asset Name", accessorKey: "assetName" },
    {
      id: "ltcr",
      header: "LTCR (mm/year)",
      accessorKey: "ltcr",
      cell: (value) => (
        <span className={`font-medium ${getCorrosionRateColor(value)}`}>
          {value.toFixed(2)}
        </span>
      ),
    },
    {
      id: "stcr",
      header: "STCR (mm/year)",
      accessorKey: "stcr",
      cell: (value) => (
        <span className={`font-medium ${getCorrosionRateColor(value)}`}>
          {value.toFixed(2)}
        </span>
      ),
    },
    {
      id: "inspectionStrategy",
      header: "Inspection Strategy",
      accessorKey: "inspectionStrategy",
    },
    {
      id: "remainingLife",
      header: "Remaining Life (years)",
      accessorKey: "remainingLife",
      cell: (value) => (
        <span className={`font-medium ${getRemainingLifeColor(value)}`}>
          {value.toFixed(1)}
        </span>
      ),
    },
    {
      id: "isActive",
      header: "Status",
      accessorKey: "isActive",
      cell: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  // Calculate pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  if(isLoading){
    return(
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading inspection data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inspection Data"
        subtitle="View and manage asset inspection records and findings"
        icon={<ClipboardList className="h-6 w-6" />}
        onAddNew={handleAddNew}
        addNewLabel="Add Inspection Data"
      />

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by asset number, name, or inspection strategy..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={currentData}
            onRowClick={handleRowClick}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
                {totalItems} results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                {/* Page numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    )
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InspectionDataPage;
