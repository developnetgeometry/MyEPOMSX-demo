
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import ManageForm from "./ManageForm";
import * as z from "zod";
import { useEffect } from "react";

interface ManageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  formSchema: z.ZodSchema<any>;
  defaultValues: any;
  formFields: {
    name: string;
    label: string;
    type: "text" | "number" | "select" | "date" | "textarea";
    options?: {
      value: string;
      label: string;
    }[];
    required?: boolean;
    placeholder?: string;
    richText?: boolean;
    section?: "main" | "dates" | "maintenance" | "additional";
    width?: "full" | "half";
  }[];
  onSubmit: (values: any) => void;
  isEdit?: boolean;
  isProcessing?: boolean;
  headerColor?: string;
  showFileUploads?: boolean;
}

const ManageDialog = ({
  open,
  onOpenChange,
  title,
  description,
  formSchema,
  defaultValues,
  formFields,
  onSubmit,
  isEdit = false,
  isProcessing = false,
  headerColor,
  showFileUploads = false
}: ManageDialogProps) => {
  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      // Form will be reset when dialog reopens with new defaultValues
    }
  }, [open]);

  // Validate formFields to ensure all select options have non-empty values
  const validatedFormFields = formFields.map(field => {
    if (field.type === "select" && field.options) {
      // Filter out any options with empty string values
      const validOptions = field.options.filter(option => option.value !== "");

      // If no valid options remain, add a placeholder option
      if (validOptions.length === 0) {
        validOptions.push({ value: "no_options", label: "No options available" });
      }

      return { ...field, options: validOptions };
    }
    return field;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className={`flex flex-row items-center justify-between ${headerColor ? headerColor : ''}`}>
          <div>
            <DialogTitle className={headerColor ? "text-white" : ""}>{title}</DialogTitle>
            <DialogDescription className={headerColor ? "text-white" : ""}>{description}</DialogDescription>
          </div>
          <div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className={headerColor ? "text-white hover:bg-white/20" : ""}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <ManageForm
          schema={formSchema}
          defaultValues={defaultValues}
          fields={validatedFormFields}
          onSubmit={values => {
            onSubmit(values);
          }}
          onCancel={() => onOpenChange(false)}
          isEdit={isEdit}
          isSubmitting={isProcessing}
          showFileUploads={showFileUploads}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ManageDialog;
