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
  ShieldIcon,
  ArrowLeft,
  Edit,
  Save,
  X,
  FileText,
  Download,
  Loader,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
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
import { useUpdateVesselData, useVesselData } from "@/hooks/queries/useIntegrity";

interface PressureVesselData {
  // General data from i_ims_general
  general: {
    id: number;
    asset_detail_id: number;
    year_in_service: string;
    tmin: string;
    material_construction_id: number;
    description: string;
    normal_wall_thickness: number;
    insulation: boolean;
    line_h2s: boolean;
    internal_lining: boolean;
    pwht: boolean;
    cladding: boolean;
    inner_diameter: number;
    clad_thickness: number;
  };

  // Design data from i_ims_design
  design: {
    outer_diameter: number;
    internal_diameter: number;
    length: number;
    welding_efficiency: number;
    design_temperature: number;
    operating_temperature: number;
    design_pressure: number;
    operating_pressure_mpa: number;
    allowable_stress_mpa: number;
    corrosion_allowance: number;
    ext_env_id: number;
    geometry_id: number;
    pipe_support: boolean;
    soil_water_interface: boolean;
    dead_legs: boolean;
    mix_point: boolean;
  };

  // Protection data from i_ims_protection
  protection: {
    coating_quality_id: number;
    insulation_type_id: number;
    insulation_complexity_id: number;
    insulation_condition_id: number;
    design_fabrication_id: number;
    interface_id: number;
    lining_type: string;
    lining_condition: string;
    lining_monitoring: string;
    online_monitor: number;
  };

  // Service data from i_ims_service
  service: {
    fluid_representive_id: number;
    toxicity_id: number;
    fluid_phase_id: number;
    toxic_mass_fraction: number;
  };

  // Asset detail from e_asset_detail
  assetDetail: {
    equipment_tag: string;
    component_type: string;
    area: string;
    system: string;
  };
}

const dummyVesselData: PressureVesselData = {
  general: {
    id: 1,
    asset_detail_id: 1,
    year_in_service: "2010-01-01",
    tmin: "8.0",
    material_construction_id: 72,
    description: "Main pressure vessel for process line A.",
    normal_wall_thickness: 12.5,
    insulation: true,
    line_h2s: false,
    internal_lining: true,
    pwht: false,
    cladding: true,
    inner_diameter: 1200,
    clad_thickness: 2.5,
  },
  design: {
    outer_diameter: 1250,
    internal_diameter: 1200,
    length: 5000,
    welding_efficiency: 0.95,
    design_temperature: 200,
    operating_temperature: 180,
    design_pressure: 2.5,
    operating_pressure_mpa: 2.0,
    allowable_stress_mpa: 150,
    corrosion_allowance: 3.0,
    ext_env_id: 1,
    geometry_id: 2,
    pipe_support: true,
    soil_water_interface: false,
    dead_legs: false,
    mix_point: true,
  },
  protection: {
    coating_quality_id: 1,
    insulation_type_id: 2,
    insulation_complexity_id: 3,
    insulation_condition_id: 1,
    design_fabrication_id: 4,
    interface_id: 2,
    lining_type: "Epoxy",
    lining_condition: "Excellent",
    lining_monitoring: "Periodic",
    online_monitor: 1,
  },
  service: {
    fluid_representive_id: 1,
    toxicity_id: 2,
    fluid_phase_id: 1,
    toxic_mass_fraction: 0.002,
  },
  assetDetail: {
    equipment_tag: "PV-1001",
    component_type: "Pressure Vessel",
    area: "Area A",
    system: "System 1",
  },
};

const PressureVesselDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const { data: vesselData, isLoading: isVesselLoading } = useVesselData(Number(id));
  const updateVesselMutation = useUpdateVesselData(Number(id), setIsEditing);
  
  const [formData, setFormData] = useState({
    // General Tab
    yearInService: "",
    materialConstruction: "",
    tmin: "",
    description: "",
    nominalThickness: "",
    insulation: "",
    h2s: "",
    internalLining: "",
    pwht: "",
    cladding: "",
    innerDiameter: "",
    cladThickness: "",

    // Design Tab
    outerDiameter: "",
    length: "",
    weldJoinEfficiency: "",
    designTemperature: "",
    operatingTemperature: "",
    designPressure: "",
    operatingPressure: "",
    allowableStress: "",
    corrosionAllowance: "",
    extEnv: "",
    geometry: "",
    pipeSupport: "",
    soilWaterInterface: "",
    deadleg: "",
    mixpoint: "",

    // Protection Tab
    coatingQuality: "",
    insulationType: "",
    insulationComplexity: "",
    insulationCondition: "",
    designFabrication: "",
    interface: "",
    liningType: "",
    liningCondition: "",
    liningMonitoring: "",
    onlineMonitor: "",

    // Service Tab
    fluidRepresentative: "",
    toxicity: "",
    fluidPhase: "",
    toxicMassFraction: "",
  });

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

  useEffect(() => {
    if (!vesselData) return;
    setFormData({
      // General Tab
      yearInService: vesselData.general.year_in_service || "",
      materialConstruction:
        vesselData.general.material_construction_id?.toString() || "",
      tmin: vesselData.general.tmin || "",
      description: vesselData.general.description || "",
      nominalThickness:
        vesselData.general.normal_wall_thickness?.toString() || "",
      insulation: vesselData.general.insulation ? "yes" : "no",
      h2s: vesselData.general.line_h2s ? "yes" : "no",
      internalLining: vesselData.general.internal_lining ? "yes" : "no",
      pwht: vesselData.general.pwht ? "yes" : "no",
      cladding: vesselData.general.cladding ? "yes" : "no",
      innerDiameter: vesselData.general.inner_diameter?.toString() || "",
      cladThickness: vesselData.general.clad_thickness?.toString() || "",

      // Design Tab
      outerDiameter: vesselData.design.outer_diameter?.toString() || "",
      length: vesselData.design.length?.toString() || "",
      weldJoinEfficiency:
        vesselData.design.welding_efficiency?.toString() || "",
      designTemperature: vesselData.design.design_temperature?.toString() || "",
      operatingTemperature:
        vesselData.design.operating_temperature?.toString() || "",
      designPressure: vesselData.design.design_pressure?.toFixed(1) || "",
      operatingPressure:
        vesselData.design.operating_pressure_mpa?.toFixed(1) || "",
      allowableStress: vesselData.design.allowable_stress_mpa?.toFixed(1) || "",
      corrosionAllowance:
        vesselData.design.corrosion_allowance?.toFixed(1) || "",
      extEnv: vesselData.design.ext_env_id?.toString() || "",
      geometry: vesselData.design.geometry_id?.toString() || "",
      pipeSupport: vesselData.design.pipe_support ? "yes" : "no",
      soilWaterInterface: vesselData.design.soil_water_interface ? "yes" : "no",
      deadleg: vesselData.design.dead_legs ? "yes" : "no",
      mixpoint: vesselData.design.mix_point ? "yes" : "no",

      // Protection Tab
      coatingQuality:
        vesselData.protection.coating_quality_id?.toString() || "",
      insulationType:
        vesselData.protection.insulation_type_id?.toString() || "",
      insulationComplexity:
        vesselData.protection.insulation_complexity_id?.toString() || "",
      insulationCondition: vesselData.protection.insulation_condition_id?.toString() || "",
      designFabrication:
        vesselData.protection.design_fabrication_id?.toString() || "",
      interface: vesselData.protection.interface_id?.toString() || "",
      liningType: vesselData.protection.lining_type || "",
      liningCondition: vesselData.protection.lining_condition || "",
      liningMonitoring: vesselData.protection.lining_monitoring || "",
      onlineMonitor: vesselData.protection.online_monitor?.toString() || "",

      // Service Tab
      fluidRepresentative:
        vesselData.service.fluid_representive_id?.toString() || "",
      toxicity: vesselData.service.toxicity_id?.toString() || "",
      fluidPhase: vesselData.service.fluid_phase_id?.toString() || "",
      toxicMassFraction:
        vesselData.service.toxic_mass_fraction?.toString() || "",
    });
  }, [vesselData]);

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Prepare payload for update (convert formData fields as needed)
      const payload = {
        // General Tab
        general: {
          year_in_service: formData.yearInService,
          material_construction_id: Number(formData.materialConstruction) || null,
          tmin: formData.tmin,
          description: formData.description,
          normal_wall_thickness: parseFloat(formData.nominalThickness) || null,
          insulation: formData.insulation === "yes",
          line_h2s: formData.h2s === "yes",
          internal_lining: formData.internalLining === "yes",
          pwht: formData.pwht === "yes",
          cladding: formData.cladding === "yes",
          inner_diameter: parseFloat(formData.innerDiameter) || null,
          clad_thickness: parseFloat(formData.cladThickness) || null,
        },
        // Design Tab
        design: {
          outer_diameter: parseFloat(formData.outerDiameter) || null,
          length: parseFloat(formData.length) || null,
          welding_efficiency: parseFloat(formData.weldJoinEfficiency) || null,
          design_temperature: parseFloat(formData.designTemperature) || null,
          operating_temperature: parseFloat(formData.operatingTemperature) || null,
          design_pressure: parseFloat(formData.designPressure) || null,
          operating_pressure_mpa: parseFloat(formData.operatingPressure) || null,
          allowable_stress_mpa: parseFloat(formData.allowableStress) || null,
          corrosion_allowance: parseFloat(formData.corrosionAllowance) || null,
          ext_env_id: formData.extEnv ? Number(formData.extEnv) : null,
          geometry_id: formData.geometry ? Number(formData.geometry) : null,
          pipe_support: formData.pipeSupport === "yes",
          soil_water_interface: formData.soilWaterInterface === "yes",
          dead_legs: formData.deadleg === "yes",
          mix_point: formData.mixpoint === "yes",
        },
        // Protection Tab
        protection: {
          coating_quality_id: formData.coatingQuality ? Number(formData.coatingQuality) : null,
          insulation_type_id: formData.insulationType ? Number(formData.insulationType) : null,
          insulation_complexity_id: formData.insulationComplexity ? Number(formData.insulationComplexity) : null,
          insulation_condition_id: formData.insulationCondition ? Number(formData.insulationCondition) : null,
          design_fabrication_id: formData.designFabrication ? Number(formData.designFabrication) : null,
          interface_id: formData.interface ? Number(formData.interface) : null,
          lining_type: formData.liningType,
          lining_condition: formData.liningCondition,
          lining_monitoring: formData.liningMonitoring,
          online_monitor: formData.onlineMonitor ? Number(formData.onlineMonitor) : null,
        },
        // Service Tab
        service: {
          fluid_representive_id: formData.fluidRepresentative ? Number(formData.fluidRepresentative) : null,
          toxicity_id: formData.toxicity ? Number(formData.toxicity) : null,
          fluid_phase_id: formData.fluidPhase ? Number(formData.fluidPhase) : null,
          toxic_mass_fraction: formData.toxicMassFraction ? parseFloat(formData.toxicMassFraction) : null,
        },
      };

      await updateVesselMutation.mutateAsync(payload);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update vessel data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  };

  if(isVesselLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="border-b pb-4">
        <PageHeader
          title={`Pressure Vessel - ${vesselData.assetDetail.equipment_tag}`}
          subtitle={`${vesselData.assetDetail.component_type} | ${vesselData.assetDetail.area} | ${vesselData.assetDetail.system}`}
          icon={<ShieldIcon className="h-6 w-6" />}
        />

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/monitor/integrity")}
              className="p-0 h-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Integrity Management
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
                      Asset identification and basic specification details
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
                          value={vesselData.assetDetail.equipment_tag}
                          disabled
                          className="bg-gray-50 font-mono"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="componentType">Component Type</Label>
                        <Input
                          id="componentType"
                          value={vesselData.assetDetail.component_type}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="area">Area</Label>
                        <Input
                          id="area"
                          value={vesselData.assetDetail.area}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="system">System</Label>
                        <Input
                          id="system"
                          value={vesselData.assetDetail.system}
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
                        <Label htmlFor="nominalThickness">
                          Nominal Thickness (mm)
                        </Label>
                        <Input
                          id="nominalThickness"
                          type="number"
                          step="0.1"
                          value={formData.nominalThickness}
                          onChange={(e) =>
                            handleInputChange(
                              "nominalThickness",
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

                        <div className="space-y-3">
                          <Label>Insulation?</Label>
                          <RadioGroup
                            value={formData.insulation}
                            onValueChange={(value) =>
                              handleInputChange("insulation", value)
                            }
                            disabled={!isEditing}
                            className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="insulation-yes" />
                              <Label htmlFor="insulation-yes">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="insulation-no" />
                              <Label htmlFor="insulation-no">No</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="space-y-3">
                          <Label>H2S?</Label>
                          <RadioGroup
                            value={formData.h2s}
                            onValueChange={(value) =>
                              handleInputChange("h2s", value)
                            }
                            disabled={!isEditing}
                            className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="h2s-yes" />
                              <Label htmlFor="h2s-yes">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="h2s-no" />
                              <Label htmlFor="h2s-no">No</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="space-y-3">
                          <Label>Internal Lining?</Label>
                          <RadioGroup
                            value={formData.internalLining}
                            onValueChange={(value) =>
                              handleInputChange("internalLining", value)
                            }
                            disabled={!isEditing}
                            className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="yes"
                                id="internal-lining-yes"
                              />
                              <Label htmlFor="internal-lining-yes">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="no"
                                id="internal-lining-no"
                              />
                              <Label htmlFor="internal-lining-no">No</Label>
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
                        <Label htmlFor="weldJoinEfficiency">
                          Weld Join Efficiency
                        </Label>
                        <Input
                          id="weldJoinEfficiency"
                          type="number"
                          step="0.01"
                          value={formData.weldJoinEfficiency}
                          onChange={(e) =>
                            handleInputChange(
                              "weldJoinEfficiency",
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
                          <Label>Dead Leg?</Label>
                          <RadioGroup
                            value={formData.deadleg}
                            onValueChange={(value) =>
                              handleInputChange("deadleg", value)
                            }
                            disabled={!isEditing}
                            className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="deadleg-yes" />
                              <Label htmlFor="deadleg-yes">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="deadleg-no" />
                              <Label htmlFor="deadleg-no">No</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="space-y-3">
                          <Label>Mix Point?</Label>
                          <RadioGroup
                            value={formData.mixpoint}
                            onValueChange={(value) =>
                              handleInputChange("mixpoint", value)
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
                      Asset protection and coating specifications
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
                    </div>

                    {/* Column 3 - Lining */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg text-purple-600">
                        Lining
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

export default PressureVesselDetailPage;
