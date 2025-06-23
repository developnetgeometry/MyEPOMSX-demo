import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PageHeader from "@/components/shared/PageHeader";
import { ChevronLeft, Database, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useMaterialConstructionOptions,
  useExternalEnvironmentOptions,
} from "@/hooks/queries/useCorrosionDropdownOptions";
import {
  useAssetOptions,
  useBaseMaterialOptions,
  useCorrosionGroupOptions,
  useCorrosionMonitoringOptions,
  useCreateCorrosionStudy,
} from "@/hooks/queries/useCorrosionStudy";
import { useAuth } from "@/contexts/AuthContext";

const CorrosionStudiesFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const createMutation = useCreateCorrosionStudy();

  // Dropdown options hooks
  const { data: assetOptions = [] } = useAssetOptions();
  const { data: materialConstructionOptions = [] } =
    useMaterialConstructionOptions();
  const { data: environmentOptions = [] } = useExternalEnvironmentOptions();
  const { data: corrosionGroupOptions = [] } = useCorrosionGroupOptions();
  const { data: baseMaterialOptions = [] } = useBaseMaterialOptions();
  const { data: corrosionMonitoringOptions = [] } =
    useCorrosionMonitoringOptions();

  const [formData, setFormData] = useState({
    // General Information
    asset: "",
    asset_name: "",
    asset_no: "",
    corrosionGroupName: "",
    materialConstruction: "",
    environment: "",
    ph: "",
    corrosionMonitoring: "",
    internalDamageMechanism: "",
    externalDamageMechanism: "",
    expectedInternalCorrosionRate: "",
    expectedExternalCorrosionRate: "",
    h2s: "no",
    co2: "no",
    description: "",

    // Corrosion Factor
    temperature: "",
    pressure: "",
    h2sConcentration: "",
    co2Concentration: "",
    baseMaterial: "",
    fluidVelocity: "",
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
    // If the asset dropdown changes, also set asset_name and asset_code
    if (name === "asset") {
      const selected = assetOptions.find(
        (option) => option.value.toString() === value
      );
      setFormData((prev) => ({
        ...prev,
        asset: value,
        asset_name: selected?.asset_name || "",
        asset_no: selected?.asset_no || "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGoBack = () => {
    navigate("/monitor/corrosion-studies");
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "User not authenticated. Please login again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare study data
      const studyData = {
        asset_id: parseInt(formData.asset),
        asset_name: formData.asset_name,
        asset_no: formData.asset_no,
        corrosion_group_id: parseInt(formData.corrosionGroupName),
        material_construction_id: parseInt(formData.materialConstruction),
        external_environment_id: parseInt(formData.environment),
        ph: formData.ph ? parseFloat(formData.ph) : null,
        monitoring_method_id: formData.corrosionMonitoring
          ? parseInt(formData.corrosionMonitoring)
          : null,
        internal_damage_mechanism: formData.internalDamageMechanism || null,
        external_damage_mechanism: formData.externalDamageMechanism || null,
        expected_internal_corrosion_rate: formData.expectedInternalCorrosionRate
          ? parseFloat(formData.expectedInternalCorrosionRate)
          : null,
        expected_external_corrosion_rate: formData.expectedExternalCorrosionRate
          ? parseFloat(formData.expectedExternalCorrosionRate)
          : null,
        h2s_presence: formData.h2s === "yes",
        co2_presence: formData.co2 === "yes",
        description: formData.description || null,
      };

      // Prepare factor data
      const factorData = {
        temperature: formData.temperature
          ? parseFloat(formData.temperature)
          : null,
        pressure: formData.pressure ? parseFloat(formData.pressure) : null,
        h2s_concentration: formData.h2sConcentration
          ? parseFloat(formData.h2sConcentration)
          : null,
        co2_concentration: formData.co2Concentration
          ? parseFloat(formData.co2Concentration)
          : null,
        base_material_id: formData.baseMaterial
          ? parseInt(formData.baseMaterial)
          : null,
        fluid_velocity: formData.fluidVelocity
          ? parseFloat(formData.fluidVelocity)
          : null,
      };

      await createMutation.mutateAsync({ studyData, factorData });

      toast({
        title: "Success",
        description: "Corrosion study created successfully!",
      });
      navigate("/monitor/corrosion-studies");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create corrosion study. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <PageHeader
        title="New Corrosion Study"
        subtitle="Create a new corrosion study and analysis"
        icon={<Database className="h-6 w-6" />}
        actions={
          <Button variant="outline" onClick={handleGoBack}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>
        }
      />

      <div className="space-y-6">
        <Accordion
          type="single"
          collapsible
          defaultValue="general"
          className="w-full"
        >
          {/* General Information Section */}
          <AccordionItem value="general" className="border rounded-md">
            <AccordionTrigger className="px-4 py-3 bg-primary/10 hover:bg-primary/20 rounded-t-md font-medium">
              General Information
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="asset">
                    Asset <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.asset}
                    onValueChange={(value) =>
                      handleSelectChange("asset", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Asset" />
                    </SelectTrigger>
                    <SelectContent>
                      {assetOptions.map((option) => (
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
                  <Label htmlFor="corrosionGroupName">
                    Corrosion Group Name <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.corrosionGroupName}
                    onValueChange={(value) =>
                      handleSelectChange("corrosionGroupName", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Corrosion Group" />
                    </SelectTrigger>
                    <SelectContent>
                      {corrosionGroupOptions.map((option) => (
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
                  <Label htmlFor="materialConstruction">
                    Material Construction{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.materialConstruction}
                    onValueChange={(value) =>
                      handleSelectChange("materialConstruction", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Material" />
                    </SelectTrigger>
                    <SelectContent>
                      {materialConstructionOptions.map((option) => (
                        <SelectItem key={option.id} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="environment">
                    Environment <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.environment}
                    onValueChange={(value) =>
                      handleSelectChange("environment", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Environment" />
                    </SelectTrigger>
                    <SelectContent>
                      {environmentOptions.map((option) => (
                        <SelectItem key={option.id} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ph">PH</Label>
                  <Input
                    id="ph"
                    name="ph"
                    type="number"
                    min="0"
                    max="14"
                    step="0.1"
                    value={formData.ph}
                    onChange={handleInputChange}
                    placeholder="Enter pH value"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Corrosion Monitoring</Label>
                  <Select
                    value={formData.corrosionMonitoring}
                    onValueChange={(value) =>
                      handleSelectChange("corrosionMonitoring", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Monitoring Method" />
                    </SelectTrigger>
                    <SelectContent>
                      {corrosionMonitoringOptions.map((option) => (
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
                  <Label htmlFor="internalDamageMechanism">
                    Internal Damage Mechanism
                  </Label>
                  <Input
                    id="internalDamageMechanism"
                    name="internalDamageMechanism"
                    value={formData.internalDamageMechanism}
                    onChange={handleInputChange}
                    placeholder="Enter internal damage mechanism"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="externalDamageMechanism">
                    External Damage Mechanism
                  </Label>
                  <Input
                    id="externalDamageMechanism"
                    name="externalDamageMechanism"
                    value={formData.externalDamageMechanism}
                    onChange={handleInputChange}
                    placeholder="Enter external damage mechanism"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedInternalCorrosionRate">
                    Expected Internal Corrosion Rate (mm/year)
                  </Label>
                  <Input
                    id="expectedInternalCorrosionRate"
                    name="expectedInternalCorrosionRate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.expectedInternalCorrosionRate}
                    onChange={handleInputChange}
                    placeholder="Enter internal corrosion rate"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedExternalCorrosionRate">
                    Expected External Corrosion Rate (mm/year)
                  </Label>
                  <Input
                    id="expectedExternalCorrosionRate"
                    name="expectedExternalCorrosionRate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.expectedExternalCorrosionRate}
                    onChange={handleInputChange}
                    placeholder="Enter external corrosion rate"
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label>H2S Presence</Label>
                    <RadioGroup
                      value={formData.h2s}
                      onValueChange={(value) => handleRadioChange("h2s", value)}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="h2s-yes" />
                        <Label htmlFor="h2s-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="h2s-no" />
                        <Label htmlFor="h2s-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label>CO2 Presence</Label>
                    <RadioGroup
                      value={formData.co2}
                      onValueChange={(value) => handleRadioChange("co2", value)}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="co2-yes" />
                        <Label htmlFor="co2-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="co2-no" />
                        <Label htmlFor="co2-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Enter study description, objectives, and findings..."
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Corrosion Factor Section */}
          <AccordionItem value="corrosion-factor" className="border rounded-md">
            <AccordionTrigger className="px-4 py-3 bg-primary/10 hover:bg-primary/20 rounded-t-md font-medium">
              Corrosion Factor
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    name="temperature"
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={handleInputChange}
                    placeholder="Enter temperature"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pressure">Pressure (bar)</Label>
                  <Input
                    id="pressure"
                    name="pressure"
                    type="number"
                    step="0.1"
                    value={formData.pressure}
                    onChange={handleInputChange}
                    placeholder="Enter pressure"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="h2sConcentration">
                    H2S Concentration (ppm)
                  </Label>
                  <Input
                    id="h2sConcentration"
                    name="h2sConcentration"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.h2sConcentration}
                    onChange={handleInputChange}
                    placeholder="Enter H2S concentration"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="co2Concentration">
                    CO2 Concentration (%)
                  </Label>
                  <Input
                    id="co2Concentration"
                    name="co2Concentration"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.co2Concentration}
                    onChange={handleInputChange}
                    placeholder="Enter CO2 concentration"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="baseMaterial">Base Material</Label>
                  <Select
                    value={formData.baseMaterial}
                    onValueChange={(value) =>
                      handleSelectChange("baseMaterial", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Base Material" />
                    </SelectTrigger>
                    <SelectContent>
                      {baseMaterialOptions.map((option) => (
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
                  <Label htmlFor="fluidVelocity">Fluid Velocity (m/s)</Label>
                  <Input
                    id="fluidVelocity"
                    name="fluidVelocity"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.fluidVelocity}
                    onChange={handleInputChange}
                    placeholder="Enter fluid velocity"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Fixed bottom toolbar with buttons */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4 flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={handleGoBack}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? "Saving..." : "Save Study"}
        </Button>
      </div>
    </div>
  );
};

export default CorrosionStudiesFormPage;
