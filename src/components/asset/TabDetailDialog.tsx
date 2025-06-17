import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FieldConfig {
  name: string;
  label: string;
  render?: (value: any, data: any) => React.ReactNode;
}

interface TabDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  fields: FieldConfig[];
  data?: Record<string, any> | null;
}

const TabDetailDialog: React.FC<TabDetailDialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  fields,
  data,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 py-2">
          {fields.map((field) => {
            // Helper to resolve nested paths like 'asset_detail.status.name'
            function getValueByPath(obj: any, path: string) {
              if (!obj || !path) return undefined;
              return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
            }
            let value = getValueByPath(data, field.name);
            // If a custom render is provided, use it
            if (field.render) {
              return (
                <div key={field.name} className="flex flex-col mb-2">
                  <span className="font-medium text-muted-foreground">{field.label}</span>
                  <span>{field.render(value, data)}</span>
                </div>
              );
            }
            // If value is an object, try to display its 'name', 'label', or 'id' property, or JSON.stringify as fallback
            let displayValue = value;
            if (value && typeof value === "object") {
              if (typeof value.name === "string") {
                displayValue = value.name;
              } else if (typeof value.label === "string") {
                displayValue = value.label;
              } else if (typeof value.id === "string" || typeof value.id === "number") {
                displayValue = value.id;
              } else {
                displayValue = JSON.stringify(value);
              }
            }
            if (displayValue === undefined || displayValue === null || displayValue === "") {
              displayValue = "-";
            }
            return (
              <div key={field.name} className="flex flex-col mb-2">
                <span className="font-medium text-muted-foreground">{field.label}</span>
                <span>{displayValue}</span>
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TabDetailDialog;