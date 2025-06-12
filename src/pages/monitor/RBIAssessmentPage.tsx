// filepath: /Users/acapxasyraf/Desktop/Source Code/net_geo/MyEPOMSX/src/pages/monitor/RBIAssessmentPage.tsx
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
    // POF Assessment - General
    coatingQuality: "Good",
    dataConfidence: "High",
    hasCladding: false,
    nominalThickness: 0,
    tMin: 0,
    currentThickness: 0,
    description: "",
    // Damage factors
    dthinf: 0,
    dfextclscc: 0,
    dfcuiff: 0,
    dfsccscc: 0,
    dfSCCSOHIC: 0,
    dmfat: 0,
    // COF Assessment - COF PROD
    fccmd: 0,
    fcaffa: 1,
    outageaffa: 17.46,
    outagemult: 0,
    lraprod: 0,
    injcost: 0,
    fcprod: 17.46,
    popdens: 0.06,
    fcinj: 0.06,
    envcost: 0,
    fracevap: 0,
    volenv: 0,
    fcenviron: 0,
    fc: 77.784,
    // COF Assessment - COF AREA
    isoSys: "Manual",
    detSys: "Manual",
    mitigationSystem: "",
    idealGasSpecificHeatEQ: "",

    // 31 Disabled Input Fields with Default Values
    ptransKpa: 0,
    mreleaseKg: 180,
    releaseType: "Continuous",
    psKpa: 2200,
    opTempK: 533,
    cp: 2.3,
    k: 1.26,
    w1Kg: 29.8,
    inventoryKg: 180,
    timeempty: 6.04,
    factdi: 0.1,
    ldmax: 0,
    raten: 0,
    idField: 0,
    eneff: 1,
    factic: 0.1,
    caCmdailCont: 0,
    caCmdailInst: 0,
    caCmdailInjail: 0,
    factait: 0.05,
    caCmdflam: 0,
    caInjflam: 0,
    molWeight: 16.04,
    ambTemp: 25,
    windSpeed: 5,
    atmStability: "D",
    duration: 600,
    height: 2,
    surfaceRoughness: 0.1,
    caTotal: 0,
    // Risk & IRP
    dhtha: 0,
    dbrit: 0,
    dextd: 0,
    dscc: 0,
    pof: 0,
    cofFinancial: 0,
    cofArea: 0,
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
    // POF Assessment - General
    coatingQuality: "Good",
    dataConfidence: "High",
    hasCladding: false,
    nominalThickness: 0,
    tMin: 0,
    currentThickness: 0,
    description: "",
    // Damage factors
    dthinf: 0,
    dfextclscc: 0,
    dfcuiff: 0,
    dfsccscc: 0,
    dfSCCSOHIC: 0,
    dmfat: 0,
    // COF Assessment - COF PROD
    fccmd: 0,
    fcaffa: 1,
    outageaffa: 17.46,
    outagemult: 0,
    lraprod: 0,
    injcost: 0,
    fcprod: 17.46,
    popdens: 0.06,
    fcinj: 0.06,
    envcost: 0,
    fracevap: 0,
    volenv: 0,
    fcenviron: 0,
    fc: 77.784,
    // COF Assessment - COF AREA
    isoSys: "Manual",
    detSys: "Manual",
    mitigationSystem: "",
    idealGasSpecificHeatEQ: "",

    // 31 Disabled Input Fields with Default Values
    ptransKpa: 0,
    mreleaseKg: 180,
    releaseType: "Continuous",
    psKpa: 2200,
    opTempK: 533,
    cp: 2.3,
    k: 1.26,
    w1Kg: 29.8,
    inventoryKg: 180,
    timeempty: 6.04,
    factdi: 0.1,
    ldmax: 0,
    raten: 0,
    idField: 0,
    eneff: 1,
    factic: 0.1,
    caCmdailCont: 0,
    caCmdailInst: 0,
    caCmdailInjail: 0,
    factait: 0.05,
    caCmdflam: 0,
    caInjflam: 0,
    molWeight: 16.04,
    ambTemp: 25,
    windSpeed: 5,
    atmStability: "D",
    duration: 600,
    height: 2,
    surfaceRoughness: 0.1,
    caTotal: 0,
    // Risk & IRP
    dhtha: 0,
    dbrit: 0,
    dextd: 0,
    dscc: 0,
    pof: 0,
    cofFinancial: 0,
    cofArea: 0,
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
    // POF Assessment - General
    coatingQuality: "Good",
    dataConfidence: "High",
    hasCladding: false,
    nominalThickness: 0,
    tMin: 0,
    currentThickness: 0,
    description: "",
    // Damage factors
    dthinf: 0,
    dfextclscc: 0,
    dfcuiff: 0,
    dfsccscc: 0,
    dfSCCSOHIC: 0,
    dmfat: 0,
    // COF Assessment - COF PROD
    fccmd: 0,
    fcaffa: 1,
    outageaffa: 17.46,
    outagemult: 0,
    lraprod: 0,
    injcost: 0,
    fcprod: 17.46,
    popdens: 0.06,
    fcinj: 0.06,
    envcost: 0,
    fracevap: 0,
    volenv: 0,
    fcenviron: 0,
    fc: 77.784,
    // COF Assessment - COF AREA
    isoSys: "Manual",
    detSys: "Manual",
    mitigationSystem: "",
    idealGasSpecificHeatEQ: "",

    // 31 Disabled Input Fields with Default Values
    ptransKpa: 0,
    mreleaseKg: 180,
    releaseType: "Continuous",
    psKpa: 2200,
    opTempK: 533,
    cp: 2.3,
    k: 1.26,
    w1Kg: 29.8,
    inventoryKg: 180,
    timeempty: 6.04,
    factdi: 0.1,
    ldmax: 0,
    raten: 0,
    idField: 0,
    eneff: 1,
    factic: 0.1,
    caCmdailCont: 0,
    caCmdailInst: 0,
    caCmdailInjail: 0,
    factait: 0.05,
    caCmdflam: 0,
    caInjflam: 0,
    molWeight: 16.04,
    ambTemp: 25,
    windSpeed: 5,
    atmStability: "D",
    duration: 600,
    height: 2,
    surfaceRoughness: 0.1,
    caTotal: 0,
    // Risk & IRP
    dhtha: 0,
    dbrit: 0,
    dextd: 0,
    dscc: 0,
    pof: 0,
    cofFinancial: 0,
    cofArea: 0,
    pofValue: 0,
    riskLevel: "Low",
    riskRanking: "Low",
  });

  const handleAddNew = () => {
    navigate("/monitor/rbi-assessment/new");
  };

  const handleEdit = (row: any) => {
    navigate(`/monitor/rbi-assessment/${row.id}`);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

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
      const newAssessment: RBIAssessment = {
        ...formData,
        id: String(rbiData.length + 1),
      };
      setRbiData((prev) => [...prev, newAssessment]);
    }

    setIsDialogOpen(false);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
    </div>
  );
};

export default RBIAssessmentPage;
