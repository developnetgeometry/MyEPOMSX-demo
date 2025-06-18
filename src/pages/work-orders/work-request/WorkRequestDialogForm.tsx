import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loading from "@/components/shared/Loading"; // Import the Loading component
import { useAssetData } from "../hooks/use-apsf-by-project-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const WorkRequestDialogForm: React.FC<WorkRequestDialogFormProps> = ({
  onSubmit,
  onCancel,
  initialData = null,
}) => {
  const { profile, loading: isProfileLoading } = useAuth();
  const { data: profiles, isLoading: isProfilesLoading } = useProfilesById(
    profile?.id || ""
  );
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
    facility_id: initialData?.facility_id?.id || initialData?.facility_id || "",
    system_id: initialData?.system_id?.id || initialData?.system_id || "",
    package_id: initialData?.package_id?.id || initialData?.package_id || "",
    asset_id: initialData?.asset_id?.id || initialData?.asset_id || "",
    cm_sce_code: initialData?.cm_sce_code?.id || "",
    work_center_id: initialData?.work_center_id?.id || "",
    date_finding: initialData?.date_finding
      ? new Date(initialData.date_finding).toLocaleDateString("en-CA")
      : null,
    maintenance_type: initialData?.maintenance_type?.id || "",
    requested_by: initialData?.requested_by?.id || profile?.id || "",
    priority_id: initialData?.priority_id?.id || "",
    finding_detail: initialData?.finding_detail || null,
    anomaly_report: initialData?.anomaly_report || false,
    quick_incident_report: initialData?.quick_incident_report || false,
    work_request_no: initialData?.work_request_no || "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        facility_id:
          initialData.facility_id?.id || initialData.facility_id || "",
        system_id: initialData.system_id?.id || initialData.system_id || "",
        package_id: initialData.package_id?.id || initialData.package_id || "",
        asset_id: initialData.asset_id?.id || initialData.asset_id || "",
        // ...other fields
        ...initialData,
      }));
    } else {
      // Reset form to default values when initialData is null
      setFormData({
        cm_status_id: 1,
        description: null,
        work_request_date: null,
        target_due_date: null,
        facility_id: "",
        system_id: "",
        package_id: "",
        asset_id: "",
        cm_sce_code: "",
        work_center_id: "",
        date_finding: null,
        maintenance_type: "",
        requested_by: profile?.id || "",
        priority_id: "",
        finding_detail: null,
        anomaly_report: false,
        quick_incident_report: false,
        work_request_no: "",
      });
    }
  }, [initialData, profile?.id]);

  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: any) => {
    let updatedFormData = { ...formData, [name]: value };

    if (name === "asset_id") {
      const selectedAsset = apsf.assets.find((asset) => asset.id === value);
      const selectedPackage = apsf.packages.find((pkg) => pkg.id === selectedAsset?.package_id);
      const selectedSystem = apsf.systems.find((sys) => sys.id === selectedPackage?.system_id);
      const selectedFacility = apsf.facilities.find((fac) => fac.id === selectedSystem?.facility_id);

      updatedFormData = {
        ...updatedFormData,
        facility_id: selectedFacility?.id || null,
        system_id: selectedSystem?.id || null,
        package_id: selectedPackage?.id || null,
      };
    } else if (name === "package_id") {
      const selectedPackage = apsf.packages.find((pkg) => pkg.id === value);
      const selectedSystem = apsf.systems.find((sys) => sys.id === selectedPackage?.system_id);
      const selectedFacility = apsf.facilities.find((fac) => fac.id === selectedSystem?.facility_id);

      updatedFormData = {
        ...updatedFormData,
        facility_id: selectedFacility?.id || null,
        system_id: selectedSystem?.id || null,
        asset_id: null,
      };
    } else if (name === "system_id") {
      const selectedSystem = apsf.systems.find((sys) => sys.id === value);
      const selectedFacility = apsf.facilities.find((fac) => fac.id === selectedSystem?.facility_id);

      updatedFormData = {
        ...updatedFormData,
        facility_id: selectedFacility?.id || null,
        package_id: null,
        asset_id: null,
      };
    } else if (name === "facility_id") {
      updatedFormData = {
        ...updatedFormData,
        system_id: null,
        package_id: null,
        asset_id: null,
      };
    }

    setFormData(updatedFormData);
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
    if (!formData.description)
      return showValidationError("Description is required");
    if (!formData.work_request_date)
      return showValidationError("Work Request Date is required");
    if (!formData.target_due_date)
      return showValidationError("Target Due Date is required");
    if (!formData.facility_id)
      return showValidationError("Facility is required");
    if (!formData.system_id) return showValidationError("System is required");
    if (!formData.package_id) return showValidationError("Package is required");
    if (!formData.asset_id) return showValidationError("Asset is required");
    if (!formData.work_center_id)
      return showValidationError("Work Center is required");
    if (!formData.date_finding)
      return showValidationError("Date Finding is required");
    if (!formData.maintenance_type)
      return showValidationError("Maintenance Type is required");
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
                onValueChange={(value) =>
                  handleSelectChange("cm_status_id", parseInt(value))
                }
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
              <Label htmlFor="description">
                Description<span className="text-red-500 ml-1">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="work_request_date">
                Work Request Date<span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="work_request_date"
                name="work_request_date"
                type="date"
                value={formData.work_request_date || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target_due_date">
                Target Due Date<span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="target_due_date"
                name="target_due_date"
                type="date"
                value={formData.target_due_date || ""}
                onChange={handleInputChange}
              />
            </div>

            {/* Facility Select */}
            <div className="space-y-2">
              <Label htmlFor="facility_id">
                Facility<span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={formData.facility_id?.toString() || ""}
                onValueChange={(value) =>
                  handleSelectChange("facility_id", parseInt(value))
                }
                required
              >
                <SelectTrigger id="facility_id" className="w-full">
                  <SelectValue placeholder="Select Facility" />
                </SelectTrigger>
                <SelectContent>
                  {apsf?.map((project) =>
                    project.facilities.map((facility) => (
                      <SelectItem
                        key={facility.id}
                        value={facility.id.toString()}
                      >
                        {facility.location_code} - {facility.location_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* System Select */}
            <div className="space-y-2">
              <Label htmlFor="system_id">
                System<span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={formData.system_id?.toString() || ""}
                onValueChange={(value) =>
                  handleSelectChange("system_id", parseInt(value))
                }
                disabled={!formData.facility_id} // Disable if no facility is selected
              >
                <SelectTrigger id="system_id" className="w-full">
                  <SelectValue placeholder="Select System" />
                </SelectTrigger>
                <SelectContent>
                  {apsf
                    ?.find((project) =>
                      project.facilities.some(
                        (facility) => facility.id === formData.facility_id
                      )
                    )
                    ?.facilities.find(
                      (facility) => facility.id === formData.facility_id
                    )
                    ?.systems.map((system) => (
                      <SelectItem key={system.id} value={system.id.toString()}>
                        {system.system_name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Package Select */}
            <div className="space-y-2">
              <Label htmlFor="package_id">
                Package<span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={formData.package_id?.toString() || ""}
                onValueChange={(value) =>
                  handleSelectChange("package_id", parseInt(value))
                }
                disabled={!formData.system_id}
              >
                <SelectTrigger id="package_id" className="w-full">
                  <SelectValue placeholder="Select Package" />
                </SelectTrigger>
                <SelectContent>
                  {apsf
                    ?.find((project) =>
                      project.facilities.some((facility) =>
                        facility.systems.some(
                          (system) => system.id === formData.system_id
                        )
                      )
                    )
                    ?.facilities.find((facility) =>
                      facility.systems.some(
                        (system) => system.id === formData.system_id
                      )
                    )
                    ?.systems.find((system) => system.id === formData.system_id)
                    ?.packages.map((packageData) => (
                      <SelectItem
                        key={packageData.id}
                        value={packageData.id.toString()}
                      >
                        {packageData.package_name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Asset Select */}
            <div className="space-y-2">
              <Label htmlFor="asset_id">Asset</Label>
              <Select
                value={formData.asset_id?.toString() || ""}
                onValueChange={(value) =>
                  handleSelectChange("asset_id", parseInt(value))
                }
                disabled={!formData.package_id}
              >
                <SelectTrigger id="asset_id" className="w-full">
                  <SelectValue placeholder="Select Asset" />
                </SelectTrigger>
                <SelectContent>
                  {apsf
                    ?.find((project) =>
                      project.facilities.some((facility) =>
                        facility.systems.some((system) =>
                          system.packages.some(
                            (packageData) =>
                              packageData.id === formData.package_id
                          )
                        )
                      )
                    )
                    ?.facilities.find((facility) =>
                      facility.systems.some((system) =>
                        system.packages.some(
                          (packageData) =>
                            packageData.id === formData.package_id
                        )
                      )
                    )
                    ?.systems.find((system) =>
                      system.packages.some(
                        (packageData) => packageData.id === formData.package_id
                      )
                    )
                    ?.packages.find(
                      (packageData) => packageData.id === formData.package_id
                    )
                    ?.assets.map((asset) => (
                      <SelectItem key={asset.id} value={asset.id.toString()}>
                        {asset.asset_name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cm_sce_code">CM SCE Code</Label>
              <Select
                value={formData.cm_sce_code?.toString() || ""}
                onValueChange={(value) =>
                  handleSelectChange("cm_sce_code", parseInt(value))
                }
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
                onValueChange={(value) =>
                  handleSelectChange("work_center_id", parseInt(value))
                }
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
              <Label htmlFor="date_finding">
                Date Finding<span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="date_finding"
                name="date_finding"
                type="date"
                value={formData.date_finding || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenance_type">
                Maintenance Type<span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={formData.maintenance_type?.toString() || ""}
                onValueChange={(value) =>
                  handleSelectChange("maintenance_type", parseInt(value))
                }
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
                onValueChange={(value) =>
                  handleSelectChange("requested_by", value)
                }
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
              <Label htmlFor="priority_id">
                Priority<span className="text-red-500 ml-1">*</span>
              </Label>
              <Select
                value={formData.priority_id?.toString() || ""}
                onValueChange={(value) =>
                  handleSelectChange("priority_id", parseInt(value))
                }
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
                <Label htmlFor="quick_incident_report">
                  Quick Incident Report
                </Label>
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
