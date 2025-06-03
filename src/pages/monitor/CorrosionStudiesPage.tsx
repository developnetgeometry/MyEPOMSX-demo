import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    studyId: "",
    system: "",
    asset: "",
    studyName: "",
    dateConducted: "",
    corrosionRate: 0,
    notes: "",
  });

  const handleAddNew = () => {
    setIsEditMode(false);
    setFormData({
      id: `${studies.length + 1}`,
      studyId: `CS-${String(studies.length + 1).padStart(3, "0")}`,
      system: "",
      asset: "",
      studyName: "",
      dateConducted: "",
      corrosionRate: 0,
      notes: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (row: any) => {
    setIsEditMode(true);
    setFormData({
      ...row,
    });
    setIsDialogOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "corrosionRate") {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode) {
      setStudies((prev) =>
        prev.map((item) => (item.id === formData.id ? formData : item))
      );
    } else {
      setStudies((prev) => [...prev, formData]);
    }

    setIsDialogOpen(false);
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
            onEdit={handleEdit}
            onRowClick={handleRowClick}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Corrosion Study" : "Add New Corrosion Study"}
            </DialogTitle>
            <DialogDescription>
              Fill in the study details. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studyId">Study ID</Label>
                <Input
                  id="studyId"
                  name="studyId"
                  value={formData.studyId}
                  onChange={handleInputChange}
                  readOnly={isEditMode}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="system">System</Label>
                <Input
                  id="system"
                  name="system"
                  value={formData.system}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="asset">Asset</Label>
                <Input
                  id="asset"
                  name="asset"
                  value={formData.asset}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studyName">Study Name</Label>
                <Input
                  id="studyName"
                  name="studyName"
                  value={formData.studyName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateConducted">Date Conducted</Label>
                <Input
                  id="dateConducted"
                  name="dateConducted"
                  type="date"
                  value={formData.dateConducted}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="corrosionRate">Corrosion Rate (mm/year)</Label>
                <Input
                  id="corrosionRate"
                  name="corrosionRate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.corrosionRate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CorrosionStudiesPage;
