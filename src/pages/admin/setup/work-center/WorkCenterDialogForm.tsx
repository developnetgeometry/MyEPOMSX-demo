import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import Loading from "@/components/shared/Loading";
import { Textarea } from "@/components/ui/textarea";

interface WorkCenterDialogFormProps {
    onSubmit: (formData: any) => Promise<void>; // Assuming onSubmit is async
    onCancel: () => void;
    initialData?: any; // Optional initial data for editing
}

const WorkCenterDialogForm: React.FC<WorkCenterDialogFormProps> = ({ onSubmit, onCancel, initialData }) => {
    const [formData, setFormData] = useState({
        code: initialData?.code || "",
        name: initialData?.name || "",
        type: initialData?.type || "",
        effective_date: initialData?.effective_date
            ? new Date(initialData.effective_date).toISOString().split("T")[0] // Format to YYYY-MM-DD
            : "",
        remark: initialData?.remark || "",
        is_active: initialData?.is_active ?? true, // Default to true
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleIsActiveChange = (value: string) => {
        setFormData((prev) => ({ ...prev, is_active: value === "true" }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
                            <Label htmlFor="code">Work Center Code</Label>
                            <Input
                                id="code"
                                name="code"
                                value={formData.code}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Work Center Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Work Center Type</Label>
                            <Input
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="effective_date">Effective Date</Label>
                            <Input
                                id="effective_date"
                                name="effective_date"
                                type="date"
                                value={formData.effective_date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="is_active">Status</Label>
                            <Select
                                value={formData.is_active.toString()}
                                onValueChange={handleIsActiveChange}
                            >
                                <SelectTrigger id="is_active" className="w-full">
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Active</SelectItem>
                                    <SelectItem value="false">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="remark">Remark</Label>
                            <Textarea
                                id="remark"
                                name="remark"
                                value={formData.remark}
                                onChange={handleInputChange}
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

export default WorkCenterDialogForm;