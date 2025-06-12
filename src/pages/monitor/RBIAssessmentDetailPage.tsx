import React, { useState, useEffect } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { supabase } from "@/lib/supabaseClient";

// Mock data for dropdowns - replace with actual API calls
const mockAssets = [
  { id: "1", name: "PV-1001", description: "Pressure Vessel 1001" },
  { id: "2", name: "PP-2003", description: "Piping 2003" },
  { id: "3", name: "PV-1002", description: "Pressure Vessel 1002" },
  { id: "4", name: "PP-2001", description: "Piping 2001" },
  { id: "5", name: "PV-1003", description: "Pressure Vessel 1003" },
];

const coatingQualityOptions = [
  { value: "Excellent", label: "Excellent" },
  { value: "Good", label: "Good" },
  { value: "Fair", label: "Fair" },
  { value: "Poor", label: "Poor" },
];

const dataConfidenceOptions = [
  { value: "High", label: "High" },
  { value: "Medium", label: "Medium" },
  { value: "Low", label: "Low" },
];

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

  // State for dropdown data
  const [mitigationSystems, setMitigationSystems] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [idealGasHeatEq, setIdealGasHeatEq] = useState<
    Array<{ id: number; name: string }>
  >([]);

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        // Fetch mitigation systems
        const { data: mitigationData, error: mitigationError } = await supabase
          .from("e_mitigation_system")
          .select("id, name")
          .order("name");

        if (mitigationError) {
          console.error("Error fetching mitigation systems:", mitigationError);
          toast.error("Failed to load mitigation systems");
        } else {
          setMitigationSystems(mitigationData || []);
        }

        // Fetch ideal gas specific heat eq
        const { data: gasHeatData, error: gasHeatError } = await supabase
          .from("e_ideal_gas_specific_heat_eq")
          .select("id, name")
          .order("name");

        if (gasHeatError) {
          console.error("Error fetching ideal gas heat eq:", gasHeatError);
          toast.error("Failed to load ideal gas heat equations");
        } else {
          setIdealGasHeatEq(gasHeatData || []);
        }
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        toast.error("Failed to load dropdown data");
      }
    };

    fetchDropdownData();
  }, []);

  // Calculate TMin when nominal thickness changes
  useEffect(() => {
    if (formData.nominalThickness > 0) {
      // Example formula: TMin = 87.5% of nominal thickness
      const calculatedTMin = formData.nominalThickness * 0.875;
      setFormData((prev) => ({
        ...prev,
        tMin: Math.round(calculatedTMin * 100) / 100,
      }));
    }
  }, [formData.nominalThickness]);

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

  const handleRadioChange = (name: string, value: string) => {
    if (name === "hasCladding") {
      setFormData((prev) => ({ ...prev, [name]: value === "yes" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
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
                    onValueChange={(value) =>
                      handleSelectChange("status", value)
                    }
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
                          <Select
                            value={formData.asset}
                            onValueChange={(value) =>
                              handleSelectChange("asset", value)
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select Asset" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockAssets.map((asset) => (
                                <SelectItem key={asset.id} value={asset.name}>
                                  {asset.name} - {asset.description}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="coatingQuality">
                            Coating Quality
                          </Label>
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
                              {coatingQualityOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="dataConfidence">
                            Data Confidence
                          </Label>
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
                              {dataConfidenceOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Cladding</Label>
                          <RadioGroup
                            value={formData.hasCladding ? "yes" : "no"}
                            onValueChange={(value) =>
                              handleRadioChange("hasCladding", value)
                            }
                            className="flex flex-row space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="cladding-yes" />
                              <Label htmlFor="cladding-yes">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="cladding-no" />
                              <Label htmlFor="cladding-no">No</Label>
                            </div>
                          </RadioGroup>
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
                          <Label htmlFor="tMin">TMin (Calculated)</Label>
                          <Input
                            id="tMin"
                            name="tMin"
                            type="number"
                            value={formData.tMin}
                            disabled
                            className="mt-1 bg-gray-50"
                          />
                        </div>
                        <div>
                          <Label htmlFor="currentThickness">
                            Current Thickness (mm)
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
                            placeholder="Enter description"
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
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="dthinf">Dthinf</Label>
                              <Input
                                id="dthinf"
                                name="dthinf"
                                type="number"
                                value={formData.dthinf}
                                disabled
                                className="bg-gray-50"
                                placeholder="Calculated value"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="dfextclscc">Dfextclscc</Label>
                              <Input
                                id="dfextclscc"
                                name="dfextclscc"
                                type="number"
                                value={formData.dfextclscc}
                                disabled
                                className="bg-gray-50"
                                placeholder="Calculated value"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="dfcuiff">DFCUIFF</Label>
                              <Input
                                id="dfcuiff"
                                name="dfcuiff"
                                type="number"
                                value={formData.dfcuiff}
                                disabled
                                className="bg-gray-50"
                                placeholder="Calculated value"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="dfsccscc">DFSCCSCC</Label>
                              <Input
                                id="dfsccscc"
                                name="dfsccscc"
                                type="number"
                                value={formData.dfsccscc}
                                disabled
                                className="bg-gray-50"
                                placeholder="Calculated value"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="dfSCCSOHIC">DF SCC SOHIC</Label>
                              <Input
                                id="dfSCCSOHIC"
                                name="dfSCCSOHIC"
                                type="number"
                                value={formData.dfSCCSOHIC}
                                disabled
                                className="bg-gray-50"
                                placeholder="Calculated value"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="dmfat">DMFAT</Label>
                              <Input
                                id="dmfat"
                                name="dmfat"
                                type="number"
                                value={formData.dmfat}
                                disabled
                                className="bg-gray-50"
                                placeholder="Calculated value"
                              />
                            </div>
                          </div>
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
                      {/* Remark Section */}
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">
                          Consequence of Failure, Financial (CoF, $)
                        </h3>
                        <p className="text-sm text-blue-600">
                          This section calculates the financial consequences of
                          potential equipment failure.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <Label htmlFor="fccmd">Fccmd</Label>
                          <Input
                            id="fccmd"
                            name="fccmd"
                            type="number"
                            value={formData.fccmd}
                            disabled
                            className="mt-1 bg-gray-50"
                            placeholder="Calculated value"
                          />
                        </div>

                        <div>
                          <Label htmlFor="fcaffa">Fcaffa</Label>
                          <Input
                            id="fcaffa"
                            name="fcaffa"
                            type="number"
                            value={formData.fcaffa}
                            disabled
                            className="mt-1 bg-gray-50"
                            placeholder="Default: 1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="outageaffa">Outageaffa</Label>
                          <Input
                            id="outageaffa"
                            name="outageaffa"
                            type="number"
                            value={formData.outageaffa}
                            disabled
                            className="mt-1 bg-gray-50"
                            placeholder="Default: 17.46"
                          />
                        </div>

                        <div>
                          <Label htmlFor="outagemult">Outagemult</Label>
                          <Input
                            id="outagemult"
                            name="outagemult"
                            type="number"
                            value={formData.outagemult}
                            onChange={handleInputChange}
                            className="mt-1"
                            step="0.01"
                          />
                        </div>

                        <div>
                          <Label htmlFor="lraprod">Lraprod</Label>
                          <Input
                            id="lraprod"
                            name="lraprod"
                            type="number"
                            value={formData.lraprod}
                            onChange={handleInputChange}
                            className="mt-1"
                            step="0.01"
                          />
                        </div>

                        <div>
                          <Label htmlFor="fcprod">Fcprod</Label>
                          <Input
                            id="fcprod"
                            name="fcprod"
                            type="number"
                            value={formData.fcprod}
                            disabled
                            className="mt-1 bg-gray-50"
                            placeholder="Default: 17.46"
                          />
                        </div>

                        <div>
                          <Label htmlFor="popdens">Popdens</Label>
                          <Input
                            id="popdens"
                            name="popdens"
                            type="number"
                            value={formData.popdens}
                            disabled
                            className="mt-1 bg-gray-50"
                            placeholder="Default: 0.06"
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
                            step="0.01"
                          />
                        </div>

                        <div>
                          <Label htmlFor="fcinj">Fcinj</Label>
                          <Input
                            id="fcinj"
                            name="fcinj"
                            type="number"
                            value={formData.fcinj}
                            disabled
                            className="mt-1 bg-gray-50"
                            placeholder="Default: 0.06"
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
                            step="0.01"
                          />
                        </div>

                        <div>
                          <Label htmlFor="fracevap">Fracevap</Label>
                          <Input
                            id="fracevap"
                            name="fracevap"
                            type="number"
                            value={formData.fracevap}
                            disabled
                            className="mt-1 bg-gray-50"
                            placeholder="Calculated value"
                          />
                        </div>

                        <div>
                          <Label htmlFor="volenv">Volenv</Label>
                          <Input
                            id="volenv"
                            name="volenv"
                            type="number"
                            value={formData.volenv}
                            disabled
                            className="mt-1 bg-gray-50"
                            placeholder="Calculated value"
                          />
                        </div>

                        <div>
                          <Label htmlFor="fcenviron">Fcenviron</Label>
                          <Input
                            id="fcenviron"
                            name="fcenviron"
                            type="number"
                            value={formData.fcenviron}
                            disabled
                            className="mt-1 bg-gray-50"
                            placeholder="Calculated value"
                          />
                        </div>

                        <div>
                          <Label htmlFor="fc">Fc</Label>
                          <Input
                            id="fc"
                            name="fc"
                            type="number"
                            value={formData.fc}
                            disabled
                            className="mt-1 bg-gray-50"
                            placeholder="Default: 77.784"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    {/* COF AREA Subtab */}
                    <TabsContent value="cofArea" className="space-y-6">
                      {/* Info Section */}
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">
                          Consequence of Failure, Area (CoF, m²)
                        </h3>
                        <p className="text-sm text-blue-600">
                          This section calculates the area-based consequences of
                          potential equipment failure.
                        </p>
                      </div>

                      {/* All Fields in One Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Dropdown Controls */}
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
                              <SelectItem value="Semi-Auto">
                                Semi-Auto
                              </SelectItem>
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
                              <SelectItem value="Semi-Auto">
                                Semi-Auto
                              </SelectItem>
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
                              {mitigationSystems.map((system) => (
                                <SelectItem key={system.id} value={system.name}>
                                  {system.name}
                                </SelectItem>
                              ))}
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
                              handleSelectChange(
                                "idealGasSpecificHeatEQ",
                                value
                              )
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select Heat EQ" />
                            </SelectTrigger>
                            <SelectContent>
                              {idealGasHeatEq.map((eq) => (
                                <SelectItem key={eq.id} value={eq.name}>
                                  {eq.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Disabled Input Fields with Default Values - 31 Fields Total */}
                        <div>
                          <Label htmlFor="ptransKpa">Ptrans Kpa</Label>
                          <Input
                            id="ptransKpa"
                            name="ptransKpa"
                            type="number"
                            value={formData.ptransKpa || 0}
                            disabled
                            className="mt-1 bg-gray-100"
                            placeholder="Default: 0"
                          />
                        </div>

                        <div>
                          <Label htmlFor="mreleaseKg">Mrelease Kg</Label>
                          <Input
                            id="mreleaseKg"
                            name="mreleaseKg"
                            type="number"
                            value={formData.mreleaseKg || 180}
                            disabled
                            className="mt-1 bg-gray-100"
                            placeholder="Default: 180"
                          />
                        </div>

                        <div>
                          <Label htmlFor="releaseType">Release Type</Label>
                          <Input
                            id="releaseType"
                            name="releaseType"
                            type="text"
                            value="Continuous"
                            disabled
                            className="mt-1 bg-gray-100"
                            placeholder="Default: Continuous"
                          />
                        </div>

                        <div>
                          <Label htmlFor="psKpa">Ps Kpa</Label>
                          <Input
                            id="psKpa"
                            name="psKpa"
                            type="number"
                            value={formData.psKpa || 2200}
                            disabled
                            className="mt-1 bg-gray-100"
                            placeholder="Default: 2200"
                          />
                        </div>

                        <div>
                          <Label htmlFor="opTempK">Op Temp K</Label>
                          <Input
                            id="opTempK"
                            name="opTempK"
                            type="number"
                            value={formData.opTempK || 533}
                            disabled
                            className="mt-1 bg-gray-100"
                            placeholder="Default: 533"
                          />
                        </div>

                        <div>
                          <Label htmlFor="cp">CP</Label>
                          <Input
                            id="cp"
                            name="cp"
                            type="number"
                            value={formData.cp || 2.3}
                            disabled
                            className="mt-1 bg-gray-100"
                            placeholder="Default: 2.3"
                          />
                        </div>

                        <div>
                          <Label htmlFor="k">K</Label>
                          <Input
                            id="k"
                            name="k"
                            type="number"
                            value={formData.k || 1.26}
                            disabled
                            className="mt-1 bg-gray-100"
                            placeholder="Default: 1.26"
                          />
                        </div>

                        <div>
                          <Label htmlFor="w1Kg">W1 Kg</Label>
                          <Input
                            id="w1Kg"
                            name="w1Kg"
                            type="number"
                            value={formData.w1Kg || 29.8}
                            disabled
                            className="mt-1 bg-gray-100"
                            placeholder="Default: 29.8"
                          />
                        </div>

                        <div>
                          <Label htmlFor="inventoryKg">Inventory Kg</Label>
                          <Input
                            id="inventoryKg"
                            name="inventoryKg"
                            type="number"
                            value={formData.inventoryKg || 180}
                            disabled
                            className="mt-1 bg-gray-100"
                            placeholder="Default: 180"
                          />
                        </div>

                        <div>
                          <Label htmlFor="timeempty">Timeempty</Label>
                          <Input
                            id="timeempty"
                            name="timeempty"
                            type="number"
                            value={formData.timeempty || 6.04}
                            disabled
                            className="mt-1 bg-gray-100"
                            placeholder="Default: 6.04"
                          />
                        </div>

                        <div>
                          <Label htmlFor="factdi">Factdi</Label>
                          <Input
                            id="factdi"
                            name="factdi"
                            type="number"
                            value={formData.factdi || 0.1}
                            disabled
                            className="mt-1 bg-gray-100"
                            placeholder="Default: 0.1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="ldmax">Ldmax</Label>
                          <Input
                            id="ldmax"
                            name="ldmax"
                            type="number"
                            value={formData.ldmax || 0}
                            disabled
                            className="mt-1 bg-gray-100"
                            placeholder="Default: 0"
                          />
                        </div>

                        <div>
                          <Label htmlFor="raten">Raten</Label>
                          <Input
                            id="raten"
                            name="raten"
                            type="number"
                            value={formData.raten || 0}
                            disabled
                            className="mt-1 bg-gray-100"
                            placeholder="Default: 0"
                          />
                        </div>

                        <div>
                          <Label htmlFor="idField">Id</Label>
                          <Input
                            id="idField"
                            name="idField"
                            type="number"
                            value={formData.idField || 0}
                            disabled
                            className="mt-1 bg-gray-100"
                            placeholder="Default: 0"
                          />
                        </div>

                        <div>
                          <Label htmlFor="eneff">Eneff</Label>
                          <Input
                            id="eneff"
                            name="eneff"
                            type="number"
                            value={formData.eneff || 1}
                            disabled
                            className="mt-1 bg-gray-100"
                            placeholder="Default: 1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="factic">Factic</Label>
                          <Input
                            id="factic"
                            name="factic"
                            type="number"
                            value={formData.factic || 0.1}
                            disabled
                            className="mt-1 bg-gray-100"
                            placeholder="Default: 0.1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="caCmdailCont">Ca Cmdail Cont</Label>
                          <Input
                            id="caCmdailCont"
                            name="caCmdailCont"
                            type="number"
                            value={formData.caCmdailCont || 0}
                            disabled
                            className="mt-1 bg-gray-100"
                            placeholder="Default: 0"
                          />
                        </div>

                        <div>
                          <Label htmlFor="caCmdailInst">Ca Cmdail Inst</Label>
                          <Input
                            id="caCmdailInst"
                            name="caCmdailInst"
                            type="number"
                            value={formData.caCmdailInst || 0}
                            disabled
                            className="mt-1 bg-gray-100"
                            placeholder="Default: 0"
                          />
                        </div>

                        <div>
                          <Label htmlFor="caCmdailInjail">Ca Injail Cont</Label>
                          <Input
                            id="caCmdailInjail"
                            name="caCmdailInjail"
                            type="number"
                            value={formData.caCmdailInjail || 0}
                            disabled
                            className="mt-1 bg-gray-100"
                            placeholder="Default: 0"
                          />
                        </div>

                        <div>
                          <Label htmlFor="factait">Factait</Label>
                          <Input
                            id="factait"
                            name="factait"
                            type="number"
                            value={formData.factait || 0.05}
                            disabled
                            className="mt-1 bg-gray-100"
                            placeholder="Default: 0.05"
                          />
                        </div>

                        <div>
                          <Label htmlFor="caCmdflam">Ca Cmdflam</Label>
                          <Input
                            id="caCmdflam"
                            name="caCmdflam"
                            type="number"
                            value={formData.caCmdflam || 0}
                            disabled
                            className="mt-1 bg-gray-100"
                            placeholder="Default: 0"
                          />
                        </div>

                        <div>
                          <Label htmlFor="caInjflam">Ca Injflam</Label>
                          <Input
                            id="caInjflam"
                            name="caInjflam"
                            type="number"
                            value={formData.caInjflam || 0}
                            disabled
                            className="mt-1 bg-gray-100"
                            placeholder="Default: 0"
                          />
                        </div>

                        {/* Additional Fields to Complete 31 Total */}
                        <div>
                          <Label htmlFor="molWeight">Mol Weight</Label>
                          <Input
                            id="molWeight"
                            name="molWeight"
                            type="number"
                            value={16.04}
                            disabled
                            className="mt-1 bg-gray-100"
                            placeholder="Default: 16.04"
                          />
                        </div>

                        <div>
                          <Label htmlFor="ambTemp">Ambient Temp</Label>
                          <Input
                            id="ambTemp"
                            name="ambTemp"
                            type="number"
                            value={25}
                            disabled
                            className="mt-1 bg-gray-100"
                            placeholder="Default: 25"
                          />
                        </div>

                        <div>
                          <Label htmlFor="windSpeed">Wind Speed</Label>
                          <Input
                            id="windSpeed"
                            name="windSpeed"
                            type="number"
                            value={5}
                            disabled
                            className="mt-1 bg-gray-100"
                            placeholder="Default: 5"
                          />
                        </div>

                        <div>
                          <Label htmlFor="atmStability">Atm Stability</Label>
                          <Input
                            id="atmStability"
                            name="atmStability"
                            type="text"
                            value="D"
                            disabled
                            className="mt-1 bg-gray-100"
                            placeholder="Default: D"
                          />
                        </div>

                        <div>
                          <Label htmlFor="duration">Duration</Label>
                          <Input
                            id="duration"
                            name="duration"
                            type="number"
                            value={600}
                            disabled
                            className="mt-1 bg-gray-100"
                            placeholder="Default: 600"
                          />
                        </div>

                        <div>
                          <Label htmlFor="height">Height</Label>
                          <Input
                            id="height"
                            name="height"
                            type="number"
                            value={2}
                            disabled
                            className="mt-1 bg-gray-100"
                            placeholder="Default: 2"
                          />
                        </div>

                        <div>
                          <Label htmlFor="surfaceRoughness">
                            Surface Roughness
                          </Label>
                          <Input
                            id="surfaceRoughness"
                            name="surfaceRoughness"
                            type="number"
                            value={0.1}
                            disabled
                            className="mt-1 bg-gray-100"
                            placeholder="Default: 0.1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="caTotal">CA Total</Label>
                          <Input
                            id="caTotal"
                            name="caTotal"
                            type="number"
                            value={0}
                            disabled
                            className="mt-1 bg-gray-100"
                            placeholder="Calculated: 0"
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </TabsContent>{" "}
                {/* Risk & IRP Tab */}
                <TabsContent value="risk" className="space-y-6">
                  {/* Info Section */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">
                      Risk & Incident Response Plan (IRP)
                    </h3>
                    <p className="text-sm text-blue-600">
                      This section calculates the overall risk assessment and
                      incident response planning.
                    </p>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Input Fields */}
                    <div>
                      <Label htmlFor="dhtha">Dhtha</Label>
                      <Input
                        id="dhtha"
                        name="dhtha"
                        type="number"
                        value={formData.dhtha || ""}
                        onChange={handleInputChange}
                        className="mt-1"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <Label htmlFor="dbrit">Dbrit</Label>
                      <Input
                        id="dbrit"
                        name="dbrit"
                        type="number"
                        value={formData.dbrit || ""}
                        onChange={handleInputChange}
                        className="mt-1"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <Label htmlFor="dextd">Dextd</Label>
                      <Input
                        id="dextd"
                        name="dextd"
                        type="number"
                        value={formData.dextd || ""}
                        onChange={handleInputChange}
                        className="mt-1"
                        step="0.01"
                      />
                    </div>

                    {/* Disabled Fields */}
                    <div>
                      <Label htmlFor="dthin">Dthin</Label>
                      <Input
                        id="dthin"
                        name="dthin"
                        type="number"
                        value={formData.dthinf || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated from damage factors"
                      />
                    </div>

                    <div>
                      <Label htmlFor="dscc">Dscc</Label>
                      <Input
                        id="dscc"
                        name="dscc"
                        type="number"
                        value={formData.dscc || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                      />
                    </div>

                    <div>
                      <Label htmlFor="dmfat">Dmfat</Label>
                      <Input
                        id="dmfat"
                        name="dmfat"
                        type="number"
                        value={formData.dmfat || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="From damage factors"
                      />
                    </div>

                    <div>
                      <Label htmlFor="pof">Pof</Label>
                      <Input
                        id="pof"
                        name="pof"
                        type="number"
                        value={formData.pof || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated POF"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cofFinancial">Cof (Financial)</Label>
                      <Input
                        id="cofFinancial"
                        name="cofFinancial"
                        type="number"
                        value={formData.cofFinancial || formData.fc || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="From COF Financial"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cofArea">Cof (Area)</Label>
                      <Input
                        id="cofArea"
                        name="cofArea"
                        type="number"
                        value={formData.cofArea || formData.caTotal || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="From COF Area"
                      />
                    </div>

                    <div>
                      <Label htmlFor="pofValue">Pof Value</Label>
                      <Input
                        id="pofValue"
                        name="pofValue"
                        type="number"
                        value={formData.pofValue || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated POF Value"
                      />
                    </div>

                    <div>
                      <Label htmlFor="riskLevel">Risk Level</Label>
                      <Input
                        id="riskLevel"
                        name="riskLevel"
                        type="text"
                        value={formData.riskLevel || "Low"}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated Risk Level"
                      />
                    </div>

                    <div>
                      <Label htmlFor="riskRanking">Risk Ranking</Label>
                      <Input
                        id="riskRanking"
                        name="riskRanking"
                        type="text"
                        value={formData.riskRanking || "Low"}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated Risk Ranking"
                      />
                    </div>
                  </div>
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
