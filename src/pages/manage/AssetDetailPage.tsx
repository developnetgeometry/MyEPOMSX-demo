import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Archive, Printer, Loader2, X } from "lucide-react";
import {
  useAssetAttachments,
  useAssetWithRelations,
  useChildAssetsByParentId,
  useItemByBomId,
  useRemoveChildAsset,
  useRemoveBom,
  useWorkOrdersByAssetId,
} from "@/hooks/queries/useAssets";
import { formatDate, getFileNameFromPath } from "@/utils/formatters";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import {
  useAssetTagOptions,
  useAssetClassOptions,
  useAssetSensorOptions,
  useAssetCategoryOptions,
  useAssetTypeOptions,
  useManufacturerOptions,
  useAssetAreaOptions,
  useCriticalityOptions,
  useSCEOptions,
} from "@/hooks/queries/useAssetDropdownOptions";
import { useAssetStatusOptions } from "@/hooks/queries/useAssetStatusOptions";
import { useQueryClient } from "@tanstack/react-query";
import { assetKeys } from "@/hooks/queries/useAssets";
import InstallationFormDialog from "@/components/manage/InstallationFormDialog";
import InstallationDetailDialog from "@/components/manage/InstallationDetailDialog";
import AssetBasicInfoCard from "@/components/asset/AssetBasicInfoCard";
import AssetDetailsCard from "@/components/asset/AssetDetailsCard";
import AssetTabs from "@/components/asset/AssetTabs";
import AssetChildDetailDialog from "@/components/asset/AssetChildDetailDialog";
import AddChildAssetDialog from "@/components/asset/AddChildAssetDialog";
import { useLoadingState } from "@/hooks/use-loading-state";
import { AddBomDialog } from "@/components/asset/AddBomDialog";
import BomDetailDialog from "@/components/asset/BomDetailDialog";
import BomFormDialog from "@/components/asset/BomFormDialog";

// Dummy data for IoT Tab
const iotData = [
  {
    id: "1",
    sensorType: "Temperature Sensor",
    readingValue: "95°C",
    status: "Warning",
    lastSync: "2025-04-29 14:00",
  },
  {
    id: "2",
    sensorType: "Pressure Transmitter",
    readingValue: "12.5 bar",
    status: "Normal",
    lastSync: "2025-04-29 14:15",
  },
  {
    id: "3",
    sensorType: "Vibration Sensor",
    readingValue: "3.2 mm/s",
    status: "Critical",
    lastSync: "2025-04-29 13:55",
  },
  {
    id: "4",
    sensorType: "Flow Meter",
    readingValue: "250 L/min",
    status: "Normal",
    lastSync: "2025-04-29 14:10",
  },
  {
    id: "5",
    sensorType: "Level Sensor",
    readingValue: "78%",
    status: "Normal",
    lastSync: "2025-04-29 14:05",
  },
];

