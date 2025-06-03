import React from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  FileText,
  Calendar,
  ShieldAlert,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatusBadge from "@/components/shared/StatusBadge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import DamageFactorTab from "@/components/monitor/DamageFactorTab";
import { RBIAssessment } from "@/types/monitoring";

// Sample data for asset integrity details
const getAssetDetails = (assetId: string, assetType: string) => {
  // In a real app, this would fetch data from an API

  if (assetType === "pressureVessel") {
    return {
      assetCode: `PV-${assetId}`,
      assetName: `Separator Vessel ${assetId}`,
      area: "Process Area A",
      system: "Separation System",
      status: "Active",
      integrity: {
        lastInspection: "2023-10-15",
        nextInspection: "2024-10-15",
        integrity: 85,
        riskLevel: "Medium",
        findings: [
          {
            id: 1,
            date: "2023-10-15",
            description: "Minor external corrosion detected",
            severity: "Low",
          },
          {
            id: 2,
            date: "2023-10-15",
            description: "Pressure relief valve requires recalibration",
            severity: "Medium",
          },
        ],
        inspections: [
          {
            id: 1,
            date: "2023-10-15",
            type: "Visual",
            result: "Pass",
            inspector: "John Smith",
          },
          {
            id: 2,
            date: "2022-10-20",
            type: "Ultrasonic",
            result: "Pass with findings",
            inspector: "Mary Johnson",
          },
          {
            id: 3,
            date: "2021-10-18",
            type: "Radiographic",
            result: "Pass",
            inspector: "David Lee",
          },
        ],
      },
    };
  } else {
    return {
      assetCode: `PP-${assetId}`,
      assetName: `Main Process Line ${assetId}`,
      area: "Process Area B",
      system: "Feed System",
      status: "Active",
      integrity: {
        lastInspection: "2023-11-05",
        nextInspection: "2024-11-05",
        integrity: 92,
        riskLevel: "Low",
        findings: [
          {
            id: 1,
            date: "2023-11-05",
            description: "Insulation damage at section B4",
            severity: "Low",
          },
        ],
        inspections: [
          {
            id: 1,
            date: "2023-11-05",
            type: "Visual",
            result: "Pass",
            inspector: "Sarah Wilson",
          },
          {
            id: 2,
            date: "2022-11-10",
            type: "Ultrasonic",
            result: "Pass",
            inspector: "James Brown",
          },
        ],
      },
    };
  }
};

// Sample data for RBI Assessment
const getSampleRBIData = (assetId: string): RBIAssessment => {
  return {
    id: "RBI-" + assetId,
    rbiId: "RBI-" + assetId + "-001",
    asset: `PV-${assetId}`,
    likelihood: "Medium" as "Medium",
    consequence: "Medium" as "Medium",
    riskRank: "Medium" as "Medium",
    nextAssessmentDate: "2024-12-15",
    status: "Active" as "Active",
    coatingQuality: "Fair" as "Fair",
    dataConfidence: "Medium" as "Medium",
    hasCladding: true,
    nominalThickness: 12.5,
    tMin: 6.4,
    currentThickness: 10.2,
    description: "Pressure vessel used for primary separation",
    lastInspectionDate: "2023-10-15",
    lastCoatingDate: "2022-08-20",
    nthinA: 0.85,
    nthinB: 0.75,
    fsThin: 0.65,
    srThin: 0.55,
    dfThin1: 0.65,
    dfThin2: 0.45,
    creep: 0.3,
    pothin1: 0.4,
    agerc: 1.5,
    bhthin: 0.75,
    dfhta: 0.4,
    dbrint: 0.5,
    dfmat: 0.35,
    dfextclsc: 0.65,
    dfcuiiff: 0.55,
    dmsccssc: 0.45,
    dmfat: 0.35,
    dpSCCSOHIC: 0.6,
    cofFinancial: 3500000,
    cofArea: 250,
    dfthin: 0.55,
    pof: 0.0045,
    pofValue: 0.0045,
    riskLevel: "Medium" as "Medium",
    riskRanking: "Medium" as "Medium",
    fcommd: 1.25,
    fatta: 0.3,
    outagehrs: 24,
    outagemult: 1.5,
    lrapprod: 0.75,
    fprodd: 1.2,
    popdens: 0.5,
    injcost: 100000,
    facexp: 2500000,
    volinv: 120,
    fc: 2.5,
    ftotal: 3.2,
    envcost: 500000,
    fatality: 0.001,
    evacuation: 0.01,
    isoSys: "Semi-Auto" as "Semi-Auto",
    detSys: "Semi-Auto" as "Semi-Auto",
    mitigationSystem: "Basic" as "Basic",
    idealGasSpecificHeatEQ: "Standard" as "Standard",
    pkkpa: 1000,
    prtankKpa: 950,
    wtkg: 5500,
    releaseType: "Gas" as "Gas",
    ratton: 1.2,
    inventorykg: 5000,
    caCmdfail: 0.25,
    caInjfail: 0.3,
    caInjfatal: 0.2,
    caCmdfatal: 0.15,
    k: 1.3,
    timemstep: 60,
    ldmax: 150,
  };
};

