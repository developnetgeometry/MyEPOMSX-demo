import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/shared/PageHeader";
import {
  ArrowLeft,
  FileSpreadsheet,
  Upload,
  AlertTriangle,
  XCircle,
} from "lucide-react";
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
import { useAuth } from "@/contexts/AuthContext";
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
  useCriticalityOptions,
  useSCEOptions,
} from "@/hooks/queries/useAssetDropdownOptions";
import {
  validateImageFile,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
} from "@/services/assetImageService";
import { useQueryClient } from "@tanstack/react-query";

const AssetAddPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth(); // Get user directly
  const [activeTab, setActiveTab] = useState("asset-info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    total: number;
    success: number;
    inProgress: boolean;
  }>({
    total: 0,
    success: 0,
    inProgress: false,
  });
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const parentAssetId = queryParams.get("parentAssetId");

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
  const { data: criticalityOptionsData = [], isLoading: isCriticalityLoading } =
    useCriticalityOptions();
  const { data: sceOptionsData = [], isLoading: isSCELoading } =
    useSCEOptions();

  // Form state
  const [formData, setFormData] = useState({
    facilityLocations: "",
    systems: "",
    packages: "",
    parentAssetId: "",
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
    assetCriticality: false,
    assetSCECode: false,
    criticalityId: "",
    sceId: "",
  });

  const [assetImageFiles, setAssetImageFiles] = useState<File[]>([]);
  const [assetImagePreviews, setAssetImagePreviews] = useState<string[]>([]);

  // Validate files before setting them
  const validateFiles = (
    files: File[]
  ): { validFiles: File[]; errors: string[] } => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file, index) => {
      const error = validateImageFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    return { validFiles, errors };
  };

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
        // Validate files before adding
        const { validFiles, errors } = validateFiles(files);

        if (errors.length > 0) {
          setFileErrors((prev) => [...prev, ...errors]);
          toast({
            title: "File validation error",
            description: errors[0],
            variant: "destructive",
          });
        }

        if (validFiles.length > 0) {
          setAssetImageFiles((prev) => [...prev, ...validFiles]);

          const newPreviews = Array.from(validFiles).map((file) =>
            URL.createObjectURL(file)
          );
          setAssetImagePreviews((prev) => [...prev, ...newPreviews]);

          setFormData({
            ...formData,
            [field]: [
              ...((formData.assetImage as File[]) || []),
              ...validFiles,
            ],
          });
        }
      }
    } else if (field === "assetCriticality") {
      // When Criticality checkbox is unchecked, reset the criticality dropdown value
      setFormData({
        ...formData,
        [field]: value,
        criticalityId: value ? formData.criticalityId : "",
      });
    } else if (field === "assetSCECode") {
      // When SCE Code checkbox is unchecked, reset the SCE dropdown value
      setFormData({
        ...formData,
        [field]: value,
        sceId: value ? formData.sceId : "",
      });
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

    // Clear any errors for the removed image
    setFileErrors((prev) => {
      if (prev.length <= index) return prev;
      const newErrors = [...prev];
      newErrors.splice(index, 1);
      return newErrors;
    });
  };

  const clearFileErrors = () => {
    setFileErrors([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting) return;

    // Ensure we have a user ID
    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description:
          "You need to be logged in to create an asset. Please log in and try again.",
        variant: "destructive",
      });
      return;
    }

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
          category_id: formData.assetCategory
            ? parseInt(formData.assetCategory)
            : null,
          type_id: formData.assetType ? parseInt(formData.assetType) : null,
          manufacturer_id: formData.assetManufacturer
            ? parseInt(formData.assetManufacturer)
            : null,
          maker_no: formData.assetMakerNo || null,
          model: formData.assetModel || null,
          hs_code: formData.assetHsCode || null,
          serial_number: formData.assetSerialNo || null,
          area_id: formData.assetArea ? parseInt(formData.assetArea) : null,
          asset_class_id: formData.assetClass
            ? parseInt(formData.assetClass)
            : null,
          parent_asset_id: formData.parentAssetId ? parseInt(formData.parentAssetId) : null,
          specification: formData.assetSpecification || null,
          is_integrity: formData.assetIntegrity,
          is_reliability: formData.assetReliability,
          is_active: formData.assetActive,
          is_sce: formData.assetSCECode,
          is_criticality: formData.assetCriticality,
          iot_sensor_id: formData.assetSensor
            ? parseInt(formData.assetSensor)
            : null,
          drawing_no: formData.assetDrawingNo || null,
          criticality_id: formData.criticalityId
            ? parseInt(formData.criticalityId)
            : null,
          sce_id: formData.sceId ? parseInt(formData.sceId) : null,
          ex_class: formData.assetExClass || null,
          ex_certificate: formData.assetExCertificate || null,
          created_by: user.id, // Use the actual logged-in user ID
          created_at: new Date().toISOString(),
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
      // Find the selected status option to get its id
      const selectedStatusOption = Array.isArray(statusOptionsData)
        ? statusOptionsData.find(
            (option) => String(option.value) === String(formData.assetStatus)
          )
        : undefined;

      const statusId = selectedStatusOption?.id || formData.assetStatus || null;

      const { data: assetData, error: assetError } = await supabase
        .from("e_asset")
        .insert({
          facility_id: formData.facilityLocations
            ? parseInt(formData.facilityLocations)
            : null,
          system_id: formData.systems ? parseInt(formData.systems) : null,
          package_id: formData.packages ? parseInt(formData.packages) : null,
          asset_no: formData.assetNo,
          asset_name: formData.assetName,
          asset_tag_id: formData.assetTag ? parseInt(formData.assetTag) : null,
          asset_sce_id: formData.sceId ? parseInt(formData.sceId) : null,
          status_id: statusId
            ? typeof statusId === "string"
              ? parseInt(statusId)
              : statusId
            : null,
          asset_group_id: formData.assetGroup
            ? parseInt(formData.assetGroup)
            : null,
          commission_date: formData.commissionDate || null,
          asset_detail_id: assetDetailId,
          created_by: user.id, // Use the actual logged-in user ID
          created_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (assetError) {
        throw new Error(`Error creating asset: ${assetError.message}`);
      }

      // Step 3: Upload images if any
      const assetId = assetData?.id;
      let attachments = [];

      if (assetId && assetImageFiles.length > 0) {
        try {
          setUploadStatus({
            total: assetImageFiles.length,
            success: 0,
            inProgress: true,
          });

          // Import here to avoid circular dependencies
          const { uploadMultipleAssetImages } = await import(
            "@/services/assetImageService"
          );

          // Upload images and save to e_asset_attachment table
          // Use the user ID from the auth context
          attachments = await uploadMultipleAssetImages(
            assetId,
            assetImageFiles,
            user.id
          );

          setUploadStatus((prev) => ({
            ...prev,
            success: attachments.length,
            inProgress: false,
          }));

          if (attachments.length === 0) {
            console.error("Failed to upload images or save attachments");
            toast({
              title: "Warning",
              description: "Asset created but images could not be uploaded",
              variant: "destructive",
            });
          } else if (attachments.length < assetImageFiles.length) {
            toast({
              title: "Partial Upload",
              description: `Asset created but only ${attachments.length} out of ${assetImageFiles.length} images were uploaded`,
              variant: "default",
            });
          }
        } catch (uploadError) {
          console.error("Error during image upload:", uploadError);
          // Continue execution even if uploads fail
          toast({
            title: "Upload Error",
            description:
              "There was a problem uploading images. The asset was created without images.",
            variant: "destructive",
          });
          setUploadStatus((prev) => ({ ...prev, inProgress: false }));
        }
      }

      
      // Show success message
      toast({
        title: "Success",
        description: "Asset created successfully",
        variant: "default",
      });
      
      // Invalidate queries to refresh asset data
      await queryClient.invalidateQueries({ queryKey: ["assets"]} );

      // Navigate back to asset list
      navigate("/manage/assets");
    } catch (error) {
      const errorMessage =
        typeof error?.message === "string" ? error.message : "";
      if (
        error.code === "23505" ||
        errorMessage.includes('duplicate key value violates unique constraint "e_asset_unique"')
      ) {
        toast({
          title: "Duplicate Entry",
          description:
            "Asset No. already exists. Please enter a different Asset No.",
          variant: "destructive",
        });
      } else {
        console.error("Error submitting form:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to create asset",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/manage/assets");
  };

  // Clear ObjectURLs on component unmount
  useEffect(() => {
    return () => {
      assetImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    if (parentAssetId) {
      setFormData((prev) => ({
        ...prev,
        parentAssetId,
      }));
    }
  }, [parentAssetId]);
  

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
                <div className="space-y-8">
                  {/* Basic Information Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 border-b pb-2">
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                assetTypeOptionsData.reduce(
                                  (groups, option) => {
                                    const groupId = option.asset_type_group_id;
                                    if (!groups[groupId]) {
                                      groups[groupId] = [];
                                    }
                                    groups[groupId].push(option);
                                    return groups;
                                  },
                                  {} as Record<
                                    number,
                                    typeof assetTypeOptionsData
                                  >
                                )
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
                    </div>
                  </div>

                  {/* Manufacturing Details Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 border-b pb-2">
                      Manufacturing Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    </div>

                    <div className="grid grid-cols-1 gap-6 mt-6">
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
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Asset Properties Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 border-b pb-2">
                      Asset Properties
                    </h3>
                    <div className="space-y-6">
                      {/* Basic Properties */}
                      <div>
                        <h4 className="text-sm font-medium mb-3 text-gray-700">
                          Basic Properties
                        </h4>
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
                            <Label htmlFor="assetReliability">
                              Reliability
                            </Label>
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
                      </div>

                      {/* Criticality and SCE Properties */}
                      <div>
                        <h4 className="text-sm font-medium mb-3 text-gray-700">
                          Risk Assessment
                        </h4>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="assetCriticality"
                              checked={formData.assetCriticality}
                              onCheckedChange={(checked) =>
                                handleChange("assetCriticality", checked)
                              }
                            />
                            <Label htmlFor="assetCriticality">
                              Criticality
                            </Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="assetSCECode"
                              checked={formData.assetSCECode}
                              onCheckedChange={(checked) =>
                                handleChange("assetSCECode", checked)
                              }
                            />
                            <Label htmlFor="assetSCECode">SCE Code</Label>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Conditional Criticality Dropdown */}
                          {formData.assetCriticality && (
                            <div className="space-y-2">
                              <Label htmlFor="criticalityId">
                                Criticality Level
                              </Label>
                              <Select
                                value={formData.criticalityId}
                                onValueChange={(value) =>
                                  handleChange("criticalityId", value)
                                }
                                disabled={isCriticalityLoading}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Criticality Level" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.isArray(criticalityOptionsData) &&
                                    criticalityOptionsData.map((option) => (
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
                          )}

                          {/* SCE Code Dropdown */}
                          {formData.assetSCECode && (
                            <div className="space-y-2">
                              <Label htmlFor="sceId">SCE Code</Label>
                              <Select
                                value={formData.sceId}
                                onValueChange={(value) =>
                                  handleChange("sceId", value)
                                }
                                disabled={isSCELoading}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select SCE Code" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.isArray(sceOptionsData) &&
                                    sceOptionsData.map((option) => (
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
                          )}
                        </div>
                      </div>

                      {/* Ex Class and Ex Certificate */}
                      <div>
                        <h4 className="text-sm font-medium mb-3 text-gray-700">
                          Explosion Protection
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="assetExClass">Ex Class</Label>
                            <Input
                              id="assetExClass"
                              value={formData.assetExClass}
                              onChange={(e) =>
                                handleChange("assetExClass", e.target.value)
                              }
                              placeholder="Enter Ex Class"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="assetExCertificate">
                              Ex Certificate
                            </Label>
                            <Input
                              id="assetExCertificate"
                              value={formData.assetExCertificate}
                              onChange={(e) =>
                                handleChange(
                                  "assetExCertificate",
                                  e.target.value
                                )
                              }
                              placeholder="Enter Ex Certificate"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between space-x-2 pt-6 border-t">
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
              </TabsContent>

              {/* Asset Images Tab */}
              <TabsContent value="asset-images">
                <div className="max-w-4xl mx-auto">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-gray-900 border-b pb-2">
                        Asset Images
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="assetImage">Upload Images</Label>
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
                                  document
                                    .getElementById("assetImage")
                                    ?.click();
                                }}
                              >
                                Select Files
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between space-x-2 pt-6 border-t">
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
