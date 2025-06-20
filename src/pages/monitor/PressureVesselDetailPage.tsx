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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

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
    insulation_condition: string;
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

const PressureVesselDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [vesselData, setVesselData] = useState<PressureVesselData | null>(null);
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

  // Load vessel data on component mount
  useEffect(() => {
    if (id) {
      loadVesselData();
    }
  }, [id]);

  const loadVesselData = async () => {
    setIsLoading(true);
    try {
      // Fetch general data with asset details
      const { data: generalData, error: generalError } = await supabase
        .from("i_ims_general")
        .select(
          `
          *,
          e_asset_detail (
            equipment_tag,
            component_type,
            e_asset (
              area,
              system
            )
          )
        `
        )
        .eq("id", id)
        .single();

      if (generalError) throw generalError;

      // Fetch design data
      const { data: designData, error: designError } = await supabase
        .from("i_ims_design")
        .select("*")
        .eq("asset_detail_id", generalData.asset_detail_id)
        .eq("ims_asset_type_id", 1) // Pressure Vessel
        .single();

      // Fetch protection data
      const { data: protectionData, error: protectionError } = await supabase
        .from("i_ims_protection")
        .select("*")
        .eq("asset_detail_id", generalData.asset_detail_id)
        .eq("ims_asset_type_id", 1) // Pressure Vessel
        .single();

      // Fetch service data
      const { data: serviceData, error: serviceError } = await supabase
        .from("i_ims_service")
        .select("*")
        .eq("asset_detail_id", generalData.asset_detail_id)
        .eq("ims_asset_type_id", 1) // Pressure Vessel
        .single();

      // Populate form data
      setFormData({
        // General Tab
        yearInService: generalData.year_in_service || "",
        materialConstruction:
          generalData.material_construction_id?.toString() || "",
        tmin: generalData.tmin || "",
        description: generalData.description || "",
        nominalThickness: generalData.normal_wall_thickness?.toString() || "",
        insulation: generalData.insulation ? "yes" : "no",
        h2s: generalData.line_h2s ? "yes" : "no",
        internalLining: generalData.internal_lining ? "yes" : "no",
        pwht: generalData.pwht ? "yes" : "no",
        cladding: generalData.cladding ? "yes" : "no",
        innerDiameter: generalData.inner_diameter?.toString() || "",
        cladThickness: generalData.clad_thickness?.toString() || "",

        // Design Tab
        outerDiameter: designData?.outer_diameter?.toString() || "",
        length: designData?.length?.toString() || "",
        weldJoinEfficiency: designData?.welding_efficiency?.toString() || "",
        designTemperature: designData?.design_temperature?.toString() || "",
        operatingTemperature:
          designData?.operating_temperature?.toString() || "",
        designPressure: designData?.design_pressure?.toString() || "",
        operatingPressure: designData?.operating_pressure_mpa?.toString() || "",
        allowableStress: designData?.allowable_stress_mpa?.toString() || "",
        corrosionAllowance: designData?.corrosion_allowance?.toString() || "",
        extEnv: designData?.ext_env_id?.toString() || "",
        geometry: designData?.geometry_id?.toString() || "",
        pipeSupport: designData?.pipe_support ? "yes" : "no",
        soilWaterInterface: designData?.soil_water_interface ? "yes" : "no",
        deadleg: designData?.dead_legs ? "yes" : "no",
        mixpoint: designData?.mix_point ? "yes" : "no",

        // Protection Tab
        coatingQuality: protectionData?.coating_quality_id?.toString() || "",
        insulationType: protectionData?.insulation_type_id?.toString() || "",
        insulationComplexity:
          protectionData?.insulation_complexity_id?.toString() || "",
        insulationCondition: protectionData?.insulation_condition || "",
        designFabrication:
          protectionData?.design_fabrication_id?.toString() || "",
        interface: protectionData?.interface_id?.toString() || "",
        liningType: protectionData?.lining_type || "",
        liningCondition: protectionData?.lining_condition || "",
        liningMonitoring: protectionData?.lining_monitoring || "",
        onlineMonitor: protectionData?.online_monitor?.toString() || "",

        // Service Tab
        fluidRepresentative:
          serviceData?.fluid_representive_id?.toString() || "",
        toxicity: serviceData?.toxicity_id?.toString() || "",
        fluidPhase: serviceData?.fluid_phase_id?.toString() || "",
        toxicMassFraction: serviceData?.toxic_mass_fraction?.toString() || "",
      });

      setVesselData({
        general: generalData,
        design: designData || {},
        protection: protectionData || {},
        service: serviceData || {},
        assetDetail: {
          equipment_tag: generalData.e_asset_detail?.equipment_tag || "",
          component_type: generalData.e_asset_detail?.component_type || "",
          area: generalData.e_asset_detail?.e_asset?.area || "",
          system: generalData.e_asset_detail?.e_asset?.system || "",
        },
      });
    } catch (error) {
      console.error("Error loading vessel data:", error);
      toast({
        title: "Error",
        description: "Failed to load pressure vessel data",
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
    }));
  };

  const handleSave = async () => {
    if (!vesselData) return;

    setIsLoading(true);
    try {
      // Update general data
      const { error: generalError } = await supabase
        .from("i_ims_general")
        .update({
          year_in_service: formData.yearInService,
          material_construction_id:
            parseInt(formData.materialConstruction) || null,
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
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (generalError) throw generalError;

      // Update design data
      const designUpdateData = {
        outer_diameter: parseFloat(formData.outerDiameter) || null,
        internal_diameter: parseFloat(formData.innerDiameter) || null,
        length: parseFloat(formData.length) || null,
        welding_efficiency: parseFloat(formData.weldJoinEfficiency) || null,
        design_temperature: parseFloat(formData.designTemperature) || null,
        operating_temperature:
          parseFloat(formData.operatingTemperature) || null,
        design_pressure: parseFloat(formData.designPressure) || null,
        operating_pressure_mpa: parseFloat(formData.operatingPressure) || null,
        allowable_stress_mpa: parseFloat(formData.allowableStress) || null,
        corrosion_allowance: parseFloat(formData.corrosionAllowance) || null,
        ext_env_id: parseInt(formData.extEnv) || null,
        geometry_id: parseInt(formData.geometry) || null,
        pipe_support: formData.pipeSupport === "yes",
        soil_water_interface: formData.soilWaterInterface === "yes",
        dead_legs: formData.deadleg === "yes",
        mix_point: formData.mixpoint === "yes",
        updated_at: new Date().toISOString(),
      };

      const { error: designError } = await supabase
        .from("i_ims_design")
        .upsert({
          ...designUpdateData,
          asset_detail_id: vesselData.general.asset_detail_id,
          ims_asset_type_id: 1,
        });

      if (designError) throw designError;

      // Update protection data
      const protectionUpdateData = {
        coating_quality_id: parseInt(formData.coatingQuality) || null,
        insulation_type_id: parseInt(formData.insulationType) || null,
        insulation_complexity_id:
          parseInt(formData.insulationComplexity) || null,
        insulation_condition: formData.insulationCondition || null,
        design_fabrication_id: parseInt(formData.designFabrication) || null,
        interface_id: parseInt(formData.interface) || null,
        lining_type: formData.liningType || null,
        lining_condition: formData.liningCondition || null,
        lining_monitoring: formData.liningMonitoring || null,
        online_monitor: parseInt(formData.onlineMonitor) || null,
        updated_at: new Date().toISOString(),
      };

      const { error: protectionError } = await supabase
        .from("i_ims_protection")
        .upsert({
          ...protectionUpdateData,
          asset_detail_id: vesselData.general.asset_detail_id,
          ims_asset_type_id: 1,
        });

      if (protectionError) throw protectionError;

      // Update service data
      const serviceUpdateData = {
        fluid_representive_id: parseInt(formData.fluidRepresentative) || null,
        toxicity_id: parseInt(formData.toxicity) || null,
        fluid_phase_id: parseInt(formData.fluidPhase) || null,
        toxic_mass_fraction: parseFloat(formData.toxicMassFraction) || null,
        updated_at: new Date().toISOString(),
      };

      const { error: serviceError } = await supabase
        .from("i_ims_service")
        .upsert({
          ...serviceUpdateData,
          asset_detail_id: vesselData.general.asset_detail_id,
          ims_asset_type_id: 1,
        });

      if (serviceError) throw serviceError;

      toast({
        title: "Success!",
        description: "Pressure vessel data updated successfully",
      });

      setIsEditing(false);
      loadVesselData(); // Reload data to show updates
    } catch (error) {
      console.error("Error updating vessel data:", error);
      toast({
        title: "Error",
        description: "Failed to update pressure vessel data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadVesselData(); // Reset form data
  };

  if (isLoading && !vesselData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">
            Loading pressure vessel data...
          </p>
        </div>
      </div>
    );
  }

  if (!vesselData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Pressure vessel not found</p>
        <Button onClick={() => navigate("/monitor/integrity")} className="mt-4">
          Back to Integrity Management
        </Button>
      </div>
    );
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
                        <Input
                          id="materialConstruction"
                          value={formData.materialConstruction}
                          onChange={(e) =>
                            handleInputChange(
                              "materialConstruction",
                              e.target.value
                            )
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                          placeholder="Material Construction ID"
                        />
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
                        <Input
                          id="extEnv"
                          value={formData.extEnv}
                          onChange={(e) =>
                            handleInputChange("extEnv", e.target.value)
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                          placeholder="External Environment ID"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="geometry">Geometry</Label>
                        <Input
                          id="geometry"
                          value={formData.geometry}
                          onChange={(e) =>
                            handleInputChange("geometry", e.target.value)
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                          placeholder="Geometry ID"
                        />
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
                        <Input
                          id="coatingQuality"
                          value={formData.coatingQuality}
                          onChange={(e) =>
                            handleInputChange("coatingQuality", e.target.value)
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                          placeholder="Coating Quality ID"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="insulationType">Insulation Type</Label>
                        <Input
                          id="insulationType"
                          value={formData.insulationType}
                          onChange={(e) =>
                            handleInputChange("insulationType", e.target.value)
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                          placeholder="Insulation Type ID"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="insulationComplexity">
                          Insulation Complexity
                        </Label>
                        <Input
                          id="insulationComplexity"
                          value={formData.insulationComplexity}
                          onChange={(e) =>
                            handleInputChange(
                              "insulationComplexity",
                              e.target.value
                            )
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                          placeholder="Insulation Complexity ID"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="insulationCondition">
                          Insulation Condition
                        </Label>
                        <Input
                          id="insulationCondition"
                          value={formData.insulationCondition}
                          onChange={(e) =>
                            handleInputChange(
                              "insulationCondition",
                              e.target.value
                            )
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                        />
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
                        <Input
                          id="designFabrication"
                          value={formData.designFabrication}
                          onChange={(e) =>
                            handleInputChange(
                              "designFabrication",
                              e.target.value
                            )
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                          placeholder="Design Fabrication ID"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="interface">Interface</Label>
                        <Input
                          id="interface"
                          value={formData.interface}
                          onChange={(e) =>
                            handleInputChange("interface", e.target.value)
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                          placeholder="Interface ID"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="onlineMonitor">Online Monitor</Label>
                        <Input
                          id="onlineMonitor"
                          value={formData.onlineMonitor}
                          onChange={(e) =>
                            handleInputChange("onlineMonitor", e.target.value)
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                          placeholder="Online Monitor ID"
                        />
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
                        <Input
                          id="fluidRepresentative"
                          value={formData.fluidRepresentative}
                          onChange={(e) =>
                            handleInputChange(
                              "fluidRepresentative",
                              e.target.value
                            )
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                          placeholder="Fluid Representative ID"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fluidPhase">Fluid Phase</Label>
                        <Input
                          id="fluidPhase"
                          value={formData.fluidPhase}
                          onChange={(e) =>
                            handleInputChange("fluidPhase", e.target.value)
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                          placeholder="Fluid Phase ID"
                        />
                      </div>
                    </div>

                    {/* Column 2 - Toxicity */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg text-green-600">
                        Toxicity
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="toxicity">Toxicity</Label>
                        <Input
                          id="toxicity"
                          value={formData.toxicity}
                          onChange={(e) =>
                            handleInputChange("toxicity", e.target.value)
                          }
                          disabled={!isEditing}
                          className={!isEditing ? "bg-gray-50" : ""}
                          placeholder="Toxicity ID"
                        />
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
