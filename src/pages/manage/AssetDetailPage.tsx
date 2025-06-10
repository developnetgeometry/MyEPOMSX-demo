import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Archive,
  FileText,
  Printer,
  Search,
  Plus,
  Settings,
  FileUp,
  File,
  Loader2,
  Check,
  X,
  Edit,
  Save,
  AlertCircle,
} from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAssetAttachments,
  useAssetWithRelations,
  useItemByBomId,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useQueryClient } from "@tanstack/react-query";
import { assetKeys } from "@/hooks/queries/useAssets";

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

  // For file upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

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

  const childAssets = assetDetails?.child_assets;
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
    toast({
      title: "Success",
      description: "Installation added successfully",
      variant: "default",
    });
  };

  const handleAddChildAsset = () => {
    toast({
      title: "Success",
      description: "Asset added successfully",
      variant: "default",
    });
  };

  const handleAddAttachment = () => {
    toast({
      title: "Success",
      description: "Attachment added successfully",
      variant: "default",
    });
  };

  const handleAddBom = () => {
    toast({
      title: "Success",
      description: "BOM added successfully",
      variant: "default",
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
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Facility Location</label>
                <Input value={asset?.facility.location_name} readOnly />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">System</label>
                <Input value={asset?.system.system_name} readOnly />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Package</label>
                <Input value={asset?.package.package_name} readOnly />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Asset No</label>
                <Input
                  value={formData.assetNo}
                  onChange={(e) => handleChange("assetNo", e.target.value)}
                  readOnly={!isEditing}
                  name="assetNo"
                  className={errors.assetNo ? "border-red-500" : ""}
                />
                {errors.assetNo && (
                  <p className="text-sm text-red-500 mt-1">{errors.assetNo}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Asset Name</label>
                <Input
                  value={formData.assetName}
                  onChange={(e) => handleChange("assetName", e.target.value)}
                  readOnly={!isEditing}
                  name="assetName"
                  className={errors.assetName ? "border-red-500" : ""}
                />
                {errors.assetName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.assetName}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Asset Tag</label>
                {isEditing ? (
                  <Select
                    value={formData.assetTagId}
                    onValueChange={(value) => handleChange("assetTagId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset tag" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(assetTagOptions) &&
                        assetTagOptions.map((option) => (
                          <SelectItem
                            key={option.id}
                            value={option.id.toString()}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={asset?.asset_tag.name} readOnly />
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Asset Status</label>
                {isEditing ? (
                  <Select
                    value={formData.assetStatusId}
                    onValueChange={(value) =>
                      handleChange("assetStatusId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem
                          key={option.id}
                          value={option.id.toString()}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={asset?.asset_status.name} readOnly />
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Commissioning Date
                </label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={formData.commissionDate}
                    onChange={(e) =>
                      handleChange("commissionDate", e.target.value)
                    }
                  />
                ) : (
                  <Input value={commissionDate} readOnly />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Asset Details Section with Blue Header */}
        <Card className="mb-4">
          <CardHeader className="bg-blue-500 text-white p-2">
            <CardTitle className="text-base">Asset Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Category</label>
                {isEditing ? (
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => handleChange("categoryId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem
                          key={option.id}
                          value={option.id.toString()}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={assetDetails?.category?.name || ""} readOnly />
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Type</label>
                {isEditing ? (
                  <Select
                    value={formData.typeId}
                    onValueChange={(value) => handleChange("typeId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((option) => (
                        <SelectItem
                          key={option.id}
                          value={option.id.toString()}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={assetDetails?.type?.name || ""} readOnly />
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Manufacturer</label>
                {isEditing ? (
                  <Select
                    value={formData.manufacturerId}
                    onValueChange={(value) =>
                      handleChange("manufacturerId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select manufacturer" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(manufacturerOptions) &&
                        manufacturerOptions.map((option) => (
                          <SelectItem
                            key={option.id}
                            value={option.id.toString()}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={assetDetails?.manufacturer?.name || ""}
                    readOnly
                  />
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Maker No</label>
                <Input
                  value={formData.makerNo}
                  onChange={(e) => handleChange("makerNo", e.target.value)}
                  readOnly={!isEditing}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Model</label>
                <Input
                  value={formData.model}
                  onChange={(e) => handleChange("model", e.target.value)}
                  readOnly={!isEditing}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Serial Number</label>
                <Input
                  value={formData.serialNumber}
                  onChange={(e) => handleChange("serialNumber", e.target.value)}
                  readOnly={!isEditing}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Area</label>
                {isEditing ? (
                  <Select
                    value={formData.areaId}
                    onValueChange={(value) => handleChange("areaId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(areaOptions) &&
                        areaOptions.map((option) => (
                          <SelectItem
                            key={option.id}
                            value={option.id.toString()}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={assetDetails?.area?.name || ""} readOnly />
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Asset Class</label>
                {isEditing ? (
                  <Select
                    value={formData.assetClassId}
                    onValueChange={(value) =>
                      handleChange("assetClassId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset class" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(assetClassOptions) &&
                        assetClassOptions.map((option) => (
                          <SelectItem
                            key={option.id}
                            value={option.id.toString()}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={assetDetails?.asset_class?.name || ""}
                    readOnly
                  />
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">HCode</label>
                <Input
                  value={formData.hsCode}
                  onChange={(e) => handleChange("hsCode", e.target.value)}
                  readOnly={!isEditing}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Specification</label>
                <Input
                  value={formData.specification}
                  onChange={(e) =>
                    handleChange("specification", e.target.value)
                  }
                  readOnly={!isEditing}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Sensor</label>
                {isEditing ? (
                  <Select
                    value={formData.iotSensorId}
                    onValueChange={(value) =>
                      handleChange("iotSensorId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sensor" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(assetSensorOptions) &&
                        assetSensorOptions.map((option) => (
                          <SelectItem
                            key={option.id}
                            value={option.id.toString()}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={assetDetails?.iot_sensor?.sensor_type?.name || ""}
                    readOnly
                  />
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">EX Class</label>
                <Input
                  value={formData.exClass}
                  onChange={(e) => handleChange("exClass", e.target.value)}
                  readOnly={!isEditing}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">EX Certificate</label>
                <Input
                  value={formData.exCertificate}
                  onChange={(e) =>
                    handleChange("exCertificate", e.target.value)
                  }
                  readOnly={!isEditing}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Drawing No</label>
                <Input
                  value={formData.drawingNo}
                  onChange={(e) => handleChange("drawingNo", e.target.value)}
                  readOnly={!isEditing}
                />
              </div>

              <div className="col-span-2 grid grid-cols-2 gap-4 pt-2">
                {/* Criticality Section */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="criticality"
                      checked={formData.isCriticality}
                      onCheckedChange={(checked) =>
                        handleChange("isCriticality", !!checked)
                      }
                      disabled={!isEditing}
                    />
                    <label
                      htmlFor="criticality"
                      className="text-sm font-medium"
                    >
                      Criticality
                    </label>
                  </div>

                  {/* Show criticality dropdown if checkbox is checked */}
                  {formData.isCriticality && (
                    <div className="mt-2">
                      {isEditing ? (
                        <Select
                          value={formData.criticalityId}
                          onValueChange={(value) =>
                            handleChange("criticalityId", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Criticality Level" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.isArray(criticalityOptions) &&
                              criticalityOptions.map((option) => (
                                <SelectItem
                                  key={option.id}
                                  value={String(option.value)}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="text-sm text-gray-600">
                          {criticalityOptions.find(
                            (opt) => opt.value === formData.criticalityId
                          )?.label || "Not selected"}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* SCE Section */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sce"
                      checked={formData.isSce}
                      onCheckedChange={(checked) =>
                        handleChange("isSce", !!checked)
                      }
                      disabled={!isEditing}
                    />
                    <label htmlFor="sce" className="text-sm font-medium">
                      SCE Code
                    </label>
                  </div>

                  {/* Show SCE dropdown if checkbox is checked */}
                  {formData.isSce && (
                    <div className="mt-2">
                      {isEditing ? (
                        <Select
                          value={formData.sceId}
                          onValueChange={(value) =>
                            handleChange("sceId", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select SCE Code" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.isArray(sceOptions) &&
                              sceOptions.map((option) => (
                                <SelectItem
                                  key={option.id}
                                  value={String(option.value)}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="text-sm text-gray-600">
                          {sceOptions.find(
                            (opt) => opt.value === formData.sceId
                          )?.label || "Not selected"}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="active"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      handleChange("isActive", !!checked)
                    }
                    disabled={!isEditing}
                  />
                  <label htmlFor="active" className="text-sm font-medium">
                    Active
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="integrity"
                    checked={formData.isIntegrity}
                    onCheckedChange={(checked) =>
                      handleChange("isIntegrity", !!checked)
                    }
                    disabled={!isEditing}
                  />
                  <label htmlFor="integrity" className="text-sm font-medium">
                    Integrity
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="reliability"
                    checked={formData.isReliability}
                    onCheckedChange={(checked) =>
                      handleChange("isReliability", !!checked)
                    }
                    disabled={!isEditing}
                  />
                  <label htmlFor="reliability" className="text-sm font-medium">
                    Reliability
                  </label>
                </div>
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-sm font-medium">Asset Image</label>
                <div className="flex flex-col gap-2 mt-1">
                  {isEditing ? (
                    <>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleFileChange}
                        />
                        <Button
                          variant="outline"
                          className="flex items-center gap-2"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <FileUp className="h-4 w-4" /> Choose file
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          {selectedFile
                            ? selectedFile.name
                            : "No file selected"}
                        </span>
                      </div>
                      {fileUploadError && (
                        <p className="text-sm text-red-500">
                          {fileUploadError}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        disabled
                      >
                        <FileUp className="h-4 w-4" /> Choose file
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        {attachments.length > 0
                          ? `${attachments.length} file(s) uploaded`
                          : "No file chosen"}
                      </span>
                    </div>
                  )}

                  {/* Display existing attachments */}
                  {attachments.length > 0 && (
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {attachments.slice(0, 3).map((attachment) => (
                        <div
                          key={attachment.id}
                          className="relative border rounded-md p-2"
                        >
                          {attachment.file_path &&
                          attachment.file_path.match(
                            /\.(jpeg|jpg|png|gif|webp)$/i
                          ) ? (
                            <img
                              src={attachment.file_path}
                              alt={attachment.file_name || "Asset image"}
                              className="w-full h-24 object-cover rounded cursor-pointer"
                              onClick={() =>
                                setZoomedImage(attachment.file_path)
                              }
                              style={{ transition: "transform 0.2s" }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.transform = "scale(1.05)";
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                              }}
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-24 bg-muted rounded">
                              <File className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                          <p className="text-xs mt-1 truncate">
                            {attachment.file_name ||
                              getFileNameFromPath(attachment.file_path)}
                          </p>
                        </div>
                      ))}
                      {attachments.length > 3 && (
                        <div className="flex items-center justify-center border rounded-md p-2 h-24">
                          <p className="text-sm text-muted-foreground">
                            +{attachments.length - 3} more
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form validation and submission status */}
            {(formSubmissionError || Object.keys(errors).length > 0) && (
              <Alert variant="destructive" className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {formSubmissionError ||
                    "Please correct the errors in the form before submitting."}
                  {Object.keys(errors).length > 0 && (
                    <ul className="mt-2 list-disc pl-5">
                      {Object.entries(errors).map(([field, message]) => (
                        <li key={field}>{message}</li>
                      ))}
                    </ul>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {formSubmissionSuccess && !formSubmissionError && (
              <Alert className="mt-6 bg-green-50 border-green-500 text-green-800">
                <Check className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>Asset updated successfully.</AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-8">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex items-center gap-2"
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleApplyChanges}
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Apply Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/manage/assets")}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Assets
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleWorkRequest}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Work Request
                  </Button>
                  <Button
                    onClick={toggleEditMode}
                    className="flex items-center gap-2"
                    variant="default"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Asset Name Details */}
        <Card>
          <CardHeader className="bg-blue-500 text-white p-2">
            <CardTitle className="text-base">
              {asset.asset_name} Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="w-full justify-start">
                <TabsTrigger value="installation">Installation</TabsTrigger>
                <TabsTrigger value="childAsset">Child Asset</TabsTrigger>
                <TabsTrigger value="bom">BOM</TabsTrigger>
                <TabsTrigger value="workOrder">Work Order</TabsTrigger>
                <TabsTrigger value="attachment">Attachment</TabsTrigger>
                <TabsTrigger value="integrity">IoT</TabsTrigger>
              </TabsList>

              <TabsContent value="installation" className="pt-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Input placeholder="Search..." className="w-64 mr-2" />
                    <Button size="sm">Go</Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="actions">
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Actions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="actions">Actions</SelectItem>
                        <SelectItem value="export">Export</SelectItem>
                        <SelectItem value="delete">Delete Selected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="icon"
                      className="ml-2"
                      onClick={handleAddInstallation}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-left p-3 font-medium">
                          Installation Type
                        </TableHead>
                        {/* <TableHead className="text-left p-3 font-medium">
                          Installed Location
                        </TableHead> */}
                        <TableHead className="text-left p-3 font-medium">
                          Installation Date
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Remarks
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y">
                      {assetInstallation.map((item) => (
                        <TableRow key={item.id} className="hover:bg-muted/30">
                          <TableCell className="p-3">
                            {item.intermittent_service}
                          </TableCell>
                          {/* <TableCell className="p-3">
                            {item.installedLocation}
                          </TableCell> */}
                          <TableCell className="p-3">
                            {formatDate(item.actual_installation_date)}
                          </TableCell>
                          <TableCell className="p-3">
                            {item.description}
                          </TableCell>
                          <TableCell className="p-3">
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="childAsset" className="pt-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Input placeholder="Search..." className="w-64 mr-2" />
                    <Button size="sm">Go</Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="actions">
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Actions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="actions">Actions</SelectItem>
                        <SelectItem value="export">Export</SelectItem>
                        <SelectItem value="delete">Delete Selected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="icon"
                      className="ml-2"
                      onClick={handleAddChildAsset}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-3 font-medium">Asset No</th>
                        <th className="text-left p-3 font-medium">Name</th>
                        <th className="text-left p-3 font-medium">Type</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {childAssets &&
                        childAssets.map((item: any) => (
                          <tr key={item.id} className="hover:bg-muted/30">
                            <td className="p-3">
                              {item.asset && item.asset[0]?.asset_no}
                            </td>
                            <td className="p-3">
                              {item.asset && item.asset[0]?.asset_name}
                            </td>
                            <td className="p-3">{item.type?.name}</td>
                            <td className="p-3">
                              <Button variant="ghost" size="sm">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="bom" className="pt-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Input placeholder="Search..." className="w-64 mr-2" />
                    <Button size="sm">Go</Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="actions">
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Actions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="actions">Actions</SelectItem>
                        <SelectItem value="export">Export</SelectItem>
                        <SelectItem value="delete">Delete Selected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="icon" className="ml-2" onClick={handleAddBom}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-left p-3 font-medium">
                          Part No
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Part Name
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Quantity
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Unit of Measure
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Remarks
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y">
                      {bomData?.map((item) => (
                        <TableRow key={item.id} className="hover:bg-muted/30">
                          <TableCell className="p-3">
                            {item.item_master.item_no}
                          </TableCell>
                          <TableCell className="p-3">
                            {item.item_master.item_name}
                          </TableCell>
                          <TableCell className="p-3">{item.quantity}</TableCell>
                          <TableCell className="p-3">
                            {item.item_master.unit.name}
                          </TableCell>
                          <TableCell className="p-3">
                            {item.description}
                          </TableCell>
                          <TableCell className="p-3">
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="workOrder" className="pt-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Input placeholder="Search..." className="w-64 mr-2" />
                    <Button size="sm">Go</Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="actions">
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Actions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="actions">Actions</SelectItem>
                        <SelectItem value="export">Export</SelectItem>
                        <SelectItem value="delete">Delete Selected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="icon"
                      className="ml-2"
                      onClick={handleAddWorkOrder}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-left p-3 font-medium">
                          Work Order No
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Task
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          WO Status
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Due Date
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y">
                      {workOrder?.map((item) => (
                        <TableRow key={item.id} className="hover:bg-muted/30">
                          <TableCell className="p-3">
                            {item.work_order_no}
                          </TableCell>
                          <TableCell className="p-3">
                            {item.task.task_name}
                          </TableCell>
                          <TableCell className="p-3">
                            <StatusBadge status={item.status.name} />
                          </TableCell>
                          <TableCell className="p-3">
                            {formatDate(item.due_date)}
                          </TableCell>
                          <TableCell className="p-3">
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="attachment" className="pt-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Input placeholder="Search..." className="w-64 mr-2" />
                    <Button size="sm">Go</Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="actions">
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Actions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="actions">Actions</SelectItem>
                        <SelectItem value="export">Export</SelectItem>
                        <SelectItem value="delete">Delete Selected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="icon"
                      className="ml-2"
                      onClick={handleAddAttachment}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-left p-3 font-medium">
                          Type
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Attachment Date
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Notes
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Attachment
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y">
                      {attachments.map((item) => (
                        <TableRow key={item.id} className="hover:bg-muted/30">
                          <TableCell className="p-3">{item.type}</TableCell>
                          <TableCell className="p-3">
                            {formatDate(item.created_at)}
                          </TableCell>
                          <TableCell className="p-3">{item.notes}</TableCell>
                          <TableCell className="p-3">
                            <div className="flex items-center gap-2">
                              <File className="h-4 w-4" />
                              <span>{getFileNameFromPath(item.file_path)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="p-3">
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="integrity" className="pt-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Input placeholder="Search..." className="w-64 mr-2" />
                    <Button size="sm">Go</Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="actions">
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Actions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="actions">Actions</SelectItem>
                        <SelectItem value="export">Export</SelectItem>
                        <SelectItem value="delete">Delete Selected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="icon" className="ml-2" onClick={handleAddIOT}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-left p-3 font-medium">
                          Sensor Type
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Reading Value
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Status
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Last Sync Date
                        </TableHead>
                        <TableHead className="text-left p-3 font-medium">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y">
                      {iotData.map((item) => (
                        <TableRow key={item.id} className="hover:bg-muted/30">
                          <TableCell className="p-3">
                            {item.sensorType}
                          </TableCell>
                          <TableCell className="p-3">
                            {item.readingValue}
                          </TableCell>
                          <TableCell className="p-3">
                            <StatusBadge status={item.status} />
                          </TableCell>
                          <TableCell className="p-3">{item.lastSync}</TableCell>
                          <TableCell className="p-3">
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default AssetDetailPage;
