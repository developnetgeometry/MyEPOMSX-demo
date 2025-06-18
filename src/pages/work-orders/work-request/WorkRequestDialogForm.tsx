import React, { useEffect, useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loading from "@/components/shared/Loading"; // Import the Loading component
import { useAssetData } from "../hooks/use-apsf-by-project-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCmStatusData } from "@/hooks/lookup/lookup-cm-status";
import { Textarea } from "@/components/ui/textarea";
import { useWorkCenterData } from "@/pages/admin/setup/hooks/use-work-center-data";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useCmSceData } from "@/hooks/lookup/lookup-cm-sce";
import { useMaintenanceTypeCmData } from "@/hooks/lookup/lookup-maintenance-types";
import { usePriorityData } from "@/hooks/lookup/lookup-priority";
import { useAuth } from "@/contexts/AuthContext";
import { useProfilesById } from "@/components/work-orders/work-order-list/hooks/use-profile-by-id";
import { toast } from "@/hooks/use-toast";

interface WorkRequestDialogFormProps {
  onSubmit: (formData: any) => Promise<void>; // Assuming onSubmit is async
  onCancel: () => void;
  initialData?: any | null; // Optional initial data for editing
}

const WorkRequestDialogForm: React.FC<WorkRequestDialogFormProps> = ({ onSubmit, onCancel, initialData = null }) => {
  const { profile, loading: isProfileLoading } = useAuth();
  const { data: profiles, isLoading: isProfilesLoading } = useProfilesById(profile?.id || "");
  const { data: apsf } = useAssetData();
  const { data: cmStatus } = useCmStatusData();
  const { data: cmSce } = useCmSceData();
  const { data: workCenter } = useWorkCenterData();
  const { data: cmMaintenanceType } = useMaintenanceTypeCmData();
  const { data: priority } = usePriorityData();


  const [formData, setFormData] = useState({
    cm_status_id: initialData?.cm_status_id?.id || 1,
    description: initialData?.description || null,
    work_request_date: initialData?.work_request_date
      ? new Date(initialData.work_request_date).toLocaleDateString("en-CA") // Convert to YYYY-MM-DD format in local timezone
      : new Date(Date.now()).toISOString().split("T")[0],
    target_due_date: initialData?.target_due_date
      ? new Date(initialData.target_due_date).toLocaleDateString("en-CA")
      : null,
    facility_id: initialData?.facility_id?.id || null,
    system_id: initialData?.system_id?.id || null,
    package_id: initialData?.package_id?.id || null,
    asset_id: initialData?.asset_id?.id || null,
    cm_sce_code: initialData?.cm_sce_code?.id || null,
    work_center_id: initialData?.work_center_id?.id || null,
    date_finding: initialData?.date_finding
      ? new Date(initialData.date_finding).toLocaleDateString("en-CA")
      : null,
    maintenance_type: initialData?.maintenance_type?.id || null,
    requested_by: initialData?.requested_by?.id || profile?.id || "",
    priority_id: initialData?.priority_id?.id || null,
    finding_detail: initialData?.finding_detail || null,
    anomaly_report: initialData?.anomaly_report || null,
    quick_incident_report: initialData?.quick_incident_report || null,
    work_request_no: initialData?.work_request_no || "",
  });


  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const facilities = useMemo(() => {
    const map = new Map<number, any>();
    apsf?.forEach((a) => {
      const f = a.package_id.system_id.facility_id;
      map.set(f.id, f);
    });
    return Array.from(map.values());
  }, [apsf]);

  const systems = useMemo(() => {
    const map = new Map<number, any>();
    apsf?.forEach((a) => {
      const sys = a.package_id.system_id;
      if (formData.facility_id && sys.facility_id.id !== formData.facility_id)
        return;
      map.set(sys.id, sys);
    });
    return Array.from(map.values());
  }, [apsf, formData.facility_id]);

  const packages = useMemo(() => {
    const map = new Map<number, any>();
    apsf?.forEach((a) => {
      const pkg = a.package_id;
      const sys = pkg.system_id;
      if (formData.facility_id && sys.facility_id.id !== formData.facility_id)
        return;
      if (formData.system_id && sys.id !== formData.system_id) return;
      map.set(pkg.id, pkg);
    });
    return Array.from(map.values());
  }, [apsf, formData.facility_id, formData.system_id]);

  const assets = useMemo(() => {
    return (
      apsf?.filter((a) => {
        const pkg = a.package_id;
        const sys = pkg.system_id;
        if (formData.facility_id && sys.facility_id.id !== formData.facility_id)
          return false;
        if (formData.system_id && sys.id !== formData.system_id) return false;
        if (formData.package_id && pkg.id !== formData.package_id) return false;
        return true;
      }) || []
    );
  }, [
    apsf,
    formData.facility_id,
    formData.system_id,
    formData.package_id,
  ]);

  /* ---------------- handleSelectChange ---------------- */
  const handleSelectChange = (name: string, value: any) => {
    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      /* -------- clear children when a parent changes -------- */
      if (name === "facility_id") {
        next.system_id = null;
        next.package_id = null;
        next.asset_id = null;
      } else if (name === "system_id") {
        next.package_id = null;
        next.asset_id = null;
      } else if (name === "package_id") {
        next.asset_id = null;
      }

      /* -------- auto‑select parents when a child changes -------- */
      if (name === "asset_id" && value) {
        const asset = apsf?.find((a) => a.id === value);
        if (asset) {
          const pkg = asset.package_id;
          const sys = pkg.system_id;
          next.package_id = pkg.id;
          next.system_id = sys.id;
          next.facility_id = sys.facility_id.id;
        }
      } else if (name === "package_id" && value) {
        const assetWithPkg = apsf?.find((a) => a.package_id.id === value);
        if (assetWithPkg) {
          const sys = assetWithPkg.package_id.system_id;
          next.system_id = sys.id;
          next.facility_id = sys.facility_id.id;
        }
      } else if (name === "system_id" && value) {
        const assetWithSys = apsf?.find((a) => a.package_id.system_id.id === value);
        if (assetWithSys) {
          next.facility_id = assetWithSys.package_id.system_id.facility_id.id;
        }
      }

      return next;
    });
  };


  const showValidationError = (description: string) => {
    toast({
      title: "Form Incomplete",
      description,
      variant: "destructive",
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description) return showValidationError("Description is required");
    if (!formData.work_request_date) return showValidationError("Work Request Date is required");
    if (!formData.target_due_date) return showValidationError("Target Due Date is required");
    if (!formData.facility_id) return showValidationError("Facility is required");
    if (!formData.system_id) return showValidationError("System is required");
    if (!formData.package_id) return showValidationError("Package is required");
    if (!formData.asset_id) return showValidationError("Asset is required");
    if (!formData.work_center_id) return showValidationError("Work Center is required");
    if (!formData.date_finding) return showValidationError("Date Finding is required");
    if (!formData.maintenance_type) return showValidationError("Maintenance Type is required");
    // if (!formData.requested_by) return showValidationError("Requested By is required");
    if (!formData.priority_id) return showValidationError("Priority is required");
    if (!formData.anomaly_report && !formData.quick_incident_report) {
      return showValidationError("Either Anomaly Report or Quick Incident Report must be selected");
    }

    setIsLoading(true); // Set loading to true
    try {
      await onSubmit(formData); // Wait for the onSubmit function to complete
    } finally {
      setIsLoading(false); // Set loading to false after submission
    }
  };

  if (isProfileLoading || isProfilesLoading) {
    return <Loading />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isLoading ? ( // Show the Loading component if isLoading is true
        <Loading />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label htmlFor="work_request_no">Work Request No</Label>
              <Input
                id="work_request_no"
                name="work_request_no"
                value={formData.work_request_no || "Auto Generated"} // Show "Auto Generated" if work_request_no is null or empty
                onChange={handleInputChange}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cm_status_id">CM Status</Label>
              <Select
                value={formData.cm_status_id?.toString() || ""}
                onValueChange={(value) => handleSelectChange("cm_status_id", parseInt(value))}
                disabled
              >
                <SelectTrigger id="cm_status_id" className="w-full">
                  <SelectValue placeholder="Select CM Status" />
                </SelectTrigger>
                <SelectContent>
                  {cmStatus?.map((status) => (
                    <SelectItem key={status.id} value={status.id.toString()}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description<span className="text-red-500 ml-1">*</span></Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="work_request_date">Work Request Date<span className="text-red-500 ml-1">*</span></Label>
              <Input
                id="work_request_date"
                name="work_request_date"
                type="date"
                value={formData.work_request_date || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target_due_date">Target Due Date<span className="text-red-500 ml-1">*</span></Label>
              <Input
                id="target_due_date"
                name="target_due_date"
                type="date"
                value={formData.target_due_date || ""}
                onChange={handleInputChange}
              />
            </div>

            {/* FACILITY */}
            <div className="space-y-2">
              <Label htmlFor="facility_id">Facility</Label>
              <Select
                value={formData.facility_id?.toString() || ""}
                onValueChange={(v) =>
                  handleSelectChange("facility_id", v ? parseInt(v) : null)
                }
              >
                <SelectTrigger id="facility_id" className="w-full">
                  <SelectValue placeholder="Select Facility" />
                </SelectTrigger>
                <SelectContent>
                  {facilities.map((f) => (
                    <SelectItem key={f.id} value={f.id.toString()}>
                      {f.location_code} - {f.location_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* SYSTEM */}
            <div className="space-y-2">
              <Label htmlFor="system_id">System</Label>
              <Select
                value={formData.system_id?.toString() || ""}
                onValueChange={(v) =>
                  handleSelectChange("system_id", v ? parseInt(v) : null)
                }
              >
                <SelectTrigger id="system_id" className="w-full">
                  <SelectValue placeholder="Select System" />
                </SelectTrigger>
                <SelectContent>
                  {systems.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.system_code} - {s.system_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* PACKAGE */}
            <div className="space-y-2">
              <Label htmlFor="package_id">Package</Label>
              <Select
                value={formData.package_id?.toString() || ""}
                onValueChange={(v) =>
                  handleSelectChange("package_id", v ? parseInt(v) : null)
                }
              >
                <SelectTrigger id="package_id" className="w-full">
                  <SelectValue placeholder="Select Package" />
                </SelectTrigger>
                <SelectContent>
                  {packages.map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()}>
                      {p.package_tag} - {p.package_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* ASSET */}
            <div className="space-y-2">
              <Label htmlFor="asset_id">Asset</Label>
              <Select
                value={formData.asset_id?.toString() || ""}
                onValueChange={(v) =>
                  handleSelectChange("asset_id", v ? parseInt(v) : null)
                }
              >
                <SelectTrigger id="asset_id" className="w-full">
                  <SelectValue placeholder="Select Asset" />
                </SelectTrigger>
                <SelectContent>
                  {assets.map((a) => (
                    <SelectItem key={a.id} value={a.id.toString()}>
                      {a.asset_no} - {a.asset_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cm_sce_code">CM SCE Code</Label>
              <Select
                value={formData.cm_sce_code?.toString() || ""}
                onValueChange={(value) => handleSelectChange("cm_sce_code", parseInt(value))}
              >
                <SelectTrigger id="cm_sce_code" className="w-full">
                  <SelectValue placeholder="Select CM SCE Code" />
                </SelectTrigger>
                <SelectContent>
                  {cmSce?.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.cm_sce_code} - {item.cm_group_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="work_center_id">
                Work Center<span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={formData.work_center_id?.toString() || ""}
                onValueChange={(value) => handleSelectChange("work_center_id", parseInt(value))}
              >
                <SelectTrigger id="work_center_id" className="w-full">
                  <SelectValue placeholder="Select Work Center" />
                </SelectTrigger>
                <SelectContent>
                  {workCenter?.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.code} - {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_finding">Date Finding<span className="text-red-500 ml-1">*</span></Label>
              <Input
                id="date_finding"
                name="date_finding"
                type="date"
                value={formData.date_finding || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenance_type">Maintenance Type<span className="text-red-500 ml-1">*</span></Label>
              <Select
                value={formData.maintenance_type?.toString() || ""}
                onValueChange={(value) => handleSelectChange("maintenance_type", parseInt(value))}
              >
                <SelectTrigger id="maintenance_type" className="w-full">
                  <SelectValue placeholder="Select Maintenance Type" />
                </SelectTrigger>
                <SelectContent>
                  {cmMaintenanceType?.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.code} - {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="requested_by">Requested By</Label>
              <Select
                value={formData.requested_by}
                onValueChange={(value) => handleSelectChange("requested_by", value)}
              >
                <SelectTrigger id="requested_by" className="w-full">
                  <SelectValue placeholder="Select Requested By" />
                </SelectTrigger>
                <SelectContent>
                  {profiles?.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority_id">Priority<span className="text-red-500 ml-1">*</span></Label>
              <Select
                value={formData.priority_id?.toString() || ""}
                onValueChange={(value) => handleSelectChange("priority_id", parseInt(value))}
              >
                <SelectTrigger id="priority_id" className="w-full">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  {priority?.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="finding_detail">Finding Detail</Label>
              <Textarea
                id="finding_detail"
                name="finding_detail"
                value={formData.finding_detail || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-4 pt-2">

              <div className="flex items-center space-x-2">
                <Label htmlFor="anomaly_report">Anomaly Report</Label>
                <Checkbox
                  id="anomaly_report"
                  checked={formData.anomaly_report || false}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      anomaly_report: checked === true, // Ensure the value is a boolean
                      quick_incident_report: checked === false, // Opposite value for the other checkbox
                    }))
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="quick_incident_report">Quick Incident Report</Label>
                <Checkbox
                  id="quick_incident_report"
                  checked={formData.quick_incident_report || false}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      quick_incident_report: checked === true, // Ensure the value is a boolean
                      anomaly_report: checked === false, // Opposite value for the other checkbox
                    }))
                  }
                />
              </div>
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