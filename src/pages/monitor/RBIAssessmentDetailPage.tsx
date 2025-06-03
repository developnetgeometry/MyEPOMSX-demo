import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import DamageFactorTab from "@/components/monitor/DamageFactorTab";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { initialRbiData } from "./RBIAssessmentPage";
import { toast } from "sonner";
import { RBIAssessment } from "@/types/monitoring";

const RBIAssessmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNewRecord = id === "new";

  // Create default data for new record
  const createDefaultData = (): RBIAssessment => ({
    id: "",
    rbiId: `RBI-${String(initialRbiData.length + 1).padStart(3, "0")}`,
    asset: "",
    likelihood: "Low",
    consequence: "Low",
    riskRank: "Low",
    nextAssessmentDate: new Date().toISOString().split("T")[0],
    status: "Active",
    // POF Assessment - General
    coatingQuality: "Good",
    dataConfidence: "High",
    hasCladding: false,
    nominalThickness: 0,
    tMin: 0,
    currentThickness: 0,
    description: "",
    // Damage Factor
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
    // COF Assessment - COF PROD
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
    // COF Assessment - COF AREA
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
    // Risk & IRP
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

  // Find the RBI assessment in the sample data or create a new empty one
  const defaultData = isNewRecord
    ? createDefaultData()
    : initialRbiData.find((item) => item.id === id) || createDefaultData();

  const [formData, setFormData] = useState<RBIAssessment>(defaultData);
  const [activeTab, setActiveTab] = useState("pof");
  const [activeSubTab, setActiveSubTab] = useState({
    pof: "general",
    cof: "cofProd",
    risk: "summary",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Calculate risk rank based on likelihood and consequence if those fields are changing
    if (name === "likelihood" || name === "consequence") {
      const likelihood =
        name === "likelihood"
          ? (value as "Low" | "Medium" | "High")
          : formData.likelihood;
      const consequence =
        name === "consequence"
          ? (value as "Low" | "Medium" | "High")
          : formData.consequence;
      const riskRank = calculateRiskRank(likelihood, consequence);

      setFormData((prev) => ({ ...prev, riskRank }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Calculate risk rank if needed
    if (name === "likelihood" || name === "consequence") {
      const likelihood =
        name === "likelihood"
          ? (value as "Low" | "Medium" | "High")
          : formData.likelihood;
      const consequence =
        name === "consequence"
          ? (value as "Low" | "Medium" | "High")
          : formData.consequence;
      const riskRank = calculateRiskRank(likelihood, consequence);

      setFormData((prev) => ({ ...prev, riskRank }));
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const calculateRiskRank = (
    likelihood: "Low" | "Medium" | "High",
    consequence: "Low" | "Medium" | "High"
  ) => {
    if (likelihood === "High" && consequence === "High") {
      return "Critical" as const;
    } else if (likelihood === "High" || consequence === "High") {
      return "High" as const;
    } else if (likelihood === "Medium" && consequence === "Medium") {
      return "Medium" as const;
    } else if (likelihood === "Medium" || consequence === "Medium") {
      return "Medium" as const;
    } else {
      return "Low" as const;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save data logic would go here
    toast.success(
      isNewRecord
        ? "RBI Assessment created successfully"
        : "RBI Assessment updated successfully"
    );
    navigate("/monitor/rbi-assessment");
  };

  const handleAssessmentChange = (updatedAssessment: RBIAssessment) => {
    setFormData(updatedAssessment);
  };

  return (
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
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <Label htmlFor="rbiId">RBI ID</Label>
                <Input
                  id="rbiId"
                  name="rbiId"
                  value={formData.rbiId}
                  onChange={handleInputChange}
                  readOnly={!isNewRecord}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="asset">Asset</Label>
                <Input
                  id="asset"
                  name="asset"
                  value={formData.asset}
                  onChange={handleInputChange}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Complete">Complete</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-4">
                <TabsTrigger value="pof">POF Assessment</TabsTrigger>
                <TabsTrigger value="cof">COF Assessment</TabsTrigger>
                <TabsTrigger value="risk">Risk & IRP</TabsTrigger>
              </TabsList>

              {/* POF Assessment Tab */}
              <TabsContent value="pof">
                <Tabs
                  value={activeSubTab.pof}
                  onValueChange={(value) =>
                    setActiveSubTab((prev) => ({ ...prev, pof: value }))
                  }
                >
                  <TabsList className="mb-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="damageFactor">
                      Damage Factor
                    </TabsTrigger>
                  </TabsList>

                  {/* General Subtab */}
                  <TabsContent value="general" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="asset">Asset</Label>
                        <Input
                          id="asset"
                          name="asset"
                          value={formData.asset}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="coatingQuality">Coating Quality</Label>
                        <Select
                          value={formData.coatingQuality}
                          onValueChange={(value) =>
                            handleSelectChange("coatingQuality", value)
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select coating quality" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Good">Good</SelectItem>
                            <SelectItem value="Fair">Fair</SelectItem>
                            <SelectItem value="Poor">Poor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="dataConfidence">Data Confidence</Label>
                        <Select
                          value={formData.dataConfidence}
                          onValueChange={(value) =>
                            handleSelectChange("dataConfidence", value)
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select data confidence" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hasCladding"
                          checked={formData.hasCladding}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(
                              "hasCladding",
                              checked as boolean
                            )
                          }
                        />
                        <Label htmlFor="hasCladding">Cladding</Label>
                      </div>
                      <div>
                        <Label htmlFor="nominalThickness">
                          Nominal Thickness (MM)
                        </Label>
                        <Input
                          id="nominalThickness"
                          name="nominalThickness"
                          type="number"
                          value={formData.nominalThickness}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tMin">TMin</Label>
                        <Input
                          id="tMin"
                          name="tMin"
                          type="number"
                          value={formData.tMin}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="currentThickness">
                          Current Thickness (MM)
                        </Label>
                        <Input
                          id="currentThickness"
                          name="currentThickness"
                          type="number"
                          value={formData.currentThickness}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div className="col-span-full">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          className="mt-1 min-h-[100px]"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Damage Factor Subtab - Now using the DamageFactorTab component */}
                  <TabsContent value="damageFactor">
                    <Card>
                      <CardHeader>
                        <CardTitle>Damage Factor Assessment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <DamageFactorTab
                          assessment={formData}
                          onAssessmentChange={handleAssessmentChange}
                          readOnly={false}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </TabsContent>

              {/* COF Assessment Tab */}
              <TabsContent value="cof">
                <Tabs
                  value={activeSubTab.cof}
                  onValueChange={(value) =>
                    setActiveSubTab((prev) => ({ ...prev, cof: value }))
                  }
                >
                  <TabsList className="mb-4">
                    <TabsTrigger value="cofProd">COF PROD</TabsTrigger>
                    <TabsTrigger value="cofArea">COF AREA</TabsTrigger>
                  </TabsList>

                  {/* COF PROD Subtab */}
                  <TabsContent value="cofProd" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="fcommd">Fcommd</Label>
                        <Input
                          id="fcommd"
                          name="fcommd"
                          type="number"
                          value={formData.fcommd}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fatta">Fatta</Label>
                        <Input
                          id="fatta"
                          name="fatta"
                          type="number"
                          value={formData.fatta}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="outagehrs">Outage hrs</Label>
                        <Input
                          id="outagehrs"
                          name="outagehrs"
                          type="number"
                          value={formData.outagehrs}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="outagemult">Outage mult</Label>
                        <Input
                          id="outagemult"
                          name="outagemult"
                          type="number"
                          value={formData.outagemult}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lrapprod">Lrapprod</Label>
                        <Input
                          id="lrapprod"
                          name="lrapprod"
                          type="number"
                          value={formData.lrapprod}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fprodd">Fprodd</Label>
                        <Input
                          id="fprodd"
                          name="fprodd"
                          type="number"
                          value={formData.fprodd}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="popdens">Popdens</Label>
                        <Input
                          id="popdens"
                          name="popdens"
                          type="number"
                          value={formData.popdens}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="injcost">Injcost</Label>
                        <Input
                          id="injcost"
                          name="injcost"
                          type="number"
                          value={formData.injcost}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="facexp">Facexp</Label>
                        <Input
                          id="facexp"
                          name="facexp"
                          type="number"
                          value={formData.facexp}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="volinv">Volinv</Label>
                        <Input
                          id="volinv"
                          name="volinv"
                          type="number"
                          value={formData.volinv}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fc">FC</Label>
                        <Input
                          id="fc"
                          name="fc"
                          type="number"
                          value={formData.fc}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ftotal">Ftotal</Label>
                        <Input
                          id="ftotal"
                          name="ftotal"
                          type="number"
                          value={formData.ftotal}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="envcost">Envcost</Label>
                        <Input
                          id="envcost"
                          name="envcost"
                          type="number"
                          value={formData.envcost}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fatality">Fatality</Label>
                        <Input
                          id="fatality"
                          name="fatality"
                          type="number"
                          value={formData.fatality}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="evacuation">Evacuation</Label>
                        <Input
                          id="evacuation"
                          name="evacuation"
                          type="number"
                          value={formData.evacuation}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* COF AREA Subtab */}
                  <TabsContent value="cofArea" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="isoSys">Iso Sys</Label>
                        <Select
                          value={formData.isoSys}
                          onValueChange={(value) =>
                            handleSelectChange("isoSys", value)
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select Iso Sys" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Manual">Manual</SelectItem>
                            <SelectItem value="Auto">Auto</SelectItem>
                            <SelectItem value="Semi-Auto">Semi-Auto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="detSys">Det Sys</Label>
                        <Select
                          value={formData.detSys}
                          onValueChange={(value) =>
                            handleSelectChange("detSys", value)
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select Det Sys" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Manual">Manual</SelectItem>
                            <SelectItem value="Auto">Auto</SelectItem>
                            <SelectItem value="Semi-Auto">Semi-Auto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="mitigationSystem">
                          Mitigation System
                        </Label>
                        <Select
                          value={formData.mitigationSystem}
                          onValueChange={(value) =>
                            handleSelectChange("mitigationSystem", value)
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select Mitigation System" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Basic">Basic</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                            <SelectItem value="Premium">Premium</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="idealGasSpecificHeatEQ">
                          Ideal Gas Specific Heat EQ
                        </Label>
                        <Select
                          value={formData.idealGasSpecificHeatEQ}
                          onValueChange={(value) =>
                            handleSelectChange("idealGasSpecificHeatEQ", value)
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select Heat EQ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Standard">Standard</SelectItem>
                            <SelectItem value="Modified">Modified</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="pkkpa">Pk kpa</Label>
                        <Input
                          id="pkkpa"
                          name="pkkpa"
                          type="number"
                          value={formData.pkkpa}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="prtankKpa">Prtank kpa</Label>
                        <Input
                          id="prtankKpa"
                          name="prtankKpa"
                          type="number"
                          value={formData.prtankKpa}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="wtkg">Wt kg</Label>
                        <Input
                          id="wtkg"
                          name="wtkg"
                          type="number"
                          value={formData.wtkg}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="releaseType">Release Type</Label>
                        <Select
                          value={formData.releaseType}
                          onValueChange={(value) =>
                            handleSelectChange("releaseType", value)
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select Release Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Gas">Gas</SelectItem>
                            <SelectItem value="Liquid">Liquid</SelectItem>
                            <SelectItem value="Two-Phase">Two-Phase</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </TabsContent>

              {/* Risk & IRP Tab - Removed DamageFactorTab from here */}
              <TabsContent value="risk">
                <Tabs
                  value={activeSubTab.risk}
                  onValueChange={(value) =>
                    setActiveSubTab((prev) => ({ ...prev, risk: value }))
                  }
                >
                  <TabsList className="mb-4">
                    <TabsTrigger value="summary">Risk Summary</TabsTrigger>
                  </TabsList>

                  {/* Risk Summary Subtab */}
                  <TabsContent value="summary" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="dfhta">Dfhta</Label>
                        <Input
                          id="dfhta"
                          name="dfhta"
                          type="number"
                          value={formData.dfhta}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dbrint">Dbrint</Label>
                        <Input
                          id="dbrint"
                          name="dbrint"
                          type="number"
                          value={formData.dbrint}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dfmat">Dfmat</Label>
                        <Input
                          id="dfmat"
                          name="dfmat"
                          type="number"
                          value={formData.dfmat}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dfextclsc">Dfextclsc</Label>
                        <Input
                          id="dfextclsc"
                          name="dfextclsc"
                          type="number"
                          value={formData.dfextclsc}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dfcuiiff">Dfcuiiff</Label>
                        <Input
                          id="dfcuiiff"
                          name="dfcuiiff"
                          type="number"
                          value={formData.dfcuiiff}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dmsccssc">Dmsccssc</Label>
                        <Input
                          id="dmsccssc"
                          name="dmsccssc"
                          type="number"
                          value={formData.dmsccssc}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dmfat">Dmfat</Label>
                        <Input
                          id="dmfat"
                          name="dmfat"
                          type="number"
                          value={formData.dmfat}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dpSCCSOHIC">DP SCC SOHIC</Label>
                        <Input
                          id="dpSCCSOHIC"
                          name="dpSCCSOHIC"
                          type="number"
                          value={formData.dpSCCSOHIC}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cofFinancial">Cof (Financial)</Label>
                        <Input
                          id="cofFinancial"
                          name="cofFinancial"
                          type="number"
                          value={formData.cofFinancial}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cofArea">Cof (Area)</Label>
                        <Input
                          id="cofArea"
                          name="cofArea"
                          type="number"
                          value={formData.cofArea}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dfthin">Dfthin</Label>
                        <Input
                          id="dfthin"
                          name="dfthin"
                          type="number"
                          value={formData.dfthin}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pof">PoF</Label>
                        <Input
                          id="pof"
                          name="pof"
                          type="number"
                          value={formData.pof}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pofValue">PoF Value</Label>
                        <Input
                          id="pofValue"
                          name="pofValue"
                          type="number"
                          value={formData.pofValue}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="riskLevel">Risk Level</Label>
                        <Select
                          value={formData.riskLevel}
                          onValueChange={(value) =>
                            handleSelectChange("riskLevel", value)
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select Risk Level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="riskRanking">Risk Ranking</Label>
                        <Select
                          value={formData.riskRanking}
                          onValueChange={(value) =>
                            handleSelectChange("riskRanking", value)
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select Risk Ranking" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
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
  );
};

export default RBIAssessmentDetailPage;
