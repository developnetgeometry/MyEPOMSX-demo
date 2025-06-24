import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, File, X } from "lucide-react";

const AttachmentFormDialog = ({
  isOpen,
  onClose,
  onSuccess,
  assetId,
  attachmentData,
  isEditMode = false,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    notes: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  React.useEffect(() => {
    if (isEditMode && attachmentData) {
      setFormData({
        type: attachmentData.type || "",
        notes: attachmentData.notes || "",
      });
      setPreviewUrl(attachmentData.file_path || null);
    } else {
      setFormData({
        type: "",
        notes: "",
      });
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [isEditMode, attachmentData]);

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview for images
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile && !isEditMode) {
      toast({
        title: "File required",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate file upload and attachment creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: `Attachment ${isEditMode ? "updated" : "added"} successfully`,
      });

      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditMode ? "update" : "add"} attachment`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Attachment" : "Add New Attachment"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* File Preview */}
          {previewUrl && (
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-full max-h-[200px] object-contain border rounded-md"
                />
                <button
                  onClick={handleRemoveFile}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Input
              id="type"
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value)}
              className="col-span-3"
              placeholder="e.g., Manual, Drawing, Photo"
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="notes" className="text-right mt-2">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              className="col-span-3"
              placeholder="Add any notes about this attachment"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right">
              File
            </Label>
            <div className="col-span-3">
              <Input
                id="file"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Max file size: 5MB
              </p>
            </div>
          </div>

          {isEditMode && attachmentData?.file_name && !selectedFile && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Current File</Label>
              <div className="col-span-3 text-sm flex items-center">
                <File className="h-4 w-4 mr-2" />
                {attachmentData.file_name}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Update Attachment" : "Add Attachment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AttachmentFormDialog;