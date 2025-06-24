import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { File, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getFileNameFromPath } from "@/utils/formatters";

const AttachmentDetailDialog = ({
  isOpen,
  onClose,
  attachmentData,
}) => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Reset states when dialog opens or attachment changes
  useEffect(() => {
    if (isOpen && attachmentData) {
      setImageLoaded(false);
      setImageError(false);
    }
  }, [isOpen, attachmentData]);

  if (!attachmentData) return null;

  const isImage = attachmentData.file_type?.startsWith("image/");
  const isPDF = attachmentData.file_type === "application/pdf";

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Create a temporary link for download
      const link = document.createElement('a');
      link.href = attachmentData.file_path;
      link.download = attachmentData.file_name || getFileNameFromPath(attachmentData.file_path);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: `${attachmentData.file_name} is downloading`,
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download file",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <File className="h-5 w-5" /> Attachment Details
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* File Preview Section */}
          <div className="flex items-center justify-center min-h-[300px]">
            {isImage ? (
              <div className="relative bg-gray-100 p-4 rounded-lg flex justify-center">
                {!imageLoaded && !imageError && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                )}
                {imageError ? (
                  <div className="flex flex-col items-center justify-center p-10">
                    <File className="h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-red-500">Failed to load image</p>
                  </div>
                ) : (
                  <img
                    src={attachmentData.file_path}
                    alt={attachmentData.file_name}
                    className={`max-w-full max-h-[400px] object-contain ${
                      imageLoaded ? "block" : "invisible"
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                  />
                )}
              </div>
            ) : isPDF ? (
              <div className="flex flex-col items-center justify-center p-10 border rounded-lg bg-red-50">
                <div className="bg-red-100 p-4 rounded-full mb-4">
                  <File className="h-16 w-16 text-red-500" />
                </div>
                <p className="text-lg font-medium">{attachmentData.file_name}</p>
                <p className="text-sm text-muted-foreground">PDF Document</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-10 border rounded-lg">
                <File className="h-16 w-16 text-gray-400 mb-4" />
                <p className="text-lg font-medium">{attachmentData.file_name}</p>
                <p className="text-sm text-muted-foreground">
                  {attachmentData.file_type || "Unknown file type"}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Information</h3>
              <div className="space-y-2">
                <div className="flex">
                  <span className="font-medium w-24">Type:</span>
                  <span>{attachmentData.type || "N/A"}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-24">File Name:</span>
                  <span>{attachmentData.file_name || "N/A"}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-24">File Type:</span>
                  <span>{attachmentData.file_type || "N/A"}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-24">File Size:</span>
                  <span>
                    {attachmentData.file_size
                      ? `${Math.round(attachmentData.file_size / 1024)} KB`
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Dates</h3>
              <div className="space-y-2">
                <div className="flex">
                  <span className="font-medium w-24">Created:</span>
                  <span>
                    {attachmentData.created_at
                      ? format(new Date(attachmentData.created_at), "PPpp")
                      : "N/A"}
                  </span>
                </div>
                <div className="flex">
                  <span className="font-medium w-24">Updated:</span>
                  <span>
                    {attachmentData.updated_at
                      ? format(new Date(attachmentData.updated_at), "PPpp")
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Notes</h3>
            <div className="bg-gray-50 rounded-lg p-3 min-h-[80px]">
              {attachmentData.notes || "No notes provided"}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttachmentDetailDialog;