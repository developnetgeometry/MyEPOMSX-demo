import React, { useState, useMemo } from "react";
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