const AssetDetailPage: React.FC = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("installation");
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isLoading: isAssetLoading, withLoading } = useLoadingState();

  const [isBomDetailOpen, setIsBomDetailOpen] = useState(false);
  const [isBomFormOpen, setIsBomFormOpen] = useState(false);
  const [selectedBom, setSelectedBom] = useState<any>(null);

  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formSubmissionError, setFormSubmissionError] = useState<string | null>(
    null
  );
  const [formSubmissionSuccess, setFormSubmissionSuccess] = useState(false);

  // Data fetching hooks
  const {
    data: asset,
    isLoading,
    error,
    refetch,
  } = useAssetWithRelations(Number(id));
  const { data: statusOptions = [] } = useAssetStatusOptions();
  const { data: assetTagOptions = [] as any[] } = useAssetTagOptions();
  const { data: assetClassOptions = [] as any[] } = useAssetClassOptions();
  const { data: assetSensorOptions = [] as any[] } = useAssetSensorOptions();
  const { data: categoryOptions = [] as any[] } = useAssetCategoryOptions();
  const { data: typeOptions = [] as any[] } = useAssetTypeOptions();
  const { data: manufacturerOptions = [] as any[] } = useManufacturerOptions();
  const { data: areaOptions = [] as any[] } = useAssetAreaOptions();
  const { data: criticalityOptions = [] as any[] } = useCriticalityOptions();
  const { data: sceOptions = [] as any[] } = useSCEOptions();
  const { data: childAssets = [], isLoading: childAssetsLoading } =
    useChildAssetsByParentId(Number(id));

  const deleteChildAssetMutation = useRemoveChildAsset();
  const deleteBomMutation = useRemoveBom();

  // For file upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  // Installation dialog states
  const [isInstallationFormOpen, setIsInstallationFormOpen] = useState(false);
  const [isInstallationDetailOpen, setIsInstallationDetailOpen] =
    useState(false);
  const [selectedInstallation, setSelectedInstallation] = useState<any>(null);
  const [isEditingInstallation, setIsEditingInstallation] = useState(false);
  const [isAddChildDialogOpen, setIsAddChildDialogOpen] = useState(false);
  const [isAddBomDialogOpen, setIsAddBomDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Asset base fields
    assetNo: "",
    assetName: "",
    assetTagId: "",
    assetStatusId: "",
    commissionDate: "",
    // Asset detail fields
    categoryId: "",
    typeId: "",
    manufacturerId: "",
    makerNo: "",
    model: "",
    serialNumber: "",
    hsCode: "",
    areaId: "",
    assetClassId: "",
    specification: "",
    isIntegrity: false,
    isReliability: false,
    isActive: true,
    iotSensorId: "",
    // Criticality and SCE fields
    isCriticality: false,
    isSce: false,
    criticalityId: "",
    sceId: "",
    // Installation fields
    exClass: "",
    exCertificate: "",
    drawingNo: "",
    description: "",
  });

  // Initialize form data when asset is loaded
  useEffect(() => {
    if (asset) {
      const assetDetail = (asset.asset_detail || {}) as {
        category_id?: number;
        type_id?: number;
        manufacturer_id?: number;
        maker_no?: string;
        model?: string;
        serial_number?: string;
        hs_code?: string;
        area_id?: number;
        asset_class_id?: number;
        specification?: string;
        is_integrity?: boolean;
        is_reliability?: boolean;
        is_active?: boolean;
        iot_sensor_id?: number;
        is_criticality?: boolean;
        is_sce?: boolean;
        criticality_id?: number;
        sce_id?: number;
        ex_class?: string;
        ex_certificate?: string;
        drawing_no?: string;
        description?: string;
      };

      type Installation = {
        ex_class?: string;
        ex_certificate?: string;
        drawing_no?: string;
        description?: string;
      };

      const installation =
        asset.asset_installation && asset.asset_installation.length > 0
          ? (asset.asset_installation[0] as Installation)
          : ({} as Installation);

      setFormData({
        // Asset base fields
        assetNo: asset.asset_no || "",
        assetName: asset.asset_name || "",
        assetTagId: asset.asset_tag_id?.toString() || "",
        assetStatusId: asset.status_id?.toString() || "",
        commissionDate: asset.commission_date || "",

        // Asset detail fields
        categoryId: assetDetail.category_id?.toString() || "",
        typeId: assetDetail.type_id?.toString() || "",
        manufacturerId: assetDetail.manufacturer_id?.toString() || "",
        makerNo: assetDetail.maker_no || "",
        model: assetDetail.model || "",
        serialNumber: assetDetail.serial_number || "",
        hsCode: assetDetail.hs_code || "",
        areaId: assetDetail.area_id?.toString() || "",
        assetClassId: assetDetail.asset_class_id?.toString() || "",
        specification: assetDetail.specification || "",
        isIntegrity: assetDetail.is_integrity || false,
        isReliability: assetDetail.is_reliability || false,
        isActive: assetDetail.is_active !== false, // Default to true if null
        iotSensorId: assetDetail.iot_sensor_id?.toString() || "",

        // Criticality and SCE fields
        isCriticality: assetDetail.is_criticality || false,
        isSce: assetDetail.is_sce || false,
        criticalityId: assetDetail.criticality_id?.toString() || "",
        sceId: assetDetail.sce_id?.toString() || "",

        // Installation fields
        exClass: assetDetail.ex_class || "",
        exCertificate: assetDetail.ex_certificate || "",
        drawingNo: assetDetail.drawing_no || "",
        description: assetDetail.description || "",
      });
    }
  }, [asset]);

  // Auto-clear success message after 3 seconds
  useEffect(() => {
    if (formSubmissionSuccess) {
      const timer = setTimeout(() => {
        setFormSubmissionSuccess(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [formSubmissionSuccess]);

  const assetDetails = asset?.asset_detail;
  const bomID = assetDetails?.bom_id;
  const { data: bomData = [], isLoading: bomLoading } = useItemByBomId(
    bomID || 0
  );
  const { data: workOrder = [], isLoading: workOrderLoading } =
    useWorkOrdersByAssetId(Number(id));
  const { data: attachments = [], refetch: refetchAttachments } =
    useAssetAttachments(Number(id));

  const assetInstallation = asset?.asset_installation;

  const commissionDate = asset?.commission_date
    ? formatDate(asset.commission_date)
    : "";

  const handleChange = (field: string, value: any) => {
    // Clear error when field is edited
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: undefined,
      });
    }

    // Handle criticality and SCE checkbox logic
    if (field === "isCriticality") {
      // When Criticality checkbox is unchecked, reset the criticality dropdown value
      setFormData({
        ...formData,
        [field]: value,
        criticalityId: value ? formData.criticalityId : "",
      });
    } else if (field === "isSce") {
      // When SCE checkbox is unchecked, reset the SCE dropdown value
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

    // Clear any general submission errors
    if (formSubmissionError) {
      setFormSubmissionError(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Basic validation
      if (!file.type.startsWith("image/")) {
        setFileUploadError("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setFileUploadError("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      setFileUploadError(null);
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    // Reset file selection when toggling edit mode
    setSelectedFile(null);
    setFileUploadError(null);
  };

  const handleCancel = () => {
    // Show confirmation dialog if form has been modified
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel? Any unsaved changes will be lost."
    );

    if (confirmCancel) {
      // Reset form data to original asset data
      if (asset) {
        const assetDetail = (asset.asset_detail || {}) as {
          category_id?: number;
          type_id?: number;
          manufacturer_id?: number;
          maker_no?: string;
          model?: string;
          serial_number?: string;
          hs_code?: string;
          area_id?: number;
          asset_class_id?: number;
          specification?: string;
          is_integrity?: boolean;
          is_reliability?: boolean;
          is_active?: boolean;
          iot_sensor_id?: number;
          is_criticality?: boolean;
          is_sce?: boolean;
          criticality_id?: number;
          sce_id?: number;
        };

        type Installation = {
          ex_class?: string;
          ex_certificate?: string;
          drawing_no?: string;
          description?: string;
        };

        const installation =
          asset.asset_installation && asset.asset_installation.length > 0
            ? (asset.asset_installation[0] as Installation)
            : ({} as Installation);

        setFormData({
          // Asset base fields
          assetNo: asset.asset_no || "",
          assetName: asset.asset_name || "",
          assetTagId: asset.asset_tag_id?.toString() || "",
          assetStatusId: asset.status_id?.toString() || "",
          commissionDate: asset.commission_date || "",

          // Asset detail fields
          categoryId: assetDetail.category_id?.toString() || "",
          typeId: assetDetail.type_id?.toString() || "",
          manufacturerId: assetDetail.manufacturer_id?.toString() || "",
          makerNo: assetDetail.maker_no || "",
          model: assetDetail.model || "",
          serialNumber: assetDetail.serial_number || "",
          hsCode: assetDetail.hs_code || "",
          areaId: assetDetail.area_id?.toString() || "",
          assetClassId: assetDetail.asset_class_id?.toString() || "",
          specification: assetDetail.specification || "",
          isIntegrity: assetDetail.is_integrity || false,
          isReliability: assetDetail.is_reliability || false,
          isActive: assetDetail.is_active !== false,
          iotSensorId: assetDetail.iot_sensor_id?.toString() || "",

          // Criticality and SCE fields
          isCriticality: assetDetail.is_criticality || false,
          isSce: assetDetail.is_sce || false,
          criticalityId: assetDetail.criticality_id?.toString() || "",
          sceId: assetDetail.sce_id?.toString() || "",

          // Installation fields
          exClass: installation.ex_class || "",
          exCertificate: installation.ex_certificate || "",
          drawingNo: installation.drawing_no || "",
          description: installation.description || "",
        });
      }

      // Reset state
      setSelectedFile(null);
      setFileUploadError(null);
      setErrors({});
      setFormSubmissionError(null);
      setFormSubmissionSuccess(false);

      // Exit edit mode
      setIsEditing(false);
    }
  };

  const handleWorkRequest = () => {
    toast({
      title: "Success",
      description: "Adding work request",
      variant: "default",
    });
    navigate(`/maintain/work-request?assetId=${id}`);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.assetNo.trim()) {
      newErrors.assetNo = "Asset No is required";
    }

    if (!formData.assetName.trim()) {
      newErrors.assetName = "Asset Name is required";
    }

    // Add more validations as needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyChanges = async () => {
    if (isSubmitting) return;

    // Validate form before submission
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(
        `[name="${firstErrorField}"]`
      );
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);
    setFormSubmissionError(null);
    setFormSubmissionSuccess(false);

    try {
      // 1. Update the e_asset table
      const { error: assetError } = await supabase
        .from("e_asset")
        .update({
          asset_no: formData.assetNo,
          asset_name: formData.assetName,
          asset_tag_id: formData.assetTagId
            ? parseInt(formData.assetTagId)
            : null,
          status_id: formData.assetStatusId
            ? parseInt(formData.assetStatusId)
            : null,
          commission_date: formData.commissionDate || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", Number(id));

      if (assetError) {
        throw new Error(`Error updating asset: ${assetError.message}`);
      }

      // 2. Update the e_asset_detail table
      if (assetDetails?.id) {
        const { error: assetDetailError } = await supabase
          .from("e_asset_detail")
          .update({
            category_id: formData.categoryId
              ? parseInt(formData.categoryId)
              : null,
            type_id: formData.typeId ? parseInt(formData.typeId) : null,
            manufacturer_id: formData.manufacturerId
              ? parseInt(formData.manufacturerId)
              : null,
            maker_no: formData.makerNo || null,
            model: formData.model || null,
            hs_code: formData.hsCode || null,
            serial_number: formData.serialNumber || null,
            area_id: formData.areaId ? parseInt(formData.areaId) : null,
            asset_class_id: formData.assetClassId
              ? parseInt(formData.assetClassId)
              : null,
            specification: formData.specification || null,
            is_integrity: formData.isIntegrity,
            is_reliability: formData.isReliability,
            is_active: formData.isActive,
            is_criticality: formData.isCriticality,
            is_sce: formData.isSce,
            criticality_id:
              formData.criticalityId && formData.isCriticality
                ? parseInt(formData.criticalityId)
                : null,
            sce_id:
              formData.sceId && formData.isSce
                ? parseInt(formData.sceId)
                : null,
            iot_sensor_id: formData.iotSensorId
              ? parseInt(formData.iotSensorId)
              : null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", assetDetails.id);

        if (assetDetailError) {
          throw new Error(
            `Error updating asset details: ${assetDetailError.message}`
          );
        }
      }

      // 3. Update installation details if they exist
      if (
        assetInstallation &&
        assetInstallation.length > 0 &&
        assetInstallation[0].id
      ) {
        const { error: installationError } = await supabase
          .from("e_asset_installation")
          .update({
            ex_class: formData.exClass || null,
            ex_certificate: formData.exCertificate || null,
            drawing_no: formData.drawingNo || null,
            description: formData.description || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", assetInstallation[0].id);

        if (installationError) {
          throw new Error(
            `Error updating installation details: ${installationError.message}`
          );
        }
      }

      // 4. Handle file upload if a file is selected
      if (selectedFile) {
        try {
          // Generate unique file path
          const fileExt = selectedFile.name.split(".").pop();
          const fileName = `${Date.now()}.${fileExt}`;
          const filePath = `${id}/${fileName}`;

          // Upload to storage bucket
          const { data: uploadData, error: uploadError } =
            await supabase.storage
              .from("asset-image")
              .upload(filePath, selectedFile, {
                cacheControl: "3600",
                upsert: true,
              });

          if (uploadError) {
            throw new Error(`Error uploading file: ${uploadError.message}`);
          }

          // Get public URL
          const { data: publicUrlData } = supabase.storage
            .from("asset-image")
            .getPublicUrl(filePath);

          if (!publicUrlData?.publicUrl) {
            throw new Error("Failed to get public URL for uploaded file");
          }

          // Add record to e_asset_attachment
          const { error: attachmentError } = await supabase
            .from("e_asset_attachment")
            .insert({
              asset_id: Number(id),
              type: "image",
              file_path: publicUrlData.publicUrl,
              file_name: selectedFile.name,
              file_type: selectedFile.type,
              file_size: selectedFile.size,
              notes: "Asset image uploaded via asset detail page",
              created_at: new Date().toISOString(),
            });

          if (attachmentError) {
            throw new Error(
              `Error saving attachment record: ${attachmentError.message}`
            );
          }

          // Refresh attachments list
          await refetchAttachments();
        } catch (fileError: any) {
          // Continue with other updates even if file upload fails
          console.error("File upload error:", fileError);
          toast({
            title: "Warning",
            description: `Asset updated but image upload failed: ${fileError.message}`,
            variant: "destructive",
          });
        }
      }

      // Mark submission as successful
      setFormSubmissionSuccess(true);

      // Success message
      toast({
        title: "Success",
        description: "Asset updated successfully",
        variant: "default",
      });

      // Invalidate all assets queries to refetch fresh data
      await queryClient.invalidateQueries({ queryKey: assetKeys.all });

      // Refetch the current asset data instead of page reload
      await refetch();

      // Exit edit mode
      setIsEditing(false);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error updating asset:", error);

      setFormSubmissionError(
        error instanceof Error ? error.message : "Failed to update asset"
      );

      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update asset",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddInstallation = () => {
    setSelectedInstallation(null);
    setIsEditingInstallation(false);
    setIsInstallationFormOpen(true);
  };

  const handleViewInstallation = (installation: any) => {
    setSelectedInstallation(installation);
    setIsInstallationDetailOpen(true);
  };

  const handleEditInstallation = (installation: any) => {
    setSelectedInstallation(installation);
    setIsEditingInstallation(true);
    setIsInstallationFormOpen(true);
  };

  const handleDeleteInstallation = async (installationId: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this installation record?"
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("e_asset_installation")
        .delete()
        .eq("id", installationId);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Installation record deleted successfully",
      });

      // Refresh the asset data to update the installation list
      refetch();
    } catch (error: any) {
      console.error("Error deleting installation:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete installation record",
        variant: "destructive",
      });
    }
  };

  const handleInstallationSuccess = () => {
    // Refresh the asset data to show updated installations
    refetch();
  };

  const handleAddChildAsset = () => {
    setIsAddChildDialogOpen(true);
  };

  const [isChildAssetDetailOpen, setIsChildAssetDetailOpen] = useState(false);
  const [selectedChildAsset, setSelectedChildAsset] = useState<any>(null);

  // Open form for editing/adding child asset
  const handleOpenChildAssetForm = (childAsset: any = null) => {
    navigate(`/manage/assets/${childAsset.id}`);
  };

  // Open detail dialog for viewing child asset
  const handleOpenChildAssetDetail = (childAsset: any) => {
    setSelectedChildAsset(childAsset);
    setIsChildAssetDetailOpen(true);
  };

  // Close detail dialog
  const handleChildAssetDetailClose = () => {
    setIsChildAssetDetailOpen(false);
    setSelectedChildAsset(null);
  };

  const handleDeleteChildAsset = async (id: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this child asset from it's parent?"
      )
    )
      return;

    withLoading(async () => {
      try {
        await deleteChildAssetMutation.mutateAsync(id);
        toast({ title: "System deleted successfully" });
      } catch (error: any) {
        toast({
          title: "Error deleting system",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  const handleAddAttachment = () => {
    toast({
      title: "Success",
      description: "Attachment added successfully",
      variant: "default",
    });
  };

  const handleViewBom = (bomId: any) => {
    setSelectedBom(bomId);
    setIsBomDetailOpen(true);
  };

  const handleEditBom = (bomId: any) => {
    setSelectedBom(bomId);
    setIsBomFormOpen(true);
  };

  const handleAddBom = () => {
    setIsAddBomDialogOpen(true);
  };

  const handleNewBomRequest = () => {
    navigate(`/manage/bom/add?assetId=${id}`);
  };

  const handleRemoveBom = async () => {
    if (
      !window.confirm(
        "Are you sure you want to remove the BOM from this asset?"
      )
    )
      return;

    withLoading(async () => {
      try {
        await deleteBomMutation.mutateAsync(Number(id));
        toast({ title: "Bom deleted successfully" });
      } catch (error: any) {
        toast({
          title: "Error deleting system",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  const handleAddIOT = () => {
    toast({
      title: "Success",
      description: "IOT added successfully",
      variant: "default",
    });
  };

  const handleAddWorkOrder = () => {
    toast({
      title: "Success",
      description: "Work Order added successfully",
      variant: "default",
    });
  };

  const handlePrint = () => {
    // Set printing mode to true
    setIsPrinting(true);

    // Create a new window for print preview
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast({
        title: "Error",
        description:
          "Could not open print window. Please check your popup blocker settings.",
        variant: "destructive",
      });
      setIsPrinting(false);
      return;
    }

    // Get attachment images for printing (limit to first 3)
    const imageElements = attachments
      .filter(
        (att) =>
          att.file_path && att.file_path.match(/\.(jpeg|jpg|png|gif|webp)$/i)
      )
      .slice(0, 3)
      .map(
        (att) => `
        <div style="margin-bottom: 10px; page-break-inside: avoid;">
          <img 
            src="${att.file_path}" 
            alt="${att.file_name || getFileNameFromPath(att.file_path)}" 
            style="max-width: 100%; max-height: 250px; object-fit: contain; border: 1px solid #ddd; border-radius: 4px;"
          />
          <p style="margin-top: 5px; font-size: 12px; color: #666;">${
            att.file_name || getFileNameFromPath(att.file_path)
          }</p>
        </div>
      `
      )
      .join("");

    // Generate print content HTML
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Asset Details: ${asset.asset_name || `#${id}`}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #0066cc;
            padding-bottom: 10px;
          }
          h1 {
            color: #0066cc;
            margin: 0;
          }
          .asset-id {
            color: #666;
            font-size: 14px;
          }
          .content {
            margin-bottom: 30px;
          }
          .section {
            margin-bottom: 30px;
            break-inside: avoid;
          }
          h2 {
            color: #0066cc;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin-top: 25px;
          }
          .detail-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }
          .detail-item {
            break-inside: avoid;
            margin-bottom: 10px;
          }
          .label {
            font-weight: bold;
            display: block;
            font-size: 14px;
            color: #666;
          }
          .value {
            font-size: 16px;
          }
          .no-data {
            color: #999;
            font-style: italic;
          }
          .image-gallery {
            margin-top: 20px;
          }
          .date-printed {
            font-size: 12px;
            color: #999;
            margin-top: 30px;
            text-align: center;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
          }
          th, td {
            text-align: left;
            padding: 8px;
            border: 1px solid #ddd;
          }
          th {
            background-color: #f5f5f5;
          }
          @media print {
            body {
              padding: 0;
              margin: 20px;
            }
            h1 { font-size: 20px; }
            h2 { font-size: 16px; }
            .page-break { 
              page-break-before: always; 
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Asset Details: ${asset.asset_name || "Unnamed Asset"}</h1>
          <div class="asset-id">Asset No: ${asset.asset_no || "-"}</div>
        </div>
        
        <div class="content">
          <div class="section">
            <h2>Basic Information</h2>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">Facility Location</span>
                <span class="value">${
                  asset?.facility?.location_name || "-"
                }</span>
              </div>
              <div class="detail-item">
                <span class="label">System</span>
                <span class="value">${asset?.system?.system_name || "-"}</span>
              </div>
              <div class="detail-item">
                <span class="label">Package</span>
                <span class="value">${
                  asset?.package?.package_name || "-"
                }</span>
              </div>
              <div class="detail-item">
                <span class="label">Asset Status</span>
                <span class="value">${asset?.asset_status?.name || "-"}</span>
              </div>
              <div class="detail-item">
                <span class="label">Asset Tag</span>
                <span class="value">${asset?.asset_tag?.name || "-"}</span>
              </div>
              <div class="detail-item">
                <span class="label">Commissioning Date</span>
                <span class="value">${commissionDate || "-"}</span>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2>Asset Details</h2>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">Category</span>
                <span class="value">${
                  assetDetails?.category?.name || "-"
                }</span>
              </div>
              <div class="detail-item">
                <span class="label">Type</span>
                <span class="value">${assetDetails?.type?.name || "-"}</span>
              </div>
              <div class="detail-item">
                <span class="label">Manufacturer</span>
                <span class="value">${
                  assetDetails?.manufacturer?.name || "-"
                }</span>
              </div>
              <div class="detail-item">
                <span class="label">Maker No</span>
                <span class="value">${formData.makerNo || "-"}</span>
              </div>
              <div class="detail-item">
                <span class="label">Model</span>
                <span class="value">${formData.model || "-"}</span>
              </div>
              <div class="detail-item">
                <span class="label">Serial Number</span>
                <span class="value">${formData.serialNumber || "-"}</span>
              </div>
              <div class="detail-item">
                <span class="label">Area</span>
                <span class="value">${assetDetails?.area?.name || "-"}</span>
              </div>
              <div class="detail-item">
                <span class="label">Asset Class</span>
                <span class="value">${
                  assetDetails?.asset_class?.name || "-"
                }</span>
              </div>
              <div class="detail-item">
                <span class="label">HS Code</span>
                <span class="value">${formData.hsCode || "-"}</span>
              </div>
              <div class="detail-item">
                <span class="label">Specification</span>
                <span class="value">${formData.specification || "-"}</span>
              </div>
              <div class="detail-item">
                <span class="label">Sensor</span>
                <span class="value">${
                  assetDetails?.iot_sensor?.sensor_type?.name || "-"
                }</span>
              </div>
              <div class="detail-item">
                <span class="label">EX Class</span>
                <span class="value">${formData.exClass || "-"}</span>
              </div>
              <div class="detail-item">
                <span class="label">EX Certificate</span>
                <span class="value">${formData.exCertificate || "-"}</span>
              </div>
              <div class="detail-item">
                <span class="label">Drawing No</span>
                <span class="value">${formData.drawingNo || "-"}</span>
              </div>
              <div class="detail-item">
                <span class="label">Active</span>
                <span class="value">${formData.isActive ? "Yes" : "No"}</span>
              </div>
              <div class="detail-item">
                <span class="label">Integrity</span>
                <span class="value">${
                  formData.isIntegrity ? "Yes" : "No"
                }</span>
              </div>
              <div class="detail-item">
                <span class="label">Reliability</span>
                <span class="value">${
                  formData.isReliability ? "Yes" : "No"
                }</span>
              </div>
            </div>
          </div>
          
          ${
            childAssets && childAssets.length > 0
              ? `
          <div class="section page-break">
            <h2>Child Assets</h2>
            <table>
              <thead>
                <tr>
                  <th>Asset No</th>
                  <th>Asset Name</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                ${childAssets
                  .map(
                    (item: any) => `
                  <tr>
                    <td>${(item.asset && item.asset[0]?.asset_no) || "-"}</td>
                    <td>${(item.asset && item.asset[0]?.asset_name) || "-"}</td>
                    <td>${item.type?.name || "-"}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
          `
              : ""
          }
          
          ${
            attachments.length > 0
              ? `
          <div class="section page-break">
            <h2>Asset Images</h2>
            <div class="image-gallery">
              ${imageElements}
            </div>
          </div>
          `
              : ""
          }
          
          <div class="date-printed">
            Printed on: ${new Date().toLocaleString()}
          </div>
        </div>
      </body>
      </html>
    `;

    // Write to the new window
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for images to load, then print
    printWindow.onload = function () {
      setTimeout(() => {
        printWindow.print();
        // Reset printing state after a delay to ensure print dialog is shown
        setTimeout(() => setIsPrinting(false), 1000);
      }, 500);
    };
  };

  if (isLoading || bomLoading || workOrderLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div>Error loading asset: {error.message}</div>;
  }

  if (!asset) {
    return <div>Asset not found</div>;
  }

  return (
    <div className="space-y-6 relative">
      {/* Loading overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="mt-2">Saving changes...</p>
          </div>
        </div>
      )}

      {/* Image zoom overlay */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-auto">
            <img
              src={zoomedImage}
              alt="Zoomed asset image"
              className="max-w-full max-h-[85vh] object-contain"
            />
            <button
              className="absolute top-2 right-2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-1"
              onClick={(e) => {
                e.stopPropagation();
                setZoomedImage(null);
              }}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <PageHeader
          title={`Asset: ${asset.asset_name || `#${id}`}`}
          icon={<Archive className="h-6 w-6" />}
        />
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate("/manage/assets")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Assets
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handlePrint}
            disabled={isPrinting}
          >
            {isPrinting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Printer className="h-4 w-4" />
            )}
            {isPrinting ? "Preparing..." : "Print"}
          </Button>
        </div>
      </div>

      <div>
        <AssetBasicInfoCard
          asset={asset}
          formData={formData}
          isEditing={isEditing}
          errors={errors}
          handleChange={handleChange}
          assetTagOptions={assetTagOptions}
          statusOptions={statusOptions}
          commissionDate={commissionDate}
        />

        {/* Asset Details Section with Blue Header */}
        <AssetDetailsCard
          assetDetails={assetDetails}
          formData={formData}
          isEditing={isEditing}
          errors={errors}
          handleChange={handleChange}
          categoryOptions={categoryOptions}
          typeOptions={typeOptions}
          manufacturerOptions={manufacturerOptions}
          areaOptions={areaOptions}
          assetClassOptions={assetClassOptions}
          assetSensorOptions={assetSensorOptions}
          criticalityOptions={criticalityOptions}
          sceOptions={sceOptions}
          attachments={attachments}
          fileInputRef={fileInputRef}
          selectedFile={selectedFile}
          fileUploadError={fileUploadError}
          setZoomedImage={setZoomedImage}
          isPrinting={isPrinting}
          handleFileChange={handleFileChange}
          formSubmissionError={formSubmissionError}
          formSubmissionSuccess={formSubmissionSuccess}
          isSubmitting={isSubmitting}
          handleCancel={handleCancel}
          handleApplyChanges={handleApplyChanges}
          navigate={navigate}
          handleWorkRequest={handleWorkRequest}
          toggleEditMode={toggleEditMode}
        />

        {/* Tabs for Asset Name Details */}
        <AssetTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          assetInstallation={assetInstallation}
          handleAddInstallation={handleAddInstallation}
          handleViewInstallation={handleViewInstallation}
          handleEditInstallation={handleEditInstallation}
          handleDeleteInstallation={handleDeleteInstallation}
          childAssets={childAssets}
          handleAddChildAsset={handleAddChildAsset}
          handleViewChildAsset={handleOpenChildAssetDetail}
          handleEditChildAsset={handleOpenChildAssetForm}
          handleDeleteChildAsset={handleDeleteChildAsset}
          bomData={bomData}
          handleAddBom={handleAddBom}
          handleViewBom={handleViewBom}
          handleEditBom={handleEditBom}
          handleRemoveBom={handleRemoveBom}
          workOrder={workOrder}
          handleAddWorkOrder={handleAddWorkOrder}
          attachments={attachments}
          handleAddAttachment={handleAddAttachment}
          iotData={iotData}
          handleAddIOT={handleAddIOT}
        />
      </div>

      <AssetChildDetailDialog
        isOpen={isChildAssetDetailOpen}
        onClose={handleChildAssetDetailClose}
        data={selectedChildAsset}
      />

      <AddChildAssetDialog
        isOpen={isAddChildDialogOpen}
        onClose={() => setIsAddChildDialogOpen(false)}
        parentAssetId={Number(id)}
        childAssets={childAssets}
        onChildAdded={async () => {
          // Invalidate all relevant queries for child asset changes
          await queryClient.invalidateQueries({
            queryKey: [...assetKeys.detail(Number(id)), "childAssets"],
          });
          await queryClient.invalidateQueries({ queryKey: assetKeys.all });
          await queryClient.invalidateQueries({
            queryKey: assetKeys.withRelations(),
          });
          await queryClient.invalidateQueries({
            queryKey: assetKeys.detail(Number(id)),
          });
          // Optionally, refetch the current asset
          if (refetch) await refetch();
        }}
        onNewAssetRequest={() => {
          navigate(`/manage/assets/add?parentAssetId=${id}`);
        }}
      />

      <BomDetailDialog
        isOpen={isBomDetailOpen}
        onClose={() => setIsBomDetailOpen(false)}
        bomId={selectedBom}
      />

      <BomFormDialog
        isOpen={isBomFormOpen}
        onClose={() => setIsBomFormOpen(false)}
        bomData={selectedBom}
        onSuccess={() => {
          refetch(); // Refresh asset data
          setIsBomFormOpen(false);
        }}
      />

      <AddBomDialog
        isOpen={isAddBomDialogOpen}
        onClose={() => setIsAddBomDialogOpen(false)}
        assetId={Number(id)}
        onBomAdded={() => {
          // Refresh asset data to show updated BOM
          refetch();
        }}
        onNewBomRequest={handleNewBomRequest}
      />

      {/* Installation Dialogs */}
      <InstallationFormDialog
        isOpen={isInstallationFormOpen}
        onClose={() => setIsInstallationFormOpen(false)}
        onSuccess={handleInstallationSuccess}
        assetId={Number(id)}
        installationData={selectedInstallation}
        isEditMode={isEditingInstallation}
      />

      <InstallationDetailDialog
        isOpen={isInstallationDetailOpen}
        onClose={() => setIsInstallationDetailOpen(false)}
        installationData={selectedInstallation}
      />
    </div>
  );
};
export default AssetDetailPage;
