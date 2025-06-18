import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loading from "@/components/shared/Loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { usePriorityData } from "@/hooks/lookup/lookup-priority";
import { useWorkCenterData } from "@/pages/admin/setup/hooks/use-work-center-data";
import { useDisciplineData } from "@/hooks/lookup/lookup-disipline";
import { useTaskByDisciplineData } from "../hooks/use-task-by-discipline-data";
import { useFrequencyData } from "../hooks/use-frequency-data";
import { useAssetData } from "@/pages/work-orders/hooks/use-apsf-by-project-data";
import { toast } from "@/hooks/use-toast";


interface PMScheduleDialogFormProps {
    onSubmit: (formData: any) => Promise<void>;
    onCancel: () => void;
    initialData?: any | null;
}

const PMScheduleDialogForm: React.FC<PMScheduleDialogFormProps> = ({
    onSubmit,
    onCancel,
    initialData = null,
}) => {
    const { data: priorities } = usePriorityData();
    const { data: workCenters } = useWorkCenterData();
    const { data: apsf } = useAssetData();
    const { data: disciplines } = useDisciplineData();
    const { data: frequencies } = useFrequencyData();


    const [formData, setFormData] = useState({
        pm_description: initialData?.pm_description || "",
        due_date: initialData?.due_date
            ? new Date(initialData.due_date).toISOString().split("T")[0]
            : "",
        is_active: initialData?.is_active || false,
        priority_id: initialData?.priority_id?.id || null,
        work_center_id: initialData?.work_center_id?.id || null,
        discipline_id: initialData?.discipline_id?.id || null,
        task_id: initialData?.task_id?.id || null,
        frequency_id: initialData?.frequency_id?.id || null,
        asset_id: initialData?.asset_id?.id || null,
        system_id: initialData?.system_id?.id || null,
        package_id: initialData?.package_id?.id || null,
        pm_group_id: initialData?.pm_group_id?.id || null,
        pm_sce_group_id: initialData?.pm_sce_group_id?.id || null,
        facility_id: initialData?.facility_id?.id || null,
    });

    const { data: tasks } = useTaskByDisciplineData(formData.discipline_id || null);

    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        if (!formData.due_date) return showValidationError("Due Date is required");
        if (!formData.priority_id) return showValidationError("Priority is required");
        if (!formData.work_center_id) return showValidationError("Work Center is required");
        if (!formData.discipline_id) return showValidationError("Discipline is required");
        if (!formData.task_id) return showValidationError("Task is required");
        if (!formData.frequency_id) return showValidationError("Frequency is required");
        if (!formData.facility_id) return showValidationError("Facility is required");
        if (!formData.system_id) return showValidationError("System is required");
        if (!formData.package_id) return showValidationError("Package is required");
        setIsLoading(true);
        try {
            await onSubmit(formData);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="pm_description">PM Description</Label>
                            <Input
                                id="pm_description"
                                name="pm_description"
                                value={formData.pm_description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="due_date">Due Date<span className="text-red-500 ml-1">*</span></Label>
                            <Input
                                id="due_date"
                                name="due_date"
                                type="date"
                                value={formData.due_date}
                                onChange={handleInputChange}
                            />
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
                                    {priorities?.map((priority) => (
                                        <SelectItem key={priority.id} value={priority.id.toString()}>
                                            {priority.name}
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
                                    {workCenters?.map((workCenter) => (
                                        <SelectItem key={workCenter.id} value={workCenter.id.toString()}>
                                            {workCenter.code} - {workCenter.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="discipline_id">Discipline<span className="text-red-500 ml-1">*</span></Label>
                            <Select
                                value={formData.discipline_id?.toString() || ""}
                                onValueChange={(value) => handleSelectChange("discipline_id", parseInt(value))}
                            >
                                <SelectTrigger id="discipline_id" className="w-full">
                                    <SelectValue placeholder="Select Discipline" />
                                </SelectTrigger>
                                <SelectContent>
                                    {disciplines?.map((discipline) => (
                                        <SelectItem key={discipline.id} value={discipline.id.toString()}>
                                            {discipline.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="task_id">Task<span className="text-red-500 ml-1">*</span></Label>
                            <Select
                                value={formData.task_id?.toString() || ""}
                                onValueChange={(value) => handleSelectChange("task_id", parseInt(value))}
                            >
                                <SelectTrigger id="task_id" className="w-full">
                                    <SelectValue placeholder="Select Task" />
                                </SelectTrigger>
                                <SelectContent>
                                    {tasks?.map((task) => (
                                        <SelectItem key={task.id} value={task.id.toString()}>
                                            {task.task_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="frequency_id">Frequency<span className="text-red-500 ml-1">*</span></Label>
                            <Select
                                value={formData.frequency_id?.toString() || ""}
                                onValueChange={(value) => handleSelectChange("frequency_id", parseInt(value))}
                            >
                                <SelectTrigger id="frequency_id" className="w-full">
                                    <SelectValue placeholder="Select Frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {frequencies?.map((frequency) => (
                                        <SelectItem key={frequency.id} value={frequency.id.toString()}>
                                            {frequency.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Facility Select */}
                        <div className="space-y-2">
                            <Label htmlFor="facility_id">Facility<span className="text-red-500 ml-1">*</span></Label>
                            <Select
                                value={formData.facility_id?.toString() || ""}
                                onValueChange={(value) => handleSelectChange("facility_id", parseInt(value))}
                            >
                                <SelectTrigger id="facility_id" className="w-full">
                                    <SelectValue placeholder="Select Facility" />
                                </SelectTrigger>
                                <SelectContent>
                                    {apsf?.facilities?.map((facility) => (
                                        <SelectItem key={facility.id} value={facility.id.toString()}>
                                            {facility.location_code} - {facility.location_name}
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
                            >
                                <SelectTrigger id="system_id" className="w-full">
                                    <SelectValue placeholder="Select System" />
                                </SelectTrigger>
                                <SelectContent>
                                    {apsf?.systems?.map((system) => (
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
                            >
                                <SelectTrigger id="package_id" className="w-full">
                                    <SelectValue placeholder="Select Package" />
                                </SelectTrigger>
                                <SelectContent>
                                    {apsf?.packages?.map((pkg) => (
                                        <SelectItem key={pkg.id} value={pkg.id.toString()}>
                                            {pkg.package_name}
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
                                onValueChange={(value) => handleSelectChange("asset_id", parseInt(value))}
                            >
                                <SelectTrigger id="asset_id" className="w-full">
                                    <SelectValue placeholder="Select Asset" />
                                </SelectTrigger>
                                <SelectContent>
                                    {apsf?.assets?.map((asset) => (
                                        <SelectItem key={asset.id} value={asset.id.toString()}>
                                            {asset.asset_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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

export default PMScheduleDialogForm;