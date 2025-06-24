import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { watch } from "fs";

interface InspectionDataEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  inspectionData: any;
  onSave: (data: any) => Promise<void>;
}

const InspectionDataEditModal: React.FC<InspectionDataEditModalProps> = ({
  isOpen,
  onClose,
  inspectionData,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: inspectionData,
  });
  const [isSaving, setIsSaving] = useState(false);
  const isActive = watch("is_active", inspectionData?.is_active ?? true);

  useEffect(() => {
    if (inspectionData) {
      reset(inspectionData);
    }
  }, [inspectionData, reset]);

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error("Failed to save inspection data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Inspection Data</DialogTitle>
          <DialogDescription>
            Update the details for asset{" "}
            {inspectionData?.asset_detail?.asset?.asset_no}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="ltcr">Long Term Corrosion Rate (mm/year)</Label>
              <Input
                id="ltcr"
                type="number"
                step="0.01"
                {...register("ltcr", {
                  required: "LTCR is required",
                  min: { value: 0, message: "Must be positive" },
                })}
              />
              {errors.ltcr && typeof errors.ltcr.message === "string" && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.ltcr.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="stcr">Short Term Corrosion Rate (mm/year)</Label>
              <Input
                id="stcr"
                type="number"
                step="0.01"
                {...register("stcr", {
                  required: "STCR is required",
                  min: { value: 0, message: "Must be positive" },
                })}
              />
              {errors.stcr && typeof errors.stcr.message === "string" && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.stcr.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="remaining_life">Remaining Life (years)</Label>
              <Input
                id="remaining_life"
                type="number"
                step="0.1"
                {...register("remaining_life", {
                  required: "Remaining life is required",
                  min: { value: 0, message: "Must be positive" },
                })}
              />
              {errors.remaining_life &&
                typeof errors.remaining_life.message === "string" && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.remaining_life.message}
                  </p>
                )}
            </div>

            <div className="flex items-center space-x-2 mt-7">
              <Switch id="is_active" checked={isActive} onCheckedChange={(checked) => setValue("is_active", checked)} />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="inspection_strategy">Inspection Strategy</Label>
              <Input
                id="inspection_strategy"
                {...register("inspection_strategy", {
                  required: "Strategy is required",
                })}
              />
              {errors.inspection_strategy &&
                typeof errors.inspection_strategy.message === "string" && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.inspection_strategy.message}
                  </p>
                )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="inspection_request">Inspection Request</Label>
              <Textarea
                id="inspection_request"
                rows={4}
                {...register("inspection_request")}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InspectionDataEditModal;
