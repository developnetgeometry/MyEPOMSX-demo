import React, { useEffect, useState } from "react";
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
  useMaterialConstructionOptions,
  useCorrosionMonitoringOptions,
  useBaseMaterialOptions,
} from "@/hooks/queries/useCorrosionStudy";

const CorrosionStudiesDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: corrosionStudy, isLoading } = useCorrosionStudy(Number(id));
  const { data: assetOptions, isLoading: isLoadingAssetOptions } =
    useAssetOptions();
  const {
    data: corrosionGroupOptions,
    isLoading: isLoadingCorrosionGroupOptions,
  } = useCorrosionGroupOptions();
  const {
    data: materialConstructionOptions,
    isLoading: isLoadingMaterialConstructionOptions,
  } = useMaterialConstructionOptions();
  const {
    data: corrosionMonitoringOptions,
    isLoading: isLoadingCorrosionMonitoringOptions,
  } = useCorrosionMonitoringOptions();
  const { data: baseMaterialOptions, isLoading: isLoadingBaseMaterialOptions } =
    useBaseMaterialOptions();
  const [formData, setFormData] = useState({
    asset_id: null,
    corrosion_group_id: null,
    material_construction_id: null,
    environment: "",
    ph: 0,
    monitoring_method_id: null,
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

  useEffect(() => {
    if (corrosionStudy) {
      setFormData({
        asset_id: corrosionStudy?.asset_id.toString(),
        corrosion_group_id: corrosionStudy?.corrosion_group_id.toString(),
        material_construction_id:
          corrosionStudy?.material_construction_id.toString(),
        environment: corrosionStudy?.environment,
        ph: corrosionStudy?.ph,
        monitoring_method_id: corrosionStudy?.monitoring_method_id.toString(),
        internal_damage_mechanism: corrosionStudy?.internal_damage_mechanism,
        external_damage_mechanism: corrosionStudy?.external_damage_mechanism,
        expected_internal_corrosion_rate:
          corrosionStudy?.expected_internal_corrosion_rate.toString(),
        expected_external_corrosion_rate:
          corrosionStudy?.expected_external_corrosion_rate.toString(),
        h2s_presence: corrosionStudy?.h2s_presence,
        co2_presence: corrosionStudy?.co2_presence,
        description: corrosionStudy?.description,
        // Corrosion Factor
        temperature: corrosionStudy?.corrosion_factor?.temperature.toString(),
        pressure: corrosionStudy?.corrosion_factor?.pressure.toString(),
        h2sConcentration:
          corrosionStudy?.corrosion_factor?.h2s_concentration.toString(),
        co2Concentration:
          corrosionStudy?.corrosion_factor?.co2_concentration.toString(),
        base_material_id:
          corrosionStudy?.corrosion_factor?.base_material_id.toString(),
        fluid_velocity:
          corrosionStudy?.corrosion_factor?.fluid_velocity.toString(),
      });
    }
  }, [corrosionStudy]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGoBack = () => {
    navigate("/monitor/corrosion-studies");
  };

  const handleSave = () => {
    console.log("Saving corrosion study:", formData);
    // Here you would typically make an API call to save the data
    navigate("/monitor/corrosion-studies");
  };

  if (
    isLoading ||
    isLoadingAssetOptions ||
    isLoadingCorrosionGroupOptions ||
    isLoadingMaterialConstructionOptions ||
    isLoadingCorrosionMonitoringOptions ||
    isLoadingBaseMaterialOptions
  )
    return(
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading corrosion study {corrosionStudy?.study_name} details... </p>
        </div>
      </div>
    )

  return (
    <div className="space-y-6 pb-16">
      <PageHeader
        title="Corrosion Study Detail"
        subtitle="View and manage corrosion study details"
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
          <AccordionItem value="general" className="border rounded-md">
            <AccordionTrigger className="px-4 py-3 bg-primary/10 hover:bg-primary/20 rounded-t-md font-medium">
              General Information
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="asset">Asset</Label>
                  <Select
                    name="asset_id"
                    value={formData.asset_id}
                    onValueChange={(value) =>
                      handleSelectChange("asset_id", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Asset" />
                    </SelectTrigger>
                    <SelectContent>
                      {assetOptions?.map((option) => {
                        return (
                          <SelectItem
                            key={option.value}
                            value={option.value.toString()}
                          >
                            {option.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="corrosionGroupName">
                    Corrosion Group Name
                  </Label>
                  <Select
                    name="corrosionGroupName"
                    value={formData.corrosion_group_id}
                    onValueChange={(value) =>
                      handleSelectChange("corrosionGroupName", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Corrosion Group" />
                    </SelectTrigger>
                    <SelectContent>
                      {corrosionGroupOptions?.map((option) => {
                        return (
                          <SelectItem
                            key={option.value}
                            value={option.value.toString()}
                          >
                            {option.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="materialConstruction">
                    Material Construction
                  </Label>
                  <Select
                    name="materialConstruction"
                    value={formData.material_construction_id}
                    onValueChange={(value) =>
                      handleSelectChange("materialConstruction", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Material" />
                    </SelectTrigger>
                    <SelectContent>
                      {materialConstructionOptions?.map((option) => {
                        return (
                          <SelectItem
                            key={option.value}
                            value={option.value.toString()}
                          >
                            {option.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="environment">Environment</Label>
                  <Input
                    id="environment"
                    name="environment"
                    value={formData.environment}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ph">pH</Label>
                  <Input
                    id="ph"
                    name="ph"
                    type="number"
                    min="0"
                    max="14"
                    step="0.1"
                    value={formData.ph}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="corrosionMonitoring">
                    Corrosion Monitoring
                  </Label>
                  <Select
                    name="corrosionMonitoring"
                    value={formData.corrosion_group_id || ""}
                    onValueChange={(value) => {
                      // This is just a simplified example, for multi-select you would
                      // typically use a custom component or more complex state management
                      handleSelectChange("corrosionMonitoring", value);
                      setFormData((prev) => ({
                        ...prev,
                        corrosionMonitoring: [value],
                      }));
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Monitoring Method" />
                    </SelectTrigger>
                    <SelectContent>
                      {corrosionMonitoringOptions?.map((option) => {
                        return (
                          <SelectItem
                            key={option.value}
                            value={option.value.toString()}
                          >
                            {option.label}
                          </SelectItem>
                        );
                      })}
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
                    value={formData.internal_damage_mechanism}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="externalDamageMechanism">
                    External Damage Mechanism
                  </Label>
                  <Input
                    id="externalDamageMechanism"
                    name="externalDamageMechanism"
                    value={formData.external_damage_mechanism}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedInternalCorrosionRate">
                    Expected Internal Corrosion Rate
                  </Label>
                  <Input
                    id="expectedInternalCorrosionRate"
                    name="expectedInternalCorrosionRate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.expected_internal_corrosion_rate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedExternalCorrosionRate">
                    Expected External Corrosion Rate
                  </Label>
                  <Input
                    id="expectedExternalCorrosionRate"
                    name="expectedExternalCorrosionRate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.expected_external_corrosion_rate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="h2s">H₂S</Label>
                    <Switch
                      id="h2s"
                      checked={formData.h2s_presence}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("h2s", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="co2">CO₂</Label>
                    <Switch
                      id="co2"
                      checked={formData.co2_presence}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("co2", checked)
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
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature °C</Label>
                  <Input
                    id="temperature"
                    name="temperature"
                    type="number"
                    value={formData.temperature}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pressure">Pressure Barg</Label>
                  <Input
                    id="pressure"
                    name="pressure"
                    type="number"
                    value={formData.pressure}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="h2sConcentration">H₂S Concentration</Label>
                  <Input
                    id="h2sConcentration"
                    name="h2sConcentration"
                    value={formData.h2sConcentration}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="co2Concentration">CO₂ Concentration</Label>
                  <Input
                    id="co2Concentration"
                    name="co2Concentration"
                    value={formData.co2Concentration}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="baseMaterial">Base Material</Label>
                  <Select
                    name="baseMaterial"
                    value={formData.base_material_id}
                    onValueChange={(value) =>
                      handleSelectChange("baseMaterial", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Base Material" />
                    </SelectTrigger>
                    <SelectContent>
                      {baseMaterialOptions?.map((material) => (
                        <SelectItem
                          key={material.value}
                          value={material.value.toString()}
                        >
                          {material.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fluidVelocity">Fluid Velocity</Label>
                  <Input
                    id="fluidVelocity"
                    name="fluidVelocity"
                    value={formData.fluid_velocity}
                    onChange={handleInputChange}
                  />
                </div>
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
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};

export default CorrosionStudiesDetailPage;
