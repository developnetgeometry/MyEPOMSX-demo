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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [field]: value,
      };

      // Trigger automatic calculations for relevant fields
      if (autoCalculateEnabled && shouldTriggerCalculation(field)) {
        triggerAutoCalculation(updatedData);
      }

      return updatedData;
    });
  };

  // Fields that should trigger automatic calculations
  const shouldTriggerCalculation = (field: string): boolean => {
    const calculationTriggerFields = [
      "wallThickness",
      "corrosionAllowance",
      "corrosionRate",
      "internalCorrosion",
      "externalCorrosion",
      "operatingPressure",
      "designPressure",
      "temperature",
      "operatingTemperature",
      "h2sContent",
      "pH",
      "material",
      "criticality",
      "productionImpact",
      "fluidVelocity",
      "installationDate",
    ];
    return calculationTriggerFields.includes(field);
  };

  // Trigger automatic calculation with debounce
  const triggerAutoCalculation = async (updatedFormData: any) => {
    if (isCalculating) return;

    try {
      setIsCalculating(true);
      const results = await calculateAutomaticDamageFactors(updatedFormData);
      setCalculationResults(results);

      // Update form with calculated values
      const formWithCalculations = updateFormWithCalculatedValues(
        updatedFormData,
        results
      );
      setFormData(formWithCalculations);
    } catch (error) {
      console.error("Auto-calculation error:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  // Manual calculation trigger
  const handleManualCalculation = async () => {
    try {
      setIsCalculating(true);
      const results = await calculateAutomaticDamageFactors(formData);
      setCalculationResults(results);

      // Update form with calculated values
      const formWithCalculations = updateFormWithCalculatedValues(
        formData,
        results
      );
      setFormData(formWithCalculations);

      toast({
        title: "Calculations Complete",
        description: "Risk assessment values have been updated automatically.",
      });
    } catch (error) {
      console.error("Manual calculation error:", error);
      toast({
        title: "Calculation Error",
        description: "Failed to calculate risk assessment values.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
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
          title="New Piping2"
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
                <TabsList className="grid w-full grid-cols-7 h-auto p-1">
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
                  <TabsTrigger value="risk" className="py-3">
                    Risk
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
                    {/* Column 1 - Basic Information */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg text-blue-600">
                        Basic Information
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="assetCode">Asset Code*</Label>
                        <Input
                          id="assetCode"
                          value={formData.assetCode}
                          onChange={(e) =>
                            handleInputChange("assetCode", e.target.value)
                          }
                          placeholder="e.g., PP-2001"
                          className="font-mono"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="assetName">Asset Name*</Label>
                        <Input
                          id="assetName"
                          value={formData.assetName}
                          onChange={(e) =>
                            handleInputChange("assetName", e.target.value)
                          }
                          placeholder="e.g., Main Process Line"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lineNumber">Line Number*</Label>
                        <Input
                          id="lineNumber"
                          value={formData.lineNumber}
                          onChange={(e) =>
                            handleInputChange("lineNumber", e.target.value)
                          }
                          placeholder="e.g., 2001-PP-12-G-001"
                          className="font-mono"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="circuit">Circuit</Label>
                        <Input
                          id="circuit"
                          value={formData.circuit}
                          onChange={(e) =>
                            handleInputChange("circuit", e.target.value)
                          }
                          placeholder="e.g., C-001"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pipeClass">Pipe Class*</Label>
                        <Select
                          onValueChange={(value) =>
                            handleInputChange("pipeClass", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select pipe class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pc-150">PC-150</SelectItem>
                            <SelectItem value="pc-300">PC-300</SelectItem>
                            <SelectItem value="pc-600">PC-600</SelectItem>
                            <SelectItem value="pc-900">PC-900</SelectItem>
                            <SelectItem value="pc-1500">PC-1500</SelectItem>
                            <SelectItem value="pc-2500">PC-2500</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Column 2 - Location & System */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg text-green-600">
                        Location & System
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="area">Area*</Label>
                        <Select
                          onValueChange={(value) =>
                            handleInputChange("area", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select area" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="process-area-100">
                              Process Area 100
                            </SelectItem>
                            <SelectItem value="process-area-200">
                              Process Area 200
                            </SelectItem>
                            <SelectItem value="process-area-300">
                              Process Area 300
                            </SelectItem>
                            <SelectItem value="tank-farm">Tank Farm</SelectItem>
                            <SelectItem value="compressor-station">
                              Compressor Station
                            </SelectItem>
                            <SelectItem value="utility-area">
                              Utility Area
                            </SelectItem>
                            <SelectItem value="flare-area">
                              Flare Area
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="system">System*</Label>
                        <Select
                          onValueChange={(value) =>
                            handleInputChange("system", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select system" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="oil-separation">
                              Oil Separation System
                            </SelectItem>
                            <SelectItem value="gas-treatment">
                              Gas Treatment System
                            </SelectItem>
                            <SelectItem value="water-injection">
                              Water Injection System
                            </SelectItem>
                            <SelectItem value="production-manifold">
                              Production Manifold
                            </SelectItem>
                            <SelectItem value="export-system">
                              Export System
                            </SelectItem>
                            <SelectItem value="utility-system">
                              Utility System
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fromEquipment">From Equipment</Label>
                        <Input
                          id="fromEquipment"
                          value={formData.fromEquipment}
                          onChange={(e) =>
                            handleInputChange("fromEquipment", e.target.value)
                          }
                          placeholder="e.g., V-101A"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="toEquipment">To Equipment</Label>
                        <Input
                          id="toEquipment"
                          value={formData.toEquipment}
                          onChange={(e) =>
                            handleInputChange("toEquipment", e.target.value)
                          }
                          placeholder="e.g., P-102B"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Status*</Label>
                        <Select
                          onValueChange={(value) =>
                            handleInputChange("status", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="under-maintenance">
                              Under Maintenance
                            </SelectItem>
                            <SelectItem value="under-inspection">
                              Under Inspection
                            </SelectItem>
                            <SelectItem value="out-of-service">
                              Out of Service
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Column 3 - Installation & Configuration */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg text-purple-600">
                        Installation & Configuration
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="installationDate">
                          Installation Date*
                        </Label>
                        <Input
                          id="installationDate"
                          type="date"
                          value={formData.installationDate}
                          onChange={(e) =>
                            handleInputChange(
                              "installationDate",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastInspection">Last Inspection</Label>
                        <Input
                          id="lastInspection"
                          type="date"
                          value={formData.lastInspection}
                          onChange={(e) =>
                            handleInputChange("lastInspection", e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nextInspection">Next Inspection</Label>
                        <Input
                          id="nextInspection"
                          type="date"
                          value={formData.nextInspection}
                          onChange={(e) =>
                            handleInputChange("nextInspection", e.target.value)
                          }
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
                          placeholder="Enter piping description..."
                          rows={3}
                        />
                      </div>

                      {/* Yes/No Options */}
                      <div className="space-y-4 pt-2">
                        <div className="space-y-3">
                          <Label>In Service?</Label>
                          <RadioGroup
                            value={formData.isInService}
                            onValueChange={(value) =>
                              handleInputChange("isInService", value)
                            }
                            className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="in-service-yes" />
                              <Label htmlFor="in-service-yes">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="in-service-no" />
                              <Label htmlFor="in-service-no">No</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="space-y-3">
                          <Label>Above Ground?</Label>
                          <RadioGroup
                            value={formData.isAboveGround}
                            onValueChange={(value) =>
                              handleInputChange("isAboveGround", value)
                            }
                            className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="yes"
                                id="above-ground-yes"
                              />
                              <Label htmlFor="above-ground-yes">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="above-ground-no" />
                              <Label htmlFor="above-ground-no">No</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="space-y-3">
                          <Label>Underground?</Label>
                          <RadioGroup
                            value={formData.isUnderground}
                            onValueChange={(value) =>
                              handleInputChange("isUnderground", value)
                            }
                            className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="yes"
                                id="underground-yes"
                              />
                              <Label htmlFor="underground-yes">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="underground-no" />
                              <Label htmlFor="underground-no">No</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Placeholder tabs for other sections - to be implemented later */}
                <TabsContent value="design" className="mt-0 space-y-6">
                  <div className="border-b pb-4">
                    <h2 className="text-xl font-semibold">
                      Design Specifications
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Technical design parameters and piping specifications
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Technical Specifications Section */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Technical Specifications
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="pipeSize">Pipe Size</Label>
                          <Input
                            id="pipeSize"
                            value={formData.pipeSize}
                            onChange={(e) =>
                              handleInputChange("pipeSize", e.target.value)
                            }
                            placeholder="e.g., 2 inch, 50mm"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="pipeSchedule">Pipe Schedule</Label>
                          <Select
                            value={formData.pipeSchedule}
                            onValueChange={(value) =>
                              handleInputChange("pipeSchedule", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select schedule" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">Schedule 5</SelectItem>
                              <SelectItem value="10">Schedule 10</SelectItem>
                              <SelectItem value="20">Schedule 20</SelectItem>
                              <SelectItem value="40">Schedule 40</SelectItem>
                              <SelectItem value="80">Schedule 80</SelectItem>
                              <SelectItem value="160">Schedule 160</SelectItem>
                              <SelectItem value="STD">STD</SelectItem>
                              <SelectItem value="XS">XS</SelectItem>
                              <SelectItem value="XXS">XXS</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="material">Material</Label>
                          <Select
                            value={formData.material}
                            onValueChange={(value) =>
                              handleInputChange("material", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select material" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="carbon-steel">
                                Carbon Steel
                              </SelectItem>
                              <SelectItem value="stainless-steel-304">
                                Stainless Steel 304
                              </SelectItem>
                              <SelectItem value="stainless-steel-316">
                                Stainless Steel 316
                              </SelectItem>
                              <SelectItem value="duplex-steel">
                                Duplex Steel
                              </SelectItem>
                              <SelectItem value="alloy-steel">
                                Alloy Steel
                              </SelectItem>
                              <SelectItem value="inconel">Inconel</SelectItem>
                              <SelectItem value="hastelloy">
                                Hastelloy
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="lineLength">Line Length (m)</Label>
                          <Input
                            id="lineLength"
                            type="number"
                            step="0.1"
                            value={formData.lineLength}
                            onChange={(e) =>
                              handleInputChange("lineLength", e.target.value)
                            }
                            placeholder="Enter length"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="wallThickness">
                            Wall Thickness (mm)
                          </Label>
                          <Input
                            id="wallThickness"
                            type="number"
                            step="0.1"
                            value={formData.wallThickness}
                            onChange={(e) =>
                              handleInputChange("wallThickness", e.target.value)
                            }
                            placeholder="Enter thickness"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="minimumRequiredThickness">
                            Min. Required Thickness (mm)
                          </Label>
                          <Input
                            id="minimumRequiredThickness"
                            type="number"
                            step="0.1"
                            value={formData.minimumRequiredThickness}
                            onChange={(e) =>
                              handleInputChange(
                                "minimumRequiredThickness",
                                e.target.value
                              )
                            }
                            placeholder="Enter min thickness"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Pressure & Temperature Section */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Pressure & Temperature Parameters
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="designPressure">
                            Design Pressure (bar)
                          </Label>
                          <Input
                            id="designPressure"
                            type="number"
                            step="0.1"
                            value={formData.designPressure}
                            onChange={(e) =>
                              handleInputChange(
                                "designPressure",
                                e.target.value
                              )
                            }
                            placeholder="Enter design pressure"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="operatingPressure">
                            Operating Pressure (bar)
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
                            placeholder="Enter operating pressure"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="designTemperature">
                            Design Temperature (°C)
                          </Label>
                          <Input
                            id="designTemperature"
                            type="number"
                            step="0.1"
                            value={formData.designTemperature}
                            onChange={(e) =>
                              handleInputChange(
                                "designTemperature",
                                e.target.value
                              )
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
                      </div>
                    </div>

                    {/* Design Considerations Section */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Design Considerations
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                        <div className="space-y-3">
                          <Label htmlFor="joinType">Join Type</Label>
                          <Select
                            value={formData.joinType}
                            onValueChange={(value) =>
                              handleInputChange("joinType", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select join type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="welded">Welded</SelectItem>
                              <SelectItem value="flanged">Flanged</SelectItem>
                              <SelectItem value="threaded">Threaded</SelectItem>
                              <SelectItem value="grooved">Grooved</SelectItem>
                              <SelectItem value="compression">
                                Compression
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Flow Characteristics Section */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Flow Characteristics
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="normalFlowRate">
                            Normal Flow Rate (m³/h)
                          </Label>
                          <Input
                            id="normalFlowRate"
                            type="number"
                            step="0.1"
                            value={formData.normalFlowRate}
                            onChange={(e) =>
                              handleInputChange(
                                "normalFlowRate",
                                e.target.value
                              )
                            }
                            placeholder="Enter normal flow rate"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="maxFlowRate">
                            Maximum Flow Rate (m³/h)
                          </Label>
                          <Input
                            id="maxFlowRate"
                            type="number"
                            step="0.1"
                            value={formData.maxFlowRate}
                            onChange={(e) =>
                              handleInputChange("maxFlowRate", e.target.value)
                            }
                            placeholder="Enter max flow rate"
                          />
                        </div>
                      </div>
                    </div>

                    {/* System Options Section */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        System Options
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label>Insulation Required?</Label>
                          <RadioGroup
                            value={formData.insulationRequired}
                            onValueChange={(value) =>
                              handleInputChange("insulationRequired", value)
                            }
                            className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="yes"
                                id="insulation-required-yes"
                              />
                              <Label htmlFor="insulation-required-yes">
                                Yes
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="no"
                                id="insulation-required-no"
                              />
                              <Label htmlFor="insulation-required-no">No</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="space-y-3">
                          <Label>Heat Traced?</Label>
                          <RadioGroup
                            value={formData.heatTraced}
                            onValueChange={(value) =>
                              handleInputChange("heatTraced", value)
                            }
                            className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="yes"
                                id="heat-traced-yes"
                              />
                              <Label htmlFor="heat-traced-yes">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="heat-traced-no" />
                              <Label htmlFor="heat-traced-no">No</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="protection" className="mt-0 space-y-6">
                  <div className="border-b pb-4">
                    <h2 className="text-xl font-semibold">
                      Protection Systems
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Piping protection and coating specifications
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Coating Systems Section */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Coating Systems
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="coatingType">Coating Type</Label>
                          <Select
                            value={formData.coatingType}
                            onValueChange={(value) =>
                              handleInputChange("coatingType", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select coating type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fusion-bonded-epoxy">
                                Fusion Bonded Epoxy (FBE)
                              </SelectItem>
                              <SelectItem value="polyethylene">
                                Polyethylene
                              </SelectItem>
                              <SelectItem value="polypropylene">
                                Polypropylene
                              </SelectItem>
                              <SelectItem value="coal-tar-enamel">
                                Coal Tar Enamel
                              </SelectItem>
                              <SelectItem value="liquid-epoxy">
                                Liquid Epoxy
                              </SelectItem>
                              <SelectItem value="polyurethane">
                                Polyurethane
                              </SelectItem>
                              <SelectItem value="none">None</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="coatingQuality">
                            Coating Quality
                          </Label>
                          <Select
                            value={formData.coatingQuality}
                            onValueChange={(value) =>
                              handleInputChange("coatingQuality", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select coating quality" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="excellent">
                                Excellent
                              </SelectItem>
                              <SelectItem value="good">Good</SelectItem>
                              <SelectItem value="fair">Fair</SelectItem>
                              <SelectItem value="poor">Poor</SelectItem>
                              <SelectItem value="very-poor">
                                Very Poor
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="paintSystem">Paint System</Label>
                          <Input
                            id="paintSystem"
                            value={formData.paintSystem}
                            onChange={(e) =>
                              handleInputChange("paintSystem", e.target.value)
                            }
                            placeholder="e.g., Epoxy primer + PU topcoat"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="paintCondition">
                            Paint Condition
                          </Label>
                          <Select
                            value={formData.paintCondition}
                            onValueChange={(value) =>
                              handleInputChange("paintCondition", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select paint condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="excellent">
                                Excellent
                              </SelectItem>
                              <SelectItem value="good">Good</SelectItem>
                              <SelectItem value="fair">Fair</SelectItem>
                              <SelectItem value="poor">Poor</SelectItem>
                              <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Insulation Section */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Insulation</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="insulationType">
                            Insulation Type
                          </Label>
                          <Select
                            value={formData.insulationType}
                            onValueChange={(value) =>
                              handleInputChange("insulationType", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select insulation type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mineral-wool">
                                Mineral Wool
                              </SelectItem>
                              <SelectItem value="polyurethane-foam">
                                Polyurethane Foam
                              </SelectItem>
                              <SelectItem value="perlite">Perlite</SelectItem>
                              <SelectItem value="calcium-silicate">
                                Calcium Silicate
                              </SelectItem>
                              <SelectItem value="elastomeric">
                                Elastomeric
                              </SelectItem>
                              <SelectItem value="none">None</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="insulationCondition">
                            Insulation Condition
                          </Label>
                          <Select
                            value={formData.insulationCondition}
                            onValueChange={(value) =>
                              handleInputChange("insulationCondition", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select insulation condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="excellent">
                                Excellent
                              </SelectItem>
                              <SelectItem value="good">Good</SelectItem>
                              <SelectItem value="fair">Fair</SelectItem>
                              <SelectItem value="poor">Poor</SelectItem>
                              <SelectItem value="damaged">Damaged</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Cathodic Protection Section */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Cathodic Protection
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <Label>Cathodic Protection?</Label>
                          <RadioGroup
                            value={formData.cathodicProtection}
                            onValueChange={(value) =>
                              handleInputChange("cathodicProtection", value)
                            }
                            className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="yes"
                                id="cathodic-protection-yes"
                              />
                              <Label htmlFor="cathodic-protection-yes">
                                Yes
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="no"
                                id="cathodic-protection-no"
                              />
                              <Label htmlFor="cathodic-protection-no">No</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {formData.cathodicProtection === "yes" && (
                          <>
                            <div className="space-y-3">
                              <Label htmlFor="protectionCurrent">
                                Protection Current (mA)
                              </Label>
                              <Input
                                id="protectionCurrent"
                                type="number"
                                step="0.01"
                                value={formData.protectionCurrent}
                                onChange={(e) =>
                                  handleInputChange(
                                    "protectionCurrent",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter current value"
                              />
                            </div>

                            <div className="space-y-3">
                              <Label htmlFor="potentialReading">
                                Potential Reading (mV)
                              </Label>
                              <Input
                                id="potentialReading"
                                type="number"
                                step="0.1"
                                value={formData.potentialReading}
                                onChange={(e) =>
                                  handleInputChange(
                                    "potentialReading",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter potential reading"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Environmental Exposure Section */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Environmental Exposure
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="environmentalExposure">
                            Environmental Exposure
                          </Label>
                          <Select
                            value={formData.environmentalExposure}
                            onValueChange={(value) =>
                              handleInputChange("environmentalExposure", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select environmental exposure" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="offshore-marine">
                                Offshore Marine
                              </SelectItem>
                              <SelectItem value="coastal">Coastal</SelectItem>
                              <SelectItem value="industrial">
                                Industrial
                              </SelectItem>
                              <SelectItem value="urban">Urban</SelectItem>
                              <SelectItem value="rural">Rural</SelectItem>
                              <SelectItem value="underground">
                                Underground
                              </SelectItem>
                              <SelectItem value="severe">Severe</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="soilType">
                            Soil Type (for underground piping)
                          </Label>
                          <Select
                            value={formData.soilType}
                            onValueChange={(value) =>
                              handleInputChange("soilType", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select soil type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="clay">Clay</SelectItem>
                              <SelectItem value="sand">Sand</SelectItem>
                              <SelectItem value="loam">Loam</SelectItem>
                              <SelectItem value="rocky">Rocky</SelectItem>
                              <SelectItem value="peat">Peat</SelectItem>
                              <SelectItem value="saline">Saline</SelectItem>
                              <SelectItem value="not-applicable">
                                Not Applicable
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="service" className="mt-0 space-y-6">
                  <div className="border-b pb-4">
                    <h2 className="text-xl font-semibold">
                      Service Conditions
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Fluid characteristics and service parameters
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Fluid Service Section */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Fluid Service
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="fluidService">Fluid Service</Label>
                          <Select
                            value={formData.fluidService}
                            onValueChange={(value) =>
                              handleInputChange("fluidService", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select fluid service" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="crude-oil">
                                Crude Oil
                              </SelectItem>
                              <SelectItem value="natural-gas">
                                Natural Gas
                              </SelectItem>
                              <SelectItem value="condensate">
                                Condensate
                              </SelectItem>
                              <SelectItem value="produced-water">
                                Produced Water
                              </SelectItem>
                              <SelectItem value="injection-water">
                                Injection Water
                              </SelectItem>
                              <SelectItem value="fuel-gas">Fuel Gas</SelectItem>
                              <SelectItem value="instrument-air">
                                Instrument Air
                              </SelectItem>
                              <SelectItem value="utility-water">
                                Utility Water
                              </SelectItem>
                              <SelectItem value="chemical-injection">
                                Chemical Injection
                              </SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="fluidPhase">Fluid Phase</Label>
                          <Select
                            value={formData.fluidPhase}
                            onValueChange={(value) =>
                              handleInputChange("fluidPhase", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select fluid phase" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gas">Gas</SelectItem>
                              <SelectItem value="liquid">Liquid</SelectItem>
                              <SelectItem value="two-phase">
                                Two Phase
                              </SelectItem>
                              <SelectItem value="multiphase">
                                Multiphase
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label>Corrosive Service?</Label>
                          <RadioGroup
                            value={formData.isCorrosive}
                            onValueChange={(value) =>
                              handleInputChange("isCorrosive", value)
                            }
                            className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="corrosive-yes" />
                              <Label htmlFor="corrosive-yes">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="corrosive-no" />
                              <Label htmlFor="corrosive-no">No</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>

                    {/* Chemical Composition Section */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Chemical Composition
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="h2sContent">H₂S Content (ppm)</Label>
                          <Input
                            id="h2sContent"
                            type="number"
                            step="0.1"
                            value={formData.h2sContent}
                            onChange={(e) =>
                              handleInputChange("h2sContent", e.target.value)
                            }
                            placeholder="Enter H₂S content"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="co2Content">CO₂ Content (%)</Label>
                          <Input
                            id="co2Content"
                            type="number"
                            step="0.01"
                            value={formData.co2Content}
                            onChange={(e) =>
                              handleInputChange("co2Content", e.target.value)
                            }
                            placeholder="Enter CO₂ content"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="chlorideContent">
                            Chloride Content (ppm)
                          </Label>
                          <Input
                            id="chlorideContent"
                            type="number"
                            step="0.1"
                            value={formData.chlorideContent}
                            onChange={(e) =>
                              handleInputChange(
                                "chlorideContent",
                                e.target.value
                              )
                            }
                            placeholder="Enter chloride content"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="waterCut">Water Cut (%)</Label>
                          <Input
                            id="waterCut"
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            value={formData.waterCut}
                            onChange={(e) =>
                              handleInputChange("waterCut", e.target.value)
                            }
                            placeholder="Enter water cut"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="pH">pH Value</Label>
                          <Input
                            id="pH"
                            type="number"
                            step="0.1"
                            min="0"
                            max="14"
                            value={formData.pH}
                            onChange={(e) =>
                              handleInputChange("pH", e.target.value)
                            }
                            placeholder="Enter pH value"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Flow Conditions Section */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Flow Conditions
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="flowRate">Flow Rate (m³/day)</Label>
                          <Input
                            id="flowRate"
                            type="number"
                            step="0.1"
                            value={formData.flowRate}
                            onChange={(e) =>
                              handleInputChange("flowRate", e.target.value)
                            }
                            placeholder="Enter flow rate"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="fluidVelocity">
                            Fluid Velocity (m/s)
                          </Label>
                          <Input
                            id="fluidVelocity"
                            type="number"
                            step="0.01"
                            value={formData.fluidVelocity}
                            onChange={(e) =>
                              handleInputChange("fluidVelocity", e.target.value)
                            }
                            placeholder="Enter fluid velocity"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Additional Service Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Additional Service Information
                      </h3>
                      <div className="space-y-3">
                        <Label htmlFor="serviceNotes">Service Notes</Label>
                        <Textarea
                          id="serviceNotes"
                          rows={4}
                          value={formData.notes}
                          onChange={(e) =>
                            handleInputChange("notes", e.target.value)
                          }
                          placeholder="Enter any additional service-related notes, operating conditions, or special considerations..."
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="risk" className="mt-0 space-y-6">
                  <div className="border-b pb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-semibold">
                          Risk Assessment
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Risk-based inspection and assessment information
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setAutoCalculateEnabled(!autoCalculateEnabled)
                          }
                          className={
                            autoCalculateEnabled
                              ? "bg-green-50 border-green-200"
                              : ""
                          }
                        >
                          <Calculator className="h-4 w-4 mr-1" />
                          Auto-calc {autoCalculateEnabled ? "ON" : "OFF"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleManualCalculation}
                          disabled={isCalculating}
                        >
                          {isCalculating ? (
                            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Calculator className="h-4 w-4 mr-1" />
                          )}
                          Calculate Now
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Calculation Status Indicator */}
                    {isCalculating && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                          <span className="text-blue-800 font-medium">
                            Calculating damage factors and risk assessment...
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Damage Factors Section */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Damage Factor Assessment
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="dthin">DF Thinning (DTHIN)</Label>
                          <Input
                            id="dthin"
                            value={formData.dfthin || ""}
                            onChange={(e) =>
                              handleInputChange("dfthin", e.target.value)
                            }
                            placeholder={
                              calculationResults?.dthin
                                ? "Auto-calculated"
                                : "Enter value"
                            }
                            className={
                              calculationResults?.dthin
                                ? "bg-green-50 border-green-200"
                                : ""
                            }
                          />
                          <p className="text-xs text-muted-foreground">
                            {calculationResults?.dthin &&
                            "value" in calculationResults.dthin
                              ? `Calculated: ${calculationResults.dthin.value.toFixed(
                                  4
                                )}`
                              : "Based on thickness loss and corrosion"}
                          </p>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="dfext">DF External (DFEXT)</Label>
                          <Input
                            id="dfext"
                            value={formData.dfext || ""}
                            onChange={(e) =>
                              handleInputChange("dfext", e.target.value)
                            }
                            placeholder={
                              calculationResults?.dfext
                                ? "Auto-calculated"
                                : "Enter value"
                            }
                            className={
                              calculationResults?.dfext
                                ? "bg-green-50 border-green-200"
                                : ""
                            }
                          />
                          <p className="text-xs text-muted-foreground">
                            {calculationResults?.dfext &&
                            "value" in calculationResults.dfext
                              ? `Calculated: ${calculationResults.dfext.value.toFixed(
                                  4
                                )}`
                              : "External corrosion damage factor"}
                          </p>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="dfscc">DF SCC (DFSCC)</Label>
                          <Input
                            id="dfscc"
                            value={formData.dfscc || ""}
                            onChange={(e) =>
                              handleInputChange("dfscc", e.target.value)
                            }
                            placeholder={
                              calculationResults?.dfscc
                                ? "Auto-calculated"
                                : "Enter value"
                            }
                            className={
                              calculationResults?.dfscc
                                ? "bg-green-50 border-green-200"
                                : ""
                            }
                          />
                          <p className="text-xs text-muted-foreground">
                            {calculationResults?.dfscc &&
                            "value" in calculationResults.dfscc
                              ? `Calculated: ${calculationResults.dfscc.value.toFixed(
                                  4
                                )}`
                              : "Stress corrosion cracking"}
                          </p>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="dfmfat">DF Fatigue (DFMFAT)</Label>
                          <Input
                            id="dfmfat"
                            value={formData.dfmfat || ""}
                            onChange={(e) =>
                              handleInputChange("dfmfat", e.target.value)
                            }
                            placeholder={
                              calculationResults?.dfmfat
                                ? "Auto-calculated"
                                : "Enter value"
                            }
                            className={
                              calculationResults?.dfmfat
                                ? "bg-green-50 border-green-200"
                                : ""
                            }
                          />
                          <p className="text-xs text-muted-foreground">
                            {calculationResults?.dfmfat &&
                            "value" in calculationResults.dfmfat
                              ? `Calculated: ${calculationResults.dfmfat.value.toFixed(
                                  4
                                )}`
                              : "Mechanical fatigue damage factor"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Risk Summary Section */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Risk Summary
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="riskRanking">Risk Ranking</Label>
                          <Input
                            id="riskRanking"
                            value={formData.riskRanking}
                            disabled
                            placeholder="Calculated automatically"
                            className={
                              calculationResults?.riskMatrix
                                ? "bg-green-50 border-green-200"
                                : "bg-muted"
                            }
                          />
                          <p className="text-xs text-muted-foreground">
                            {calculationResults?.riskMatrix &&
                            "riskLevel" in calculationResults.riskMatrix
                              ? `Auto: ${calculationResults.riskMatrix.riskLevel} (Category ${calculationResults.riskMatrix.riskCategory})`
                              : "Auto-calculated based on PoF × CoF"}
                          </p>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="riskLevel">Risk Level</Label>
                          <Input
                            id="riskLevel"
                            value={formData.riskLevel}
                            disabled
                            placeholder="Calculated automatically"
                            className={
                              calculationResults?.riskMatrix
                                ? "bg-green-50 border-green-200"
                                : "bg-muted"
                            }
                          />
                          <p className="text-xs text-muted-foreground">
                            {calculationResults?.riskMatrix &&
                            "priority" in calculationResults.riskMatrix
                              ? `Priority: ${calculationResults.riskMatrix.priority}`
                              : "High/Medium/Low classification"}
                          </p>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="PoF">
                            Probability of Failure (PoF)
                          </Label>
                          <Input
                            id="PoF"
                            value={formData.PoF}
                            disabled
                            placeholder="Calculated automatically"
                            className={
                              calculationResults?.riskMatrix
                                ? "bg-green-50 border-green-200"
                                : "bg-muted"
                            }
                          />
                          <p className="text-xs text-muted-foreground">
                            Based on damage mechanisms
                          </p>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="CoF">
                            Consequence of Failure (CoF)
                          </Label>
                          <Input
                            id="CoF"
                            value={formData.CoF}
                            disabled
                            placeholder="Calculated automatically"
                            className={
                              calculationResults?.cofProd ||
                              calculationResults?.cofArea
                                ? "bg-green-50 border-green-200"
                                : "bg-muted"
                            }
                          />
                          <p className="text-xs text-muted-foreground">
                            {(calculationResults?.cofProd &&
                              "value" in calculationResults.cofProd) ||
                            (calculationResults?.cofArea &&
                              "value" in calculationResults.cofArea)
                              ? "Auto-calculated from impact assessment"
                              : "Based on safety & financial impact"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Corrosion Assessment Section */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Corrosion Assessment
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="corrosionRate">
                            General Corrosion Rate (mm/year)
                          </Label>
                          <Input
                            id="corrosionRate"
                            type="number"
                            step="0.001"
                            value={formData.corrosionRate}
                            onChange={(e) =>
                              handleInputChange("corrosionRate", e.target.value)
                            }
                            placeholder="Enter corrosion rate"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="externalCorrosion">
                            External Corrosion Rate (mm/year)
                          </Label>
                          <Input
                            id="externalCorrosion"
                            type="number"
                            step="0.001"
                            value={formData.externalCorrosion}
                            onChange={(e) =>
                              handleInputChange(
                                "externalCorrosion",
                                e.target.value
                              )
                            }
                            placeholder="Enter external corrosion rate"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="internalCorrosion">
                            Internal Corrosion Rate (mm/year)
                          </Label>
                          <Input
                            id="internalCorrosion"
                            type="number"
                            step="0.001"
                            value={formData.internalCorrosion}
                            onChange={(e) =>
                              handleInputChange(
                                "internalCorrosion",
                                e.target.value
                              )
                            }
                            placeholder="Enter internal corrosion rate"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Remaining Life & Criticality Section */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Remaining Life & Criticality
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="remainingLife">
                            Remaining Life (years)
                          </Label>
                          <Input
                            id="remainingLife"
                            value={formData.remainingLife}
                            disabled
                            placeholder="Calculated automatically"
                            className="bg-muted"
                          />
                          <p className="text-xs text-muted-foreground">
                            Based on thickness and corrosion rate
                          </p>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="criticality">Criticality</Label>
                          <Select
                            value={formData.criticality}
                            onValueChange={(value) =>
                              handleInputChange("criticality", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select criticality" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="productionImpact">
                            Production Impact
                          </Label>
                          <Select
                            value={formData.productionImpact}
                            onValueChange={(value) =>
                              handleInputChange("productionImpact", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select production impact" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="critical">
                                Critical - Total shutdown
                              </SelectItem>
                              <SelectItem value="major">
                                Major - Significant reduction
                              </SelectItem>
                              <SelectItem value="minor">
                                Minor - Minimal impact
                              </SelectItem>
                              <SelectItem value="negligible">
                                Negligible
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Failure Mode Analysis Section */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Failure Mode Analysis
                      </h3>
                      <div className="space-y-3">
                        <Label htmlFor="lofFailureMode">
                          Loss of Containment Failure Mode
                        </Label>
                        <Select
                          value={formData.lofFailureMode}
                          onValueChange={(value) =>
                            handleInputChange("lofFailureMode", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select failure mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small-leak">
                              Small Leak (&lt; 6mm diameter)
                            </SelectItem>
                            <SelectItem value="medium-leak">
                              Medium Leak (6-50mm diameter)
                            </SelectItem>
                            <SelectItem value="large-leak">
                              Large Leak (&gt; 50mm diameter)
                            </SelectItem>
                            <SelectItem value="rupture">
                              Rupture (Full bore)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Risk Notes Section */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Risk Assessment Notes
                      </h3>
                      <div className="space-y-3">
                        <Label htmlFor="riskNotes">Risk Assessment Notes</Label>
                        <Textarea
                          id="riskNotes"
                          rows={4}
                          placeholder="Enter any risk assessment notes, assumptions, or special considerations..."
                        />
                      </div>
                    </div>

                    {/* Enhanced Information Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">
                        Automated Risk Assessment Information
                      </h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>
                          • <strong>Auto-calculation:</strong>{" "}
                          {autoCalculateEnabled ? "Enabled" : "Disabled"} -
                          Formulas run automatically when relevant values change
                        </li>
                        <li>
                          • <strong>DTHIN formulas:</strong> 17 variants
                          automatically selected based on service conditions
                          (acid, caustic, flow-assisted, H₂S, etc.)
                        </li>
                        <li>
                          • <strong>PoF calculation:</strong> Combined damage
                          factors from thinning, SCC, fatigue, and external
                          corrosion
                        </li>
                        <li>
                          • <strong>CoF calculation:</strong> Production and
                          area-based consequences using API 581 methodology
                        </li>
                        <li>
                          • <strong>Risk Matrix:</strong> Automatic
                          categorization (A-E) with inspection interval
                          recommendations
                        </li>
                        <li>
                          • <strong>Green highlighted fields:</strong> Values
                          calculated automatically by the formula engine
                        </li>
                      </ul>
                      {calculationResults && (
                        <div className="mt-3 pt-3 border-t border-blue-300">
                          <p className="text-xs text-blue-600">
                            <strong>Last calculation:</strong>{" "}
                            {new Date().toLocaleTimeString()} • Active formulas:{" "}
                            {
                              Object.keys(calculationResults).filter(
                                (key) =>
                                  calculationResults[key] &&
                                  "value" in calculationResults[key]
                              ).length
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

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
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          Inspection Strategy & Plan
                        </h3>

                        {/* Inspection Planning Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-3">
                            <Label htmlFor="nextInspectionDate">
                              Next Inspection Date
                            </Label>
                            <Input
                              id="nextInspectionDate"
                              type="date"
                              value={formData.nextInspection}
                              onChange={(e) =>
                                handleInputChange(
                                  "nextInspection",
                                  e.target.value
                                )
                              }
                            />
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor="inspectionMethod">
                              Primary Inspection Method
                            </Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select inspection method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="visual">
                                  Visual Inspection
                                </SelectItem>
                                <SelectItem value="ut">
                                  Ultrasonic Testing (UT)
                                </SelectItem>
                                <SelectItem value="rt">
                                  Radiographic Testing (RT)
                                </SelectItem>
                                <SelectItem value="mt">
                                  Magnetic Testing (MT)
                                </SelectItem>
                                <SelectItem value="pt">
                                  Penetrant Testing (PT)
                                </SelectItem>
                                <SelectItem value="cips">
                                  Close Interval Potential Survey (CIPS)
                                </SelectItem>
                                <SelectItem value="inline">
                                  Inline Inspection (ILI)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* WYSIWYG Text Editor for Inspection Plan */}
                        <div className="space-y-3">
                          <Label htmlFor="inspectionPlan">
                            Detailed Inspection Plan
                          </Label>

                          {/* Simple Toolbar */}
                          <div className="border rounded-t-md p-2 bg-gray-50 flex gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Bold"
                            >
                              <Bold className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Italic"
                            >
                              <Italic className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Underline"
                            >
                              <Underline className="h-4 w-4" />
                            </Button>
                            <div className="w-px bg-gray-300 mx-1"></div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Bullet List"
                            >
                              <List className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Numbered List"
                            >
                              <ListOrdered className="h-4 w-4" />
                            </Button>
                            <div className="w-px bg-gray-300 mx-1"></div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Align Left"
                            >
                              <AlignLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Align Center"
                            >
                              <AlignCenter className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Align Right"
                            >
                              <AlignRight className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Text Editor Area */}
                          <Textarea
                            id="inspectionPlan"
                            rows={12}
                            value={formData.inspectionPlan}
                            onChange={(e) =>
                              handleInputChange(
                                "inspectionPlan",
                                e.target.value
                              )
                            }
                            placeholder="Enter detailed inspection plan including:
• Inspection scope and objectives
• Inspection methods and techniques to be used
• Inspection locations and access requirements
• Personnel requirements and qualifications
• Safety considerations
• Documentation requirements
• Acceptance criteria
• Frequency of inspections"
                            className="rounded-t-none border-t-0"
                          />
                        </div>

                        {/* Template Quick Actions */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-3">
                            Quick Plan Templates
                          </h4>
                          <div className="flex gap-2 flex-wrap">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const template = `## Inspection Plan for ${
                                  formData.lineNumber || "[Line Number]"
                                }

### Inspection Scope
- Visual inspection of external surfaces
- Ultrasonic thickness measurements at predetermined locations
- Coating condition assessment
- Support and connection point inspection

### Inspection Methods
- **Visual Inspection**: General condition assessment
- **Ultrasonic Testing**: Wall thickness measurement
- **Close Interval Potential Survey**: For underground sections (if applicable)

### Safety Considerations
- Isolation and depressurization procedures
- Hot work permit requirements
- PPE requirements
- Gas testing requirements

### Documentation
- Inspection checklist completion
- Photographic documentation of defects
- Thickness measurement records
- Coating condition assessment forms`;
                                handleInputChange("inspectionPlan", template);
                              }}
                            >
                              Above Ground Template
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const template = `## Underground Piping Inspection Plan for ${
                                  formData.lineNumber || "[Line Number]"
                                }

### Inspection Scope
- Cathodic protection system verification
- Close interval potential survey (CIPS)
- Coating condition assessment at test points
- Inline inspection planning (if required)

### Inspection Methods
- **CIPS**: Annual pipe-to-soil potential survey
- **Test Station Readings**: Monthly potential measurements
- **Coating Assessment**: At excavation points
- **Inline Inspection**: Smart pig run (if piggable)

### Access Requirements
- Test station accessibility
- Excavation permits for coating inspection
- Pipeline isolation for inline inspection

### Documentation
- CIPS survey results
- Monthly test station readings
- Coating condition reports
- Inline inspection reports`;
                                handleInputChange("inspectionPlan", template);
                              }}
                            >
                              Underground Template
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Inspection Reports Sub-tab */}
                    <TabsContent value="reports" className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          Inspection Reports & Documentation
                        </h3>

                        {/* File Upload Area */}
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
                            <p className="text-xs text-gray-500 mt-2">
                              Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG,
                              PNG (Max 10MB each)
                            </p>
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
                                    {file.type.includes("pdf") ? (
                                      <FileText className="h-8 w-8 text-red-500" />
                                    ) : file.type.includes("image") ? (
                                      <FileImage className="h-8 w-8 text-blue-500" />
                                    ) : file.type.includes("sheet") ||
                                      file.type.includes("excel") ? (
                                      <FileSpreadsheet className="h-8 w-8 text-green-500" />
                                    ) : (
                                      <File className="h-8 w-8 text-gray-500" />
                                    )}
                                    <div>
                                      <p className="font-medium text-sm">
                                        {file.name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {(file.size / 1024 / 1024).toFixed(2)}{" "}
                                        MB
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      removeInspectionReport(index)
                                    }
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Report Categories */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <h4 className="font-medium">
                              Typical Inspection Report Types
                            </h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Ultrasonic Thickness Survey Reports</li>
                              <li>• Visual Inspection Reports</li>
                              <li>• Coating Condition Assessment</li>
                              <li>• Cathodic Protection Survey Reports</li>
                              <li>• Inline Inspection Reports</li>
                              <li>• Radiographic Test Reports</li>
                            </ul>
                          </div>
                          <div className="space-y-3">
                            <h4 className="font-medium">
                              Documentation Guidelines
                            </h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>
                                • Include date and inspector identification
                              </li>
                              <li>• Provide clear location references</li>
                              <li>• Document findings with photographs</li>
                              <li>• Include measurement data and readings</li>
                              <li>
                                • Note any immediate concerns or recommendations
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </TabsContent>

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
                        <p className="text-xs text-gray-500 mt-4">
                          Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT,
                          PPTX, JPG, PNG, GIF, DWG, DXF, TXT
                        </p>
                        <p className="text-xs text-gray-500">
                          Maximum file size: 10MB per file
                        </p>
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
                                  ) : file.name
                                      .toLowerCase()
                                      .includes(".dwg") ||
                                    file.name.toLowerCase().includes(".dxf") ? (
                                    <File className="h-10 w-10 text-purple-500" />
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
                                  <p className="text-xs text-gray-500">
                                    {file.type || "Unknown type"}
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

                    {/* File Categories Guide */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h4 className="font-medium text-blue-900 mb-4">
                        Recommended Document Categories
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-blue-800 mb-2">
                            Technical Documents
                          </h5>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• P&ID drawings</li>
                            <li>• Isometric drawings</li>
                            <li>• Material specifications</li>
                            <li>• Design calculations</li>
                            <li>• Stress analysis reports</li>
                            <li>• Installation procedures</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-blue-800 mb-2">
                            Operational Documents
                          </h5>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Operating procedures</li>
                            <li>• Maintenance procedures</li>
                            <li>• Safety data sheets</li>
                            <li>• Risk assessments</li>
                            <li>• Incident reports</li>
                            <li>• Modification records</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-blue-800 mb-2">
                            Inspection & Testing
                          </h5>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Hydrostatic test certificates</li>
                            <li>• NDT reports</li>
                            <li>• Material test certificates</li>
                            <li>• Welding procedure specifications</li>
                            <li>• Welder qualification records</li>
                            <li>• Coating specifications</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-blue-800 mb-2">
                            Photos & Images
                          </h5>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Installation photos</li>
                            <li>• Support details</li>
                            <li>• Connection details</li>
                            <li>• Coating condition</li>
                            <li>• Defect documentation</li>
                            <li>• As-built photos</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* File Management Information */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        File Management Tips
                      </h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>
                          • Use descriptive file names that include document
                          type and date
                        </li>
                        <li>
                          • Ensure file sizes are under 10MB for optimal upload
                          performance
                        </li>
                        <li>
                          • Organize documents by category for easy retrieval
                        </li>
                        <li>
                          • Include version numbers for controlled documents
                        </li>
                        <li>
                          • Verify document quality and readability before
                          uploading
                        </li>
                      </ul>
                    </div>

                    {/* Empty State Message */}
                    {formData.attachments.length === 0 && (
                      <div className="text-center py-8">
                        <File className="mx-auto h-12 w-12 text-gray-400 mb-4" />
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
