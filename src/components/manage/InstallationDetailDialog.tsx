import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatters";

interface InstallationDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  installationData: any;
}

const InstallationDetailDialog: React.FC<InstallationDetailDialogProps> = ({
  isOpen,
  onClose,
  installationData,
}) => {
  if (!installationData) return null;

  const isolationClassLabels: Record<string, string> = {
    "1": "Class 1 - Manual Isolation",
    "2": "Class 2 - Remote Manual Isolation",
    "3": "Class 3 - Automatic Isolation",
    "4": "Class 4 - Emergency Shutdown",
  };

  const detectionClassLabels: Record<string, string> = {
    "1": "Class 1 - Manual Detection",
    "2": "Class 2 - Semi-Automatic Detection",
    "3": "Class 3 - Automatic Detection",
    "4": "Class 4 - Advanced Detection System",
  };

  const orientationLabels: Record<string, string> = {
    horizontal: "Horizontal",
    vertical: "Vertical",
    inclined: "Inclined",
  };

  const DetailField = ({
    label,
    value,
    type = "text",
  }: {
    label: string;
    value: any;
    type?: string;
  }) => {
    let displayValue = value;

    if (type === "date" && value) {
      displayValue = formatDate(value);
    } else if (type === "dimension" && value) {
      displayValue = `${value} mm`;
    } else if (!value) {
      displayValue = "-";
    }

    return (
      <div className="space-y-1">
        <label className="text-sm font-medium text-muted-foreground">
          {label}
        </label>
        <div className="text-sm">{displayValue}</div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Installation Details</DialogTitle>
          <DialogDescription>
            Detailed information about this installation record.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-600">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailField
                label="Actual Installation Date"
                value={installationData.actual_installation_date}
                type="date"
              />
              <DetailField
                label="Actual Startup Date"
                value={installationData.actual_startup_date}
                type="date"
              />
              <DetailField
                label="Warranty Date"
                value={installationData.warranty_date}
                type="date"
              />
              <DetailField
                label="Drawing No"
                value={installationData.drawing_no}
              />
            </div>
          </div>

          {/* Technical Specifications */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-600">
              Technical Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailField label="EX Class" value={installationData.ex_class} />
              <DetailField
                label="EX Certificate"
                value={installationData.ex_certificate}
              />
              <DetailField
                label="Intermittent Service"
                value={installationData.intermittent_service}
              />
              <DetailField
                label="Orientation"
                value={
                  installationData.orientation
                    ? orientationLabels[installationData.orientation] ||
                      installationData.orientation
                    : null
                }
              />
            </div>
          </div>

          {/* Dimensions */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-600">
              Dimensions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DetailField
                label="Overall Height"
                value={installationData.overall_height}
                type="dimension"
              />
              <DetailField
                label="Overall Length"
                value={installationData.overall_length}
                type="dimension"
              />
              <DetailField
                label="Overall Width"
                value={installationData.overall_width}
                type="dimension"
              />
            </div>
          </div>

          {/* Safety Systems */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-600">
              Safety Systems
            </h3>
            <div className="space-y-4">
              {/* Isolation System */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    Isolation Service Class
                  </label>
                  <div className="text-sm">
                    {installationData.isolation_service_class_id ? (
                      <Badge variant="outline">
                        {isolationClassLabels[
                          installationData.isolation_service_class_id.toString()
                        ] ||
                          `Class ${installationData.isolation_service_class_id}`}
                      </Badge>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    Detection System Class
                  </label>
                  <div className="text-sm">
                    {installationData.detection_system_class_id ? (
                      <Badge variant="outline">
                        {detectionClassLabels[
                          installationData.detection_system_class_id.toString()
                        ] ||
                          `Class ${installationData.detection_system_class_id}`}
                      </Badge>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
              </div>

              {/* System Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    Isolation System Description
                  </label>
                  <div className="text-sm p-3 bg-muted rounded-md min-h-[80px]">
                    {installationData.isolation_system_desc || "-"}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    Detection System Description
                  </label>
                  <div className="text-sm p-3 bg-muted rounded-md min-h-[80px]">
                    {installationData.detection_system_desc || "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* General Description */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-red-600">
              General Description
            </h3>
            <div className="text-sm p-4 bg-muted rounded-md min-h-[100px]">
              {installationData.description || "No description provided."}
            </div>
          </div>

          {/* Metadata */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-600">
              Record Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailField
                label="Created At"
                value={installationData.created_at}
                type="date"
              />
              <DetailField
                label="Updated At"
                value={installationData.updated_at}
                type="date"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InstallationDetailDialog;
