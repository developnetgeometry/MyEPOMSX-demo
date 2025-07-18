import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import { FileCodeIcon } from "lucide-react";
import { useCorrosionStudies } from "@/hooks/queries/useCorrosionStudy";
import { formatDate } from "@/utils/formatters";
import Loading from "@/components/shared/Loading";
import SearchFilters from "@/components/shared/SearchFilters";
import useDebounce from "@/hooks/use-debounce";


const CorrosionStudiesPage: React.FC = () => {
  const navigate = useNavigate();

  // Corrosion study page data and mutation
  const { data: corrosionStudies, isLoading: loadingStudies } = useCorrosionStudies()
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredData = useMemo(() => {
    if (!corrosionStudies) return [];
    if (!debouncedSearchTerm.trim()) return corrosionStudies;
  
    const lowerSearch = debouncedSearchTerm.toLowerCase();
    return corrosionStudies.filter(
      (study) =>
        study.studyCode?.toLowerCase().includes(lowerSearch) ||
        study.studyName?.toLowerCase().includes(lowerSearch) ||
        study.assetName?.toLowerCase().includes(lowerSearch)
    );
  }, [corrosionStudies, debouncedSearchTerm]);
  

  const handleAddNew = () => {
    navigate("/monitor/corrosion-studies/new");
  };

  // Function to handle row click and navigate to the detail page
  const handleRowClick = (row: any) => {
    navigate(`/monitor/corrosion-studies/${row.id}`);
  };

  const handleSearch = () => {

  }

  // Function to get appropriate color class based on corrosion rate
  const getCorrosionRateColor = (rate: number) => {
    if (rate > 0.25) return "text-red-600";
    if (rate > 0.1) return "text-orange-600";
    return "text-green-600";
  };

  const columns: Column[] = [
    { id: "studyCode", header: "Study Code", accessorKey: "studyCode" },
    { id: "asset", header: "Asset", accessorKey: "assetName" },
    { id: "studyName", header: "Study Name", accessorKey: "studyName" },
    {
      id: "dateConducted",
      header: "Date Conducted",
      accessorKey: "dateConducted",
      cell: (value) => formatDate(value),
    },
    {
      id: "corrosionRate",
      header: "Corrosion Rate (mm/year)",
      accessorKey: "corrosionRate",
      cell: (value) => (
        <span className={`font-medium ${getCorrosionRateColor(value)}`}>
          {value.toFixed(2)}
        </span>
      ),
    },
    {
      id: "notes",
      header: "Notes",
      accessorKey: "notes",
      cell: (value) => (
        <div className="max-w-[300px] truncate" title={value}>
          {value}
        </div>
      ),
    },
  ];

  // If data is still loading, show a loading state
  if (loadingStudies) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading corrosion studies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Corrosion Studies"
        subtitle="Management of corrosion studies and analysis"
        icon={<FileCodeIcon className="h-6 w-6" />}
        onAddNew={handleAddNew}
        addNewLabel="New Study"
      />

      <Card>
        <CardContent className="p-6">
          {loadingStudies ? (
            <Loading />
          ) : (
            <>
            <SearchFilters
              text="Corrosion Studies"
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleSearch={handleSearch}
            />
            <DataTable
              columns={columns}
              data={filteredData}
              onRowClick={handleRowClick}
            />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CorrosionStudiesPage;
