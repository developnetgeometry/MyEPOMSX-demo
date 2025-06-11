import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

interface InstallationFormData {
  id?: number;
  actualInstallationDate: string;
  actualStartupDate: string;
  description: string;
  drawingNo: string;
  assetId: number;
  exCertificate: string;
  exClass: string;
  intermittentService: string;
  isolationServiceClassId: string;
  isolationSystemDesc: string;
  detectionSystemDesc: string;
  detectionSystemClassId: string;
  orientation: string;
  overallHeight: string;
  overallLength: string;
  overallWidth: string;
  warrantyDate: string;
}

interface InstallationFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  assetId: number;
  installationData?: any;
  isEditMode?: boolean;
}

const InstallationFormDialog: React.FC<InstallationFormDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  assetId,
  installationData,
  isEditMode = false,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<InstallationFormData>({
    actualInstallationDate: "",
    actualStartupDate: "",
    description: "",
    drawingNo: "",
    assetId: assetId,
    exCertificate: "",
    exClass: "",
    intermittentService: "",
    isolationServiceClassId: "",
    isolationSystemDesc: "",
    detectionSystemDesc: "",
    detectionSystemClassId: "",
    orientation: "",
    overallHeight: "",
    overallLength: "",
    overallWidth: "",
    warrantyDate: "",
  });

  // Dropdown options
  const [isolationClassOptions] = useState([
    { value: "1", label: "Class 1 - Manual Isolation" },
    { value: "2", label: "Class 2 - Remote Manual Isolation" },
    { value: "3", label: "Class 3 - Automatic Isolation" },
    { value: "4", label: "Class 4 - Emergency Shutdown" },
  ]);

  const [detectionClassOptions] = useState([
    { value: "1", label: "Class 1 - Manual Detection" },
    { value: "2", label: "Class 2 - Semi-Automatic Detection" },
    { value: "3", label: "Class 3 - Automatic Detection" },
    { value: "4", label: "Class 4 - Advanced Detection System" },
  ]);

  const [orientationOptions] = useState([
    { value: "horizontal", label: "Horizontal" },
    { value: "vertical", label: "Vertical" },
    { value: "inclined", label: "Inclined" },
  ]);

  // Initialize form data when in edit mode
  useEffect(() => {
    if (isEditMode && installationData) {
      setFormData({
        id: installationData.id,
        actualInstallationDate: installationData.actual_installation_date || "",
        actualStartupDate: installationData.actual_startup_date || "",
        description: installationData.description || "",
        drawingNo: installationData.drawing_no || "",
        assetId: installationData.asset_id || assetId,
        exCertificate: installationData.ex_certificate || "",
        exClass: installationData.ex_class || "",
        intermittentService: installationData.intermittent_service || "",
        isolationServiceClassId:
          installationData.isolation_service_class_id?.toString() || "",
        isolationSystemDesc: installationData.isolation_system_desc || "",
        detectionSystemDesc: installationData.detection_system_desc || "",
        detectionSystemClassId:
          installationData.detection_system_class_id?.toString() || "",
        orientation: installationData.orientation || "",
        overallHeight: installationData.overall_height?.toString() || "",
        overallLength: installationData.overall_length?.toString() || "",
        overallWidth: installationData.overall_width?.toString() || "",
        warrantyDate: installationData.warranty_date || "",
      });
    } else {
      // Reset form for new installation
      setFormData({
        actualInstallationDate: "",
        actualStartupDate: "",
        description: "",
        drawingNo: "",
        assetId: assetId,
        exCertificate: "",
        exClass: "",
        intermittentService: "",
        isolationServiceClassId: "",
        isolationSystemDesc: "",
        detectionSystemDesc: "",
        detectionSystemClassId: "",
        orientation: "",
        overallHeight: "",
        overallLength: "",
        overallWidth: "",
        warrantyDate: "",
      });
    }
  }, [isEditMode, installationData, assetId]);

  const handleChange = (field: keyof InstallationFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const installationPayload = {
        actual_installation_date: formData.actualInstallationDate || null,
        actual_startup_date: formData.actualStartupDate || null,
        description: formData.description || null,
        drawing_no: formData.drawingNo || null,
        asset_id: formData.assetId,
        ex_certificate: formData.exCertificate || null,
        ex_class: formData.exClass || null,
        intermittent_service: formData.intermittentService || null,
        isolation_service_class_id: formData.isolationServiceClassId
          ? parseInt(formData.isolationServiceClassId)
          : null,
        isolation_system_desc: formData.isolationSystemDesc || null,
        detection_system_desc: formData.detectionSystemDesc || null,
        detection_system_class_id: formData.detectionSystemClassId
          ? parseInt(formData.detectionSystemClassId)
          : null,
        orientation: formData.orientation || null,
        overall_height: formData.overallHeight
          ? parseFloat(formData.overallHeight)
          : null,
        overall_length: formData.overallLength
          ? parseFloat(formData.overallLength)
          : null,
        overall_width: formData.overallWidth
          ? parseFloat(formData.overallWidth)
          : null,
        warranty_date: formData.warrantyDate || null,
        updated_at: new Date().toISOString(),
      };

      let result;
      if (isEditMode && formData.id) {
        // Update existing installation
        result = await supabase
          .from("e_asset_installation")
          .update(installationPayload)
          .eq("id", formData.id);
      } else {
        // Create new installation
        result = await supabase.from("e_asset_installation").insert({
          ...installationPayload,
          created_at: new Date().toISOString(),
        });
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: "Success",
        description: `Installation ${
          isEditMode ? "updated" : "created"
        } successfully`,
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error saving installation:", error);
      toast({
        title: "Error",
        description:
          error.message ||
          `Failed to ${isEditMode ? "update" : "create"} installation`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Installation" : "Add New Installation"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the installation details below."
              : "Fill in the installation details for this asset."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>

              <div className="space-y-2">
                <Label htmlFor="actualInstallationDate">
                  Actual Installation Date
                </Label>
                <Input
                  id="actualInstallationDate"
                  type="date"
                  value={formData.actualInstallationDate}
                  onChange={(e) =>
                    handleChange("actualInstallationDate", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="actualStartupDate">Actual Startup Date</Label>
                <Input
                  id="actualStartupDate"
                  type="date"
                  value={formData.actualStartupDate}
                  onChange={(e) =>
                    handleChange("actualStartupDate", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warrantyDate">Warranty Date</Label>
                <Input
                  id="warrantyDate"
                  type="date"
                  value={formData.warrantyDate}
                  onChange={(e) => handleChange("warrantyDate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="drawingNo">Drawing No</Label>
                <Input
                  id="drawingNo"
                  value={formData.drawingNo}
                  onChange={(e) => handleChange("drawingNo", e.target.value)}
                  placeholder="Enter drawing number"
                />
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Technical Specifications</h3>

              <div className="space-y-2">
                <Label htmlFor="exClass">EX Class</Label>
                <Input
                  id="exClass"
                  value={formData.exClass}
                  onChange={(e) => handleChange("exClass", e.target.value)}
                  placeholder="Enter EX class"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exCertificate">EX Certificate</Label>
                <Input
                  id="exCertificate"
                  value={formData.exCertificate}
                  onChange={(e) =>
                    handleChange("exCertificate", e.target.value)
                  }
                  placeholder="Enter EX certificate number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="intermittentService">
                  Intermittent Service
                </Label>
                <Input
                  id="intermittentService"
                  value={formData.intermittentService}
                  onChange={(e) =>
                    handleChange("intermittentService", e.target.value)
                  }
                  placeholder="Enter service type"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orientation">Orientation</Label>
                <Select
                  value={formData.orientation}
                  onValueChange={(value) => handleChange("orientation", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select orientation" />
                  </SelectTrigger>
                  <SelectContent>
                    {orientationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dimensions */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Dimensions (mm)</h3>

              <div className="space-y-2">
                <Label htmlFor="overallHeight">Overall Height</Label>
                <Input
                  id="overallHeight"
                  type="number"
                  step="0.01"
                  value={formData.overallHeight}
                  onChange={(e) =>
                    handleChange("overallHeight", e.target.value)
                  }
                  placeholder="Height in mm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="overallLength">Overall Length</Label>
                <Input
                  id="overallLength"
                  type="number"
                  step="0.01"
                  value={formData.overallLength}
                  onChange={(e) =>
                    handleChange("overallLength", e.target.value)
                  }
                  placeholder="Length in mm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="overallWidth">Overall Width</Label>
                <Input
                  id="overallWidth"
                  type="number"
                  step="0.01"
                  value={formData.overallWidth}
                  onChange={(e) => handleChange("overallWidth", e.target.value)}
                  placeholder="Width in mm"
                />
              </div>
            </div>

            {/* Safety Systems */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Safety Systems</h3>

              <div className="space-y-2">
                <Label htmlFor="isolationServiceClassId">
                  Isolation Service Class
                </Label>
                <Select
                  value={formData.isolationServiceClassId}
                  onValueChange={(value) =>
                    handleChange("isolationServiceClassId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select isolation class" />
                  </SelectTrigger>
                  <SelectContent>
                    {isolationClassOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="isolationSystemDesc">
                  Isolation System Description
                </Label>
                <Textarea
                  id="isolationSystemDesc"
                  value={formData.isolationSystemDesc}
                  onChange={(e) =>
                    handleChange("isolationSystemDesc", e.target.value)
                  }
                  placeholder="Describe the isolation system"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="detectionSystemClassId">
                  Detection System Class
                </Label>
                <Select
                  value={formData.detectionSystemClassId}
                  onValueChange={(value) =>
                    handleChange("detectionSystemClassId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select detection class" />
                  </SelectTrigger>
                  <SelectContent>
                    {detectionClassOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="detectionSystemDesc">
                  Detection System Description
                </Label>
                <Textarea
                  id="detectionSystemDesc"
                  value={formData.detectionSystemDesc}
                  onChange={(e) =>
                    handleChange("detectionSystemDesc", e.target.value)
                  }
                  placeholder="Describe the detection system"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Description - Full Width */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter general description"
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditMode ? "Update Installation" : "Create Installation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InstallationFormDialog;
