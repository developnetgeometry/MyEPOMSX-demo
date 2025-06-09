import React, { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import { deleteCmAttachmentData, insertCmAttachmentData, updateCmAttachmentData, useCmAttachmentData } from "../hooks/cm/use-cm-attachment-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Loading from "@/components/shared/Loading";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import AttachmentDialogForm from "../../work-request/attachment/AttachmentDialogForm";

interface CmAttachmentTabProps {
  cmGeneralId: number; // Passed as a prop to this page
}

const CmAttachmentTab: React.FC<CmAttachmentTabProps> = ({ cmGeneralId }) => {
  const { data: attachments, isLoading, refetch } = useCmAttachmentData(cmGeneralId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAttachment, setEditingAttachment] = useState<any | null>(null);
  const { toast } = useToast();

  const handleAddNew = () => {
    setEditingAttachment(null);
    setIsDialogOpen(true);
  };

  const handleEditAttachment = (attachment: any) => {
    setEditingAttachment(attachment);
    setIsDialogOpen(true);
  };

  const handleDeleteAttachment = async (attachment: any) => {
    try {
      await deleteCmAttachmentData(attachment.id);
      toast({
        title: "Success",
        description: "Attachment deleted successfully!",
        variant: "default",
      });
      refetch();
    } catch (error) {
      console.error("Failed to delete attachment data:", error);
      toast({
        title: "Error",
        description: "Failed to delete attachment data.",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (formData: { file: File; description?: string }) => {
    try {
      if (editingAttachment) {
        await updateCmAttachmentData(editingAttachment.id, {
          file: formData.file,
          description: formData.description,
          cm_general_id: cmGeneralId,
        });
        toast({
          title: "Success",
          description: "Attachment updated successfully!",
          variant: "default",
        });
      } else {
        await insertCmAttachmentData({
          file: formData.file,
          description: formData.description,
          cm_general_id: cmGeneralId,
        });
        toast({
          title: "Success",
          description: "Attachment added successfully!",
          variant: "default",
        });
      }
      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error("Failed to save attachment data:", error);
      toast({
        title: "Error",
        description: "Failed to save attachment data.",
        variant: "destructive",
      });
    }
  };

  const columns: Column[] = [
    { id: "file_path", header: "File", accessorKey: "file_path", cell: (value) => <a href={value} target="_blank" rel="noopener noreferrer">View</a> },
    { id: "description", header: "Description", accessorKey: "description" },
  ];

  return (
    <div className="space-y-6 mt-6">
      <PageHeader
        title="Attachments"
        onAddNew={handleAddNew}
        addNewLabel="New Attachment"
      />

      {isLoading ? (
        <Loading />
      ) : (
        <DataTable
          columns={columns}
          data={attachments || []}
          onEdit={handleEditAttachment}
          onDelete={handleDeleteAttachment}
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between w-full">
              <div>
                <DialogTitle>{editingAttachment ? "Edit Attachment" : "Add New Attachment"}</DialogTitle>
                <DialogDescription>
                  {editingAttachment
                    ? "Update the details of the attachment."
                    : "Fill in the details to add a new attachment."}
                </DialogDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <AttachmentDialogForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
            initialData={editingAttachment}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CmAttachmentTab;