const IntegrityStatusCard = ({
  value,
  label,
  icon,
  colorClass,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
  colorClass: string;
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-full ${colorClass}`}>{icon}</div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const getIntegrityColorClass = (value: number) => {
  if (value >= 90) return "bg-green-100 text-green-700";
  if (value >= 70) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};

const AssetIntegrityDetailPage: React.FC = () => {
  const { id, type = "pressureVessel" } = useParams<{
    id: string;
    type?: string;
  }>();
  const navigate = useNavigate();

  if (!id) {
    return <div>Asset ID is required</div>;
  }

  const asset = getAssetDetails(id, type);
  const rbiAssessment = getSampleRBIData(id);
  const integrityColorClass = getIntegrityColorClass(asset.integrity.integrity);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title={`${asset.assetName} Integrity`}
          subtitle={`Asset Code: ${asset.assetCode}`}
          icon={<ShieldAlert className="h-6 w-6" />}
        />
        <Button
          variant="outline"
          onClick={() => navigate("/monitor/integrity")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Integrity Management
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    System
                  </p>
                  <p className="text-sm">{asset.system}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Area
                  </p>
                  <p className="text-sm">{asset.area}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <StatusBadge status={asset.status} />
              </div>
            </div>
          </CardContent>
        </Card>

        <IntegrityStatusCard
          value={asset.integrity.lastInspection}
          label="Last Inspection"
          icon={<Calendar className="h-5 w-5 text-blue-600" />}
          colorClass="bg-blue-100 text-blue-600"
        />

        <IntegrityStatusCard
          value={asset.integrity.nextInspection}
          label="Next Inspection"
          icon={<Calendar className="h-5 w-5 text-purple-600" />}
          colorClass="bg-purple-100 text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 px-6">
            <h3 className="text-lg font-semibold mb-2">Integrity Score</h3>
            <div className="flex flex-col space-y-2">
              <Progress value={asset.integrity.integrity} className="h-3" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Score</span>
                <span
                  className={`text-lg font-bold ${
                    asset.integrity.integrity >= 90
                      ? "text-green-600"
                      : asset.integrity.integrity >= 70
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {asset.integrity.integrity}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <IntegrityStatusCard
          value={asset.integrity.riskLevel}
          label="Risk Level"
          icon={<ShieldAlert className="h-5 w-5 text-orange-600" />}
          colorClass="bg-orange-100 text-orange-600"
        />

        <IntegrityStatusCard
          value={`${asset.integrity.inspections.length}`}
          label="Total Inspections"
          icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
          colorClass="bg-green-100 text-green-600"
        />
      </div>

      <Tabs defaultValue="inspections" className="w-full">
        <TabsList className="grid w-full md:w-[600px] grid-cols-3">
          <TabsTrigger value="inspections">Inspection History</TabsTrigger>
          <TabsTrigger value="findings">Findings</TabsTrigger>
          <TabsTrigger value="damagefactors">Damage Factors</TabsTrigger>
        </TabsList>

        <TabsContent value="inspections" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Inspection History</CardTitle>
            </CardHeader>
            <CardContent>
              {asset.integrity.inspections.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No inspection records found
                </p>
              ) : (
                <div className="space-y-4">
                  {asset.integrity.inspections.map((inspection, index) => (
                    <div key={inspection.id} className="pb-4">
                      {index > 0 && <Separator className="mb-4" />}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Date
                          </p>
                          <p className="text-sm">{inspection.date}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Type
                          </p>
                          <p className="text-sm">{inspection.type}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Result
                          </p>
                          <p className="text-sm">{inspection.result}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Inspector
                          </p>
                          <p className="text-sm">{inspection.inspector}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="findings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Findings</CardTitle>
            </CardHeader>
            <CardContent>
              {asset.integrity.findings.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No findings recorded
                </p>
              ) : (
                <div className="space-y-4">
                  {asset.integrity.findings.map((finding, index) => (
                    <div key={finding.id} className="pb-4">
                      {index > 0 && <Separator className="mb-4" />}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Date
                          </p>
                          <p className="text-sm">{finding.date}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm font-medium text-muted-foreground">
                            Description
                          </p>
                          <p className="text-sm">{finding.description}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Severity
                          </p>
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${
                              finding.severity === "High"
                                ? "bg-red-100 text-red-700"
                                : finding.severity === "Medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {finding.severity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="damagefactors" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Damage Factor Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <DamageFactorTab assessment={rbiAssessment} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button className="flex items-center">
          <FileText className="mr-2 h-4 w-4" /> Generate Integrity Report
        </Button>
      </div>
    </div>
  );
};

export default AssetIntegrityDetailPage;
