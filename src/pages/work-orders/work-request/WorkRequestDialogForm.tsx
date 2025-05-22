import React, { useEffect, useState } from "react";
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
import { useCriticalityData } from "@/hooks/lookup/lookup-criticality";
import { toast } from "@/hooks/use-toast";

interface WorkRequestDialogFormProps {
  onSubmit: (formData: any) => Promise<void>; // Assuming onSubmit is async
  onCancel: () => void;
  initialData?: any | null; // Optional initial data for editing
}

const WorkRequestDialogForm: React.FC<WorkRequestDialogFormProps> = ({ onSubmit, onCancel, initialData = null }) => {
  const { data: apsf } = useAssetData();
  const { data: cmStatus } = useCmStatusData();
  const { data: cmSce } = useCmSceData();
  const { data: workCenter } = useWorkCenterData();
  const { data: cmMaintenanceType } = useMaintenanceTypeCmData();
  const { data: criticality } = useCriticalityData();


  const [formData, setFormData] = useState({
    cm_status_id: initialData?.cm_status_id?.id || 1,
    description: initialData?.description || null,
    work_request_date: initialData?.work_request_date
      ? new Date(initialData.work_request_date).toISOString().split("T")[0]
      : null,
    target_due_date: initialData?.target_due_date
      ? new Date(initialData.target_due_date).toISOString().split("T")[0]
      : null,
    facility_id: initialData?.facility_id?.id || null,
    system_id: initialData?.system_id?.id || null,
    package_id: initialData?.package_id?.id || null,
    asset_id: initialData?.asset_id?.id || null,
    cm_sce_code: initialData?.cm_sce_code?.id || null,
    work_center_id: initialData?.work_center_id?.id || null,
    date_finding: initialData?.date_finding
      ? new Date(initialData.date_finding).toISOString().split("T")[0]
      : null,
    maintenance_type: initialData?.maintenance_type?.id || null,
    requested_by: initialData?.requested_by || null,
    criticality_id: initialData?.criticality_id?.id || null,
    finding_detail: initialData?.finding_detail || null,
    anomaly_report: initialData?.anomaly_report || null,
    quick_incident_report: initialData?.quick_incident_report || null,
    work_request_prefix: initialData?.work_request_prefix || "",
    work_request_no: initialData?.work_request_no || "",
  });


  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "facility_id" && { system_id: null, package_id: null, asset_id: null }),
      ...(name === "system_id" && { package_id: null, asset_id: null }),
      ...(name === "package_id" && { asset_id: null }),
    }));
  };

  useEffect(() => {
    if (formData.facility_id && formData.work_request_date) {
      const facility = apsf
        ?.find((project) =>
          project.facilities.some((facility) => facility.id === formData.facility_id)
        )
        ?.facilities.find((facility) => facility.id === formData.facility_id);

      const locationAbbr = facility?.location_name
        ?.split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase() || "XXX";

      const yearSuffix = formData.work_request_date.slice(2, 4) || "YY";

      const newPrefix = `WR-${locationAbbr}-CM-${yearSuffix}/`;

      setFormData((prev) => ({
        ...prev,
        work_request_prefix: newPrefix,
      }));
    }
  }, [formData.facility_id, formData.work_request_date, apsf]);

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
    if (!formData.criticality_id) return showValidationError("Criticality is required");


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
            {/* <pre>{JSON.stringify(apsf, null, 2)}</pre> */}
            <div className={`space-y-2 ${initialData?.work_request_no ? 'hidden' : ''}`}>
              <Label htmlFor="work_request_prefix">Work Request No</Label>
              <Input
                id="work_request_prefix"
                name="work_request_prefix"
                placeholder="...auto-generated..."
                value={formData.work_request_prefix}
                onChange={handleInputChange}
                required
                disabled
              />
            </div>

            <div className={`space-y-2 ${!initialData?.work_request_no ? 'hidden' : ''}`}>
              <Label htmlFor="work_request_no">Work Request No</Label>
              <Input
                id="work_request_no"
                name="work_request_no"
                value={formData.work_request_no}
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
                disabled={formData.cm_status_id !== 1}
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
                disabled={formData.cm_status_id !== 1}
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
                disabled={formData.cm_status_id !== 1}
              />
            </div>
            {/* Facility Select */}
            <div className="space-y-2">
              <Label htmlFor="facility_id">Facility<span className="text-red-500 ml-1">*</span></Label>
              <Select
                value={formData.facility_id?.toString() || ""}
                onValueChange={(value) => handleSelectChange("facility_id", parseInt(value))}
                required
                disabled={formData.cm_status_id !== 1}
              >
                <SelectTrigger id="facility_id" className="w-full">
                  <SelectValue placeholder="Select Facility" />
                </SelectTrigger>
                <SelectContent>
                  {apsf?.map((project) =>
                    project.facilities.map((facility) => (
                      <SelectItem key={facility.id} value={facility.id.toString()}>
                        {facility.location_code} - {facility.location_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* System Select */}
            <div className="space-y-2">
              <Label htmlFor="system_id">System<span className="text-red-500 ml-1">*</span></Label>
              <Select
                value={formData.system_id?.toString() || ""}
                onValueChange={(value) => handleSelectChange("system_id", parseInt(value))}
                disabled={formData.cm_status_id !== 1}
              >
                <SelectTrigger id="system_id" className="w-full">
                  <SelectValue placeholder="Select System" />
                </SelectTrigger>
                <SelectContent>
                  {apsf
                    ?.find((project) =>
                      project.facilities.some((facility) => facility.id === formData.facility_id)
                    )
                    ?.facilities.find((facility) => facility.id === formData.facility_id)
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
              <Label htmlFor="package_id">Package<span className="text-red-500 ml-1">*</span></Label>
              <Select
                value={formData.package_id?.toString() || ""}
                onValueChange={(value) => handleSelectChange("package_id", parseInt(value))}
                disabled={formData.cm_status_id !== 1}
              >
                <SelectTrigger id="package_id" className="w-full">
                  <SelectValue placeholder="Select Package" />
                </SelectTrigger>
                <SelectContent>
                  {apsf
                    ?.find((project) =>
                      project.facilities.some((facility) =>
                        facility.systems.some((system) => system.id === formData.system_id)
                      )
                    )
                    ?.facilities.find((facility) =>
                      facility.systems.some((system) => system.id === formData.system_id)
                    )
                    ?.systems.find((system) => system.id === formData.system_id)
                    ?.packages.map((packageData) => (
                      <SelectItem key={packageData.id} value={packageData.id.toString()}>
                        {packageData.package_name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Asset Select */}
            <div className="space-y-2">
              <Label htmlFor="asset_id">Asset<span className="text-red-500 ml-1">*</span></Label>
              <SearchableSelect
                options={
                  apsf
                    ?.find((project) =>
                      project.facilities.some((facility) =>
                        facility.systems.some((system) =>
                          system.packages.some((packageData) => packageData.id === formData.package_id)
                        )
                      )
                    )
                    ?.facilities.find((facility) =>
                      facility.systems.some((system) =>
                        system.packages.some((packageData) => packageData.id === formData.package_id)
                      )
                    )
                    ?.systems.find((system) =>
                      system.packages.some((packageData) => packageData.id === formData.package_id)
                    )
                    ?.packages.find((packageData) => packageData.id === formData.package_id)
                    ?.assets || []
                }
                value={formData.asset_id}
                onChange={(value) => handleSelectChange("asset_id", value)}
                placeholder="Select Asset"
                searchBy={(asset) => [asset.asset_name, asset.asset_no]} // Search by asset name and number
                getLabel={(asset) => asset.asset_name} // Display asset name
                getValue={(asset) => asset.id} // Use asset ID as the value
                disabled={formData.cm_status_id !== 1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cm_sce_code">CM SCE Code</Label>
              <SearchableSelect
                options={cmSce || []} // Use the cmSce data
                value={formData.cm_sce_code}
                onChange={(value) => handleSelectChange("cm_sce_code", value)}
                placeholder="Select CM SCE Code"
                searchBy={(item) => [item.cm_sce_code, item.cm_group_name]} // Search by cm_sce_code and cm_group_name
                getLabel={(item) => `${item.cm_sce_code} - ${item.cm_group_name}`} // Display cm_sce_code and cm_group_name
                getValue={(item) => item.id} // Use cm_sce_code as the value

              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="work_center_id">Work Center<span className="text-red-500 ml-1">*</span></Label>
              <SearchableSelect
                options={workCenter || []} // Use the workCenter data
                value={formData.work_center_id}
                onChange={(value) => handleSelectChange("work_center_id", value)}
                placeholder="Select Work Center"
                searchBy={(item) => [item.id.toString(), item.code, item.name]} // Search by id, code, and name
                getLabel={(item) => `${item.code} - ${item.name}`} // Display code and name
                getValue={(item) => item.id}
                disabled={formData.cm_status_id !== 1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_finding">Date Finding<span className="text-red-500 ml-1">*</span></Label>
              <Input
                id="date_finding"
                name="date_finding"
                type="date"
                value={formData.date_finding || ""}
                onChange={handleInputChange}
                disabled={formData.cm_status_id !== 1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenance_type">Maintenance Type<span className="text-red-500 ml-1">*</span></Label>
              <Select
                value={formData.maintenance_type?.toString() || ""}
                onValueChange={(value) => handleSelectChange("maintenance_type", parseInt(value))}
                disabled={formData.cm_status_id !== 1}
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
              <Label htmlFor="requested_by">Requested By<span className="text-red-500 ml-1">*</span></Label>
              <Input
                id="requested_by"
                name="requested_by"
                value={formData.requested_by || ""}
                onChange={handleInputChange}
                disabled={formData.cm_status_id !== 1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="criticality_id">Criticality<span className="text-red-500 ml-1">*</span></Label>
              <Select
                value={formData.criticality_id?.toString() || ""}
                onValueChange={(value) => handleSelectChange("criticality_id", parseInt(value))}
                disabled={formData.cm_status_id !== 1}
              >
                <SelectTrigger id="criticality_id" className="w-full">
                  <SelectValue placeholder="Select Criticality" />
                </SelectTrigger>
                <SelectContent>
                  {criticality?.map((item) => (
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
                    }))
                  }
                  disabled={formData.cm_status_id !== 1}
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
                    }))
                  }
                  disabled={formData.cm_status_id !== 1}
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