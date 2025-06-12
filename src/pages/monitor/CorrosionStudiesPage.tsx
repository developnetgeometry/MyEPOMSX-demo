import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import { FileCodeIcon } from "lucide-react";

// Sample data for corrosion studies
const initialCorrosionStudies = [
  {
    id: "1",
    studyId: "CS-001",
    system: "Cooling Water System",
    asset: "HX-1001",
    studyName: "Heat Exchanger Tube Corrosion Analysis",
    dateConducted: "2025-02-15",
    corrosionRate: 0.12,
    notes:
      "Found localized pitting on tube sheets. Recommended increased inhibitor concentration.",
  },
  {
    id: "2",
    studyId: "CS-002",
    system: "Process Line",
    asset: "PP-2001",
    studyName: "Pipeline Internal Corrosion Assessment",
    dateConducted: "2025-03-10",
    corrosionRate: 0.08,
    notes:
      "Uniform corrosion detected. Within acceptable limits. Monitor in 6 months.",
  },
  {
    id: "3",
    studyId: "CS-003",
    system: "Storage Tank",
    asset: "TK-3001",
    studyName: "Tank Floor Corrosion Study",
    dateConducted: "2025-01-25",
    corrosionRate: 0.22,
    notes:
      "Significant floor plate thinning detected. Scheduled for repair during next maintenance window.",
  },
  {
    id: "4",
    studyId: "CS-004",
    system: "Overhead Condenser",
    asset: "CD-4001",
    studyName: "Condensate Corrosion Analysis",
    dateConducted: "2025-02-28",
    corrosionRate: 0.05,
    notes: "Minimal corrosion detected. No immediate action required.",
  },
  {
    id: "5",
    studyId: "CS-005",
    system: "Flare System",
    asset: "FL-5001",
    studyName: "Flare Tip Erosion Study",
    dateConducted: "2025-03-22",
    corrosionRate: 0.31,
    notes:
      "Erosion rate higher than expected. Recommended replacement in next turnaround.",
  },
];

const CorrosionStudiesPage: React.FC = () => {
  const navigate = useNavigate();
  const [studies, setStudies] = useState(initialCorrosionStudies);

  const handleAddNew = () => {
    navigate("/monitor/corrosion-studies/new");
  };

  // Function to handle row click and navigate to the detail page
  const handleRowClick = (row: any) => {
    navigate(`/monitor/corrosion-studies/${row.id}`);
  };

  // Function to get appropriate color class based on corrosion rate
  const getCorrosionRateColor = (rate: number) => {
    if (rate > 0.25) return "text-red-600";
    if (rate > 0.1) return "text-orange-600";
    return "text-green-600";
  };

  const columns: Column[] = [
    { id: "studyId", header: "Study ID", accessorKey: "studyId" },
    { id: "system", header: "System", accessorKey: "system" },
    { id: "asset", header: "Asset", accessorKey: "asset" },
    { id: "studyName", header: "Study Name", accessorKey: "studyName" },
    {
      id: "dateConducted",
      header: "Date Conducted",
      accessorKey: "dateConducted",
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Corrosion Studies"
        subtitle="Management of corrosion studies and analysis"
        icon={<FileCodeIcon className="h-6 w-6" />}
        onAddNew={handleAddNew}
        addNewLabel="+ New Study"
        onSearch={(query) => console.log("Search:", query)}
      />

      <Card>
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={studies}
            onRowClick={handleRowClick}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CorrosionStudiesPage;
