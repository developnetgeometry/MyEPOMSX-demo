import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageHeader from "@/components/shared/PageHeader";
import { ChevronLeft, Database, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useAssetDetailOptionsWithAssetName,
  useCreateInspectionData,
} from "@/hooks/queries/useInspectionData";
import { useAuth } from "@/contexts/AuthContext";

const InspectionDataFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dropdown options hooks
  const { data: assetDetailOptionsWithAssetName = [], isLoading } =
    useAssetDetailOptionsWithAssetName();
  const createInspectionDataMutation = useCreateInspectionData();

  const [formData, setFormData] = useState({
    asset: "",
    ltcr: "",
    stcr: "",
    inspectionStrategy: "",
    remainingLife: "",
    inspectionRequest: "",
    isActive: true,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isActive: checked,
    }));
  };

  const handleGoBack = () => {
    navigate("/monitor/inspection-data");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const transformedData = {
      asset_detail_id: Number(formData.asset),
      ltcr: formData.ltcr,
      stcr: formData.stcr,
      inspection_strategy: formData.inspectionStrategy,
      remaining_life: formData.remainingLife,
      inspection_request: formData.inspectionRequest,
      is_active: formData.isActive,
      created_by: user?.id,
    };

    try {
      // Validate required fields
      if (!formData.asset) {
        toast({
          title: "Validation Error",
          description: "Please select an asset.",
          variant: "destructive",
        });
        return;
      }

      await createInspectionDataMutation.mutateAsync(transformedData);

      toast({
        title: "Success",
        description: "Inspection data has been created successfully.",
      });

      navigate("/monitor/inspection-data");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create inspection data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <PageHeader
        title="New Inspection Data"
        subtitle="Create new asset inspection record"
        icon={<Database className="h-6 w-6" />}
        actions={
          <Button variant="outline" onClick={handleGoBack}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Inspection Data Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="asset">
                  Asset <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.asset}
                  onValueChange={(value) => handleSelectChange("asset", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {assetDetailOptionsWithAssetName.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value.toString()}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ltcr">
                  Long Term Corrosion Rate (LTCR){" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ltcr"
                  name="ltcr"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.ltcr}
                  onChange={handleInputChange}
                  placeholder="Enter LTCR (mm/year)"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stcr">
                  Short Term Corrosion Rate (STCR){" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="stcr"
                  name="stcr"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.stcr}
                  onChange={handleInputChange}
                  placeholder="Enter STCR (mm/year)"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inspectionStrategy">
                  Inspection Strategy <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="inspectionStrategy"
                  name="inspectionStrategy"
                  value={formData.inspectionStrategy}
                  onChange={handleInputChange}
                  placeholder="Enter inspection strategy"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="remainingLife">
                  Remaining Life (RL) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="remainingLife"
                  name="remainingLife"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.remainingLife}
                  onChange={handleInputChange}
                  placeholder="Enter remaining life (years)"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inspectionRequest">Inspection Request</Label>
                <Input
                  id="inspectionRequest"
                  name="inspectionRequest"
                  value={formData.inspectionRequest}
                  onChange={handleInputChange}
                  placeholder="Enter inspection request details"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="isActive" className="font-normal">
                    Active?
                  </Label>
                </div>
                <p className="text-sm text-gray-500">
                  Mark as active to include in active inspections
                </p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoBack}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InspectionDataFormPage;
