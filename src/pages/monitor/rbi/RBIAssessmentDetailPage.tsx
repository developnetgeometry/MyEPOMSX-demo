import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import PofTab from "@/components/monitor/rbi/pof/PofTab";
import CofTab from "@/components/monitor/rbi/cof/CofTab";
import RiskIrpTab from "@/components/monitor/rbi/risk/RiskIrpTab";
import { initialRbiData } from "./RBIAssessmentPage";

const RBIAssessmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNewRecord = id === "new";

  const createDefaultData = (): any => ({
    
    // i_ims_pof_assessment_general
    coating_quality_id: "",
    cladding: false,
    nominal_thickness: 0,
    current_thickness: 0,
    description: "",

    // i_ims_cof_assessment_cof_prod
    outagemult: 0,
    injcost: 0,
    envcost: 0,
    fracevap: 0,
    volenv: 0,
    fcenviron: 0,
    fc: 0,

    // i_ims_cof_asssessment_cof_area
    iso_sys_id: "",
    det_sys_id: "",
    mitigation_system_id: "",
    ideal_gas_specific_heat_eq: "",
    ca_cmdflam: 0,
    ca_injflam: 0,
    ims_service_id: "",

    // i_ims_rbi_risk_irp
    dhtha: 0,
    dbrit: 0,
    dthin: 0,
    dextd: 0,
    dscc: 0,
    dmfat: 0,
    pof: 0,
    cof_financial: 0,
    cof_area: 0,
    pof_value: 0,
    risk_level: "",
    risk_ranking: "",

    // DUMMY
    id: "",
    rbiId: `RBI-${String(initialRbiData.length + 1).padStart(3, "0")}`,
    asset: "",
    likelihood: "Low",
    consequence: "Low",
    riskRank: "Low",
    nextAssessmentDate: new Date().toISOString().split("T")[0],
    status: "Active",
    coatingQuality: "Good",
    dataConfidence: "High",
    hasCladding: false,
    nominalThickness: 0,
    tMin: 0,
    currentThickness: 0,

    dthinf: 0,
    dfextclscc: 0,
    dfcuiff: 0,
    dfsccscc: 0,
    dfSCCSOHIC: 0,
    
    fccmd: 0,
    fcaffa: 1,
    outageaffa: 17.46,

    lraprod: 0,

    fcprod: 17.46,
    popdens: 0.06,
    fcinj: 0.06,





    isoSys: "Manual",
    detSys: "Manual",
    mitigationSystem: "",
    idealGasSpecificHeatEQ: "",
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
    
    
    
    
    
    cofFinancial: 0,
    cofArea: 0,
    pofValue: 0,
    riskLevel: "Low",
    riskRanking: "Low",
  });

  const defaultData = isNewRecord
    ? createDefaultData()
    : initialRbiData.find((item) => item.id === id) || createDefaultData();

  const [formData, setFormData] = useState<any>(defaultData);
  const [activeTab, setActiveTab] = useState("pof");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      isNewRecord
        ? "RBI Assessment created successfully"
        : "RBI Assessment updated successfully"
    );
    navigate("/monitor/rbi-assessment");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <PageHeader
            title={
              isNewRecord ? "Create RBI Assessment" : "RBI Assessment Detail"
            }
            icon={<ShieldAlert className="h-6 w-6" />}
          />
          <Button
            variant="outline"
            onClick={() => navigate("/monitor/rbi-assessment")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to RBI Assessment
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="pof">POF Assessment</TabsTrigger>
                  <TabsTrigger value="cof">COF Assessment</TabsTrigger>
                  <TabsTrigger value="risk">Risk & IRP</TabsTrigger>
                </TabsList>
                <TabsContent value="pof">
                  <PofTab formData={formData} setFormData={setFormData} />
                </TabsContent>
                <TabsContent value="cof">
                  <CofTab formData={formData} setFormData={setFormData} />
                </TabsContent>
                <TabsContent value="risk">
                  <RiskIrpTab formData={formData} setFormData={setFormData} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/monitor/rbi-assessment")}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isNewRecord ? "Create Assessment" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RBIAssessmentDetailPage;