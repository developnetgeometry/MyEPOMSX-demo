import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from "@/components/shared/StatusBadge";
import { ShieldAlertIcon } from "lucide-react";
import { RBIAssessment } from "@/types/monitoring";

// Sample data for RBI assessments
export const initialRbiData: RBIAssessment[] = [
  {
    id: "1",
    rbiId: "RBI-001",
    asset: "PV-1001",
    likelihood: "Medium",
    consequence: "High",
    riskRank: "High",
    nextAssessmentDate: "2025-09-15",
    status: "Active",
    // Default values for additional fields
    coatingQuality: "Good",
    dataConfidence: "High",
    hasCladding: false,
    nominalThickness: 0,
    tMin: 0,
    currentThickness: 0,
    description: "",
    lastInspectionDate: new Date().toISOString().split("T")[0],
    lastCoatingDate: new Date().toISOString().split("T")[0],
    nthinA: 0,
    nthinB: 0,
    fsThin: 0,
    srThin: 0,
    dfThin1: 0,
    dfThin2: 0,
    creep: 0,
    pothin1: 0,
    agerc: 0,
    bhthin: 0,
    fcommd: 0,
    fatta: 0,
    outagehrs: 0,
    outagemult: 0,
    lrapprod: 0,
    fprodd: 0,
    popdens: 0,
    injcost: 0,
    facexp: 0,
    volinv: 0,
    fc: 0,
    ftotal: 0,
    envcost: 0,
    fatality: 0,
    evacuation: 0,
    isoSys: "Manual",
    detSys: "Manual",
    mitigationSystem: "Basic",
    idealGasSpecificHeatEQ: "Standard",
    pkkpa: 0,
    prtankKpa: 0,
    wtkg: 0,
    releaseType: "Gas",
    ratton: 0,
    inventorykg: 0,
    caCmdfail: 0,
    caInjfail: 0,
    caInjfatal: 0,
    caCmdfatal: 0,
    k: 0,
    timemstep: 0,
    ldmax: 0,
    dfhta: 0,
    dbrint: 0,
    dfmat: 0,
    dfextclsc: 0,
    dfcuiiff: 0,
    dmsccssc: 0,
    dmfat: 0,
    dpSCCSOHIC: 0,
    cofFinancial: 0,
    cofArea: 0,
    dfthin: 0,
    pof: 0,
    pofValue: 0,
    riskLevel: "Low",
    riskRanking: "Low",
  },
  {
    id: "2",
    rbiId: "RBI-002",
    asset: "PP-2003",
    likelihood: "Low",
    consequence: "Medium",
    riskRank: "Medium",
    nextAssessmentDate: "2025-10-22",
    status: "Active",
    // Default values for additional fields
    coatingQuality: "Good",
    dataConfidence: "High",
    hasCladding: false,
    nominalThickness: 0,
    tMin: 0,
    currentThickness: 0,
    description: "",
    lastInspectionDate: new Date().toISOString().split("T")[0],
    lastCoatingDate: new Date().toISOString().split("T")[0],
    nthinA: 0,
    nthinB: 0,
    fsThin: 0,
    srThin: 0,
    dfThin1: 0,
    dfThin2: 0,
    creep: 0,
    pothin1: 0,
    agerc: 0,
    bhthin: 0,
    fcommd: 0,
    fatta: 0,
    outagehrs: 0,
    outagemult: 0,
    lrapprod: 0,
    fprodd: 0,
    popdens: 0,
    injcost: 0,
    facexp: 0,
    volinv: 0,
    fc: 0,
    ftotal: 0,
    envcost: 0,
    fatality: 0,
    evacuation: 0,
    isoSys: "Manual",
    detSys: "Manual",
    mitigationSystem: "Basic",
    idealGasSpecificHeatEQ: "Standard",
    pkkpa: 0,
    prtankKpa: 0,
    wtkg: 0,
    releaseType: "Gas",
    ratton: 0,
    inventorykg: 0,
    caCmdfail: 0,
    caInjfail: 0,
    caInjfatal: 0,
    caCmdfatal: 0,
    k: 0,
    timemstep: 0,
    ldmax: 0,
    dfhta: 0,
    dbrint: 0,
    dfmat: 0,
    dfextclsc: 0,
    dfcuiiff: 0,
    dmsccssc: 0,
    dmfat: 0,
    dpSCCSOHIC: 0,
    cofFinancial: 0,
    cofArea: 0,
    dfthin: 0,
    pof: 0,
    pofValue: 0,
    riskLevel: "Low",
    riskRanking: "Low",
  },
  {
    id: "3",
    rbiId: "RBI-003",
    asset: "PV-1002",
    likelihood: "High",
    consequence: "High",
    riskRank: "Critical",
    nextAssessmentDate: "2025-07-30",
    status: "Active",
    // Default values for additional fields
    coatingQuality: "Good",
    dataConfidence: "High",
    hasCladding: false,
    nominalThickness: 0,
    tMin: 0,
    currentThickness: 0,
    description: "",
    lastInspectionDate: new Date().toISOString().split("T")[0],
    lastCoatingDate: new Date().toISOString().split("T")[0],
    nthinA: 0,
    nthinB: 0,
    fsThin: 0,
    srThin: 0,
    dfThin1: 0,
    dfThin2: 0,
    creep: 0,
    pothin1: 0,
    agerc: 0,
    bhthin: 0,
    fcommd: 0,
    fatta: 0,
    outagehrs: 0,
    outagemult: 0,
    lrapprod: 0,
    fprodd: 0,
    popdens: 0,
    injcost: 0,
    facexp: 0,
    volinv: 0,
    fc: 0,
    ftotal: 0,
    envcost: 0,
    fatality: 0,
    evacuation: 0,
    isoSys: "Manual",
    detSys: "Manual",
    mitigationSystem: "Basic",
    idealGasSpecificHeatEQ: "Standard",
    pkkpa: 0,
    prtankKpa: 0,
    wtkg: 0,
    releaseType: "Gas",
    ratton: 0,
    inventorykg: 0,
    caCmdfail: 0,
    caInjfail: 0,
    caInjfatal: 0,
    caCmdfatal: 0,
    k: 0,
    timemstep: 0,
    ldmax: 0,
    dfhta: 0,
    dbrint: 0,
    dfmat: 0,
    dfextclsc: 0,
    dfcuiiff: 0,
    dmsccssc: 0,
    dmfat: 0,
    dpSCCSOHIC: 0,
    cofFinancial: 0,
    cofArea: 0,
    dfthin: 0,
    pof: 0,
    pofValue: 0,
    riskLevel: "Low",
    riskRanking: "Low",
  },
  {
    id: "4",
    rbiId: "RBI-004",
    asset: "PP-2001",
    likelihood: "Low",
    consequence: "Low",
    riskRank: "Low",
    nextAssessmentDate: "2025-12-05",
    status: "Active",
    // Default values for additional fields
    coatingQuality: "Good",
    dataConfidence: "High",
    hasCladding: false,
    nominalThickness: 0,
    tMin: 0,
    currentThickness: 0,
    description: "",
    lastInspectionDate: new Date().toISOString().split("T")[0],
    lastCoatingDate: new Date().toISOString().split("T")[0],
    nthinA: 0,
    nthinB: 0,
    fsThin: 0,
    srThin: 0,
    dfThin1: 0,
    dfThin2: 0,
    creep: 0,
    pothin1: 0,
    agerc: 0,
    bhthin: 0,
    fcommd: 0,
    fatta: 0,
    outagehrs: 0,
    outagemult: 0,
    lrapprod: 0,
    fprodd: 0,
    popdens: 0,
    injcost: 0,
    facexp: 0,
    volinv: 0,
    fc: 0,
    ftotal: 0,
    envcost: 0,
    fatality: 0,
    evacuation: 0,
    isoSys: "Manual",
    detSys: "Manual",
    mitigationSystem: "Basic",
    idealGasSpecificHeatEQ: "Standard",
    pkkpa: 0,
    prtankKpa: 0,
    wtkg: 0,
    releaseType: "Gas",
    ratton: 0,
    inventorykg: 0,
    caCmdfail: 0,
    caInjfail: 0,
    caInjfatal: 0,
    caCmdfatal: 0,
    k: 0,
    timemstep: 0,
    ldmax: 0,
    dfhta: 0,
    dbrint: 0,
    dfmat: 0,
    dfextclsc: 0,
    dfcuiiff: 0,
    dmsccssc: 0,
    dmfat: 0,
    dpSCCSOHIC: 0,
    cofFinancial: 0,
    cofArea: 0,
    dfthin: 0,
    pof: 0,
    pofValue: 0,
    riskLevel: "Low",
    riskRanking: "Low",
  },
  {
    id: "5",
    rbiId: "RBI-005",
    asset: "PV-1003",
    likelihood: "Medium",
    consequence: "Medium",
    riskRank: "Medium",
    nextAssessmentDate: "2025-11-18",
    status: "Complete",
    // Default values for additional fields
    coatingQuality: "Good",
    dataConfidence: "High",
    hasCladding: false,
    nominalThickness: 0,
    tMin: 0,
    currentThickness: 0,
    description: "",
    lastInspectionDate: new Date().toISOString().split("T")[0],
    lastCoatingDate: new Date().toISOString().split("T")[0],
    nthinA: 0,
    nthinB: 0,
    fsThin: 0,
    srThin: 0,
    dfThin1: 0,
    dfThin2: 0,
    creep: 0,
    pothin1: 0,
    agerc: 0,
    bhthin: 0,
    fcommd: 0,
    fatta: 0,
    outagehrs: 0,
    outagemult: 0,
    lrapprod: 0,
    fprodd: 0,
    popdens: 0,
    injcost: 0,
    facexp: 0,
    volinv: 0,
    fc: 0,
    ftotal: 0,
    envcost: 0,
    fatality: 0,
    evacuation: 0,
    isoSys: "Manual",
    detSys: "Manual",
    mitigationSystem: "Basic",
    idealGasSpecificHeatEQ: "Standard",
    pkkpa: 0,
    prtankKpa: 0,
    wtkg: 0,
    releaseType: "Gas",
    ratton: 0,
    inventorykg: 0,
    caCmdfail: 0,
    caInjfail: 0,
    caInjfatal: 0,
    caCmdfatal: 0,
    k: 0,
    timemstep: 0,
    ldmax: 0,
    dfhta: 0,
    dbrint: 0,
    dfmat: 0,
    dfextclsc: 0,
    dfcuiiff: 0,
    dmsccssc: 0,
    dmfat: 0,
    dpSCCSOHIC: 0,
    cofFinancial: 0,
    cofArea: 0,
    dfthin: 0,
    pof: 0,
    pofValue: 0,
    riskLevel: "Low",
    riskRanking: "Low",
  },
];

const RBIAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [rbiData, setRbiData] = useState(initialRbiData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<RBIAssessment>({
    id: "",
    rbiId: "",
    asset: "",
    likelihood: "Low",
    consequence: "Low",
    riskRank: "Low",
    nextAssessmentDate: "",
    status: "Active",
    // Add all required properties based on the RBIAssessment interface
    coatingQuality: "Good",
    dataConfidence: "High",
    hasCladding: false,
    nominalThickness: 0,
    tMin: 0,
    currentThickness: 0,
    description: "",
    lastInspectionDate: new Date().toISOString().split("T")[0],
    lastCoatingDate: new Date().toISOString().split("T")[0],
    nthinA: 0,
    nthinB: 0,
    fsThin: 0,
    srThin: 0,
    dfThin1: 0,
    dfThin2: 0,
    creep: 0,
    pothin1: 0,
    agerc: 0,
    bhthin: 0,
    fcommd: 0,
    fatta: 0,
    outagehrs: 0,
    outagemult: 0,
    lrapprod: 0,
    fprodd: 0,
    popdens: 0,
    injcost: 0,
    facexp: 0,
    volinv: 0,
    fc: 0,
    ftotal: 0,
    envcost: 0,
    fatality: 0,
    evacuation: 0,
    isoSys: "Manual",
    detSys: "Manual",
    mitigationSystem: "Basic",
    idealGasSpecificHeatEQ: "Standard",
    pkkpa: 0,
    prtankKpa: 0,
    wtkg: 0,
    releaseType: "Gas",
    ratton: 0,
    inventorykg: 0,
    caCmdfail: 0,
    caInjfail: 0,
    caInjfatal: 0,
    caCmdfatal: 0,
    k: 0,
    timemstep: 0,
    ldmax: 0,
    dfhta: 0,
    dbrint: 0,
    dfmat: 0,
    dfextclsc: 0,
    dfcuiiff: 0,
    dmsccssc: 0,
    dmfat: 0,
    dpSCCSOHIC: 0,
    cofFinancial: 0,
    cofArea: 0,
    dfthin: 0,
    pof: 0,
    pofValue: 0,
    riskLevel: "Low",
    riskRanking: "Low",
  });

  const handleAddNew = () => {
    // Navigate to the new assessment page instead of opening a dialog
    navigate("/monitor/rbi-assessment/new");
  };

  const handleEdit = (row: any) => {
    // Navigate to the detail page for editing
    navigate(`/monitor/rbi-assessment/${row.id}`);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Calculate risk rank based on likelihood and consequence
    if (name === "likelihood" || name === "consequence") {
      const likelihood = name === "likelihood" ? value : formData.likelihood;
      const consequence = name === "consequence" ? value : formData.consequence;
      const riskRank = calculateRiskRank(
        likelihood as "Low" | "Medium" | "High",
        consequence as "Low" | "Medium" | "High"
      );

      setFormData((prev) => ({
        ...prev,
        [name]: value,
        riskRank,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Utility function to calculate risk rank
  const calculateRiskRank = (
    likelihood: "Low" | "Medium" | "High",
    consequence: "Low" | "Medium" | "High"
  ) => {
    if (likelihood === "High" && consequence === "High") {
      return "Critical" as const;
    } else if (likelihood === "High" || consequence === "High") {
      return "High" as const;
    } else if (likelihood === "Medium" || consequence === "Medium") {
      return "Medium" as const;
    } else {
      return "Low" as const;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode) {
      setRbiData((prev) =>
        prev.map((item) => (item.id === formData.id ? { ...formData } : item))
      );
    } else {
      // Ensure we create a complete RBIAssessment object
      const newAssessment: RBIAssessment = {
        ...formData,
        id: String(rbiData.length + 1),
      };
      setRbiData((prev) => [...prev, newAssessment]);
    }

    setIsDialogOpen(false);
  };

  // Function to get appropriate color class based on risk rank
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

  const handleRowClick = (row: any) => {
    navigate(`/monitor/rbi-assessment/${row.id}`);
  };

  const columns: Column[] = [
    { id: "rbiId", header: "RBI ID", accessorKey: "rbiId" },
    { id: "asset", header: "Asset", accessorKey: "asset" },
    {
      id: "likelihood",
      header: "Likelihood",
      accessorKey: "likelihood",
      cell: (value) => (
        <span
          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
            value === "High"
              ? "bg-red-100 text-red-800"
              : value === "Medium"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      id: "consequence",
      header: "Consequence",
      accessorKey: "consequence",
      cell: (value) => (
        <span
          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
            value === "High"
              ? "bg-red-100 text-red-800"
              : value === "Medium"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      id: "riskRank",
      header: "Risk Rank",
      accessorKey: "riskRank",
      cell: (value) => (
        <span
          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getRiskRankColor(
            value
          )}`}
        >
          {value}
        </span>
      ),
    },
    {
      id: "nextAssessmentDate",
      header: "Next Assessment Date",
      accessorKey: "nextAssessmentDate",
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: (value) => <StatusBadge status={value} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="RBI Assessment"
        subtitle="Risk-Based Inspection assessment management"
        icon={<ShieldAlertIcon className="h-6 w-6" />}
        onAddNew={handleAddNew}
        addNewLabel="+ New Assessment"
        onSearch={(query) => console.log("Search:", query)}
      />

      <Card>
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={rbiData}
            onEdit={handleEdit}
            onRowClick={handleRowClick}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RBIAssessmentPage;
