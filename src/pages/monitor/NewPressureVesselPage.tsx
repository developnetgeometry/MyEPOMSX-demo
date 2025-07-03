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

import React, { useState, useEffect, useCallback, useMemo } from "react";
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
import {
  useMaterialConstructionOptions,
  useAsmeViiAllowableStressLookup,
  useTminCalculation,
} from "@/hooks/queries/useCorrosionDropdownOptions";
import { supabase } from "@/lib/supabaseClient";
import { useInsulationConditionOptions } from "@/hooks/lookup/lookup-insulation-condition";
import { useCoatingQualityOptions } from "@/hooks/lookup/lookup-coating-quality";
import { useInsulationTypeOptions } from "@/hooks/lookup/lookup-insulation-type";
import { useInsulationComplexityOptions } from "@/hooks/lookup/lookup-insulation-complexity";
import { useDesignFabricationOptions } from "@/hooks/lookup/lookup-design-fabrication";
import { useInterfaceOptions } from "@/hooks/lookup/lookup-interface";
import { useOnlineMonitorOptions } from "@/hooks/lookup/lookup-online-monitoring";
import { useFluidRepresentativeOptions } from "@/hooks/lookup/lookup-fluid-representative";
import { useToxicityOptions } from "@/hooks/lookup/lookup-toxicity";
import { useFluidPhaseOptions } from "@/hooks/lookup/lookup-fluid-phase";
import { useAuth } from "@/contexts/AuthContext";
import { useExtEnvOptions } from "@/hooks/lookup/lookup-ext-env";
import { useGeometryOptions } from "@/hooks/lookup/lookup-geometry";

// File icon mapping (moved outside component to prevent re-creation)
const getFileIcon = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf": return <FileText className="h-5 w-5 text-red-500" />;
    case "jpg": case "jpeg": case "png": 
      return <FileImage className="h-5 w-5 text-green-500" />;
    case "xls": case "xlsx": 
      return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
    case "dwg": case "dxf": 
      return <File className="h-5 w-5 text-blue-500" />;
    default: return <FileText className="h-5 w-5 text-gray-500" />;
  }
};

// File category mapping (moved outside component)
const getFileCategory = (fileName: string) => {
  const name = fileName.toLowerCase();
  if (name.includes("pid") || name.includes("p&id")) return "P&ID";
  if (name.includes("pfd")) return "PFD";
  if (name.includes("ga") || name.includes("general")) return "GA";
  if (name.includes("iso") || name.includes("isometric")) return "ISO";
  if (name.includes("inspection") || name.includes("report")) return "Report";
  return "Document";
};

const NewPressureVesselPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [activeInspectionTab, setActiveInspectionTab] = useState("plan");
  const { user } = useAuth();

  // Dropdown options hooks
  const { data: assetWithComponentTypeOptions = [] } = 
    useAssetWithComponentTypeOptions();
  const { data: materialConstructionOptions = [] } = 
    useMaterialConstructionOptions();
  const insulationConditionOptions = useInsulationConditionOptions();
  const coatingQualityOptions = useCoatingQualityOptions();
  const insulationTypeOptions = useInsulationTypeOptions();
  const insulationComplexityOptions = useInsulationComplexityOptions();
  const designFabricationOptions = useDesignFabricationOptions();
  const interfaceOptions = useInterfaceOptions();
  const onlineMonitorOptions = useOnlineMonitorOptions();
  const fluidRepresentativeOptions = useFluidRepresentativeOptions();
  const toxicityOptions = useToxicityOptions();
  const fluidPhaseOptions = useFluidPhaseOptions();
  const extEnvOptions = useExtEnvOptions();
  const geometryOptions = useGeometryOptions();

  // Form data structure mapped to i_ims_general table
  const [formData, setFormData] = useState({
    // General Tab - Maps directly to i_ims_general table columns
    asset: "",
    equipmentTag: "",
    equipmentType: "Pressure Vessel",
    componentType: "",
    area: "",
    system: "",
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

    // Risk Tab
    riskRanking: "",
    riskLevel: "",
    dthin: "",
    dscc: "",
    dbrit: "",
    pof: "",
    dextd: "",
    dhtha: "",
    dmfat: "",
    f1: "",
    cofDollar: "",
    cofM2: "",

    // Inspection Tab
    inspectionPlan: "",
    inspectionReports: [] as File[],

    // Attachment Tab
    attachments: [] as File[],
    notes: "",
  });

  // Memoize expensive calculation inputs
  const materialConstructionId = useMemo(() => 
    parseInt(formData.materialConstruction) || undefined, 
    [formData.materialConstruction]
  );
  
  const designTemperature = useMemo(() => 
    parseInt(formData.designTemperature) || undefined, 
    [formData.designTemperature]
  );
  
  const { data: allowableStress, isLoading: calculatingStress } = 
    useAsmeViiAllowableStressLookup(materialConstructionId, designTemperature);

  const designPressure = useMemo(() => 
    parseFloat(formData.designPressure) || undefined, 
    [formData.designPressure]
  );
  
  const allowableStressValue = useMemo(() => 
    allowableStress?.allowable_stress_mpa ? parseFloat(allowableStress.allowable_stress_mpa) : undefined, 
    [allowableStress]
  );
  
  const weldJoinEfficiency = useMemo(() => 
    parseFloat(formData.weldJoinEfficiency) || undefined, 
    [formData.weldJoinEfficiency]
  );
  
  const innerDiameter = useMemo(() => 
    parseFloat(formData.innerDiameter) || undefined, 
    [formData.innerDiameter]
  );
  
  const { data: tminResult, isLoading: calculatingTmin } = useTminCalculation(
    designPressure,
    allowableStressValue,
    weldJoinEfficiency,
    innerDiameter
  );

  // Optimized auto-update effects
  useEffect(() => {
    if (allowableStress?.is_valid_lookup && allowableStress.allowable_stress_mpa) {
      setFormData(prev => ({
        ...prev,
        allowableStress: allowableStress.allowable_stress_mpa,
      }));
    }
  }, [allowableStress]);

  useEffect(() => {
    if (tminResult?.calculation_valid && tminResult.tmin_mm) {
      setFormData(prev => ({
        ...prev,
        tmin: tminResult.tmin_mm.toFixed(3),
      }));
    }
  }, [tminResult]);

  // Optimized handlers with useCallback
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => {
      const updatedData = { ...prev, [field]: value };

      if (field === "asset") {
        const selectedAsset = assetWithComponentTypeOptions.find(
          asset => asset.value === value
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
  }, [assetWithComponentTypeOptions]);

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newFiles],
    }));
  }, []);

  const handleInspectionReportsUpload = useCallback((files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setFormData(prev => ({
      ...prev,
      inspectionReports: [...prev.inspectionReports, ...newFiles],
    }));
  }, []);

  const removeAttachment = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  }, []);

  const removeInspectionReport = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      inspectionReports: prev.inspectionReports.filter((_, i) => i !== index),
    }));
  }, []);

  // Memoized file lists for rendering
  const inspectionReportItems = useMemo(() => 
    formData.inspectionReports.map((file, index) => (
      <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
        <div className="flex items-center gap-3">
          {getFileIcon(file.name)}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium truncate">{file.name}</p>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                {getFileCategory(file.name)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
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
    )),
    [formData.inspectionReports, removeInspectionReport]
  );

  const attachmentItems = useMemo(() => 
    formData.attachments.map((file, index) => {
      const getFileTypeLabel = (fileName: string) => {
        const ext = fileName.split(".").pop()?.toLowerCase();
        switch (ext) {
          case "pdf": return "PDF Document";
          case "doc": case "docx": return "Word Document";
          case "xls": case "xlsx": return "Excel Spreadsheet";
          case "jpg": case "jpeg": case "png": case "gif": case "bmp": 
            return "Image File";
          case "dwg": case "dxf": return "CAD Drawing";
          default: return "Document";
        }
      };

      return (
        <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 flex-1">
            {getFileIcon(file.name)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium truncate">{file.name}</p>
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                  {getFileTypeLabel(file.name)}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                <span>•</span>
                <span>Uploaded {new Date().toLocaleDateString()}</span>
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
    }),
    [formData.attachments, removeAttachment]
  );

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

      // Get asset_detail_id from selected asset
      const selectedAsset = assetWithComponentTypeOptions.find(
        (asset) => asset.value === formData.asset
      );

      if (!selectedAsset) {
        throw new Error("Selected Asset not found");
      }

      // Prepare main pressure vessel data for i_ims_general table insertion
      const imsGeneralData = {
        asset_detail_id: selectedAsset.asset_detail_id,
        year_in_service: formData.yearInService,
        tmin: formData.tmin || null,
        material_construction_id:
          parseInt(formData.materialConstruction) || null,
        description: formData.description,
        normal_wall_thickness: parseFloat(formData.nominalThickness) || null,
        insulation: formData.insulation === "yes",
        line_h2s: formData.h2s === "yes",
        internal_lining: formData.internalLining === "yes",
        pwht: formData.pwht === "yes",
        cladding: formData.cladding === "yes",
        ims_asset_type_id: 1,
        inner_diameter: parseFloat(formData.innerDiameter) || null,
        clad_thickness: parseFloat(formData.cladThickness) || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: user?.id,
      };

      // Insert main record into i_ims_general table
      const { data: savedRecord, error: insertError } = await supabase
        .from("i_ims_general")
        .insert(imsGeneralData)
        .select()
        .single();

      if (insertError) throw insertError;
      const recordId = savedRecord.id;

      // Insert Design Tab data
      const imsDesignData = {
        asset_detail_id: selectedAsset.asset_detail_id,
        ims_asset_type_id: 1,
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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: user?.id,
      };

      const { error: designInsertError } = await supabase
        .from("i_ims_design")
        .insert(imsDesignData);

      if (designInsertError) throw designInsertError;

      // Insert Protection Tab data
      const imsProtectionData = {
        asset_detail_id: selectedAsset.asset_detail_id,
        ims_asset_type_id: 1,
        coating_quality_id: parseInt(formData.coatingQuality) || null,
        insulation_type_id: parseInt(formData.insulationType) || null,
        insulation_complexity_id:
          parseInt(formData.insulationComplexity) || null,
        insulation_condition_id: formData.insulationCondition
          ? parseInt(formData.insulationCondition)
          : null,
        design_fabrication_id: parseInt(formData.designFabrication) || null,
        interface_id: parseInt(formData.interface) || null,
        lining_type: formData.liningType || null,
        lining_condition: formData.liningCondition || null,
        lining_monitoring: formData.liningMonitoring || null,
        online_monitor: parseInt(formData.onlineMonitor) || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ims_general_id: recordId,
        created_by: user?.id,
      };

      const { error: protectionInsertError } = await supabase
        .from("i_ims_protection")
        .insert(imsProtectionData);

      if (protectionInsertError) throw protectionInsertError;

      // Insert Service Tab data
      const imsServiceData = {
        asset_detail_id: selectedAsset.asset_detail_id,
        ims_asset_type_id: 1,
        fluid_representive_id: parseInt(formData.fluidRepresentative) || null,
        toxicity_id: parseInt(formData.toxicity) || null,
        fluid_phase_id: parseInt(formData.fluidPhase) || null,
        toxic_mass_fraction: parseFloat(formData.toxicMassFraction) || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ims_general_id: recordId,
        created_by: user?.id,
      };

      const { error: serviceInsertError } = await supabase
        .from("i_ims_service")
        .insert(imsServiceData);

      if (serviceInsertError) throw serviceInsertError;

      const imsInspectionData = {
        asset_detail_id: selectedAsset.asset_detail_id,
        inspection_plan: formData.inspectionPlan || null,
        created_at: new Date().toISOString(),
        created_by: user?.id,
        updated_at: new Date().toISOString(),
        ims_general_id: recordId,
      };

      const { error: inspectionInsertError } = await supabase
        .from("i_ims_inspection")
        .insert(imsInspectionData);

      if (inspectionInsertError) throw inspectionInsertError;

      // Handle Inspection Reports File Upload
      if (formData.inspectionReports.length > 0) {
        for (const file of formData.inspectionReports) {
          try {
            const bucketPath = `integrity/pressure-vessel/${selectedAsset.asset_detail_id}/reports/${Date.now()}_${file.name}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
              .from("integrity")
              .upload(bucketPath, file, {
                cacheControl: "3600",
                upsert: false,
              });

            if (uploadError) throw uploadError;

            // Insert into i_inspection_attachment table
            const { error: attachmentError } = await supabase
              .from("i_ims_inspection_attachment")
              .insert({
                asset_detail_id: selectedAsset.asset_detail_id,
                attachment_path: bucketPath,
                created_at: new Date().toISOString(),
                created_by: user?.id,
              });

            if (attachmentError) throw attachmentError;
          } catch (fileError) {
            console.error(`Error uploading inspection report ${file.name}:`, fileError);
          }
        }
      }

      // Handle General Attachments File Upload
      if (formData.attachments.length > 0) {
        for (const file of formData.attachments) {
          try {
            const bucketPath = `integrity/pressure-vessel/${recordId}/attachments/${Date.now()}_${file.name}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
              .from("integrity")
              .upload(bucketPath, file, {
                cacheControl: "3600",
                upsert: false,
              });

            if (uploadError) throw uploadError;

            // Insert into i_ims_attachment table
            const { error: attachmentError } = await supabase
              .from("i_ims_attachment")
              .insert({
                asset_detail_id: selectedAsset.asset_detail_id,
                attachment_path: bucketPath,
                created_at: new Date().toISOString(),
                created_by: user?.id,
                remark: formData.notes,
              });

            if (attachmentError) throw attachmentError;
          } catch (fileError) {
            console.error(`Error uploading attachment ${file.name}:`, fileError);
          }
        }
      }

      // Success notification
      toast({
        title: "Success!",
        description: `Pressure vessel ${formData.equipmentTag} has been created successfully with ${formData.inspectionReports.length} inspection reports and ${formData.attachments.length} attachments.`,
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

  const handleCancel = useCallback(() => {
    navigate("/monitor/integrity");
  }, [navigate]);

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
            onClick={handleCancel}
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
                        <Label htmlFor="asset">Asset<span className="text-red-500">*</span></Label>
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
                        <Label htmlFor="equipmentTag">Equipment Tag<span className="text-red-500">*</span></Label>
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
                        <Label htmlFor="componentType">Component Type<span className="text-red-500">*</span></Label>
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
                        <Label htmlFor="yearInService">Year In Service<span className="text-red-500">*</span></Label>
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
                        <Label htmlFor="area">Area<span className="text-red-500">*</span></Label>
                        <Input
                          id="area"
                          value={formData.area}
                          placeholder="Auto-populated from selected asset"
                          disabled
                          className="bg-gray-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="system">System<span className="text-red-500">*</span></Label>
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
                            {materialConstructionOptions.map((option) => (
                              <SelectItem key={option.id} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                            {materialConstructionOptions.length === 0 && (
                              <>
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
                              </>
                            )}
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
                        <Label htmlFor="tmin">
                          Tmin (mm)
                          {calculatingTmin && (
                            <span className="ml-2 text-blue-600 text-xs">
                              Calculating...
                            </span>
                          )}
                        </Label>
                        <Input
                          id="tmin"
                          type="number"
                          step="0.001"
                          value={formData.tmin}
                          placeholder={
                            calculatingTmin
                              ? "Calculating..."
                              : tminResult?.calculation_valid
                              ? "Auto-calculated"
                              : "Enter required inputs for calculation"
                          }
                          disabled
                          className={`bg-gray-50 ${
                            calculatingTmin ? "animate-pulse" : ""
                          }`}
                        />
                        <p className="text-xs text-muted-foreground">
                          {calculatingTmin ? (
                            <span className="text-blue-600">
                              Auto-calculating using ASME VIII Div 1 formula...
                            </span>
                          ) : tminResult?.calculation_valid ? (
                            <span className="text-green-600">
                              ✅ Auto-calculated: t = (P × R) / (S × E - 0.6 ×
                              P)
                            </span>
                          ) : (
                            <span className="text-amber-600">
                              Requires: Design Pressure, Allowable Stress, Weld
                              Join Efficiency, Inner Diameter
                            </span>
                          )}
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
                          {calculatingStress && (
                            <span className="ml-2 text-blue-600 text-xs">
                              Calculating...
                            </span>
                          )}
                        </Label>
                        <Input
                          id="allowableStress"
                          type="number"
                          step="0.1"
                          value={formData.allowableStress}
                          placeholder={
                            calculatingStress
                              ? "Calculating..."
                              : allowableStress?.is_valid_lookup
                              ? "Calculated from material construction"
                              : "Select material and temperature first"
                          }
                          disabled
                          className={`bg-gray-50 ${
                            calculatingStress ? "animate-pulse" : ""
                          }`}
                        />
                        <p className="text-xs text-muted-foreground">
                          {calculatingStress ? (
                            <span className="text-blue-600">
                              Auto-calculating based on material construction
                              and design temperature...
                            </span>
                          ) : allowableStress?.is_valid_lookup ? (
                            <span className="text-green-600">
                              ✅ Auto-calculated using ASME VIII INDEX/MATCH
                              formula
                            </span>
                          ) : (
                            <span className="text-amber-600">
                              Select Material Construction and Design
                              Temperature to auto-calculate
                            </span>
                          )}
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
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select geometry" />
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
                        <Label htmlFor="coatingQuality">Coating Quality<span className="text-red-500">*</span></Label>
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
                        <Label htmlFor="insulationType">Insulation Type<span className="text-red-500">*</span></Label>
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
                        <Label htmlFor="interface">Interface<span className="text-red-500">*</span></Label>
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
                        <Label htmlFor="onlineMonitor">Online Monitor<span className="text-red-500">*</span></Label>
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
                        <Label htmlFor="toxicity">Toxicity<span className="text-red-500">*</span></Label>
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
                    </div>

                    {/* Column 2 - Phase & Composition */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg text-green-600">
                        Phase & Composition
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="fluidPhase">Fluid Phase<span className="text-red-500">*</span></Label>
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
                                {inspectionReportItems}
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
                          {attachmentItems}
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

export default React.memo(NewPressureVesselPage);