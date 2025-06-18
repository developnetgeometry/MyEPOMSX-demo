// src/components/bom/BomFormDialog.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface BomFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bomData?: any;
  onSuccess: () => void;
}

const BomFormDialog: React.FC<BomFormDialogProps> = ({ 
  isOpen, 
  onClose,
  bomData,
  onSuccess
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      bom_name: "",
      bom_code: "",
      description: ""
    }
  });

  useEffect(() => {
    if (bomData) {
      reset({
        bom_name: bomData.bom_name || "",
        bom_code: bomData.bom_code || "",
        description: bomData.description || ""
      });
    } else {
      reset({
        bom_name: "",
        bom_code: "",
        description: ""
      });
    }
  }, [bomData, reset]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (bomData) {
        // Update existing BOM
        const { error } = await supabase
          .from("e_bom_assembly")
          .update(data)
          .eq("id", bomData.id);

        if (error) throw error;
      } else {
        // Create new BOM
        const { error } = await supabase
          .from("e_bom_assembly")
          .insert(data);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `BOM ${bomData ? "updated" : "created"} successfully`,
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${bomData ? "update" : "create"} BOM`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {bomData ? "Edit BOM" : "Create New BOM"}
          </DialogTitle>
          <DialogDescription>
            {bomData 
              ? "Update the details of this Bill of Materials" 
              : "Create a new Bill of Materials for your assets"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="bom_name">BOM Name *</Label>
            <Input
              id="bom_name"
              {...register("bom_name", { required: "BOM name is required" })}
            />
            {errors.bom_name && (
              <p className="text-red-500 text-sm mt-1">{errors.bom_name.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="bom_code">BOM Code</Label>
            <Input
              id="bom_code"
              {...register("bom_code")}
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {bomData ? "Update BOM" : "Create BOM"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BomFormDialog;