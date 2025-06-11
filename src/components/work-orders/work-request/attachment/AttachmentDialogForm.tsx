import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loading from "@/components/shared/Loading";

interface AttachmentDialogFormProps {
    onSubmit: (formData: { file: File | null; description?: string }) => Promise<void>;
    onCancel: () => void;
    initialData?: { description?: string; file_path?: string };
}

const AttachmentDialogForm: React.FC<AttachmentDialogFormProps> = ({
    onSubmit,
    onCancel,
    initialData,
}) => {
    const [formData, setFormData] = useState({
        file: null as File | null,
        description: initialData?.description || "",
        file_path: initialData?.file_path || "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData((prev) => ({ ...prev, file }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onSubmit({ file: formData.file, description: formData.description });
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
                        {initialData?.file_path ? (
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="file">File</Label>
                                <div className="mb-2">
                                    <a
                                        href={initialData.file_path}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline"
                                    >
                                        View Current File
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="file">File</Label>
                                <Input
                                    id="file"
                                    name="file"
                                    type="file"
                                    onChange={handleFileChange}
                                    required
                                />
                            </div>
                        )}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter a description (optional)"
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

export default AttachmentDialogForm;