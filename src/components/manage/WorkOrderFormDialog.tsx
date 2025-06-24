import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const WorkOrderFormDialog = ({
  isOpen,
  onClose,
  onSuccess,
  assetId,
  workOrderData,
  isEditMode = false,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [formData, setFormData] = useState({
    work_order_no: "",
    description: "",
    work_order_type_id: "",
    due_date: new Date().toISOString(),
  });

  useEffect(() => {
    if (isEditMode && workOrderData) {
      setFormData({
        work_order_no: workOrderData.work_order_no || "",
        description: workOrderData.description || "",
        work_order_type_id: workOrderData.work_order_type_id?.toString() || "",
        due_date: workOrderData.due_date || new Date().toISOString(),
      });
      setDueDate(
        workOrderData.due_date ? new Date(workOrderData.due_date) : new Date()
      );
    } else {
      // Generate default work order number (WO-YYYYMMDD-XXXX)
      const datePart = format(new Date(), "yyyyMMdd");
      const randomPart = Math.floor(1000 + Math.random() * 9000);
      setFormData({
        work_order_no: `WO-${datePart}-${randomPart}`,
        description: "",
        work_order_type_id: "",
        due_date: new Date().toISOString(),
      });
      setDueDate(new Date());
    }
  }, [isEditMode, workOrderData]);

  const handleChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        asset_id: assetId,
        due_date: dueDate?.toISOString(),
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: `Work order ${isEditMode ? "updated" : "created"} successfully`,
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditMode ? "update" : "create"} work order`,
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
            {isEditMode ? "Edit Work Order" : "Create New Work Order"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="work_order_no" className="text-right">
              Work Order No
            </Label>
            <Input
              id="work_order_no"
              value={formData.work_order_no}
              onChange={(e) => handleChange("work_order_no", e.target.value)}
              className="col-span-3"
              disabled={isEditMode}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="work_order_type" className="text-right">
              Work Order Type
            </Label>
            <Select
              value={formData.work_order_type_id}
              onValueChange={(value) => handleChange("work_order_type_id", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Preventive Maintenance</SelectItem>
                <SelectItem value="2">Corrective Maintenance</SelectItem>
                <SelectItem value="3">Inspection</SelectItem>
                <SelectItem value="4">Calibration</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="due_date" className="text-right">
              Due Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="col-span-3 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right mt-2">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="col-span-3"
              rows={4}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Work Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkOrderFormDialog;