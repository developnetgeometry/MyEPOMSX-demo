/**
 * NEW PIPING PAGE - INTEGRITY MANAGEMENT SYSTEM
 *
 * DATABASE MAPPING IMPLEMENTATION:
 * ================================
 *
 * PRIMARY TABLES: i_ims_general, i_ims_design, i_ims_protection, i_ims_service
 * - Stores piping data across multiple related tables
 * - Key field mappings:
 *   • asset_detail_id (from e_asset selection)
 *   • year_in_service (yyyy-mm-dd format)
 *   • material_construction_id (from material selection)
 *   • ims_asset_type_id = 2 (auto-set for Piping)
 *   • Boolean fields: insulation, line_h2s, internal_lining, pwht, cladding
 *
 * FILE UPLOAD SYSTEM:
 * ==================
 *
 * BUCKET STRUCTURE: integrity/piping/{id}/
 * - Reports: integrity/piping/{id}/reports/
 * - Attachments: integrity/piping/{id}/attachments/
 *
 * IMPLEMENTATION STATUS:
 * =====================
 * ✅ Form structure mapped to multiple database tables
 * ✅ HandleSubmit function with proper field mappings
 * ✅ File upload system with correct bucket structure
 * ✅ Database insertion logic across i_ims_general, i_ims_design, i_ims_protection, i_ims_service
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Save,
  X,
  Upload,
  FileText,
  File,
  FileImage,
  FileSpreadsheet,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useAssetTagOptions,
  useAssetWithComponentTypeOptions,
} from "@/hooks/queries/useAssetDropdownOptions";
import {
  useMaterialConstructionOptions,
  useAsmeViiAllowableStressLookup,
  useTminCalculation,
} from "@/hooks/queries/useCorrosionDropdownOptions";
import { supabase } from "@/lib/supabaseClient";

const NewPipingPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [activeInspectionTab, setActiveInspectionTab] = useState("plan");

  // Dropdown options hooks
  const { data: assetTagOptions = [] } = useAssetTagOptions();
  const { data: assetWithComponentTypeOptions = [] } =
    useAssetWithComponentTypeOptions();
  const { data: materialConstructionOptions = [] } =
    useMaterialConstructionOptions();

  // Form data structure mapped to multiple database tables
  const [formData, setFormData] = useState({
    // General Tab - Maps directly to i_ims_general table columns
    asset: "", // asset_detail_id - from e_asset table, store the id
    equipmentTag: "", // reference only (from e_asset_detail)
    equipmentType: "Piping", // fixed value for display
    componentType: "", // reference only (from e_asset_detail)
    area: "", // reference only (from e_asset)
    system: "", // reference only (from e_asset)
    yearInService: "", // year_in_service - store as yyyy-mm-dd format
    materialConstruction: "", // material_construction_id - from selecting Material Construction, store the id
    tmin: "", // tmin - from input Tmin (mm) under general tab
    description: "", // description - from input Description under general tab
    nominalThickness: "", // normal_wall_thickness - from input Nominal Thickness (mm) under general tab
    nominalBoreDiameter: "", // nominal_bore_diameter - from input for piping
    pressureRating: "", // pressure_rating - specific to piping
    pipeClass: "", // pipe_class_id - piping specific
    pipeSchedule: "", // pipe_schedule_id - piping specific
    circuitId: "", // circuit_id - piping specific
    lineNo: "", // line_no - piping specific
    insulation: "", // insulation - from radio button Insulation value (yes/no)
    lineH2s: "", // line_h2s - from radio button H2S value (yes/no)
    internalLining: "", // internal_lining - from radio button Internal Lining value (yes/no)
    pwht: "", // pwht - from radio button PWHT value (yes/no)
    cladding: "", // cladding - from radio button Cladding value (yes/no)
    innerDiameter: "", // inner_diameter - from input Inner Diameter (mm) under general tab
    cladThickness: "", // clad_thickness - from input Clad Thickness (mm) under general tab
    // ims_asset_type_id - automatically set to 2 for Piping

    // Design Tab - Maps to i_ims_design table
    outerDiameter: "", // outer_diameter - mm
    internalDiameter: "", // internal_diameter - mm
    length: "", // length - mm
    weldingEfficiency: "", // welding_efficiency - unitless
    designTemperature: "", // design_temperature - Degree Fahrenheit (user input)
    operatingTemperature: "", // operating_temperature - Degree Celsius
    designPressure: "", // design_pressure - MPa
    operatingPressure: "", // operating_pressure_mpa - MPa
    allowableStress: "", // allowable_stress_mpa - MPa (auto-calculated)
    corrosionAllowance: "", // corrosion_allowance - mm
    externalEnvironment: "", // ext_env_id - dropdown/text
    geometry: "", // geometry_id - dropdown/text
    pipeSupport: "", // pipe_support - Yes or No
    soilWaterInterface: "", // soil_water_interface - Yes or No
    deadLegs: "", // dead_legs - Yes or No
    mixPoint: "", // mix_point - Yes or No

    // Protection Tab - Maps to i_ims_protection table
    coatingQuality: "", // coating_quality_id - from e_coating_quality table
    insulationType: "", // insulation_type_id - from e_insulation_type table
    insulationComplexity: "", // insulation_complexity_id - from i_insulation_complexity table
    insulationCondition: "", // insulation_condition - input
    designFabrication: "", // design_fabrication_id - from e_design_fabrication table
    interface: "", // interface_id - from e_interface table
    liningType: "", // lining_type - input
    liningCondition: "", // lining_condition - input
    liningMonitoring: "", // lining_monitoring - input
    isolationSystem: "", // isolation_system_id - piping specific
    detectionSystem: "", // detection_system_id - piping specific
    mitigationSystem: "", // mitigation_system_id - piping specific
    onlineMonitor: "", // online_monitor - from e_online_monitor table
    postWeldHeatTreatment: "", // post_weld_heat_treatment - piping specific
    lineDescription: "", // line_description - piping specific
    replacementLine: "", // replacement_line - piping specific
    minimumThickness: "", // minimum_thickness - piping specific

    // Service Tab - Maps to i_ims_service table
    fluidRepresentative: "", // fluid_representive_id - from e_fluid_representative table
    toxicity: "", // toxicity_id - from e_toxicity table
    fluidPhase: "", // fluid_phase_id - from e_fluid_phase table
    toxicMassFraction: "", // toxic_mass_fraction - input form

    // Risk Tab
    riskRanking: "", // disabled, display value
    riskLevel: "", // disabled, display value
    dthin: "", // disabled, display value
    dscc: "", // disabled, display value
    dbrit: "", // disabled, display value
    pof: "", // disabled, display value
    dextd: "", // disabled, display value
    dhtha: "", // disabled, display value
    dmfat: "", // disabled, display value
    f1: "", // input form
    cofDollar: "", // disabled, display value
    cofM2: "", // disabled, display value

    // Inspection Tab
    // Plan sub-tab
    inspectionPlan: "", // WYSIWYG text editor content

    // Reports sub-tab
    inspectionReports: [] as File[], // Multiple file upload for documentation

    // Attachment Tab - Multiple file uploads
    attachments: [] as File[],

    // Additional fields
    notes: "",
  });

  // Auto-calculating hooks for allowable stress and Tmin (now after formData is defined)
  const { data: allowableStress, isLoading: calculatingStress } =
    useAsmeViiAllowableStressLookup(
      parseInt(formData.materialConstruction) || undefined,
      parseInt(formData.designTemperature) || undefined
    );

  const { data: tminResult, isLoading: calculatingTmin } = useTminCalculation(
    parseFloat(formData.designPressure) || undefined,
    allowableStress?.allowable_stress_mpa
      ? parseFloat(allowableStress.allowable_stress_mpa)
      : undefined,
    parseFloat(formData.weldingEfficiency) || undefined,
    parseFloat(formData.innerDiameter) || undefined
  );

  // Auto-update form data when calculations complete
  useEffect(() => {
    if (
      allowableStress?.is_valid_lookup &&
      allowableStress.allowable_stress_mpa
    ) {
      setFormData((prev) => ({
        ...prev,
        allowableStress: allowableStress.allowable_stress_mpa,
      }));
    }
  }, [allowableStress]);

  useEffect(() => {
    if (tminResult?.calculation_valid && tminResult.tmin_mm) {
      setFormData((prev) => ({
        ...prev,
        tmin: tminResult.tmin_mm.toFixed(3),
      }));
    }
  }, [tminResult]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [field]: value,
      };

      // Auto-populate fields when asset is selected
      if (field === "asset") {
        const selectedAsset = assetWithComponentTypeOptions.find(
          (asset) => asset.value === value
        );

        if (selectedAsset) {
          updatedData.componentType = selectedAsset.component_type || "";
          updatedData.area = selectedAsset.area || "";
          updatedData.system = selectedAsset.system || "";
          updatedData.equipmentTag = selectedAsset.equipment_tag || "";
        }
      }

      return updatedData;
    });
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles],
      }));
    }
  };

  const handleInspectionReportsUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        inspectionReports: [...prev.inspectionReports, ...newFiles],
      }));
    }
  };

  const removeAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const removeInspectionReport = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      inspectionReports: prev.inspectionReports.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Form validation
      if (
        !formData.asset ||
        !formData.equipmentTag ||
        !formData.componentType
      ) {
        toast({
          title: "Validation Error",
          description:
            "Please fill in all required fields (Asset, Equipment Tag, Component Type).",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      console.log("=== Starting Piping Save Process ===");

      // Get asset_detail_id from selected asset
      const selectedAsset = assetWithComponentTypeOptions.find(
        (asset) => asset.value === formData.asset
      );

      if (!selectedAsset) {
        throw new Error("Selected asset not found");
      }

      // Prepare main piping data for i_ims_general table insertion
      const imsGeneralData = {
        // Core required fields - only fields that exist in i_ims_general table
        asset_detail_id: selectedAsset.asset_detail_id, // Use asset_detail_id from the selected asset
        year_in_service: formData.yearInService, // yyyy-mm-dd format
        tmin: formData.tmin || null, // Store as string as expected by database
        material_construction_id:
          parseInt(formData.materialConstruction) || null,
        description: formData.description,
        normal_wall_thickness: parseFloat(formData.nominalThickness) || null,
        nominal_bore_diameter: parseFloat(formData.nominalBoreDiameter) || null,
        pressure_rating: parseFloat(formData.pressureRating) || null,
        pipe_class_id: parseInt(formData.pipeClass) || null,
        pipe_schedule_id: parseInt(formData.pipeSchedule) || null,
        circuit_id: parseInt(formData.circuitId) || null,
        line_no: formData.lineNo || null,
        insulation: formData.insulation === "yes",
        line_h2s: formData.lineH2s === "yes",
        internal_lining: formData.internalLining === "yes",
        pwht: formData.pwht === "yes",
        cladding: formData.cladding === "yes",
        ims_asset_type_id: 2, // Automatically set to 2 for Piping
        inner_diameter: parseFloat(formData.innerDiameter) || null,
        clad_thickness: parseFloat(formData.cladThickness) || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("Prepared i_ims_general data:", imsGeneralData);

      // Insert main record into i_ims_general table
      const { data: savedRecord, error: insertError } = await supabase
        .from("i_ims_general")
        .insert(imsGeneralData)
        .select()
        .single();

      if (insertError) throw insertError;
      const recordId = savedRecord.id;

      // Insert Design Tab data into i_ims_design table
      const imsDesignData = {
        asset_detail_id: selectedAsset.asset_detail_id,
        ims_asset_type_id: 2, // Piping
        outer_diameter: parseFloat(formData.outerDiameter) || null,
        internal_diameter: parseFloat(formData.internalDiameter) || null,
        length: parseFloat(formData.length) || null,
        welding_efficiency: parseFloat(formData.weldingEfficiency) || null,
        design_temperature: parseFloat(formData.designTemperature) || null,
        operating_temperature:
          parseFloat(formData.operatingTemperature) || null,
        design_pressure: parseFloat(formData.designPressure) || null,
        operating_pressure_mpa: parseFloat(formData.operatingPressure) || null,
        allowable_stress_mpa: parseFloat(formData.allowableStress) || null,
        corrosion_allowance: parseFloat(formData.corrosionAllowance) || null,
        ext_env_id: parseInt(formData.externalEnvironment) || null,
        geometry_id: parseInt(formData.geometry) || null,
        pipe_support: formData.pipeSupport === "yes",
        soil_water_interface: formData.soilWaterInterface === "yes",
        dead_legs: formData.deadLegs === "yes",
        mix_point: formData.mixPoint === "yes",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("Prepared i_ims_design data:", imsDesignData);

      const { error: designInsertError } = await supabase
        .from("i_ims_design")
        .insert(imsDesignData);

      if (designInsertError) throw designInsertError;

      // Insert Protection Tab data into i_ims_protection table
      const imsProtectionData = {
        asset_detail_id: selectedAsset.asset_detail_id,
        ims_asset_type_id: 2, // Piping
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
        isolation_system_id: parseInt(formData.isolationSystem) || null,
        detection_system_id: parseInt(formData.detectionSystem) || null,
        mitigation_system_id: parseInt(formData.mitigationSystem) || null,
        online_monitor: parseInt(formData.onlineMonitor) || null,
        post_weld_heat_treatment:
          parseFloat(formData.postWeldHeatTreatment) || null,
        line_description: formData.lineDescription || null,
        replacement_line: formData.replacementLine || null,
        minimum_thickness: parseFloat(formData.minimumThickness) || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("Prepared i_ims_protection data:", imsProtectionData);

      const { error: protectionInsertError } = await supabase
        .from("i_ims_protection")
        .insert(imsProtectionData);

      if (protectionInsertError) throw protectionInsertError;

      // Insert Service Tab data into i_ims_service table
      const imsServiceData = {
        asset_detail_id: selectedAsset.asset_detail_id,
        ims_asset_type_id: 2, // Piping
        fluid_representive_id: parseInt(formData.fluidRepresentative) || null,
        toxicity_id: parseInt(formData.toxicity) || null,
        fluid_phase_id: parseInt(formData.fluidPhase) || null,
        toxic_mass_fraction: parseFloat(formData.toxicMassFraction) || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("Prepared i_ims_service data:", imsServiceData);

      const { error: serviceInsertError } = await supabase
        .from("i_ims_service")
        .insert(imsServiceData);

      if (serviceInsertError) throw serviceInsertError;

      // Handle Inspection Reports File Upload with proper bucket structure
      let inspectionReportPaths: string[] = [];
      if (formData.inspectionReports.length > 0) {
        console.log(
          `Uploading ${formData.inspectionReports.length} inspection report files...`
        );

        for (const file of formData.inspectionReports) {
          try {
            // Create bucket structure: integrity/piping/{id}/reports/
            const bucketPath = `integrity/piping/${recordId}/reports/${Date.now()}_${
              file.name
            }`;

            console.log(
              `Uploading inspection report: ${file.name} to ${bucketPath}`
            );

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } =
              await supabase.storage
                .from("integrity")
                .upload(bucketPath, file, {
                  cacheControl: "3600",
                  upsert: false,
                });

            if (uploadError) throw uploadError;

            // Store file path (not full URL) for database
            inspectionReportPaths.push(bucketPath);

            // Insert into i_ims_inspection_attachment table
            const { error: attachmentError } = await supabase
              .from("i_ims_inspection_attachment")
              .insert({
                asset_detail_id: recordId, // links to i_ims_general.id
                file_path: bucketPath,
                file_name: file.name,
                file_size: file.size,
                uploaded_at: new Date().toISOString(),
              });

            if (attachmentError) throw attachmentError;
          } catch (fileError) {
            console.error(
              `Error uploading inspection report ${file.name}:`,
              fileError
            );
            // Continue with other files even if one fails
          }
        }
      }

      // Handle General Attachments File Upload with proper bucket structure
      let attachmentPaths: string[] = [];
      if (formData.attachments.length > 0) {
        console.log(
          `Uploading ${formData.attachments.length} attachment files...`
        );

        for (const file of formData.attachments) {
          try {
            // Create bucket structure: integrity/piping/{id}/attachments/
            const bucketPath = `integrity/piping/${recordId}/attachments/${Date.now()}_${
              file.name
            }`;

            console.log(`Uploading attachment: ${file.name} to ${bucketPath}`);

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } =
              await supabase.storage
                .from("integrity")
                .upload(bucketPath, file, {
                  cacheControl: "3600",
                  upsert: false,
                });

            if (uploadError) throw uploadError;

            // Store file path (not full URL) for database
            attachmentPaths.push(bucketPath);

            // Insert into i_ims_attachment table
            const { error: attachmentError } = await supabase
              .from("i_ims_attachment")
              .insert({
                asset_detail_id: recordId, // links to i_ims_general.id
                file_path: bucketPath,
                file_name: file.name,
                file_size: file.size,
                uploaded_at: new Date().toISOString(),
              });

            if (attachmentError) throw attachmentError;
          } catch (fileError) {
            console.error(
              `Error uploading attachment ${file.name}:`,
              fileError
            );
            // Continue with other files even if one fails
          }
        }
      }

      // Log summary for debugging
      console.log("=== Save Summary ===");
      console.log("i_ims_general Record ID:", recordId);
      console.log("Inspection Reports Uploaded:", inspectionReportPaths.length);
      console.log("Attachments Uploaded:", attachmentPaths.length);
      console.log("Data Structure:");
      console.log("- i_ims_general (Main record)");
      console.log("- i_ims_design (Design specifications)");
      console.log("- i_ims_protection (Protection data)");
      console.log("- i_ims_service (Service conditions)");
      console.log("- i_ims_inspection_attachment (Inspection reports)");
      console.log("- i_ims_attachment (General attachments)");

      toast({
        title: "Piping Created Successfully",
        description: `Piping asset has been saved with ID: ${recordId}. Data stored across multiple tables with ${
          inspectionReportPaths.length + attachmentPaths.length
        } files uploaded.`,
      });

      // Navigate back to integrity page
      navigate("/monitor/integrity");
    } catch (error) {
      console.error("Error creating piping:", error);
      toast({
        title: "Error",
        description: "Failed to create piping asset. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/monitor/integrity");
  };

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="border-b pb-4">
        <PageHeader
          title="New Piping"
          subtitle="Create a new piping asset with comprehensive details"
          icon={<ShieldIcon className="h-6 w-6" />}
        />

        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
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
                <TabsList className="grid w-full grid-cols-6 h-auto p-1">
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
                  <TabsTrigger value="inspection" className="py-3">
                    Inspection
                  </TabsTrigger>
                  <TabsTrigger value="attachment" className="py-3">
                    Attachment
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
                    {/* Column 1 - Asset Selection */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg text-blue-600">
                        Asset Selection
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="asset">Asset*</Label>
                        <Select
                          value={formData.asset}
                          onValueChange={(value) =>
                            handleInputChange("asset", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select asset" />
                          </SelectTrigger>
                          <SelectContent>
                            {assetWithComponentTypeOptions.map((option) => (
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
                        <Label htmlFor="equipmentTag">Equipment Tag*</Label>
                        <Input
                          id="equipmentTag"
                          value={formData.equipmentTag}
                          disabled
                          placeholder="Auto-populated from asset selection"
                          className="bg-muted"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="componentType">Component Type*</Label>
                        <Input
                          id="componentType"
                          value={formData.componentType}
                          disabled
                          placeholder="Auto-populated from asset selection"
                          className="bg-muted"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="area">Area</Label>
                        <Input
                          id="area"
                          value={formData.area}
                          disabled
                          placeholder="Auto-populated from asset selection"
                          className="bg-muted"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="system">System</Label>
                        <Input
                          id="system"
                          value={formData.system}
                          disabled
                          placeholder="Auto-populated from asset selection"
                          className="bg-muted"
                        />
                      </div>
                    </div>

                    {/* Column 2 - Basic Information */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg text-green-600">
                        Basic Information
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="yearInService">Year in Service*</Label>
                        <Input
                          id="yearInService"
                          type="date"
                          value={formData.yearInService}
                          onChange={(e) =>
                            handleInputChange("yearInService", e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="materialConstruction">
                          Material Construction*
                        </Label>
                        <Select
                          value={formData.materialConstruction}
                          onValueChange={(value) =>
                            handleInputChange("materialConstruction", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select material" />
                          </SelectTrigger>
                          <SelectContent>
                            {materialConstructionOptions.map((option) => (
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
                          placeholder="Enter nominal thickness"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nominalBoreDiameter">
                          Nominal Bore Diameter (mm)
                        </Label>
                        <Input
                          id="nominalBoreDiameter"
                          type="number"
                          step="0.1"
                          value={formData.nominalBoreDiameter}
                          onChange={(e) =>
                            handleInputChange(
                              "nominalBoreDiameter",
                              e.target.value
                            )
                          }
                          placeholder="Enter bore diameter"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pressureRating">
                          Pressure Rating (bar)
                        </Label>
                        <Input
                          id="pressureRating"
                          type="number"
                          step="0.1"
                          value={formData.pressureRating}
                          onChange={(e) =>
                            handleInputChange("pressureRating", e.target.value)
                          }
                          placeholder="Enter pressure rating"
                        />
                      </div>
                    </div>

                    {/* Column 3 - Piping Specific */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg text-purple-600">
                        Piping Specifications
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="lineNo">Line Number</Label>
                        <Input
                          id="lineNo"
                          value={formData.lineNo}
                          onChange={(e) =>
                            handleInputChange("lineNo", e.target.value)
                          }
                          placeholder="e.g., 2001-PP-12-G-001"
                          className="font-mono"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="circuitId">Circuit ID</Label>
                        <Input
                          id="circuitId"
                          value={formData.circuitId}
                          onChange={(e) =>
                            handleInputChange("circuitId", e.target.value)
                          }
                          placeholder="Enter circuit ID"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="innerDiameter">
                          Inner Diameter (mm)
                        </Label>
                        <Input
                          id="innerDiameter"
                          type="number"
                          step="0.1"
                          value={formData.innerDiameter}
                          onChange={(e) =>
                            handleInputChange("innerDiameter", e.target.value)
                          }
                          placeholder="Enter inner diameter"
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
                          placeholder={
                            calculatingTmin
                              ? "Calculating..."
                              : "Enter or auto-calculated"
                          }
                          className={
                            tminResult?.calculation_valid ? "bg-green-50" : ""
                          }
                        />
                        {calculatingTmin && (
                          <p className="text-xs text-blue-600">
                            Auto-calculating based on design parameters...
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) =>
                            handleInputChange("description", e.target.value)
                          }
                          placeholder="Enter piping description..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Boolean Options Section */}
                  <div className="border-t pt-6">
                    <h3 className="font-medium text-lg mb-4">
                      Configuration Options
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                      <div className="space-y-3">
                        <Label>Insulation</Label>
                        <RadioGroup
                          value={formData.insulation}
                          onValueChange={(value) =>
                            handleInputChange("insulation", value)
                          }
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
                        <Label>H2S Service</Label>
                        <RadioGroup
                          value={formData.lineH2s}
                          onValueChange={(value) =>
                            handleInputChange("lineH2s", value)
                          }
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
                        <Label>Internal Lining</Label>
                        <RadioGroup
                          value={formData.internalLining}
                          onValueChange={(value) =>
                            handleInputChange("internalLining", value)
                          }
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="lining-yes" />
                            <Label htmlFor="lining-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="lining-no" />
                            <Label htmlFor="lining-no">No</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-3">
                        <Label>PWHT</Label>
                        <RadioGroup
                          value={formData.pwht}
                          onValueChange={(value) =>
                            handleInputChange("pwht", value)
                          }
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
                        <Label>Cladding</Label>
                        <RadioGroup
                          value={formData.cladding}
                          onValueChange={(value) =>
                            handleInputChange("cladding", value)
                          }
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
                    </div>

                    {/* Clad Thickness field - only show if cladding is yes */}
                    {formData.cladding === "yes" && (
                      <div className="mt-4 max-w-sm">
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
                            placeholder="Enter clad thickness"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Design Tab - Simplified for now */}
                <TabsContent value="design" className="mt-0 space-y-6">
                  <div className="border-b pb-4">
                    <h2 className="text-xl font-semibold">
                      Design Specifications
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Technical design parameters and piping specifications
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="outerDiameter">Outer Diameter (mm)</Label>
                      <Input
                        id="outerDiameter"
                        type="number"
                        step="0.1"
                        value={formData.outerDiameter}
                        onChange={(e) =>
                          handleInputChange("outerDiameter", e.target.value)
                        }
                        placeholder="Enter outer diameter"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="length">Length (m)</Label>
                      <Input
                        id="length"
                        type="number"
                        step="0.1"
                        value={formData.length}
                        onChange={(e) =>
                          handleInputChange("length", e.target.value)
                        }
                        placeholder="Enter length"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="weldingEfficiency">
                        Welding Efficiency
                      </Label>
                      <Input
                        id="weldingEfficiency"
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        value={formData.weldingEfficiency}
                        onChange={(e) =>
                          handleInputChange("weldingEfficiency", e.target.value)
                        }
                        placeholder="Enter efficiency (0-1)"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="designTemperature">
                        Design Temperature (°F)
                      </Label>
                      <Input
                        id="designTemperature"
                        type="number"
                        step="0.1"
                        value={formData.designTemperature}
                        onChange={(e) =>
                          handleInputChange("designTemperature", e.target.value)
                        }
                        placeholder="Enter design temperature"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="operatingTemperature">
                        Operating Temperature (°C)
                      </Label>
                      <Input
                        id="operatingTemperature"
                        type="number"
                        step="0.1"
                        value={formData.operatingTemperature}
                        onChange={(e) =>
                          handleInputChange(
                            "operatingTemperature",
                            e.target.value
                          )
                        }
                        placeholder="Enter operating temperature"
                      />
                    </div>

                    <div className="space-y-3">
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
                        placeholder="Enter design pressure"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="operatingPressure">
                        Operating Pressure (MPa)
                      </Label>
                      <Input
                        id="operatingPressure"
                        type="number"
                        step="0.1"
                        value={formData.operatingPressure}
                        onChange={(e) =>
                          handleInputChange("operatingPressure", e.target.value)
                        }
                        placeholder="Enter operating pressure"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="allowableStress">
                        Allowable Stress (MPa)
                      </Label>
                      <Input
                        id="allowableStress"
                        value={formData.allowableStress}
                        onChange={(e) =>
                          handleInputChange("allowableStress", e.target.value)
                        }
                        placeholder={
                          calculatingStress
                            ? "Calculating..."
                            : "Enter or auto-calculated"
                        }
                        className={
                          allowableStress?.is_valid_lookup ? "bg-green-50" : ""
                        }
                      />
                      {calculatingStress && (
                        <p className="text-xs text-blue-600">
                          Auto-calculating from material and temperature...
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
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
                        placeholder="Enter corrosion allowance"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Protection Tab - Simplified for now */}
                <TabsContent value="protection" className="mt-0 space-y-6">
                  <div className="border-b pb-4">
                    <h2 className="text-xl font-semibold">
                      Protection Systems
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Piping protection and coating specifications
                    </p>
                  </div>

                  <div className="text-center py-12">
                    <ShieldIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Protection Tab</h3>
                    <p className="text-muted-foreground">
                      Protection system configuration will be implemented here
                    </p>
                  </div>
                </TabsContent>

                {/* Service Tab - Simplified for now */}
                <TabsContent value="service" className="mt-0 space-y-6">
                  <div className="border-b pb-4">
                    <h2 className="text-xl font-semibold">
                      Service Conditions
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Fluid characteristics and service parameters
                    </p>
                  </div>

                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Service Tab</h3>
                    <p className="text-muted-foreground">
                      Service conditions configuration will be implemented here
                    </p>
                  </div>
                </TabsContent>

                {/* Inspection Tab - Simplified for now */}
                <TabsContent value="inspection" className="mt-0 space-y-6">
                  <div className="border-b pb-4">
                    <h2 className="text-xl font-semibold">
                      Inspection Management
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Inspection planning and documentation
                    </p>
                  </div>

                  <Tabs
                    value={activeInspectionTab}
                    onValueChange={setActiveInspectionTab}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="plan">Inspection Plan</TabsTrigger>
                      <TabsTrigger value="reports">
                        Inspection Reports
                      </TabsTrigger>
                    </TabsList>

                    {/* Inspection Plan Sub-tab */}
                    <TabsContent value="plan" className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="inspectionPlan">
                          Inspection Plan Details
                        </Label>
                        <Textarea
                          id="inspectionPlan"
                          rows={12}
                          value={formData.inspectionPlan}
                          onChange={(e) =>
                            handleInputChange("inspectionPlan", e.target.value)
                          }
                          placeholder="Enter detailed inspection plan..."
                        />
                      </div>
                    </TabsContent>

                    {/* Inspection Reports Sub-tab */}
                    <TabsContent value="reports" className="space-y-6">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                        <div className="text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <h4 className="text-lg font-medium text-gray-900 mb-2">
                            Upload Inspection Reports
                          </h4>
                          <p className="text-sm text-gray-600 mb-4">
                            Drag and drop files here, or click to select files
                          </p>
                          <Input
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                            onChange={(e) =>
                              handleInspectionReportsUpload(e.target.files)
                            }
                            className="hidden"
                            id="inspection-reports-upload"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document
                                .getElementById("inspection-reports-upload")
                                ?.click()
                            }
                          >
                            Select Files
                          </Button>
                        </div>
                      </div>

                      {/* Uploaded Files List */}
                      {formData.inspectionReports.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="font-medium">
                            Uploaded Inspection Reports
                          </h4>
                          <div className="space-y-2">
                            {formData.inspectionReports.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                              >
                                <div className="flex items-center gap-3">
                                  <FileText className="h-8 w-8 text-red-500" />
                                  <div>
                                    <p className="font-medium text-sm">
                                      {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeInspectionReport(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </TabsContent>

                {/* Attachment Tab */}
                <TabsContent value="attachment" className="mt-0 space-y-6">
                  <div className="border-b pb-4">
                    <h2 className="text-xl font-semibold">Attachments</h2>
                    <p className="text-sm text-muted-foreground">
                      Upload relevant documents, images, and supporting files
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* File Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-gray-400 transition-colors">
                      <div className="text-center">
                        <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                          Upload Files
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                          Drag and drop files here, or click to browse and
                          select files
                        </p>
                        <Input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.dwg,.dxf,.txt"
                          onChange={(e) => handleFileUpload(e.target.files)}
                          className="hidden"
                          id="attachments-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="lg"
                          onClick={() =>
                            document
                              .getElementById("attachments-upload")
                              ?.click()
                          }
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Files
                        </Button>
                      </div>
                    </div>

                    {/* Uploaded Files Display */}
                    {formData.attachments.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">
                            Uploaded Files ({formData.attachments.length})
                          </h3>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                attachments: [],
                              }))
                            }
                            className="text-red-600 hover:text-red-700"
                          >
                            Clear All
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {formData.attachments.map((file, index) => (
                            <div
                              key={index}
                              className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start gap-3">
                                {/* File Icon */}
                                <div className="flex-shrink-0">
                                  {file.type.includes("pdf") ? (
                                    <FileText className="h-10 w-10 text-red-500" />
                                  ) : file.type.includes("image") ? (
                                    <FileImage className="h-10 w-10 text-blue-500" />
                                  ) : file.type.includes("sheet") ||
                                    file.type.includes("excel") ? (
                                    <FileSpreadsheet className="h-10 w-10 text-green-500" />
                                  ) : (
                                    <File className="h-10 w-10 text-gray-500" />
                                  )}
                                </div>

                                {/* File Details */}
                                <div className="flex-1 min-w-0">
                                  <p
                                    className="font-medium text-sm truncate"
                                    title={file.name}
                                  >
                                    {file.name}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>

                                {/* Remove Button */}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeAttachment(index)}
                                  className="flex-shrink-0 text-red-500 hover:text-red-700 p-1"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Empty State Message */}
                    {formData.attachments.length === 0 && (
                      <div className="text-center py-8">
                        <File className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No files uploaded yet
                        </h3>
                        <p className="text-gray-600">
                          Upload technical documents, drawings, photos, and
                          other supporting files for this piping asset.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Form Actions - Outside the tabs */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Piping
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewPipingPage;
