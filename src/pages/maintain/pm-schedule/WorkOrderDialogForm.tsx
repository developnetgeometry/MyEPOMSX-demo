import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loading from "@/components/shared/Loading"; // Import the Loading component
import { useAssetData } from "@/pages/work-orders/hooks/use-apsf-by-project-data";
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
import { useAssetOptions, useFacilityOptions, useMaintenanceOptions, usePackageOptions, useSystemOptions, useWorkCenterOptions } from "@/hooks/queries/usePMSchedule";

interface WorkOrderDialogFormProps {
  onSubmit: (formData: any) => Promise<void>; // Assuming onSubmit is async
  onCancel: () => void;
  initialData?: any | null; // Optional initial data for editing
}

const WorkOrderDialogForm: React.FC<WorkOrderDialogFormProps> = ({ onSubmit, onCancel, initialData = null }) => {
  const { data: apsf } = useAssetData();
  const { data: facilityOptions } = useFacilityOptions();
  const { data: packageOptions } = usePackageOptions();
  const { data: systemOptions } = useSystemOptions();
  const { data: assetOptions } = useAssetOptions();
  const { data: maintenanceOptions } = useMaintenanceOptions();
  const { data: workCenterOptions } = useWorkCenterOptions();


  const [formData, setFormData] = useState({
    pm_schedule_id: initialData?.pm_schedule_id || null,
    is_active: initialData?.is_active || true,
    pm_description: initialData?.pm_description || null,
    work_order_date: initialData?.work_order_date
      ? new Date(initialData.work_order_date).toISOString().split("T")[0]
      : null,
    due_date: initialData?.due_date
      ? new Date(initialData.due_date).toISOString().split("T")[0]
      : null,
    facility_id: initialData?.facility_id || null,
    system_id: initialData?.system_id || null,
    package_id: initialData?.package_id || null,
    asset_id: initialData?.asset_id || null,
    work_center_id: initialData?.work_center_id || null,
    maintenance_id: initialData?.maintenance_id || null,
    requested_by: initialData?.requested_by || null,
    work_order_prefix: initialData?.work_order_prefix || "",
    work_order_no: initialData?.work_order_no || "",
    asset_sce_code_id: initialData?.asset_sce_code_id || null,
    pm_group_id: initialData?.pm_group_id || null,
    priority_id: initialData?.priority_id || null,
    discipline_id: initialData?.discipline_id || null,
    task_id: initialData?.task_id || null,
    frequency_id: initialData?.frequency_id || null,
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
    if (formData.facility_id && formData.work_order_date) {
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

      const yearSuffix = formData.work_order_date.slice(2, 4) || "YY";

      const newPrefix = `WR-${locationAbbr}-PM-${yearSuffix}/`;

      setFormData((prev) => ({
        ...prev,
        work_request_prefix: newPrefix,
      }));
    }
  }, [formData.facility_id, formData.work_order_date, apsf]);

  const showValidationError = (description: string) => {
    toast({
      title: "Form Incomplete",
      description,
      variant: "destructive",
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pm_description) return showValidationError("Description is required");
    if (!formData.work_order_date) return showValidationError("Work Order Date is required");
    if (!formData.due_date) return showValidationError("Target Due Date is required");
    if (!formData.facility_id) return showValidationError("Facility is required");
    if (!formData.system_id) return showValidationError("System is required");
    if (!formData.package_id) return showValidationError("Package is required");
    if (!formData.asset_id) return showValidationError("Asset is required");
    if (!formData.work_center_id) return showValidationError("Work Center is required");
    if (!formData.maintenance_id) return showValidationError("Maintenance Type is required");
    // if (!formData.requested_by) return showValidationError("Requested By is required");


    setIsLoading(true); // Set loading to true
    try {
        await onSubmit(formData);
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Something went wrong",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isLoading ? ( // Show the Loading component if isLoading is true
        <Loading />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`space-y-2 ${initialData?.work_order_no ? 'hidden' : ''}`}>
              <Label htmlFor="work_order_prefix">Work Order No</Label>
              <Input
                id="work_order_prefix"
                name="work_order_prefix"
                placeholder="...auto-generated..."
                value={formData.work_order_prefix}
                onChange={handleInputChange}
                required
                disabled
              />
            </div>

            <div className={`space-y-2 ${!initialData?.work_order_no ? 'hidden' : ''}`}>
              <Label htmlFor="work_order_no">Work Order No</Label>
              <Input
                id="work_order_no"
                name="work_order_no"
                value={formData.work_order_no}
                onChange={handleInputChange}
                disabled
              />
            </div>


            {/* <div className="space-y-2">
              <Label htmlFor="is_active">PM Status</Label>
              <Select
                value={formData.is_active?.toString() || ""}
                onValueChange={(value) => handleSelectChange("is_active", parseInt(value))}
                disabled
              >
                <SelectTrigger id="is_active" className="w-full">
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
            </div> */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description<span className="text-red-500 ml-1">*</span></Label>
              <Textarea
                id="description"
                name="description"
                value={formData.pm_description || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="work_order_date">Work Order Date<span className="text-red-500 ml-1">*</span></Label>
              <Input
                id="work_order_date"
                name="work_order_date"
                type="date"
                value={formData.work_order_date || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="due_date">Target Due Date<span className="text-red-500 ml-1">*</span></Label>
              <Input
                id="due_date"
                name="due_date"
                type="date"
                value={formData.due_date || ""}
                onChange={handleInputChange}
              />
            </div>
            {/* Facility Select */}
            <div className="space-y-2">
              <Label htmlFor="facility_id">Facility<span className="text-red-500 ml-1">*</span></Label>
              <Select
                value={formData.facility_id?.toString() || ""}
                onValueChange={(value) => handleSelectChange("facility_id", parseInt(value))}
                required
              >
                <SelectTrigger id="facility_id" className="w-full">
                  <SelectValue placeholder="Select Facility" />
                </SelectTrigger>
                <SelectContent>
                  {facilityOptions?.map((facility) => (
                    <SelectItem key={facility.id} value={facility.id.toString()}>
                      {facility.location_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* System Select */}
            <div className="space-y-2">
              <Label htmlFor="system_id">System<span className="text-red-500 ml-1">*</span></Label>
              <Select
                value={formData.system_id?.toString() || ""}
                onValueChange={(value) => handleSelectChange("system_id", parseInt(value))}
                disabled={!formData.facility_id } // Disable if no facility is selected
              >
                <SelectTrigger id="system_id" className="w-full">
                  <SelectValue placeholder="Select System" />
                </SelectTrigger>
                <SelectContent>
                  {systemOptions?.map((system) => (
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
                disabled={!formData.system_id } // Disable if no system is selected
              >
                <SelectTrigger id="package_id" className="w-full">
                  <SelectValue placeholder="Select Package" />
                </SelectTrigger>
                <SelectContent>
                  {packageOptions?.map((packageData) => (
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
              <Select
                value={formData.asset_id?.toString() || ""}
                onValueChange={(value) => handleSelectChange("asset_id", parseInt(value))}
                disabled={!formData.package_id } // Disable if no package is selected
              >
                <SelectTrigger id="asset_id" className="w-full">
                  <SelectValue placeholder="Select Asset" />
                </SelectTrigger>
                <SelectContent>
                  {assetOptions?.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id.toString()}>
                      {asset.asset_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="work_center_id">Work Center<span className="text-red-500 ml-1">*</span></Label>
              <Select
                value={formData.work_center_id?.toString() || ""}
                onValueChange={(value) => handleSelectChange("work_center_id", parseInt(value))}
              >
                <SelectTrigger id="work_center_id" className="w-full">
                  <SelectValue placeholder="Select Work Center" />
                </SelectTrigger>
                <SelectContent>
                  {workCenterOptions?.map((workCenter) => (
                    <SelectItem key={workCenter.id} value={workCenter.id.toString()}>
                      {workCenter.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenance_type">Maintenance Type<span className="text-red-500 ml-1">*</span></Label>
              <Select
                value={formData.maintenance_id?.toString() || ""}
                onValueChange={(value) => handleSelectChange("maintenance_type", parseInt(value))}
              >
                <SelectTrigger id="maintenance_type" className="w-full">
                  <SelectValue placeholder="Select Maintenance Type" />
                </SelectTrigger>
                <SelectContent>
                  {maintenanceOptions?.map((maintenanceType) => (
                    <SelectItem key={maintenanceType.id} value={maintenanceType.id.toString()}>
                      {maintenanceType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="requested_by">Requested By<span className="text-red-500 ml-1">*</span></Label>
              <Input
                id="requested_by"
                name="requested_by"
                value={formData.requested_by || ""}
                onChange={handleInputChange}
              />
            </div> */}
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

export default WorkOrderDialogForm;