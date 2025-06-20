import React, { useState } from "react";
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

// Sample data for inspection records
const initialInspectionData = [
  {
    id: "1",
    assetNo: "PV-1001",
    assetName: "Pressure Vessel - Main Reactor",
    ltcr: 0.15,
    stcr: 0.12,
    inspectionStrategy: "Visual + UT Thickness",
    remainingLife: 8.5,
    isActive: true,
  },
  {
    id: "2",
    assetNo: "PP-2003",
    assetName: "Process Piping - Feed Line",
    ltcr: 0.08,
    stcr: 0.06,
    inspectionStrategy: "Radiographic Testing",
    remainingLife: 12.3,
    isActive: true,
  },
  {
    id: "3",
    assetNo: "HX-1002",
    assetName: "Heat Exchanger - Shell & Tube",
    ltcr: 0.22,
    stcr: 0.18,
    inspectionStrategy: "Eddy Current + Visual",
    remainingLife: 6.7,
    isActive: true,
  },
  {
    id: "4",
    assetNo: "TK-3001",
    assetName: "Storage Tank - Crude Oil",
    ltcr: 0.11,
    stcr: 0.09,
    inspectionStrategy: "Magnetic Particle Testing",
    remainingLife: 9.8,
    isActive: false,
  },
  {
    id: "5",
    assetNo: "CD-4001",
    assetName: "Condenser - Overhead System",
    ltcr: 0.05,
    stcr: 0.04,
    inspectionStrategy: "Ultrasonic Testing",
    remainingLife: 15.2,
    isActive: true,
  },
  {
    id: "6",
    assetNo: "PP-2004",
    assetName: "Process Piping - Return Line",
    ltcr: 0.18,
    stcr: 0.15,
    inspectionStrategy: "Visual + Dye Penetrant",
    remainingLife: 7.1,
    isActive: true,
  },
  {
    id: "7",
    assetNo: "PV-1002",
    assetName: "Pressure Vessel - Secondary",
    ltcr: 0.13,
    stcr: 0.11,
    inspectionStrategy: "Radiographic + UT",
    remainingLife: 10.4,
    isActive: true,
  },
  {
    id: "8",
    assetNo: "TK-3002",
    assetName: "Storage Tank - Product",
    ltcr: 0.07,
    stcr: 0.05,
    inspectionStrategy: "Visual Inspection",
    remainingLife: 14.6,
    isActive: false,
  },
];

const InspectionDataPage: React.FC = () => {
  const navigate = useNavigate();
  const [inspectionData, setInspectionData] = useState(initialInspectionData);
  const [filteredData, setFilteredData] = useState(initialInspectionData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inspection Data"
        subtitle="View and manage asset inspection records and findings"
        icon={<ClipboardList className="h-6 w-6" />}
        onAddNew={handleAddNew}
        addNewLabel="+ Add Inspection Data"
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
