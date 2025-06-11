import React, { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import DataTable, { Column } from "@/components/shared/DataTable";
import {
  useNewWorkAttachmentData,
  insertNewWorkAttachmentData,
  updateNewWorkAttachmentData,
  deleteNewWorkAttachmentData,
} from "../hooks/use-new-work-attachment-data";
import AttachmentDialogForm from "./AttachmentDialogForm";
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

interface AttachmentTabProps {
  workRequestId: number; // Passed as a prop to this page
  cmStatusId: number;
}

const AttachmentTab: React.FC<AttachmentTabProps> = ({ workRequestId, cmStatusId }) => {
  const { data: attachments, isLoading, refetch } = useNewWorkAttachmentData(workRequestId);
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
      await deleteNewWorkAttachmentData(attachment.id);
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
        await updateNewWorkAttachmentData(editingAttachment.id, {
          description: formData.description,
        });
        toast({
          title: "Success",
          description: "Attachment updated successfully!",
          variant: "default",
        });
      } else {
        await insertNewWorkAttachmentData({
          file: formData.file,
          description: formData.description,
          work_request_id: workRequestId,
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
        onAddNew={cmStatusId == 3 ? null : handleAddNew}
        addNewLabel="New Attachment"
      />

      {isLoading ? (
        <Loading />
      ) : (
        <DataTable
          columns={columns}
          data={attachments || []}
          onEdit={cmStatusId == 3 ? null : handleEditAttachment}
          onDelete={cmStatusId == 3 ? null : handleDeleteAttachment}
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

export default AttachmentTab;