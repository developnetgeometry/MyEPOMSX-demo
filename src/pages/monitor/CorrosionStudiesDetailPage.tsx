import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, Database } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import {
  useAssetOptions,
  useCorrosionStudy,
  useCorrosionGroupOptions,
  useCorrosionMonitoringOptions,
  useBaseMaterialOptions,
  useUpdateCorrosionStudy,
} from "@/hooks/queries/useCorrosionStudy";

import {
  useMaterialConstructionOptions,
  useExternalEnvironmentOptions,
} from "@/hooks/queries/useCorrosionDropdownOptions";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Memoized Select Option Component to prevent unnecessary re-renders
const SelectOption = React.memo(({ option }: { option: { value: any; label: string } }) => (
  <SelectItem key={option.value} value={option.value.toString()}>
    {option.label}
  </SelectItem>
));

// Memoized Input Field Component
const InputField = React.memo(({ 
  id, 
  name, 
  label, 
  type = "text", 
  value, 
  onChange, 
  ...props 
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      {...props}
    />
  </div>
));

// Memoized Select Field Component
const SelectField = React.memo(({ 
  name, 
  label, 
  value, 
  onValueChange, 
  placeholder, 
  options = [],
  isLoading = false
}: {
  name: string;
  label: string;
  value: any;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: Array<{ value: any; label: string }>;
  isLoading?: boolean;
}) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    <Select name={name} value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={isLoading ? "Loading..." : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectOption key={option.value} option={option} />
        ))}
      </SelectContent>
    </Select>
  </div>
));

const CorrosionStudiesDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const updateMutation = useUpdateCorrosionStudy(Number(id));
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Data queries
  const { data: corrosionStudy, isLoading } = useCorrosionStudy(Number(id));
  const { data: assetOptions, isLoading: isLoadingAssetOptions } = useAssetOptions();
  const { data: corrosionGroupOptions, isLoading: isLoadingCorrosionGroupOptions } = useCorrosionGroupOptions();
  const { data: materialConstructionOptions, isLoading: isLoadingMaterialConstructionOptions } = useMaterialConstructionOptions();
  const { data: externalEnvironmentOptions, isLoading: isLoadingExternalEnvironmentOptions } = useExternalEnvironmentOptions();
  const { data: corrosionMonitoringOptions, isLoading: isLoadingCorrosionMonitoringOptions } = useCorrosionMonitoringOptions();
  const { data: baseMaterialOptions, isLoading: isLoadingBaseMaterialOptions } = useBaseMaterialOptions();

  // Form state
  const [formData, setFormData] = useState({
    asset_id: "",
    corrosion_group_id: "",
    material_construction_id: "",
    external_environment_id: "",
    ph: "",
    monitoring_method_id: "",
    internal_damage_mechanism: "",
    external_damage_mechanism: "",
    expected_internal_corrosion_rate: "",
    expected_external_corrosion_rate: "",
    h2s_presence: false,
    co2_presence: false,
    description: "",
    // Corrosion Factor
    temperature: "",
    pressure: "",
    h2sConcentration: "",
    co2Concentration: "",
    base_material_id: "",
    fluid_velocity: "",
  });

  // Memoize loading state to prevent unnecessary re-calculations
  const isAnyLoading = useMemo(() => 
    isLoading ||
    isLoadingAssetOptions ||
    isLoadingCorrosionGroupOptions ||
    isLoadingMaterialConstructionOptions ||
    isLoadingCorrosionMonitoringOptions ||
    isLoadingBaseMaterialOptions ||
    isLoadingExternalEnvironmentOptions,
    [
      isLoading,
      isLoadingAssetOptions,
      isLoadingCorrosionGroupOptions,
      isLoadingMaterialConstructionOptions,
      isLoadingCorrosionMonitoringOptions,
      isLoadingBaseMaterialOptions,
      isLoadingExternalEnvironmentOptions
    ]
  );

  // Initialize form data when corrosion study loads
  useEffect(() => {
    if (corrosionStudy) {
      setFormData({
        asset_id: corrosionStudy?.asset_id?.toString() || "",
        corrosion_group_id: corrosionStudy?.corrosion_group_id?.toString() || "",
        material_construction_id: corrosionStudy?.material_construction_id?.toString() || "",
        external_environment_id: corrosionStudy?.external_environment_id?.toString() || "",
        ph: corrosionStudy?.ph?.toString() || "",
        monitoring_method_id: corrosionStudy?.monitoring_method_id?.toString() || "",
        internal_damage_mechanism: corrosionStudy?.internal_damage_mechanism || "",
        external_damage_mechanism: corrosionStudy?.external_damage_mechanism || "",
        expected_internal_corrosion_rate: corrosionStudy?.expected_internal_corrosion_rate?.toString() || "",
        expected_external_corrosion_rate: corrosionStudy?.expected_external_corrosion_rate?.toString() || "",
        h2s_presence: corrosionStudy?.h2s_presence || false,
        co2_presence: corrosionStudy?.co2_presence || false,
        description: corrosionStudy?.description || "",
        // Corrosion Factor
        temperature: corrosionStudy?.corrosion_factor?.temperature?.toString() || "",
        pressure: corrosionStudy?.corrosion_factor?.pressure?.toString() || "",
        h2sConcentration: corrosionStudy?.corrosion_factor?.h2s_concentration?.toString() || "",
        co2Concentration: corrosionStudy?.corrosion_factor?.co2_concentration?.toString() || "",
        base_material_id: corrosionStudy?.corrosion_factor?.base_material_id?.toString() || "",
        fluid_velocity: corrosionStudy?.corrosion_factor?.fluid_velocity?.toString() || "",
      });
    }
  }, [corrosionStudy]);

  // Memoized event handlers to prevent unnecessary re-renders
  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSwitchChange = useCallback((name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  }, []);

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleGoBack = useCallback(() => {
    navigate("/monitor/corrosion-studies");
  }, [navigate]);

  const handleSave = useCallback(async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "User not authenticated. Please login again.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Prepare study data
      const studyData = {
        asset_id: formData.asset_id ? parseInt(formData.asset_id) : undefined,
        corrosion_group_id: formData.corrosion_group_id ? parseInt(formData.corrosion_group_id) : undefined,
        material_construction_id: formData.material_construction_id ? parseInt(formData.material_construction_id) : undefined,
        external_environment_id: formData.external_environment_id ? parseInt(formData.external_environment_id) : undefined,
        ph: formData.ph ? parseFloat(formData.ph) : null,
        monitoring_method_id: formData.monitoring_method_id ? parseInt(formData.monitoring_method_id) : null,
        internal_damage_mechanism: formData.internal_damage_mechanism || null,
        external_damage_mechanism: formData.external_damage_mechanism || null,
        expected_internal_corrosion_rate: formData.expected_internal_corrosion_rate 
          ? parseFloat(formData.expected_internal_corrosion_rate) 
          : null,
        expected_external_corrosion_rate: formData.expected_external_corrosion_rate 
          ? parseFloat(formData.expected_external_corrosion_rate) 
          : null,
        h2s_presence: formData.h2s_presence,
        co2_presence: formData.co2_presence,
        description: formData.description || null,
      };

      // Prepare factor data
      const factorData = {
        temperature: formData.temperature ? parseFloat(formData.temperature) : null,
        pressure: formData.pressure ? parseFloat(formData.pressure) : null,
        h2s_concentration: formData.h2sConcentration 
          ? parseFloat(formData.h2sConcentration) 
          : null,
        co2_concentration: formData.co2Concentration 
          ? parseFloat(formData.co2Concentration) 
          : null,
        base_material_id: formData.base_material_id 
          ? parseInt(formData.base_material_id) 
          : null,
        fluid_velocity: formData.fluid_velocity 
          ? parseFloat(formData.fluid_velocity) 
          : null,
      };

      await updateMutation.mutateAsync({ studyData, factorData });

      toast({
        title: "Success",
        description: "Corrosion study updated successfully!",
      });

      navigate("/monitor/corrosion-studies");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update corrosion study. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [formData, user, updateMutation, toast, navigate]);

  // Memoized page header actions
  const pageHeaderActions = useMemo(() => (
    <Button variant="outline" onClick={handleGoBack}>
      <ChevronLeft className="mr-2 h-4 w-4" />
      Back to List
    </Button>
  ), [handleGoBack]);

  if (isAnyLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading corrosion study {corrosionStudy?.study_name} details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <PageHeader
        title="Corrosion Study Detail"
        subtitle="View and manage corrosion study details"
        icon={<Database className="h-6 w-6" />}
        actions={pageHeaderActions}
      />

      <div className="space-y-6">
        <Accordion
          type="single"
          collapsible
          defaultValue="general"
          className="w-full"
        >
          <AccordionItem value="general" className="border rounded-md">
            <AccordionTrigger className="px-4 py-3 bg-primary/10 hover:bg-primary/20 rounded-t-md font-medium">
              General Information
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  name="asset_id"
                  label="Asset"
                  value={formData.asset_id}
                  onValueChange={(value) => handleSelectChange("asset_id", value)}
                  placeholder="Select Asset"
                  options={assetOptions || []}
                  isLoading={isLoadingAssetOptions}
                />

                <SelectField
                  name="corrosion_group_id"
                  label="Corrosion Group Name"
                  value={formData.corrosion_group_id}
                  onValueChange={(value) => handleSelectChange("corrosion_group_id", value)}
                  placeholder="Select Corrosion Group"
                  options={corrosionGroupOptions || []}
                  isLoading={isLoadingCorrosionGroupOptions}
                />

                <SelectField
                  name="material_construction_id"
                  label="Material Construction"
                  value={formData.material_construction_id}
                  onValueChange={(value) => handleSelectChange("material_construction_id", value)}
                  placeholder="Select Material"
                  options={materialConstructionOptions || []}
                  isLoading={isLoadingMaterialConstructionOptions}
                />

                <SelectField
                  name="external_environment_id"
                  label="Environment"
                  value={formData.external_environment_id}
                  onValueChange={(value) => handleSelectChange("external_environment_id", value)}
                  placeholder="Select Environment"
                  options={externalEnvironmentOptions || []}
                  isLoading={isLoadingExternalEnvironmentOptions}
                />

                <InputField
                  id="ph"
                  name="ph"
                  label="pH"
                  type="number"
                  min="0"
                  max="14"
                  step="0.1"
                  value={formData.ph}
                  onChange={handleInputChange}
                />

                <SelectField
                  name="monitoring_method_id"
                  label="Corrosion Monitoring"
                  value={formData.monitoring_method_id}
                  onValueChange={(value) => handleSelectChange("monitoring_method_id", value)}
                  placeholder="Select Monitoring Method"
                  options={corrosionMonitoringOptions || []}
                  isLoading={isLoadingCorrosionMonitoringOptions}
                />

                <InputField
                  id="internalDamageMechanism"
                  name="internal_damage_mechanism"
                  label="Internal Damage Mechanism"
                  value={formData.internal_damage_mechanism}
                  onChange={handleInputChange}
                />

                <InputField
                  id="externalDamageMechanism"
                  name="external_damage_mechanism"
                  label="External Damage Mechanism"
                  value={formData.external_damage_mechanism}
                  onChange={handleInputChange}
                />

                <InputField
                  id="expectedInternalCorrosionRate"
                  name="expected_internal_corrosion_rate"
                  label="Expected Internal Corrosion Rate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.expected_internal_corrosion_rate}
                  onChange={handleInputChange}
                />

                <InputField
                  id="expectedExternalCorrosionRate"
                  name="expected_external_corrosion_rate"
                  label="Expected External Corrosion Rate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.expected_external_corrosion_rate}
                  onChange={handleInputChange}
                />

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="h2s">H₂S</Label>
                    <Switch
                      id="h2s"
                      checked={formData.h2s_presence}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("h2s_presence", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="co2">CO₂</Label>
                    <Switch
                      id="co2"
                      checked={formData.co2_presence}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("co2_presence", checked)
                      }
                    />
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="corrosionFactor"
            className="border rounded-md mt-4"
          >
            <AccordionTrigger className="px-4 py-3 bg-primary/10 hover:bg-primary/20 rounded-t-md font-medium">
              Corrosion Factor
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  id="temperature"
                  name="temperature"
                  label="Temperature °C"
                  type="number"
                  value={formData.temperature}
                  onChange={handleInputChange}
                />

                <InputField
                  id="pressure"
                  name="pressure"
                  label="Pressure (bar)"
                  type="number"
                  value={formData.pressure}
                  onChange={handleInputChange}
                />

                <InputField
                  id="h2sConcentration"
                  name="h2sConcentration"
                  label="H₂S Concentration"
                  value={formData.h2sConcentration}
                  onChange={handleInputChange}
                />

                <InputField
                  id="co2Concentration"
                  name="co2Concentration"
                  label="CO₂ Concentration"
                  value={formData.co2Concentration}
                  onChange={handleInputChange}
                />

                <SelectField
                  name="base_material_id"
                  label="Base Material"
                  value={formData.base_material_id}
                  onValueChange={(value) => handleSelectChange("base_material_id", value)}
                  placeholder="Select Base Material"
                  options={baseMaterialOptions || []}
                  isLoading={isLoadingBaseMaterialOptions}
                />

                <InputField
                  id="fluidVelocity"
                  name="fluid_velocity"
                  label="Fluid Velocity"
                  value={formData.fluid_velocity}
                  onChange={handleInputChange}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Fixed bottom toolbar with buttons */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4 flex justify-end gap-2">
        <Button variant="outline" onClick={handleGoBack}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default CorrosionStudiesDetailPage;