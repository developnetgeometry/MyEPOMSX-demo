import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/shared/PageHeader";
import { ArrowLeft, FileSpreadsheet, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAssetStatusOptions } from "@/hooks/queries/useAssetStatusOptions";
import {
  useFacilityOptions,
  useSystemOptionsByFacility,
  usePackageOptionsBySystem,
} from "@/hooks/queries/useFacilitySystemOptions";
import {
  useAssetTagOptions,
  useAssetGroupOptions,
  useAssetCategoryOptions,
  useAssetCategoryGroups,
  useAssetTypeOptions,
  useAssetTypeGroups,
  useAssetClassOptions,
  useManufacturerOptions,
  useAssetAreaOptions,
  useAssetSensorOptions,
} from "@/hooks/queries/useAssetDropdownOptions";

const AssetAddPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("asset-info");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for tracking selected values in cascading dropdowns
  // Facility > System > Package relationship
  const [selectedFacility, setSelectedFacility] = useState<string | undefined>(
    undefined
  );
  const [selectedSystem, setSelectedSystem] = useState<string | undefined>(
    undefined
  );

  // Fetch options from API
  // Cascading data fetching:
  // 1. Facility options are fetched on load
  // 2. System options are fetched when a facility is selected
  // 3. Package options are fetched when a system is selected
  const { data: statusOptionsData = [], isLoading: isStatusLoading } =
    useAssetStatusOptions();
  const { data: facilityOptionsData = [], isLoading: isFacilityLoading } =
    useFacilityOptions();
  const { data: systemOptionsData = [], isLoading: isSystemLoading } =
    useSystemOptionsByFacility(selectedFacility);
  const { data: packageOptionsData = [], isLoading: isPackageLoading } =
    usePackageOptionsBySystem(selectedSystem);

  // Asset dropdown options
  const { data: assetTagOptionsData = [], isLoading: isAssetTagLoading } =
    useAssetTagOptions();
  const { data: assetGroupOptionsData = [], isLoading: isAssetGroupLoading } =
    useAssetGroupOptions();
  const {
    data: assetCategoryOptionsData = [],
    isLoading: isAssetCategoryLoading,
  } = useAssetCategoryOptions();
  const { data: categoryGroups = {}, isLoading: isCategoryGroupLoading } =
    useAssetCategoryGroups();
  // Additional asset dropdown options
  const { data: assetTypeOptionsData = [], isLoading: isAssetTypeLoading } =
    useAssetTypeOptions();
  const { data: typeGroups = {}, isLoading: isTypeGroupLoading } =
    useAssetTypeGroups();
  const { data: assetClassOptionsData = [], isLoading: isAssetClassLoading } =
    useAssetClassOptions();
  const {
    data: manufacturerOptionsData = [],
    isLoading: isManufacturerLoading,
  } = useManufacturerOptions();
  const { data: assetAreaOptionsData = [], isLoading: isAssetAreaLoading } =
    useAssetAreaOptions();
  const { data: assetSensorOptionsData = [], isLoading: isAssetSensorLoading } =
    useAssetSensorOptions();

  // Form state
  const [formData, setFormData] = useState({
    facilityLocations: "",
    systems: "",
    packages: "",
    assetNo: "",
    assetName: "",
    assetTag: "",
    assetStatus: "",
    assetGroup: "",
    commissionDate: "",
    assetCategory: "",
    assetType: "",
    assetSubType: "",
    assetManufacturer: "",
    assetMakerNo: "",
    assetModel: "",
    assetHsCode: "",
    assetSerialNo: "",
    assetArea: "",
    assetClass: "",
    assetSpecification: "",
    assetDrawingNo: "",
    assetImage: [],
    assetIntegrity: false,
    assetReliability: false,
    assetActive: true,
    assetSensor: "",
    assetExClass: "",
    assetExCertificate: "",
  });

  const [assetImageFiles, setAssetImageFiles] = useState<File[]>([]);
  const [assetImagePreviews, setAssetImagePreviews] = useState<string[]>([]);

  const handleChange = (field: string, value: any) => {
    // Implementation of cascading dropdowns logic:
    // When parent dropdown changes, reset all child dropdowns
    if (field === "facilityLocations") {
      setSelectedFacility(value);
      // Reset systems and packages when facility changes
      // This ensures that users can only select valid combinations
      setFormData({
        ...formData,
        [field]: value,
        systems: "", // Reset systems
        packages: "", // Reset packages
      });
      setSelectedSystem(undefined);
    } else if (field === "systems") {
      setSelectedSystem(value);
      // Reset packages when system changes
      // This ensures that packages are filtered based on the selected system
      setFormData({
        ...formData,
        [field]: value,
        packages: "", // Reset packages
      });
    } else if (field === "assetImage") {
      const files = value as File[];
      if (files && files.length > 0) {
        setAssetImageFiles((prev) => [...prev, ...files]);

        const newPreviews = Array.from(files).map((file) =>
          URL.createObjectURL(file)
        );
        setAssetImagePreviews((prev) => [...prev, ...newPreviews]);

        setFormData({
          ...formData,
          [field]: [...((formData.assetImage as File[]) || []), ...files],
        });
      }
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleChange("assetImage", Array.from(files));
    }
  };

  const removeImage = (index: number) => {
    setAssetImageFiles((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });

    setAssetImagePreviews((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]); // Clean up the URL
      newPreviews.splice(index, 1);
      return newPreviews;
    });

    setFormData((prev) => {
      const currentImages = (prev.assetImage as File[]) || [];
      const newImages = [...currentImages];
      newImages.splice(index, 1);
      return {
        ...prev,
        assetImage: newImages,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Show loading toast
      toast({
        title: "Processing",
        description: "Creating asset and uploading images...",
        variant: "default",
      });

      console.log("Submitting form data:", formData);

      // Step 1: Create asset_detail record first to get its ID
      const { data: assetDetailData, error: assetDetailError } = await supabase
        .from("e_asset_detail")
        .insert({
          category_id: formData.assetCategory || null,
          type_id: formData.assetType || null,
          manufacturer_id: formData.assetManufacturer || null,
          maker_no: formData.assetMakerNo || null,
          model: formData.assetModel || null,
          hs_code: formData.assetHsCode || null,
          serial_number: formData.assetSerialNo || null,
          area_id: formData.assetArea || null,
          asset_class_id: formData.assetClass || null,
          specification: formData.assetSpecification || null,
          is_integrity: formData.assetIntegrity,
          is_reliability: formData.assetReliability,
          is_active: formData.assetActive,
          iot_sensor_id: formData.assetSensor || null,
          drawing_no: formData.assetDrawingNo || null,
          ex_class: formData.assetExClass || null,
          ex_certificate: formData.assetExCertificate || null,
          created_by: "5495aba4-2446-41c3-a496-6502c0b10f4b", // You might want to replace this with actual user ID
          created_at: new Date().toISOString(),
          // Leave asset_image_path empty for now, we'll update it after uploading images
        })
        .select("id")
        .single();

      if (assetDetailError) {
        throw new Error(
          `Error creating asset detail: ${assetDetailError.message}`
        );
      }

      const assetDetailId = assetDetailData?.id;

      // Step 2: Create the main asset record
      const { data: assetData, error: assetError } = await supabase
        .from("e_asset")
        .insert({
          facility_id: formData.facilityLocations,
          system_id: formData.systems,
          package_id: formData.packages,
          asset_no: formData.assetNo,
          asset_name: formData.assetName,
          asset_tag_id: formData.assetTag,
          status_id: formData.assetStatus,
          asset_group_id: formData.assetGroup || null,
          commission_date: formData.commissionDate || null,
          asset_detail_id: assetDetailId,
          created_by: "5495aba4-2446-41c3-a496-6502c0b10f4b", // Replace with actual user ID
          created_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (assetError) {
        throw new Error(`Error creating asset: ${assetError.message}`);
      }

      // Step 3: Upload images if any
      const assetId = assetData?.id;
      let imageUrls: string[] = [];

      if (assetId && assetImageFiles.length > 0) {
        // Import here to avoid circular dependencies
        const { uploadMultipleAssetImages } = await import(
          "@/services/assetImageService"
        );
        imageUrls = await uploadMultipleAssetImages(assetId, assetImageFiles);

        // Step 4: Update asset_detail with image paths if images were uploaded
        if (imageUrls.length > 0) {
          const { error: updateError } = await supabase
            .from("e_asset_detail")
            .update({
              asset_image_path: imageUrls.join(","), // Store as comma-separated string
              updated_at: new Date().toISOString(),
              updated_by: "system", // Replace with actual user ID
            })
            .eq("id", assetDetailId);

          if (updateError) {
            console.error(
              "Error updating asset_detail with image paths:",
              updateError
            );
            // Continue execution even if update fails
          }
        }
      }

      // Show success message
      toast({
        title: "Success",
        description: "Asset created successfully",
        variant: "default",
      });

      // Navigate back to asset list
      navigate("/manage/assets");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create asset",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/manage/assets");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Add New Asset"
          icon={<FileSpreadsheet className="h-6 w-6" />}
        />
        <Button
          variant="outline"
          onClick={handleCancel}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Assets
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="asset-info">Asset Information</TabsTrigger>
                <TabsTrigger value="asset-details">Asset Details</TabsTrigger>
                <TabsTrigger value="asset-images">Asset Images</TabsTrigger>
              </TabsList>

              {/* Asset Information Tab */}
              <TabsContent value="asset-info">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="facilityLocations">
                        Facility Location<span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.facilityLocations}
                        onValueChange={(value) =>
                          handleChange("facilityLocations", value)
                        }
                        disabled={isFacilityLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select facility location" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(facilityOptionsData) &&
                            facilityOptionsData.map((option) => (
                              <SelectItem
                                key={option.id}
                                value={String(option.value)}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="systems">
                        System<span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.systems}
                        onValueChange={(value) =>
                          handleChange("systems", value)
                        }
                        disabled={!selectedFacility || isSystemLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select system" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(systemOptionsData) &&
                            systemOptionsData.map((option) => (
                              <SelectItem
                                key={option.id}
                                value={String(option.value)}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="packages">
                        Package<span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.packages}
                        onValueChange={(value) =>
                          handleChange("packages", value)
                        }
                        disabled={!selectedSystem || isPackageLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select package" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(packageOptionsData) &&
                            packageOptionsData.map((option) => (
                              <SelectItem
                                key={option.id}
                                value={String(option.value)}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assetNo">
                        Asset No<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="assetNo"
                        value={formData.assetNo}
                        onChange={(e) =>
                          handleChange("assetNo", e.target.value)
                        }
                        placeholder="Enter asset number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assetName">
                        Asset Name<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="assetName"
                        value={formData.assetName}
                        onChange={(e) =>
                          handleChange("assetName", e.target.value)
                        }
                        placeholder="Enter asset name"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="assetTag">
                        Asset Tag<span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.assetTag}
                        onValueChange={(value) =>
                          handleChange("assetTag", value)
                        }
                        disabled={isAssetTagLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select asset tag" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(assetTagOptionsData) &&
                            assetTagOptionsData.map((option) => (
                              <SelectItem
                                key={option.id}
                                value={String(option.value)}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assetStatus">
                        Asset Status<span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.assetStatus}
                        onValueChange={(value) =>
                          handleChange("assetStatus", value)
                        }
                        disabled={isStatusLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(statusOptionsData) &&
                            statusOptionsData.map((option) => (
                              <SelectItem key={option.id} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assetGroup">Asset Group</Label>
                      <Select
                        value={formData.assetGroup}
                        onValueChange={(value) =>
                          handleChange("assetGroup", value)
                        }
                        disabled={isAssetGroupLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select asset group" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(assetGroupOptionsData) &&
                            assetGroupOptionsData.map((option) => (
                              <SelectItem
                                key={option.id}
                                value={String(option.value)}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="commissionDate">Commission Date</Label>
                      <Input
                        id="commissionDate"
                        type="date"
                        value={formData.commissionDate}
                        onChange={(e) =>
                          handleChange("commissionDate", e.target.value)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-end space-x-2 pt-6">
                      <Button
                        type="button"
                        onClick={() => setActiveTab("asset-details")}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Asset Details Tab */}
              <TabsContent value="asset-details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="assetCategory">Asset Category</Label>
                      <Select
                        value={formData.assetCategory}
                        onValueChange={(value) =>
                          handleChange("assetCategory", value)
                        }
                        disabled={
                          isAssetCategoryLoading || isCategoryGroupLoading
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select asset category" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Group categories by their category group */}
                          {Array.isArray(assetCategoryOptionsData) &&
                            Object.entries(
                              assetCategoryOptionsData.reduce(
                                (groups, option) => {
                                  const groupId =
                                    option.asset_category_group_id;
                                  if (!groups[groupId]) {
                                    groups[groupId] = [];
                                  }
                                  groups[groupId].push(option);
                                  return groups;
                                },
                                {} as Record<
                                  number,
                                  typeof assetCategoryOptionsData
                                >
                              )
                            ).map(([groupId, options]) => (
                              <div key={groupId} className="px-2">
                                <div className="font-semibold text-xs text-muted-foreground py-2 border-b mb-1">
                                  {categoryGroups[groupId] ||
                                    `Group ${groupId}`}
                                </div>
                                {options.map((option) => (
                                  <SelectItem
                                    key={option.id}
                                    value={String(option.value)}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </div>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assetType">Asset Type</Label>
                      <Select
                        value={formData.assetType}
                        onValueChange={(value) =>
                          handleChange("assetType", value)
                        }
                        disabled={isAssetTypeLoading || isTypeGroupLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select asset type" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Group types by their type group */}
                          {Array.isArray(assetTypeOptionsData) &&
                            Object.entries(
                              assetTypeOptionsData.reduce((groups, option) => {
                                const groupId = option.asset_type_group_id;
                                if (!groups[groupId]) {
                                  groups[groupId] = [];
                                }
                                groups[groupId].push(option);
                                return groups;
                              }, {} as Record<number, typeof assetTypeOptionsData>)
                            ).map(([groupId, options]) => (
                              <div key={groupId} className="px-2">
                                <div className="font-semibold text-xs text-muted-foreground py-2 border-b mb-1">
                                  {typeGroups[groupId] || `Group ${groupId}`}
                                </div>
                                {options.map((option) => (
                                  <SelectItem
                                    key={option.id}
                                    value={String(option.value)}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </div>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/*                    <div className="space-y-2">
                      <Label htmlFor="assetSubType">Asset Sub-Type</Label>
                      <Input
                        id="assetSubType"
                        value={formData.assetSubType}
                        onChange={(e) =>
                          handleChange("assetSubType", e.target.value)
                        }
                        placeholder="Enter asset sub-type"
                      />
                    </div>*/}

                    <div className="space-y-2">
                      <Label htmlFor="assetManufacturer">
                        Asset Manufacturer
                      </Label>
                      <Select
                        value={formData.assetManufacturer}
                        onValueChange={(value) =>
                          handleChange("assetManufacturer", value)
                        }
                        disabled={isManufacturerLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select manufacturer" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(manufacturerOptionsData) &&
                            manufacturerOptionsData.map((option) => (
                              <SelectItem
                                key={option.id}
                                value={String(option.value)}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assetMakerNo">Asset Maker No</Label>
                      <Input
                        id="assetMakerNo"
                        value={formData.assetMakerNo}
                        onChange={(e) =>
                          handleChange("assetMakerNo", e.target.value)
                        }
                        placeholder="Enter asset maker number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assetModel">Asset Model</Label>
                      <Input
                        id="assetModel"
                        value={formData.assetModel}
                        onChange={(e) =>
                          handleChange("assetModel", e.target.value)
                        }
                        placeholder="Enter asset model"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assetSpecification">
                        Asset Specification
                      </Label>
                      <Textarea
                        id="assetSpecification"
                        value={formData.assetSpecification}
                        onChange={(e) =>
                          handleChange("assetSpecification", e.target.value)
                        }
                        placeholder="Enter asset specification"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="assetHsCode">Asset HS Code</Label>
                      <Input
                        id="assetHsCode"
                        value={formData.assetHsCode}
                        onChange={(e) =>
                          handleChange("assetHsCode", e.target.value)
                        }
                        placeholder="Enter asset HS code"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assetSerialNo">Asset Serial No</Label>
                      <Input
                        id="assetSerialNo"
                        value={formData.assetSerialNo}
                        onChange={(e) =>
                          handleChange("assetSerialNo", e.target.value)
                        }
                        placeholder="Enter asset serial number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assetArea">Asset Area</Label>
                      <Select
                        value={formData.assetArea}
                        onValueChange={(value) =>
                          handleChange("assetArea", value)
                        }
                        disabled={isAssetAreaLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select asset area" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(assetAreaOptionsData) &&
                            assetAreaOptionsData.map((option) => (
                              <SelectItem
                                key={option.id}
                                value={String(option.value)}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assetClass">Asset Class</Label>
                      <Select
                        value={formData.assetClass}
                        onValueChange={(value) =>
                          handleChange("assetClass", value)
                        }
                        disabled={isAssetClassLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select asset class" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(assetClassOptionsData) &&
                            assetClassOptionsData.map((option) => (
                              <SelectItem
                                key={option.id}
                                value={String(option.value)}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assetDrawingNo">Asset Drawing No</Label>
                      <Input
                        id="assetDrawingNo"
                        value={formData.assetDrawingNo}
                        onChange={(e) =>
                          handleChange("assetDrawingNo", e.target.value)
                        }
                        placeholder="Enter asset drawing number"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="assetIntegrity"
                          checked={formData.assetIntegrity}
                          onCheckedChange={(checked) =>
                            handleChange("assetIntegrity", checked)
                          }
                        />
                        <Label htmlFor="assetIntegrity">Integrity</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="assetReliability"
                          checked={formData.assetReliability}
                          onCheckedChange={(checked) =>
                            handleChange("assetReliability", checked)
                          }
                        />
                        <Label htmlFor="assetReliability">Reliability</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="assetActive"
                          checked={formData.assetActive}
                          onCheckedChange={(checked) =>
                            handleChange("assetActive", checked)
                          }
                        />
                        <Label htmlFor="assetActive">Active</Label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab("asset-info")}
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setActiveTab("asset-images")}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Asset Images Tab */}
              <TabsContent value="asset-images">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="assetSensor">Asset Sensor</Label>
                      <Select
                        value={formData.assetSensor}
                        onValueChange={(value) =>
                          handleChange("assetSensor", value)
                        }
                        disabled={isAssetSensorLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select asset sensor" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(assetSensorOptionsData) &&
                            assetSensorOptionsData.map((option) => (
                              <SelectItem
                                key={option.id}
                                value={String(option.value)}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assetExClass">Asset Ex Class</Label>
                      <Input
                        id="assetExClass"
                        value={formData.assetExClass}
                        onChange={(e) =>
                          handleChange("assetExClass", e.target.value)
                        }
                        placeholder="Enter asset EX class"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assetExCertificate">
                        Asset Ex Certificate
                      </Label>
                      <Input
                        id="assetExCertificate"
                        value={formData.assetExCertificate}
                        onChange={(e) =>
                          handleChange("assetExCertificate", e.target.value)
                        }
                        placeholder="Enter asset EX certificate"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="assetImage">Asset Images</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center relative">
                        {assetImagePreviews.length > 0 ? (
                          <div className="w-full">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              {assetImagePreviews.map((preview, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={preview}
                                    alt={`Asset Preview ${index + 1}`}
                                    className="h-[150px] w-full object-cover rounded-md"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-6 w-6"
                                    onClick={() => removeImage(index)}
                                  >
                                    ×
                                  </Button>
                                </div>
                              ))}
                            </div>

                            <div className="flex flex-col items-center mt-4">
                              <div className="relative w-full h-12">
                                <input
                                  id="assetImage"
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                  onChange={handleFileChange}
                                />
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-2 z-20"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  document
                                    .getElementById("assetImage")
                                    ?.click();
                                }}
                              >
                                Add More Images
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="h-10 w-10 text-gray-400" />
                            <p className="text-sm text-gray-500">
                              Click to upload or drag and drop
                            </p>
                            <div className="relative w-full h-12">
                              <input
                                id="assetImage"
                                type="file"
                                multiple
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                onChange={handleFileChange}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-2 z-20"
                              onClick={(e) => {
                                e.stopPropagation();
                                document.getElementById("assetImage")?.click();
                              }}
                            >
                              Select Files
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between space-x-2 pt-14">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab("asset-details")}
                      >
                        Back
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Asset"}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default AssetAddPage;
