import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import Loading from "@/components/shared/Loading";
import { useSensorTypeData } from "@/hooks/lookup/lookup-sensor_type";
import { useManufacturerData } from "@/hooks/lookup/lookup-manufacturer";
import { useClientData } from "../hooks/use-client-data";
import { Textarea } from "@/components/ui/textarea";

interface SensorDialogFormProps {
    onSubmit: (formData: any) => Promise<void>;
    onCancel: () => void;
    initialData?: any;
}

const SensorDialogForm: React.FC<SensorDialogFormProps> = ({
    onSubmit,
    onCancel,
    initialData,
}) => {
    const { data: sensorTypes } = useSensorTypeData();
    const { data: manufacturers } = useManufacturerData();
    const { data: clients } = useClientData();
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        sensor_type_id: initialData?.sensor_type_id?.id || "",
        description: initialData?.description || "",
        manufacturer_id: initialData?.manufacturer_id?.id || "",
        model: initialData?.model || "",
        calibration_date: initialData?.calibration_date
            ? new Date(initialData.calibration_date).toISOString().split("T")[0] // Format to YYYY-MM-DD
            : "",
        client_id: initialData?.client_id || "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
                            <Label htmlFor="name">Sensor Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sensor_type_id">Sensor Type</Label>
                            <Select
                                value={formData.sensor_type_id?.toString()}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({ ...prev, sensor_type_id: parseInt(value) })) // Store the ID as a number
                                }
                            >
                                <SelectTrigger id="sensor_type_id" className="w-full">
                                    <SelectValue placeholder="Select Sensor Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sensorTypes?.map((type) => (
                                        <SelectItem key={type.id} value={type.id.toString()}>
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="model">Model</Label>
                            <Input
                                id="model"
                                name="model"
                                value={formData.model}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="manufacturer_id">Manufacturer</Label>
                            <Select
                                value={formData.manufacturer_id?.toString()}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({ ...prev, manufacturer_id: parseInt(value) })) // Store the ID as a number
                                }
                            >
                                <SelectTrigger id="manufacturer_id" className="w-full">
                                    <SelectValue placeholder="Select Manufacturer" />
                                </SelectTrigger>
                                <SelectContent>
                                    {manufacturers?.map((manufacturer) => (
                                        <SelectItem key={manufacturer.id} value={manufacturer.id.toString()}>
                                            {manufacturer.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="client_id">Client</Label>
                            <Select
                                value={formData.client_id?.toString()}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, client_id: value }))}>
                                <SelectTrigger id="client_id" className="w-full">
                                    <SelectValue placeholder="Select Client" />
                                </SelectTrigger>
                                <SelectContent>
                                    {clients?.map((client) => (
                                        <SelectItem key={client.id} value={client.id.toString()}>
                                            {`${client.code} - ${client.name}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="calibration_date">Calibration Date</Label>
                            <Input
                                id="calibration_date"
                                name="calibration_date"
                                type="date"
                                value={formData.calibration_date}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
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

export default SensorDialogForm;