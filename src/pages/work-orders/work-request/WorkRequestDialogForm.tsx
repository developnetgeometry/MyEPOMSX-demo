import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loading from "@/components/shared/Loading"; // Import the Loading component

interface WorkRequestDialogFormProps {
  onSubmit: (formData: any) => Promise<void>; // Assuming onSubmit is async
  onCancel: () => void;
  initialData?: any | null; // Optional initial data for editing
}

const WorkRequestDialogForm: React.FC<WorkRequestDialogFormProps> = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    cm_status_id: initialData?.cm_status_id || null,
    description: initialData?.description || null,
    work_request_date: initialData?.work_request_date
      ? new Date(initialData.work_request_date).toISOString().split("T")[0]
      : null,
    target_due_date: initialData?.target_due_date
      ? new Date(initialData.target_due_date).toISOString().split("T")[0]
      : null,
    facility_id: initialData?.facility_id || null,
    system_id: initialData?.system_id || null,
    package_id: initialData?.package_id || null,
    asset_id: initialData?.asset_id || null,
    cm_sce_code: initialData?.cm_sce_code || null,
    work_center_id: initialData?.work_center_id || null,
    date_finding: initialData?.date_finding
      ? new Date(initialData.date_finding).toISOString().split("T")[0]
      : null,
    maintenance_type: initialData?.maintenance_type || null,
    requested_by: initialData?.requested_by || null,
    criticality_id: initialData?.criticality_id || null,
    finding_detail: initialData?.finding_detail || null,
    anomaly_report: initialData?.anomaly_report || false,
    quick_incident_report: initialData?.quick_incident_report || false,
    work_request_no: initialData?.work_request_no || "",
  });

  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true
    try {
      await onSubmit(formData); // Wait for the onSubmit function to complete
    } finally {
      setIsLoading(false); // Set loading to false after submission
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isLoading ? ( // Show the Loading component if isLoading is true
        <Loading />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cm_status_id">CM Status ID</Label>
              <Input
                id="cm_status_id"
                name="cm_status_id"
                value={formData.cm_status_id || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="work_request_date">Work Request Date</Label>
              <Input
                id="work_request_date"
                name="work_request_date"
                type="date"
                value={formData.work_request_date || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target_due_date">Target Due Date</Label>
              <Input
                id="target_due_date"
                name="target_due_date"
                type="date"
                value={formData.target_due_date || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facility_id">Facility ID</Label>
              <Input
                id="facility_id"
                name="facility_id"
                value={formData.facility_id || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="system_id">System ID</Label>
              <Input
                id="system_id"
                name="system_id"
                value={formData.system_id || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="package_id">Package ID</Label>
              <Input
                id="package_id"
                name="package_id"
                value={formData.package_id || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="asset_id">Asset ID</Label>
              <Input
                id="asset_id"
                name="asset_id"
                value={formData.asset_id || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cm_sce_code">CM SCE Code</Label>
              <Input
                id="cm_sce_code"
                name="cm_sce_code"
                value={formData.cm_sce_code || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="work_center_id">Work Center ID</Label>
              <Input
                id="work_center_id"
                name="work_center_id"
                value={formData.work_center_id || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_finding">Date Finding</Label>
              <Input
                id="date_finding"
                name="date_finding"
                type="date"
                value={formData.date_finding || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenance_type">Maintenance Type</Label>
              <Input
                id="maintenance_type"
                name="maintenance_type"
                value={formData.maintenance_type || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="requested_by">Requested By</Label>
              <Input
                id="requested_by"
                name="requested_by"
                value={formData.requested_by || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="criticality_id">Criticality ID</Label>
              <Input
                id="criticality_id"
                name="criticality_id"
                value={formData.criticality_id || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="finding_detail">Finding Detail</Label>
              <Input
                id="finding_detail"
                name="finding_detail"
                value={formData.finding_detail || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anomaly_report">Anomaly Report</Label>
              <Input
                id="anomaly_report"
                name="anomaly_report"
                type="checkbox"
                checked={formData.anomaly_report || false}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    anomaly_report: e.target.checked,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quick_incident_report">Quick Incident Report</Label>
              <Input
                id="quick_incident_report"
                name="quick_incident_report"
                type="checkbox"
                checked={formData.quick_incident_report || false}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    quick_incident_report: e.target.checked,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="work_request_no">Work Request No</Label>
              <Input
                id="work_request_no"
                name="work_request_no"
                value={formData.work_request_no || ""}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </>
      )}
    </form>
  );
};

export default WorkRequestDialogForm;