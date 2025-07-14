import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import PageHeader from "@/components/shared/PageHeader";
import {
  Pipette,
  ArrowLeft,
  Edit,
  Save,
  X,
  FileText,
  Download,
  Loader,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  usePipingData,
  useUpdatePipingData,
} from "@/hooks/queries/useIntegrity";
import { useMaterialConstructionOptions } from "@/hooks/queries/useCorrosionDropdownOptions";
import { useExtEnvOptions } from "@/hooks/lookup/lookup-ext-env";
import { useGeometryOptions } from "@/hooks/lookup/lookup-geometry";
import { useCoatingQualityOptions } from "@/hooks/lookup/lookup-coating-quality";
import { useDesignFabricationOptions } from "@/hooks/lookup/lookup-design-fabrication";
import { useFluidPhaseOptions } from "@/hooks/lookup/lookup-fluid-phase";
import { useFluidRepresentativeOptions } from "@/hooks/lookup/lookup-fluid-representative";
import { useInsulationComplexityOptions } from "@/hooks/lookup/lookup-insulation-complexity";
import { useInsulationTypeOptions } from "@/hooks/lookup/lookup-insulation-type";
import { useInterfaceOptions } from "@/hooks/lookup/lookup-interface";
import { useOnlineMonitorOptions } from "@/hooks/lookup/lookup-online-monitoring";
import { useToxicityOptions } from "@/hooks/lookup/lookup-toxicity";
import { useInsulationConditionOptions } from "@/hooks/lookup/lookup-insulation-condition";
import { usePipeClassOptions } from "@/hooks/lookup/lookup-pipe-class";
import { usePipeScheduleOptions } from "@/hooks/lookup/lookup-pipe-schedule";
import { useIsolationSystemOptions } from "@/hooks/lookup/lookup-isolation-system";
import { useDetectionSystemOptions } from "@/hooks/lookup/lookup-detection-system";
import { useMitigationSystemOptions } from "@/hooks/lookup/lookup-mitigation-system";
import { useCircuitOptions } from "@/hooks/lookup/lookup-circuit";

interface PipingFormData {
  // General Tab
  yearInService: string;
  materialConstruction: string;
  tmin: string;
  description: string;
  nominalWallThickness: string;
  nominalBoreDiameter: string;
  pressureRating: string;
  pipeClass: string;
  pipeSchedule: string;
  circuitId: string;
  lineNo: string;
  insulation: string;
  lineH2S: string;
  internalLining: string;
  pwht: string;
  cladding: string;
  innerDiameter: string;
  cladThickness: string;

  // Design Tab
  outerDiameter: string;
  length: string;
  weldingEfficiency: string;
  designTemperature: string;
  operatingTemperature: string;
  designPressure: string;
  operatingPressure: string;
  allowableStress: string;
  corrosionAllowance: string;
  extEnv: string;
  geometry: string;
  pipeSupport: string;
  soilWaterInterface: string;
  deadLegs: string;
  mixPoint: string;

  // Protection Tab
  coatingQuality: string;
  insulationType: string;
  insulationComplexity: string;
  insulationCondition: string;
  designFabrication: string;
  interface: string;
  liningType: string;
  liningCondition: string;
  liningMonitoring: string;
  isolationSystem: string;
  detectionSystem: string;
  mitigationSystem: string;
  onlineMonitor: string;
  postWeldHeatTreatment: string;
  lineDescription: string;
  replacementLine: string;
  minimumThickness: string;

  // Service Tab
  fluidRepresentative: string;
  toxicity: string;
  fluidPhase: string;
  toxicMassFraction: string;
}

const PipingDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const { data: pipingData, isLoading: isPipingLoading } = usePipingData(
    Number(id)
  );
  const updatePipingMutation = useUpdatePipingData(Number(id), setIsEditing);

  const [formData, setFormData] = useState<PipingFormData>({
    // Initialize with empty values
    yearInService: "",
    materialConstruction: "",
    tmin: "",
    description: "",
    nominalWallThickness: "",
    nominalBoreDiameter: "",
    pressureRating: "",
    pipeClass: "",
    pipeSchedule: "",
    circuitId: "",
    lineNo: "",
    insulation: "no",
    lineH2S: "no",
    internalLining: "no",
    pwht: "no",
    cladding: "no",
    innerDiameter: "",
    cladThickness: "",
    outerDiameter: "",
    length: "",
    weldingEfficiency: "",
    designTemperature: "",
    operatingTemperature: "",
    designPressure: "",
    operatingPressure: "",
    allowableStress: "",
    corrosionAllowance: "",
    extEnv: "",
    geometry: "",
    pipeSupport: "no",
    soilWaterInterface: "no",
    deadLegs: "no",
    mixPoint: "no",
    coatingQuality: "",
    insulationType: "",
    insulationComplexity: "",
    insulationCondition: "",
    designFabrication: "",
    interface: "",
    liningType: "",
    liningCondition: "",
    liningMonitoring: "",
    isolationSystem: "",
    detectionSystem: "",
    mitigationSystem: "",
    onlineMonitor: "",
    postWeldHeatTreatment: "no",
    lineDescription: "",
    replacementLine: "",
    minimumThickness: "",
    fluidRepresentative: "",
    toxicity: "",
    fluidPhase: "",
    toxicMassFraction: "",
  });

  // Lookup hooks
  const { data: materialConstructionOptions = [] } =
    useMaterialConstructionOptions();
  const coatingQualityOptions = useCoatingQualityOptions();
  const insulationTypeOptions = useInsulationTypeOptions();
  const insulationComplexityOptions = useInsulationComplexityOptions();
  const insulationConditionOptions = useInsulationConditionOptions();
  const designFabricationOptions = useDesignFabricationOptions();
  const interfaceOptions = useInterfaceOptions();
  const onlineMonitorOptions = useOnlineMonitorOptions();
  const fluidRepresentativeOptions = useFluidRepresentativeOptions();
  const toxicityOptions = useToxicityOptions();
  const fluidPhaseOptions = useFluidPhaseOptions();
  const extEnvOptions = useExtEnvOptions();
  const geometryOptions = useGeometryOptions();
  const pipeClassOptions = usePipeClassOptions();
  const pipeScheduleOptions = usePipeScheduleOptions();
  const isolationSystemOptions = useIsolationSystemOptions();
  const detectionSystemOptions = useDetectionSystemOptions();
  const mitigationSystemOptions = useMitigationSystemOptions();
  const circuitOptions = useCircuitOptions();
  

  useEffect(() => {
    if (!pipingData) return;

    setFormData({
      // General Tab
      yearInService: pipingData.general.year_in_service || "",
      materialConstruction:
        pipingData.general.material_construction_id?.toString() || "",
      tmin: pipingData.general.tmin || "",
      description: pipingData.general.description || "",
      nominalWallThickness:
        pipingData.general.normal_wall_thickness?.toString() || "",
      nominalBoreDiameter:
        pipingData.general.nominal_bore_diameter?.toString() || "",
      pressureRating: pipingData.general.pressure_rating?.toString() || "",
      pipeClass: pipingData.general.pipe_class_id?.toString() || "",
      pipeSchedule: pipingData.general.pipe_schedule_id?.toString() || "",
      circuitId: pipingData.general.circuit_id?.toString() || "",
      lineNo: pipingData.general.line_no || "",
      insulation: pipingData.general.insulation ? "yes" : "no",
      lineH2S: pipingData.general.line_h2s ? "yes" : "no",
      internalLining: pipingData.general.internal_lining ? "yes" : "no",
      pwht: pipingData.general.pwht ? "yes" : "no",
      cladding: pipingData.general.cladding ? "yes" : "no",
      innerDiameter: pipingData.general.inner_diameter?.toString() || "",
      cladThickness: pipingData.general.clad_thickness?.toString() || "",

      // Design Tab
      outerDiameter: pipingData.design.outer_diameter?.toString() || "",
      length: pipingData.design.length?.toString() || "",
      weldingEfficiency: pipingData.design.welding_efficiency?.toString() || "",
      designTemperature: pipingData.design.design_temperature?.toString() || "",
      operatingTemperature:
        pipingData.design.operating_temperature?.toString() || "",
      designPressure: pipingData.design.design_pressure?.toString() || "",
      operatingPressure:
        pipingData.design.operating_pressure_mpa?.toString() || "",
      allowableStress: pipingData.design.allowable_stress_mpa?.toString() || "",
      corrosionAllowance:
        pipingData.design.corrosion_allowance?.toString() || "",
      extEnv: pipingData.design.ext_env_id?.toString() || "",
      geometry: pipingData.design.geometry_id?.toString() || "",
      pipeSupport: pipingData.design.pipe_support ? "yes" : "no",
      soilWaterInterface: pipingData.design.soil_water_interface ? "yes" : "no",
      deadLegs: pipingData.design.dead_legs ? "yes" : "no",
      mixPoint: pipingData.design.mix_point ? "yes" : "no",

      // Protection Tab
      coatingQuality:
        pipingData.protection.coating_quality_id?.toString() || "",
      insulationType:
        pipingData.protection.insulation_type_id?.toString() || "",
      insulationComplexity:
        pipingData.protection.insulation_complexity_id?.toString() || "",
      insulationCondition:
        pipingData.protection.insulation_condition_id?.toString() || "",
      designFabrication:
        pipingData.protection.design_fabrication_id?.toString() || "",
      interface: pipingData.protection.interface_id?.toString() || "",
      liningType: pipingData.protection.lining_type || "",
      liningCondition: pipingData.protection.lining_condition || "",
      liningMonitoring: pipingData.protection.lining_monitoring || "",
      isolationSystem:
        pipingData.protection.isolation_system_id?.toString() || "",
      detectionSystem:
        pipingData.protection.detection_system_id?.toString() || "",
      mitigationSystem:
        pipingData.protection.mitigation_system_id?.toString() || "",
      onlineMonitor: pipingData.protection.online_monitor?.toString() || "",
      postWeldHeatTreatment: pipingData.protection.post_weld_heat_treatment
        ? "yes"
        : "no",
      lineDescription: pipingData.protection.line_description || "",
      replacementLine: pipingData.protection.replacement_line || "",
      minimumThickness:
        pipingData.protection.minimum_thickness?.toString() || "",

      // Service Tab
      fluidRepresentative:
        pipingData.service.fluid_representive_id?.toString() || "",
      toxicity: pipingData.service.toxicity_id?.toString() || "",
      fluidPhase: pipingData.service.fluid_phase_id?.toString() || "",
      toxicMassFraction:
        pipingData.service.toxic_mass_fraction?.toString() || "",
    });
  }, [pipingData]);

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const payload = {
        general: {
          year_in_service: formData.yearInService,
          material_construction_id:
            Number(formData.materialConstruction) || null,
          tmin: formData.tmin,
          description: formData.description,
          normal_wall_thickness:
            parseFloat(formData.nominalWallThickness) || null,
          nominal_bore_diameter:
            parseFloat(formData.nominalBoreDiameter) || null,
          pressure_rating: parseFloat(formData.pressureRating) || null,
          pipe_class_id: Number(formData.pipeClass) || null,
          pipe_schedule_id: Number(formData.pipeSchedule) || null,
          circuit_id: formData.circuitId,
          line_no: formData.lineNo,
          insulation: formData.insulation === "yes",
          line_h2s: formData.lineH2S === "yes",
          internal_lining: formData.internalLining === "yes",
          pwht: formData.pwht === "yes",
          cladding: formData.cladding === "yes",
          inner_diameter: parseFloat(formData.innerDiameter) || null,
          clad_thickness: parseFloat(formData.cladThickness) || null,
        },
        design: {
          outer_diameter: parseFloat(formData.outerDiameter) || null,
          length: parseFloat(formData.length) || null,
          welding_efficiency: parseFloat(formData.weldingEfficiency) || null,
          design_temperature: parseFloat(formData.designTemperature) || null,
          operating_temperature:
            parseFloat(formData.operatingTemperature) || null,
          design_pressure: parseFloat(formData.designPressure) || null,
          operating_pressure_mpa:
            parseFloat(formData.operatingPressure) || null,
          allowable_stress_mpa: parseFloat(formData.allowableStress) || null,
          corrosion_allowance: parseFloat(formData.corrosionAllowance) || null,
          ext_env_id: Number(formData.extEnv) || null,
          geometry_id: Number(formData.geometry) || null,
          pipe_support: formData.pipeSupport === "yes",
          soil_water_interface: formData.soilWaterInterface === "yes",
          dead_legs: formData.deadLegs === "yes",
          mix_point: formData.mixPoint === "yes",
        },
        protection: {
          coating_quality_id: Number(formData.coatingQuality) || null,
          insulation_type_id: Number(formData.insulationType) || null,
          insulation_complexity_id:
            Number(formData.insulationComplexity) || null,
          insulation_condition_id: Number(formData.insulationCondition) || null,
          design_fabrication_id: Number(formData.designFabrication) || null,
          interface_id: Number(formData.interface) || null,
          lining_type: formData.liningType,
          lining_condition: formData.liningCondition,
          lining_monitoring: formData.liningMonitoring,
          isolation_system_id: Number(formData.isolationSystem) || null,
          detection_system_id: Number(formData.detectionSystem) || null,
          mitigation_system_id: Number(formData.mitigationSystem) || null,
          online_monitor: Number(formData.onlineMonitor) || null,
          post_weld_heat_treatment: formData.postWeldHeatTreatment === "yes",
          line_description: formData.lineDescription,
          replacement_line: formData.replacementLine,
          minimum_thickness: parseFloat(formData.minimumThickness) || null,
        },
        service: {
          fluid_representive_id: Number(formData.fluidRepresentative) || null,
          toxicity_id: Number(formData.toxicity) || null,
          fluid_phase_id: Number(formData.fluidPhase) || null,
          toxic_mass_fraction: parseFloat(formData.toxicMassFraction) || null,
        },
      };

      await updatePipingMutation.mutateAsync(payload);

      toast({
        title: "Success",
        description: "Piping data updated successfully",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update piping data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof PipingFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isPipingLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="border-b pb-4">
        <PageHeader
          title={`Piping - ${
            pipingData?.assetDetail?.equipment_tag || "Unknown"
          }`}
          subtitle={`${pipingData?.assetDetail?.component_type || "Piping"} | ${
            pipingData?.assetDetail?.area || "N/A"
          } | ${pipingData?.assetDetail?.system || "N/A"}`}
          icon={<Pipette className="h-6 w-6" />}
        />

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/monitor/integrity")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Integrity
            </Button>
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Multi-Tab Form */}
        <Card>
          <CardContent className="p-0">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="border-b">
                <TabsList className="grid w-full grid-cols-4 h-auto p-1">
                  <TabsTrigger value="general" className="py-3">
                    General
                  </TabsTrigger>
                  <TabsTrigger value="design" className="py-3">
                    Design
                  </TabsTrigger>
                  <TabsTrigger value="protection" className="py-3">
                    Protection
                  </TabsTrigger>
                  <TabsTrigger value="service" className="py-3">
                    Service
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                {/* General Tab */}
                <TabsContent value="general" className="mt-0 space-y-6">
                  <div className="border-b pb-4">
                    <h2 className="text-xl font-semibold">
                      General Information
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Piping identification and basic specification details
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Column 1 - Basic Information */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg text-blue-600">
                        Basic Information
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="equipmentTag">Equipment Tag</Label>
                        <Input
                          id="equipmentTag"
                          value={pipingData?.assetDetail?.equipment_tag || ""}
                          disabled
                          className="bg-gray-50 font-mono"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="componentType">Component Type</Label>
                        <Input
                          id="componentType"
                          value={pipingData?.assetDetail?.component_type || ""}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="area">Area</Label>
                        <Input
                          id="area"
                          value={pipingData?.assetDetail?.area || ""}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="system">System</Label>
                        <Input
                          id="system"
                          value={pipingData?.assetDetail?.system || ""}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="yearInService">Year In Service</Label>
                        <Input
                          id="yearInService"
                          type="date"
                          value={formData.yearInService}
                          onChange={(e) =>
                            handleInputChange("yearInService", e.target.value)
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </div>
                    </div>

                    {/* Column 2 - Material & Specifications */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg text-green-600">
                        Material & Specifications
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="materialConstruction">
                          Material Construction
                        </Label>
                        <Select
                          name="materialConstruction"
                          value={formData.materialConstruction}
                          onValueChange={(value) =>
                            handleInputChange("materialConstruction", value)
                          }
                          disabled={!isEditing}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select material..." />
                          </SelectTrigger>
                          <SelectContent>
                            {materialConstructionOptions.map((material) => (
                              <SelectItem
                                key={material.value}
                                value={material.value}
                              >
                                {material.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="circuitId">Circuit</Label>
                        <Select
                          value={formData.circuitId}
                          onValueChange={(value) =>
                            handleInputChange("circuitId", value)
                          }
                          disabled={!isEditing}
                          name="circuitId"
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select circuit" />
                          </SelectTrigger>
                          <SelectContent>
                            {circuitOptions?.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value.toString()}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) =>
                            handleInputChange("description", e.target.value)
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nominalWallThickness">
                          Nominal Wall Thickness (mm)
                        </Label>
                        <Input
                          id="nominalWallThickness"
                          type="number"
                          step="0.1"
                          value={formData.nominalWallThickness}
                          onChange={(e) =>
                            handleInputChange(
                              "nominalWallThickness",
                              e.target.value
                            )
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tmin">Tmin (mm)</Label>
                        <Input
                          id="tmin"
                          value={formData.tmin}
                          onChange={(e) =>
                            handleInputChange("tmin", e.target.value)
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </div>
                    </div>

                    {/* Column 3 - Dimensions & Options */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg text-purple-600">
                        Dimensions & Options
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="innerDiameter">
                          Inner Diameter (mm)
                        </Label>
                        <Input
                          id="innerDiameter"
                          type="number"
                          value={formData.innerDiameter}
                          onChange={(e) =>
                            handleInputChange("innerDiameter", e.target.value)
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cladThickness">
                          Clad Thickness (mm)
                        </Label>
                        <Input
                          id="cladThickness"
                          type="number"
                          step="0.1"
                          value={formData.cladThickness}
                          onChange={(e) =>
                            handleInputChange("cladThickness", e.target.value)
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nominalBoreDiameter">
                          Nominal Bore Diameter (mm)
                        </Label>
                        <Input
                          id="nominalBoreDiameter"
                          type="number"
                          value={formData.nominalBoreDiameter}
                          onChange={(e) =>
                            handleInputChange(
                              "nominalBoreDiameter",
                              e.target.value
                            )
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pressureRating">
                          Pressure Rating (PSI)
                        </Label>
                        <Input
                          id="pressureRating"
                          type="number"
                          value={formData.pressureRating}
                          onChange={(e) =>
                            handleInputChange("pressureRating", e.target.value)
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </div>

                      {/* Yes/No Options */}
                      <div className="space-y-4 pt-2">
                        <div className="space-y-3">
                          <Label>Cladding?</Label>
                          <RadioGroup
                            value={formData.cladding}
                            onValueChange={(value) =>
                              handleInputChange("cladding", value)
                            }
                            disabled={!isEditing}
                            className="flex gap-6"
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

                        <div className="space-y-3">
                          <Label>PWHT?</Label>
                          <RadioGroup
                            value={formData.pwht}
                            onValueChange={(value) =>
                              handleInputChange("pwht", value)
                            }
                            disabled={!isEditing}
                            className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="pwht-yes" />
                              <Label htmlFor="pwht-yes">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="pwht-no" />
                              <Label htmlFor="pwht-no">No</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Design Tab */}
                <TabsContent value="design" className="mt-0 space-y-6">
                  <div className="border-b pb-4">
                    <h2 className="text-xl font-semibold">
                      Design Specifications
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Technical design parameters and specifications
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Column 1 - Dimensions */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg text-blue-600">
                        Dimensions
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="outerDiameter">
                          Outer Diameter (mm)
                        </Label>
                        <Input
                          id="outerDiameter"
                          type="number"
                          value={formData.outerDiameter}
                          onChange={(e) =>
                            handleInputChange("outerDiameter", e.target.value)
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="length">Length (mm)</Label>
                        <Input
                          id="length"
                          type="number"
                          value={formData.length}
                          onChange={(e) =>
                            handleInputChange("length", e.target.value)
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="weldingEfficiency">
                          Weld Join Efficiency
                        </Label>
                        <Input
                          id="weldingEfficiency"
                          type="number"
                          step="0.01"
                          value={formData.weldingEfficiency}
                          onChange={(e) =>
                            handleInputChange(
                              "weldingEfficiency",
                              e.target.value
                            )
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="corrosionAllowance">
                          Corrosion Allowance (mm)
                        </Label>
                        <Input
                          id="corrosionAllowance"
                          type="number"
                          step="0.1"
                          value={formData.corrosionAllowance}
                          onChange={(e) =>
                            handleInputChange(
                              "corrosionAllowance",
                              e.target.value
                            )
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </div>
                    </div>

                    {/* Column 2 - Pressure & Temperature */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg text-green-600">
                        Pressure & Temperature
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="designTemperature">
                          Design Temperature (°F)
                        </Label>
                        <Input
                          id="designTemperature"
                          type="number"
                          value={formData.designTemperature}
                          onChange={(e) =>
                            handleInputChange(
                              "designTemperature",
                              e.target.value
                            )
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="operatingTemperature">
                          Operating Temperature (°C)
                        </Label>
                        <Input
                          id="operatingTemperature"
                          type="number"
                          value={formData.operatingTemperature}
                          onChange={(e) =>
                            handleInputChange(
                              "operatingTemperature",
                              e.target.value
                            )
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="designPressure">
                          Design Pressure (MPa)
                        </Label>
                        <Input
                          id="designPressure"
                          type="number"
                          step="0.1"
                          value={formData.designPressure}
                          onChange={(e) =>
                            handleInputChange("designPressure", e.target.value)
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="operatingPressure">
                          Operating Pressure (MPa)
                        </Label>
                        <Input
                          id="operatingPressure"
                          type="number"
                          step="0.1"
                          value={formData.operatingPressure}
                          onChange={(e) =>
                            handleInputChange(
                              "operatingPressure",
                              e.target.value
                            )
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="allowableStress">
                          Allowable Stress (MPa)
                        </Label>
                        <Input
                          id="allowableStress"
                          type="number"
                          step="0.1"
                          value={formData.allowableStress}
                          onChange={(e) =>
                            handleInputChange("allowableStress", e.target.value)
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </div>
                    </div>

                    {/* Column 3 - Environment & Configuration */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg text-purple-600">
                        Environment & Configuration
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="extEnv">External Environment</Label>
                        <Select
                          value={formData.extEnv}
                          onValueChange={(value) =>
                            handleInputChange("extEnv", value)
                          }
                          disabled={!isEditing}
                          name="extEnv"
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            {extEnvOptions?.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value.toString()}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="geometry">Geometry</Label>
                        <Select
                          value={formData.geometry}
                          onValueChange={(value) =>
                            handleInputChange("geometry", value)
                          }
                          disabled={!isEditing}
                          name="geometry"
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            {geometryOptions?.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value.toString()}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Yes/No Options */}
                      <div className="space-y-4 pt-2">
                        <div className="space-y-3">
                          <Label>Pipe Support?</Label>
                          <RadioGroup
                            value={formData.pipeSupport}
                            onValueChange={(value) =>
                              handleInputChange("pipeSupport", value)
                            }
                            disabled={!isEditing}
                            className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="yes"
                                id="pipe-support-yes"
                              />
                              <Label htmlFor="pipe-support-yes">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="pipe-support-no" />
                              <Label htmlFor="pipe-support-no">No</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="space-y-3">
                          <Label>Soil Water Interface?</Label>
                          <RadioGroup
                            value={formData.soilWaterInterface}
                            onValueChange={(value) =>
                              handleInputChange("soilWaterInterface", value)
                            }
                            disabled={!isEditing}
                            className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="soil-water-yes" />
                              <Label htmlFor="soil-water-yes">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="soil-water-no" />
                              <Label htmlFor="soil-water-no">No</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="space-y-3">
                          <Label>Dead Legs?</Label>
                          <RadioGroup
                            value={formData.deadLegs}
                            onValueChange={(value) =>
                              handleInputChange("deadLegs", value)
                            }
                            disabled={!isEditing}
                            className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="deadlegs-yes" />
                              <Label htmlFor="deadlegs-yes">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="deadlegs-no" />
                              <Label htmlFor="deadlegs-no">No</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="space-y-3">
                          <Label>Mix Point?</Label>
                          <RadioGroup
                            value={formData.mixPoint}
                            onValueChange={(value) =>
                              handleInputChange("mixPoint", value)
                            }
                            disabled={!isEditing}
                            className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="mixpoint-yes" />
                              <Label htmlFor="mixpoint-yes">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="mixpoint-no" />
                              <Label htmlFor="mixpoint-no">No</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Protection Tab */}
                <TabsContent value="protection" className="mt-0 space-y-6">
                  <div className="border-b pb-4">
                    <h2 className="text-xl font-semibold">
                      Protection Systems
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Piping protection and coating specifications
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Column 1 - Coating & Insulation */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg text-blue-600">
                        Coating & Insulation
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="coatingQuality">Coating Quality</Label>
                        <Select
                          value={formData.coatingQuality}
                          onValueChange={(value) =>
                            handleInputChange("coatingQuality", value)
                          }
                          disabled={!isEditing}
                          name="coatingQuality"
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select coating quality" />
                          </SelectTrigger>
                          <SelectContent>
                            {coatingQualityOptions?.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value.toString()}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="insulationType">Insulation Type</Label>
                        <Select
                          value={formData.insulationType}
                          onValueChange={(value) =>
                            handleInputChange("insulationType", value)
                          }
                          disabled={!isEditing}
                          name="insulationType"
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select insulation type" />
                          </SelectTrigger>
                          <SelectContent>
                            {insulationTypeOptions?.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value.toString()}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="insulationComplexity">
                          Insulation Complexity
                        </Label>
                        <Select
                          value={formData.insulationComplexity}
                          onValueChange={(value) =>
                            handleInputChange("insulationComplexity", value)
                          }
                          disabled={!isEditing}
                          name="insulationComplexity"
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select insulation complexity" />
                          </SelectTrigger>
                          <SelectContent>
                            {insulationComplexityOptions?.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value.toString()}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="insulationCondition">
                          Insulation Condition
                        </Label>
                        <Select
                          value={formData.insulationCondition}
                          onValueChange={(value) =>
                            handleInputChange("insulationCondition", value)
                          }
                          disabled={!isEditing}
                          name="insulationCondition"
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select insulation condition" />
                          </SelectTrigger>
                          <SelectContent>
                            {insulationConditionOptions?.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value.toString()}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Column 2 - Design & Interface */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg text-green-600">
                        Design & Interface
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="designFabrication">
                          Design Fabrication
                        </Label>
                        <Select
                          value={formData.designFabrication}
                          onValueChange={(value) =>
                            handleInputChange("designFabrication", value)
                          }
                          disabled={!isEditing}
                          name="designFabrication"
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select design fabrication" />
                          </SelectTrigger>
                          <SelectContent>
                            {designFabricationOptions?.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value.toString()}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="interface">Interface</Label>
                        <Select
                          value={formData.interface}
                          onValueChange={(value) =>
                            handleInputChange("interface", value)
                          }
                          disabled={!isEditing}
                          name="interface"
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select interface" />
                          </SelectTrigger>
                          <SelectContent>
                            {interfaceOptions?.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value.toString()}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="onlineMonitor">Online Monitor</Label>
                        <Select
                          value={formData.onlineMonitor}
                          onValueChange={(value) =>
                            handleInputChange("onlineMonitor", value)
                          }
                          disabled={!isEditing}
                          name="onlineMonitor"
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select online monitor" />
                          </SelectTrigger>
                          <SelectContent>
                            {onlineMonitorOptions?.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value.toString()}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="minimumThickness">
                          Minimum Thickness (mm)
                        </Label>
                        <Input
                          id="minimumThickness"
                          type="number"
                          step="0.1"
                          value={formData.minimumThickness}
                          onChange={(e) =>
                            handleInputChange(
                              "minimumThickness",
                              e.target.value
                            )
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </div>

                      <div className="space-y-3">
                        <Label>Post Weld Heat Treatment?</Label>
                        <RadioGroup
                          value={formData.postWeldHeatTreatment}
                          onValueChange={(value) =>
                            handleInputChange("postWeldHeatTreatment", value)
                          }
                          disabled={!isEditing}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="pwht-yes" />
                            <Label htmlFor="pwht-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="pwht-no" />
                            <Label htmlFor="pwht-no">No</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    {/* Column 3 - Lining & Systems */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg text-purple-600">
                        Lining & Systems
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="liningType">Lining Type</Label>
                        <Input
                          id="liningType"
                          value={formData.liningType}
                          onChange={(e) =>
                            handleInputChange("liningType", e.target.value)
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="liningCondition">
                          Lining Condition
                        </Label>
                        <Input
                          id="liningCondition"
                          value={formData.liningCondition}
                          onChange={(e) =>
                            handleInputChange("liningCondition", e.target.value)
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="liningMonitoring">
                          Lining Monitoring
                        </Label>
                        <Input
                          id="liningMonitoring"
                          value={formData.liningMonitoring}
                          onChange={(e) =>
                            handleInputChange(
                              "liningMonitoring",
                              e.target.value
                            )
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="isolationSystem">
                          Isolation System
                        </Label>
                        <Select
                          value={formData.isolationSystem}
                          onValueChange={(value) =>
                            handleInputChange("isolationSystem", value)
                          }
                          disabled={!isEditing}
                          name="isolationSystem"
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select isolation system" />
                          </SelectTrigger>
                          <SelectContent>
                            {isolationSystemOptions?.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value.toString()}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="detectionSystem">
                          Detection System
                        </Label>
                        <Select
                          value={formData.detectionSystem}
                          onValueChange={(value) =>
                            handleInputChange("detectionSystem", value)
                          }
                          disabled={!isEditing}
                          name="detectionSystem"
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select detection system" />
                          </SelectTrigger>
                          <SelectContent>
                            {detectionSystemOptions?.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value.toString()}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Service Tab */}
                <TabsContent value="service" className="mt-0 space-y-6">
                  <div className="border-b pb-4">
                    <h2 className="text-xl font-semibold">
                      Service Conditions
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Process fluid and service specifications
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Column 1 - Fluid Properties */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg text-blue-600">
                        Fluid Properties
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="fluidRepresentative">
                          Fluid Representative
                        </Label>
                        <Select
                          value={formData.fluidRepresentative}
                          onValueChange={(value) =>
                            handleInputChange("fluidRepresentative", value)
                          }
                          disabled={!isEditing}
                          name="fluidRepresentative"
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select fluid representative" />
                          </SelectTrigger>
                          <SelectContent>
                            {fluidRepresentativeOptions?.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value.toString()}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fluidPhase">Fluid Phase</Label>
                        <Select
                          value={formData.fluidPhase}
                          onValueChange={(value) =>
                            handleInputChange("fluidPhase", value)
                          }
                          disabled={!isEditing}
                          name="fluidPhase"
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select fluid phase" />
                          </SelectTrigger>
                          <SelectContent>
                            {fluidPhaseOptions?.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value.toString()}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Column 2 - Toxicity */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg text-green-600">
                        Toxicity
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="toxicity">Toxicity</Label>
                        <Select
                          value={formData.toxicity}
                          onValueChange={(value) =>
                            handleInputChange("toxicity", value)
                          }
                          disabled={!isEditing}
                          name="toxicity"
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select toxicity" />
                          </SelectTrigger>
                          <SelectContent>
                            {toxicityOptions?.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value.toString()}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="toxicMassFraction">
                          Toxic Mass Fraction
                        </Label>
                        <Input
                          id="toxicMassFraction"
                          type="number"
                          step="0.001"
                          value={formData.toxicMassFraction}
                          onChange={(e) =>
                            handleInputChange(
                              "toxicMassFraction",
                              e.target.value
                            )
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PipingDetailPage;
