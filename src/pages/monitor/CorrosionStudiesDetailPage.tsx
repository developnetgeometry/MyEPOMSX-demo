import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const CorrosionStudiesDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    asset: "",
    corrosionGroupName: "",
    materialConstruction: "",
    environment: "",
    ph: "",
    corrosionMonitoring: [] as string[],
    internalDamageMechanism: "",
    externalDamageMechanism: "",
    expectedInternalCorrosionRate: "",
    expectedExternalCorrosionRate: "",
    h2s: false,
    co2: false,
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
                    name="asset"
                    value={formData.asset}
                    onValueChange={(value) =>
                      handleSelectChange("asset", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Asset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PV-1001">PV-1001</SelectItem>
                      <SelectItem value="PP-2003">PP-2003</SelectItem>
                      <SelectItem value="PV-1002">PV-1002</SelectItem>
                      <SelectItem value="PP-2001">PP-2001</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="corrosionGroupName">
                    Corrosion Group Name
                  </Label>
                  <Select
                    name="corrosionGroupName"
                    value={formData.corrosionGroupName}
                    onValueChange={(value) =>
                      handleSelectChange("corrosionGroupName", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Corrosion Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Group A">Group A</SelectItem>
                      <SelectItem value="Group B">Group B</SelectItem>
                      <SelectItem value="Group C">Group C</SelectItem>
                      <SelectItem value="Group D">Group D</SelectItem>
                      <SelectItem value="add_new">+ Add New Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="materialConstruction">
                    Material Construction
                  </Label>
                  <Select
                    name="materialConstruction"
                    value={formData.materialConstruction}
                    onValueChange={(value) =>
                      handleSelectChange("materialConstruction", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Material" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Carbon Steel">Carbon Steel</SelectItem>
                      <SelectItem value="Stainless Steel">
                        Stainless Steel
                      </SelectItem>
                      <SelectItem value="Chrome Alloy">Chrome Alloy</SelectItem>
                      <SelectItem value="High Nickel Alloy">
                        High Nickel Alloy
                      </SelectItem>
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
                    value={formData.corrosionMonitoring[0] || ""}
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
                      <SelectItem value="Ultrasonic Testing">
                        Ultrasonic Testing
                      </SelectItem>
                      <SelectItem value="Radiography">Radiography</SelectItem>
                      <SelectItem value="Visual Inspection">
                        Visual Inspection
                      </SelectItem>
                      <SelectItem value="Coupon Testing">
                        Coupon Testing
                      </SelectItem>
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
                    value={formData.expectedInternalCorrosionRate}
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
                    value={formData.expectedExternalCorrosionRate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="h2s">H₂S</Label>
                    <Switch
                      id="h2s"
                      checked={formData.h2s}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("h2s", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="co2">CO₂</Label>
                    <Switch
                      id="co2"
                      checked={formData.co2}
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
                    value={formData.baseMaterial}
                    onValueChange={(value) =>
                      handleSelectChange("baseMaterial", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Base Material" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Carbon Steel">Carbon Steel</SelectItem>
                      <SelectItem value="Stainless Steel 304">
                        Stainless Steel 304
                      </SelectItem>
                      <SelectItem value="Stainless Steel 316">
                        Stainless Steel 316
                      </SelectItem>
                      <SelectItem value="Duplex Steel">Duplex Steel</SelectItem>
                      <SelectItem value="Super Duplex">Super Duplex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fluidVelocity">Fluid Velocity</Label>
                  <Input
                    id="fluidVelocity"
                    name="fluidVelocity"
                    value={formData.fluidVelocity}
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
