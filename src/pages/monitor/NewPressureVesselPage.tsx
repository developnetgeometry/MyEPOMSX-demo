/**
 * NEW PRESSURE VESSEL PAGE - INTEGRITY MANAGEMENT SYSTEM
 *
 * DATABASE MAPPING IMPLEMENTATION:
 * ================================
 *
 * PRIMARY TABLE: i_ims_general
 * - Stores main pressure vessel data from General, Design, Protection, Service, and Risk tabs
 * - Key field mappings:
 *   • asset_detail_id (from e_asset selection)
 *   • year_in_service (yyyy-mm-dd format)
 *   • material_construction_id (from material selection)
 *   • nominal_bore_diameter (mapped from nominalThickness input)
 *   • ims_asset_type_id = 1 (auto-set for Pressure Vessel)
 *   • Boolean fields: insulation, line_h2s, internal_lining, pwht, cladding
 *
 * FILE UPLOAD SYSTEM:
 * ==================
 *
 * BUCKET STRUCTURE: integrity/pressure-vessel/{id}/
 * - Reports: integrity/pressure-vessel/{id}/reports/
 * - Attachments: integrity/pressure-vessel/{id}/attachments/
 *
 * INSPECTION REPORTS TABLE: i_inspection_attachment
 * - asset_detail_id (links to i_ims_general.id)
 * - file_path, file_name, file_size, uploaded_at
 *
 * GENERAL ATTACHMENTS TABLE: i_ims_attachment
 * - asset_detail_id (links to i_ims_general.id)
 * - file_path, file_name, file_size, uploaded_at
 *
 * IMPLEMENTATION STATUS:
 * =====================
 * ✅ Form structure cleaned and mapped to i_ims_general table
 * ✅ HandleSubmit function updated with proper field mappings
 * ✅ File upload system designed with correct bucket structure
 * ✅ Database insertion logic prepared (commented TODOs)
 * 🔄 Pending: Replace TODO comments with actual Supabase integration
 * 🔄 Pending: Risk tab enhancement with proper calculations
 *
 * NOTES:
 * ======
 * - nominalThickness field maps to nominal_bore_diameter in database
 * - Radio button "yes/no" values converted to boolean for database
 * - File paths stored in database (not full URLs)
 * - Equipment Tag, Area, System are reference-only fields from related tables
 */

import React, { useState } from "react";
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
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useAssetTagOptions,
  useAssetWithComponentTypeOptions,
} from "@/hooks/queries/useAssetDropdownOptions";
import { useMaterialConstructionOptions } from "@/hooks/queries/useCorrosionDropdownOptions";
import { supabase } from "@/lib/supabaseClient";

const NewPressureVesselPage: React.FC = () => {
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

  // Form data structure mapped to i_ims_general table
  const [formData, setFormData] = useState({
    // General Tab - Maps directly to i_ims_general table columns
    asset: "", // asset_detail_id - from e_asset table, store the id
    equipmentTag: "", // reference only (from e_asset_detail)
    equipmentType: "Pressure Vessel", // fixed value for display
    componentType: "", // reference only (from e_asset_detail)
    area: "", // reference only (from e_asset)
    system: "", // reference only (from e_asset)
    yearInService: "", // year_in_service - store as yyyy-mm-dd format
    materialConstruction: "", // material_construction_id - from selecting Material Construction, store the id
    tmin: "", // tmin - from input Tmin (mm) under general tab
    description: "", // description - from input Description under general tab
    nominalThickness: "", // nominal_bore_diameter - from input Nominal Thickness (mm) under general tab
    insulation: "", // insulation - from radio button Insulation value (yes/no)
    h2s: "", // line_h2s - from radio button H2S value (yes/no)
    internalLining: "", // internal_lining - from radio button Internal Lining value (yes/no)
    pwht: "", // pwht - from radio button PWHT value (yes/no)
    cladding: "", // cladding - from radio button Cladding value (yes/no)
    innerDiameter: "", // inner_diameter - from input Inner Diameter (mm) under general tab
    cladThickness: "", // clad_thickness - from input Clad Thickness (mm) under general tab
    // ims_asset_type_id - automatically set to 1 for Pressure Vessel, 2 for Piping

    // Design Tab
    outerDiameter: "", // mm
    length: "", // mm
    weldJoinEfficiency: "", // unitless
    designTemperature: "", // Degree Celsius
    operatingTemperature: "", // Degree Celsius
    designPressure: "", // MPa
    operatingPressure: "", // MPa
    allowableStress: "", // MPa
    corrosionAllowance: "", // mm
    extEnv: "", // dropdown/text
    geometry: "", // dropdown/text
    pipeSupport: "", // Yes or No
    soilWaterInterface: "", // Yes or No
    deadleg: "", // Yes or No
    mixpoint: "", // Yes or No

    // Protection Tab
    coatingQuality: "", // from e_coating_quality table
    insulationType: "", // from e_insulation_type table
    insulationComplexity: "", // from i_insulation_complexity table
    insulationCondition: "", // input
    designFabrication: "", // from e_design_fabrication table
    interface: "", // from e_interface table
    liningType: "", // input
    liningCondition: "", // input
    liningMonitoring: "", // input
    onlineMonitor: "", // from e_online_monitor table

    // Service Tab
    fluidRepresentative: "", // from e_fluid_representative table
    toxicity: "", // from e_toxicity table
    fluidPhase: "", // from e_fluid_phase table
    toxicMassFraction: "", // input form

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

  // Allowable stress calculation function based on material construction
  const calculateAllowableStress = (materialConstruction: string): string => {
    const materialStressMapping: { [key: string]: number } = {
      "carbon-steel-a516-gr70": 138.0, // MPa
      "stainless-steel-304l": 137.9, // MPa
      "stainless-steel-316l": 137.9, // MPa
      "duplex-2205": 207.0, // MPa
      "super-duplex-2507": 276.0, // MPa
      "inconel-625": 241.0, // MPa
      "hastelloy-c276": 172.0, // MPa
    };

    if (materialConstruction && materialStressMapping[materialConstruction]) {
      return materialStressMapping[materialConstruction].toFixed(1);
    }
    return "";
  };

  // Tmin calculation function
  const calculateTmin = (data: typeof formData) => {
    const designPressure = parseFloat(data.designPressure) || 0;
    const innerDiameter = parseFloat(data.innerDiameter) || 0;
    const allowableStress = parseFloat(data.allowableStress) || 0;
    const weldJoinEfficiency = parseFloat(data.weldJoinEfficiency) || 0;
    const componentType = data.componentType;

    // Check if all required values are available for calculation
    if (
      designPressure === 0 ||
      innerDiameter === 0 ||
      allowableStress === 0 ||
      weldJoinEfficiency === 0
    ) {
      return "";
    }

    try {
      // First part of the formula: (Design Pressure * Inner Diameter) / ((2 * Allowable Stress * Weld Join Efficiency) - (0.6 * Design Pressure))
      const denominator =
        2 * allowableStress * weldJoinEfficiency - 0.6 * designPressure;

      if (denominator <= 0) {
        return ""; // Avoid division by zero or negative denominator
      }

      const calculatedValue = (designPressure * innerDiameter) / denominator;

      // Second part: Component type based value
      const componentTypeValue = componentType === "HEXTUBE" ? 0.889 : 3.175;

      // MAX function - return the larger of the two values
      const tminValue = Math.max(calculatedValue, componentTypeValue);

      return tminValue.toFixed(3); // Return with 3 decimal places
    } catch (error) {
      console.error("Error calculating Tmin:", error);
      return "";
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // Fields that affect Tmin calculation
    const tminCalculationFields = [
      "designPressure",
      "innerDiameter",
      "allowableStress",
      "weldJoinEfficiency",
      "componentType",
    ];

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

      // Calculate allowable stress when material construction changes
      if (field === "materialConstruction") {
        const calculatedStress = calculateAllowableStress(value);
        if (calculatedStress !== "") {
          updatedData.allowableStress = calculatedStress;
        }
      }

      // Calculate Tmin if any relevant field changed
      if (
        tminCalculationFields.includes(field) ||
        field === "asset" ||
        field === "materialConstruction"
      ) {
        const calculatedTmin = calculateTmin(updatedData);
        if (calculatedTmin !== "") {
          updatedData.tmin = calculatedTmin;
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

      console.log("=== Starting Pressure Vessel Save Process ===");

      // Get asset_detail_id from selected asset
      const selectedAsset = assetWithComponentTypeOptions.find(
        (asset) => asset.value === formData.asset
      );

      if (!selectedAsset) {
        throw new Error("Selected asset not found");
      }

      // Prepare main pressure vessel data for i_ims_general table insertion
      const imsGeneralData = {
        // Core required fields
        asset_detail_id: selectedAsset.asset_detail_id, // Use asset_detail_id from the selected asset
        year_in_service: formData.yearInService, // yyyy-mm-dd format
        tmin: formData.tmin || null, // Store as string as expected by database
        material_construction_id:
          parseInt(formData.materialConstruction) || null,
        description: formData.description,
        nominal_bore_diameter: parseFloat(formData.nominalThickness) || null, // Note: mapping nominalThickness to nominal_bore_diameter
        insulation: formData.insulation === "yes",
        line_h2s: formData.h2s === "yes",
        internal_lining: formData.internalLining === "yes",
        pwht: formData.pwht === "yes",
        cladding: formData.cladding === "yes",
        ims_asset_type_id: 1, // Automatically set to 1 for Pressure Vessel
        inner_diameter: parseFloat(formData.innerDiameter) || null,
        clad_thickness: parseFloat(formData.cladThickness) || null,

        // Additional fields from other tabs (if they exist in i_ims_general table)
        outer_diameter: parseFloat(formData.outerDiameter) || null,
        length: parseFloat(formData.length) || null,
        weld_join_efficiency: parseFloat(formData.weldJoinEfficiency) || null,
        design_temperature: parseFloat(formData.designTemperature) || null,
        operating_temperature:
          parseFloat(formData.operatingTemperature) || null,
        design_pressure: parseFloat(formData.designPressure) || null,
        operating_pressure: parseFloat(formData.operatingPressure) || null,
        allowable_stress: parseFloat(formData.allowableStress) || null,
        corrosion_allowance: parseFloat(formData.corrosionAllowance) || null,
        ext_env: formData.extEnv,
        geometry: formData.geometry,
        pipe_support: formData.pipeSupport === "yes",
        soil_water_interface: formData.soilWaterInterface === "yes",
        deadleg: formData.deadleg === "yes",
        mixpoint: formData.mixpoint === "yes",

        // Protection Tab Data
        coating_quality: formData.coatingQuality,
        insulation_type: formData.insulationType,
        insulation_complexity: formData.insulationComplexity,
        insulation_condition: formData.insulationCondition,
        design_fabrication: formData.designFabrication,
        interface: formData.interface,
        lining_type: formData.liningType,
        lining_condition: formData.liningCondition,
        lining_monitoring: formData.liningMonitoring,
        online_monitor: formData.onlineMonitor,

        // Service Tab Data
        fluid_representative: formData.fluidRepresentative,
        toxicity: formData.toxicity,
        fluid_phase: formData.fluidPhase,
        toxic_mass_fraction: parseFloat(formData.toxicMassFraction) || null,

        // Risk Tab Data
        risk_ranking: formData.riskRanking,
        risk_level: formData.riskLevel,
        dthin: parseFloat(formData.dthin) || null,
        dscc: parseFloat(formData.dscc) || null,
        dbrit: parseFloat(formData.dbrit) || null,
        pof: parseFloat(formData.pof) || null,
        dextd: parseFloat(formData.dextd) || null,
        dhtha: parseFloat(formData.dhtha) || null,
        dmfat: parseFloat(formData.dmfat) || null,
        f1: parseFloat(formData.f1) || null,
        cof_dollar: parseFloat(formData.cofDollar) || null,
        cof_m2: parseFloat(formData.cofM2) || null,

        // Inspection Tab Data
        inspection_plan: formData.inspectionPlan,

        // Additional Data
        notes: formData.notes,
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

      // Handle Inspection Reports File Upload with proper bucket structure
      let inspectionReportPaths: string[] = [];
      if (formData.inspectionReports.length > 0) {
        console.log(
          `Uploading ${formData.inspectionReports.length} inspection report files...`
        );

        for (const file of formData.inspectionReports) {
          try {
            // Create bucket structure: integrity/pressure-vessel/{id}/reports/
            const bucketPath = `integrity/pressure-vessel/${recordId}/reports/${Date.now()}_${
              file.name
            }`;

            console.log(
              `Uploading inspection report: ${file.name} to ${bucketPath}`
            );
            console.log(
              `Uploading inspection report: ${file.name} to ${bucketPath}`
            );

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } =
              await supabase.storage
                .from("integrity-files")
                .upload(bucketPath, file, {
                  cacheControl: "3600",
                  upsert: false,
                });

            if (uploadError) throw uploadError;

            // Store file path (not full URL) for database
            inspectionReportPaths.push(bucketPath);

            // Insert into i_inspection_attachment table
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
            // Create bucket structure: integrity/pressure-vessel/{id}/attachments/
            const bucketPath = `integrity/pressure-vessel/${recordId}/attachments/${Date.now()}_${
              file.name
            }`;

            console.log(`Uploading attachment: ${file.name} to ${bucketPath}`);

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } =
              await supabase.storage
                .from("integrity-files")
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
      console.log("- Main record saved to: i_ims_general table");
      console.log(
        "- Inspection reports saved to: i_inspection_attachment table"
      );
      console.log("- General attachments saved to: i_ims_attachment table");
      console.log(
        "- File bucket structure: integrity/pressure-vessel/{id}/reports/ and /attachments/"
      );

      // Success notification
      toast({
        title: "Success!",
        description: `Pressure vessel ${formData.equipmentTag} has been created successfully with ${inspectionReportPaths.length} inspection reports and ${attachmentPaths.length} attachments.`,
      });

      // Navigate back to integrity page
      navigate("/monitor/integrity");
    } catch (error) {
      console.error("Error creating pressure vessel:", error);
      toast({
        title: "Error",
        description: `Failed to create pressure vessel. ${
          error instanceof Error ? error.message : "Please try again."
        }`,
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
          title="New Pressure Vessel"
          subtitle="Create a new pressure vessel asset with comprehensive details"
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
                            {assetWithComponentTypeOptions.map((asset) => (
                              <SelectItem key={asset.id} value={asset.value}>
                                {asset.label}
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
                          placeholder="Auto-populated from selected asset"
                          disabled
                          className="bg-gray-50 font-mono"
                        />
                        <p className="text-xs text-muted-foreground">
                          Auto-populated from selected asset (read-only)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="equipmentType">Equipment Type</Label>
                        <Input
                          id="equipmentType"
                          value={formData.equipmentType}
                          onChange={(e) =>
                            handleInputChange("equipmentType", e.target.value)
                          }
                          placeholder="Pressure Vessel"
                          disabled
                          className="bg-gray-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="componentType">Component Type*</Label>
                        <Input
                          id="componentType"
                          value={formData.componentType}
                          placeholder="Auto-populated from selected asset"
                          disabled
                          className="bg-gray-50"
                        />
                        <p className="text-xs text-muted-foreground">
                          Component type is automatically populated based on the
                          selected asset
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="yearInService">Year In Service*</Label>
                        <Input
                          id="yearInService"
                          type="date"
                          value={formData.yearInService}
                          onChange={(e) =>
                            handleInputChange("yearInService", e.target.value)
                          }
                          placeholder="Select commissioning date"
                        />
                      </div>
                    </div>

                    {/* Column 2 - Location & Material */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg text-green-600">
                        Location & Material
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="area">Area*</Label>
                        <Input
                          id="area"
                          value={formData.area}
                          placeholder="Auto-populated from selected asset"
                          disabled
                          className="bg-gray-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="system">System*</Label>
                        <Input
                          id="system"
                          value={formData.system}
                          placeholder="Auto-populated from selected asset"
                          disabled
                          className="bg-gray-50"
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
                            <SelectItem value="carbon-steel-a516-gr70">
                              Carbon Steel A516 Gr.70
                            </SelectItem>
                            <SelectItem value="stainless-steel-304l">
                              Stainless Steel 304L
                            </SelectItem>
                            <SelectItem value="stainless-steel-316l">
                              Stainless Steel 316L
                            </SelectItem>
                            <SelectItem value="duplex-2205">
                              Duplex 2205
                            </SelectItem>
                            <SelectItem value="super-duplex-2507">
                              Super Duplex 2507
                            </SelectItem>
                            <SelectItem value="inconel-625">
                              Inconel 625
                            </SelectItem>
                            <SelectItem value="hastelloy-c276">
                              Hastelloy C276
                            </SelectItem>
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
                          placeholder="Enter equipment description..."
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Column 3 - Technical Specifications */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg text-purple-600">
                        Technical Specifications
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="nominalThickness">
                          Nominal Thickness (mm)*
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
                          placeholder="e.g., 12.5"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tmin">Tmin (mm)</Label>
                        <Input
                          id="tmin"
                          type="number"
                          step="0.001"
                          value={formData.tmin}
                          placeholder="Calculated automatically"
                          disabled
                          className="bg-gray-50"
                        />
                        <p className="text-xs text-muted-foreground">
                          Auto-calculated using: MAX((Design Pressure × Inner
                          Diameter) ÷ ((2 × Allowable Stress × Weld Join
                          Efficiency) - (0.6 × Design Pressure)), Component Type
                          Value)
                        </p>
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
                          placeholder="e.g., 3.0"
                        />
                      </div>

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
                          placeholder="e.g., 2000"
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
                          placeholder="e.g., 2000"
                        />
                      </div>

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
                          placeholder="e.g., 2024"
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
                          placeholder="e.g., 6000"
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
                          placeholder="e.g., 0.85"
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
                          placeholder="e.g., 3.0"
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
                          Design Temperature (°C)
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
                          placeholder="e.g., 150"
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
                          placeholder="e.g., 120"
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
                          placeholder="e.g., 1.6"
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
                          placeholder="e.g., 1.2"
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
                          placeholder="Calculated from material construction"
                          disabled
                          className="bg-gray-50"
                        />
                        <p className="text-xs text-muted-foreground">
                          Auto-calculated based on selected material
                          construction
                        </p>
                      </div>
                    </div>

                    {/* Column 3 - Environment & Configuration */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg text-purple-600">
                        Environment & Configuration
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="extEnv">Ext Env</Label>
                        <Select
                          value={formData.extEnv}
                          onValueChange={(value) =>
                            handleInputChange("extEnv", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select external environment" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="atmospheric">
                              Atmospheric
                            </SelectItem>
                            <SelectItem value="marine">Marine</SelectItem>
                            <SelectItem value="industrial">
                              Industrial
                            </SelectItem>
                            <SelectItem value="harsh">Harsh</SelectItem>
                            <SelectItem value="offshore">Offshore</SelectItem>
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
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select geometry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cylindrical">
                              Cylindrical
                            </SelectItem>
                            <SelectItem value="spherical">Spherical</SelectItem>
                            <SelectItem value="conical">Conical</SelectItem>
                            <SelectItem value="rectangular">
                              Rectangular
                            </SelectItem>
                            <SelectItem value="elliptical">
                              Elliptical
                            </SelectItem>
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
                          <Label>Deadleg?</Label>
                          <RadioGroup
                            value={formData.deadleg}
                            onValueChange={(value) =>
                              handleInputChange("deadleg", value)
                            }
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
                          <Label>Mixpoint?</Label>
                          <RadioGroup
                            value={formData.mixpoint}
                            onValueChange={(value) =>
                              handleInputChange("mixpoint", value)
                            }
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

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Column 1 - Coating & Insulation */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg text-blue-600">
                        Coating & Quality
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="coatingQuality">Coating Quality*</Label>
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
                            <SelectItem value="excellent">Excellent</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                            <SelectItem value="poor">Poor</SelectItem>
                            <SelectItem value="very-poor">Very Poor</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="insulationType">Insulation Type*</Label>
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
                            <SelectItem value="calcium-silicate">
                              Calcium Silicate
                            </SelectItem>
                            <SelectItem value="perlite">Perlite</SelectItem>
                            <SelectItem value="ceramic-fiber">
                              Ceramic Fiber
                            </SelectItem>
                            <SelectItem value="polyurethane-foam">
                              Polyurethane Foam
                            </SelectItem>
                            <SelectItem value="aerogel">Aerogel</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="insulationComplexity">
                          Insulation Complexity*
                        </Label>
                        <Select
                          value={formData.insulationComplexity}
                          onValueChange={(value) =>
                            handleInputChange("insulationComplexity", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select complexity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="very-high">Very High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Column 2 - Conditions & Design */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg text-green-600">
                        Condition & Design
                      </h3>

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
                          placeholder="Describe insulation condition"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="designFabrication">
                          Design Fabrication*
                        </Label>
                        <Select
                          value={formData.designFabrication}
                          onValueChange={(value) =>
                            handleInputChange("designFabrication", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select design fabrication" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="welded">Welded</SelectItem>
                            <SelectItem value="seamless">Seamless</SelectItem>
                            <SelectItem value="forged">Forged</SelectItem>
                            <SelectItem value="cast">Cast</SelectItem>
                            <SelectItem value="rolled">Rolled</SelectItem>
                            <SelectItem value="fabricated">
                              Fabricated
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="interface">Interface*</Label>
                        <Select
                          value={formData.interface}
                          onValueChange={(value) =>
                            handleInputChange("interface", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select interface" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="buried">Buried</SelectItem>
                            <SelectItem value="soil-air">Soil-Air</SelectItem>
                            <SelectItem value="water-air">Water-Air</SelectItem>
                            <SelectItem value="atmospheric">
                              Atmospheric
                            </SelectItem>
                            <SelectItem value="submerged">Submerged</SelectItem>
                            <SelectItem value="splash-zone">
                              Splash Zone
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Column 3 - Lining Systems */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg text-purple-600">
                        Lining Systems
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="liningType">Lining Type</Label>
                        <Input
                          id="liningType"
                          value={formData.liningType}
                          onChange={(e) =>
                            handleInputChange("liningType", e.target.value)
                          }
                          placeholder="e.g., Rubber, PTFE, Ceramic"
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
                          placeholder="Describe lining condition"
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
                          placeholder="e.g., Visual, Holiday Test"
                        />
                      </div>
                    </div>

                    {/* Column 4 - Monitoring */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg text-orange-600">
                        Online Monitoring
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="onlineMonitor">Online Monitor*</Label>
                        <Select
                          value={formData.onlineMonitor}
                          onValueChange={(value) =>
                            handleInputChange("onlineMonitor", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select online monitor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ultrasonic">
                              Ultrasonic Thickness
                            </SelectItem>
                            <SelectItem value="radiographic">
                              Radiographic
                            </SelectItem>
                            <SelectItem value="acoustic-emission">
                              Acoustic Emission
                            </SelectItem>
                            <SelectItem value="corrosion-probe">
                              Corrosion Probe
                            </SelectItem>
                            <SelectItem value="strain-gauge">
                              Strain Gauge
                            </SelectItem>
                            <SelectItem value="vibration">
                              Vibration Monitor
                            </SelectItem>
                            <SelectItem value="thermal">
                              Thermal Monitor
                            </SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">
                          Monitoring Status
                        </Label>
                        <div className="p-3 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-600">
                            Online monitoring system status will be displayed
                            here based on the selected monitor type.
                          </p>
                        </div>
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
                      Fluid characteristics and service parameters
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
                          Fluid Representative*
                        </Label>
                        <Select
                          value={formData.fluidRepresentative}
                          onValueChange={(value) =>
                            handleInputChange("fluidRepresentative", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select fluid representative" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="crude-oil">Crude Oil</SelectItem>
                            <SelectItem value="natural-gas">
                              Natural Gas
                            </SelectItem>
                            <SelectItem value="produced-water">
                              Produced Water
                            </SelectItem>
                            <SelectItem value="condensate">
                              Condensate
                            </SelectItem>
                            <SelectItem value="methanol">Methanol</SelectItem>
                            <SelectItem value="glycol">Glycol</SelectItem>
                            <SelectItem value="seawater">Seawater</SelectItem>
                            <SelectItem value="diesel">Diesel</SelectItem>
                            <SelectItem value="fuel-gas">Fuel Gas</SelectItem>
                            <SelectItem value="flare-gas">Flare Gas</SelectItem>
                            <SelectItem value="instrument-air">
                              Instrument Air
                            </SelectItem>
                            <SelectItem value="nitrogen">Nitrogen</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="toxicity">Toxicity*</Label>
                        <Select
                          value={formData.toxicity}
                          onValueChange={(value) =>
                            handleInputChange("toxicity", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select toxicity level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="non-toxic">Non-Toxic</SelectItem>
                            <SelectItem value="slightly-toxic">
                              Slightly Toxic
                            </SelectItem>
                            <SelectItem value="moderately-toxic">
                              Moderately Toxic
                            </SelectItem>
                            <SelectItem value="highly-toxic">
                              Highly Toxic
                            </SelectItem>
                            <SelectItem value="extremely-toxic">
                              Extremely Toxic
                            </SelectItem>
                            <SelectItem value="lethal">Lethal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Column 2 - Phase & Composition */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg text-green-600">
                        Phase & Composition
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="fluidPhase">Fluid Phase*</Label>
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
                            <SelectItem value="two-phase">Two Phase</SelectItem>
                            <SelectItem value="vapor">Vapor</SelectItem>
                            <SelectItem value="steam">Steam</SelectItem>
                            <SelectItem value="supercritical">
                              Supercritical
                            </SelectItem>
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
                          placeholder="e.g., 0.15 (15%)"
                          min="0"
                          max="1"
                        />
                        <p className="text-xs text-muted-foreground">
                          Enter as decimal (0.15 for 15%)
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Inspection Tab */}
                <TabsContent value="inspection" className="mt-0 space-y-6">
                  <div className="border-b pb-4">
                    <h2 className="text-xl font-semibold">
                      Inspection Management
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive inspection planning and reporting
                    </p>
                  </div>

                  <Tabs
                    value={activeInspectionTab}
                    onValueChange={setActiveInspectionTab}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="plan">Plan</TabsTrigger>
                      <TabsTrigger value="reports">Reports</TabsTrigger>
                    </TabsList>

                    {/* Plan Sub-tab */}
                    <TabsContent value="plan" className="mt-6 space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="inspectionPlan">
                            Inspection Plan
                          </Label>
                          <div className="border rounded-lg">
                            {/* WYSIWYG-style formatting toolbar */}
                            <div className="border-b p-2 flex gap-1 bg-gray-50">
                              <Button type="button" variant="ghost" size="sm">
                                <Bold className="h-4 w-4" />
                              </Button>
                              <Button type="button" variant="ghost" size="sm">
                                <Italic className="h-4 w-4" />
                              </Button>
                              <Button type="button" variant="ghost" size="sm">
                                <Underline className="h-4 w-4" />
                              </Button>
                              <div className="w-px bg-gray-300 mx-1" />
                              <Button type="button" variant="ghost" size="sm">
                                <List className="h-4 w-4" />
                              </Button>
                              <Button type="button" variant="ghost" size="sm">
                                <ListOrdered className="h-4 w-4" />
                              </Button>
                              <div className="w-px bg-gray-300 mx-1" />
                              <Button type="button" variant="ghost" size="sm">
                                <AlignLeft className="h-4 w-4" />
                              </Button>
                              <Button type="button" variant="ghost" size="sm">
                                <AlignCenter className="h-4 w-4" />
                              </Button>
                              <Button type="button" variant="ghost" size="sm">
                                <AlignRight className="h-4 w-4" />
                              </Button>
                            </div>

                            <Textarea
                              id="inspectionPlan"
                              value={formData.inspectionPlan}
                              onChange={(e) =>
                                handleInputChange(
                                  "inspectionPlan",
                                  e.target.value
                                )
                              }
                              placeholder="Enter comprehensive inspection plan details...

Example content:
• Visual inspection of external surfaces for corrosion, damage, or coating degradation
• Ultrasonic thickness measurements at predetermined locations
• Internal inspection for corrosion, erosion, or material degradation
• Pressure testing as per applicable standards
• Documentation of findings and recommendations
• Follow-up actions and timelines"
                              rows={20}
                              className="border-0 resize-none focus:ring-0"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Use the formatting toolbar above to style your
                            inspection plan. Include detailed procedures,
                            checkpoints, and safety requirements.
                          </p>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Reports Sub-tab */}
                    <TabsContent value="reports" className="mt-6 space-y-6">
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>
                              Documentation (P&ID, PFD, GA, ISO etc.)
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Upload technical documentation including Process &
                              Instrumentation Diagrams (P&ID), Process Flow
                              Diagrams (PFD), General Arrangements (GA),
                              Isometric drawings (ISO), inspection reports, and
                              other relevant documents.
                            </p>
                          </div>

                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <div className="space-y-2">
                              <p className="text-lg font-medium">
                                Upload Documentation
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Drag and drop files here, or click to browse
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Supported formats: PDF, DWG, DXF, JPG, PNG, XLS,
                                DOC
                              </p>
                              <input
                                type="file"
                                multiple
                                accept=".pdf,.dwg,.dxf,.jpg,.jpeg,.png,.xls,.xlsx,.doc,.docx"
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
                                <Upload className="h-4 w-4 mr-2" />
                                Choose Documentation Files
                              </Button>
                            </div>
                          </div>

                          {formData.inspectionReports.length > 0 && (
                            <div className="space-y-4">
                              <h3 className="font-medium">
                                Uploaded Documentation
                              </h3>
                              <div className="grid grid-cols-1 gap-3">
                                {formData.inspectionReports.map(
                                  (file, index) => {
                                    const getFileIcon = (fileName: string) => {
                                      const ext = fileName
                                        .split(".")
                                        .pop()
                                        ?.toLowerCase();
                                      switch (ext) {
                                        case "pdf":
                                          return (
                                            <FileText className="h-5 w-5 text-red-500" />
                                          );
                                        case "jpg":
                                        case "jpeg":
                                        case "png":
                                          return (
                                            <FileImage className="h-5 w-5 text-green-500" />
                                          );
                                        case "xls":
                                        case "xlsx":
                                          return (
                                            <FileSpreadsheet className="h-5 w-5 text-green-600" />
                                          );
                                        case "dwg":
                                        case "dxf":
                                          return (
                                            <File className="h-5 w-5 text-blue-500" />
                                          );
                                        default:
                                          return (
                                            <FileText className="h-5 w-5 text-gray-500" />
                                          );
                                      }
                                    };

                                    const getFileCategory = (
                                      fileName: string
                                    ) => {
                                      const name = fileName.toLowerCase();
                                      if (
                                        name.includes("pid") ||
                                        name.includes("p&id")
                                      )
                                        return "P&ID";
                                      if (name.includes("pfd")) return "PFD";
                                      if (
                                        name.includes("ga") ||
                                        name.includes("general")
                                      )
                                        return "GA";
                                      if (
                                        name.includes("iso") ||
                                        name.includes("isometric")
                                      )
                                        return "ISO";
                                      if (
                                        name.includes("inspection") ||
                                        name.includes("report")
                                      )
                                        return "Report";
                                      return "Document";
                                    };

                                    return (
                                      <div
                                        key={index}
                                        className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm"
                                      >
                                        <div className="flex items-center gap-3">
                                          {getFileIcon(file.name)}
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                              <p className="font-medium">
                                                {file.name}
                                              </p>
                                              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                                                {getFileCategory(file.name)}
                                              </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                              {(
                                                file.size /
                                                1024 /
                                                1024
                                              ).toFixed(2)}{" "}
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
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
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
                    {/* Enhanced file upload area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                      <Upload className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <div className="space-y-3">
                        <h3 className="text-lg font-medium">
                          Upload Multiple Files
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Drag and drop files here, or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Supported formats: PDF, DOC, XLS, JPG, PNG, DWG, and
                          more
                        </p>
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.bmp,.dwg,.dxf,.txt,.csv"
                          onChange={(e) => handleFileUpload(e.target.files)}
                          className="hidden"
                          id="attachment-upload"
                        />
                        <div className="flex gap-2 justify-center">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document
                                .getElementById("attachment-upload")
                                ?.click()
                            }
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Choose Files
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              // Simulate folder upload capability
                              const input = document.getElementById(
                                "attachment-upload"
                              ) as HTMLInputElement;
                              if (input) {
                                input.webkitdirectory = true;
                                input.click();
                                input.webkitdirectory = false;
                              }
                            }}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Choose Folder
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* File categorization and display */}
                    {formData.attachments.length > 0 && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">
                            Uploaded Files ({formData.attachments.length})
                          </h3>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                attachments: [],
                              }));
                            }}
                          >
                            Clear All
                          </Button>
                        </div>

                        {/* Categorized file display */}
                        <div className="grid grid-cols-1 gap-4">
                          {formData.attachments.map((file, index) => {
                            const getFileIcon = (fileName: string) => {
                              const ext = fileName
                                .split(".")
                                .pop()
                                ?.toLowerCase();
                              switch (ext) {
                                case "pdf":
                                  return (
                                    <FileText className="h-6 w-6 text-red-500" />
                                  );
                                case "doc":
                                case "docx":
                                  return (
                                    <FileText className="h-6 w-6 text-blue-500" />
                                  );
                                case "xls":
                                case "xlsx":
                                  return (
                                    <FileSpreadsheet className="h-6 w-6 text-green-600" />
                                  );
                                case "jpg":
                                case "jpeg":
                                case "png":
                                case "gif":
                                case "bmp":
                                  return (
                                    <FileImage className="h-6 w-6 text-green-500" />
                                  );
                                case "dwg":
                                case "dxf":
                                  return (
                                    <File className="h-6 w-6 text-blue-600" />
                                  );
                                case "ppt":
                                case "pptx":
                                  return (
                                    <FileText className="h-6 w-6 text-orange-500" />
                                  );
                                default:
                                  return (
                                    <File className="h-6 w-6 text-gray-500" />
                                  );
                              }
                            };

                            const getFileTypeLabel = (fileName: string) => {
                              const ext = fileName
                                .split(".")
                                .pop()
                                ?.toLowerCase();
                              switch (ext) {
                                case "pdf":
                                  return "PDF Document";
                                case "doc":
                                case "docx":
                                  return "Word Document";
                                case "xls":
                                case "xlsx":
                                  return "Excel Spreadsheet";
                                case "ppt":
                                case "pptx":
                                  return "PowerPoint";
                                case "jpg":
                                case "jpeg":
                                case "png":
                                case "gif":
                                case "bmp":
                                  return "Image File";
                                case "dwg":
                                case "dxf":
                                  return "CAD Drawing";
                                case "txt":
                                  return "Text File";
                                case "csv":
                                  return "CSV File";
                                default:
                                  return "Document";
                              }
                            };

                            const getFileSizeColor = (size: number) => {
                              const sizeInMB = size / 1024 / 1024;
                              if (sizeInMB > 10) return "text-red-600";
                              if (sizeInMB > 5) return "text-orange-600";
                              return "text-gray-600";
                            };

                            return (
                              <div
                                key={index}
                                className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-center gap-4 flex-1">
                                  {getFileIcon(file.name)}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="font-medium truncate">
                                        {file.name}
                                      </p>
                                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                        {getFileTypeLabel(file.name)}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                      <span
                                        className={getFileSizeColor(file.size)}
                                      >
                                        {(file.size / 1024 / 1024).toFixed(2)}{" "}
                                        MB
                                      </span>
                                      <span>•</span>
                                      <span>
                                        Uploaded{" "}
                                        {new Date().toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    Preview
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeAttachment(index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* File summary */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Total Files:</span>
                              <span className="ml-2">
                                {formData.attachments.length}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">Total Size:</span>
                              <span className="ml-2">
                                {(
                                  formData.attachments.reduce(
                                    (total, file) => total + file.size,
                                    0
                                  ) /
                                  1024 /
                                  1024
                                ).toFixed(2)}{" "}
                                MB
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">Images:</span>
                              <span className="ml-2">
                                {
                                  formData.attachments.filter((file) =>
                                    /\.(jpg|jpeg|png|gif|bmp)$/i.test(file.name)
                                  ).length
                                }
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">Documents:</span>
                              <span className="ml-2">
                                {
                                  formData.attachments.filter((file) =>
                                    /\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/i.test(
                                      file.name
                                    )
                                  ).length
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Additional notes section */}
                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) =>
                          handleInputChange("notes", e.target.value)
                        }
                        placeholder="Any additional notes, comments, or instructions for this pressure vessel...

Examples:
• Special handling requirements
• Maintenance history notes
• Operational constraints
• Safety considerations
• Vendor information"
                        rows={6}
                      />
                    </div>
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
                    Save Pressure Vessel
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

export default NewPressureVesselPage;
