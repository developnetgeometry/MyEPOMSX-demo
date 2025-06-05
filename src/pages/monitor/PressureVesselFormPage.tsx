import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Save, ArrowLeft } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { Textarea } from "@/components/ui/textarea";

const PressureVesselFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the form submission
    toast.success("Pressure Vessel data saved successfully!");
    navigate("/monitor/integrity");
  };

  const handleCancel = () => {
    navigate("/monitor/integrity");
  };

  const handleBackClick = () => {
    navigate("/monitor/integrity");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Pressure Vessel"
        subtitle="Enter pressure vessel details for integrity management"
        description="Complete the form below to add a new pressure vessel record to the system"
        icon={<ArrowLeft className="h-6 w-6" onClick={handleBackClick} />}
      />

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid grid-cols-7 w-full">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="protection">Protection</TabsTrigger>
              <TabsTrigger value="service">Service</TabsTrigger>
              <TabsTrigger value="risk">Risk</TabsTrigger>
              <TabsTrigger value="inspection">Inspection</TabsTrigger>
              <TabsTrigger value="attachment">Attachment</TabsTrigger>
            </TabsList>

            {/* General Tab Content */}
            <TabsContent value="general">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="assetCode">Asset Code</Label>
                      <Input id="assetCode" placeholder="Enter asset code" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assetName">Asset Name</Label>
                      <Input id="assetName" placeholder="Enter asset name" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="yearInService">Year In Service</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="materialConstruction">
                        Material Construction
                      </Label>
                      <Select>
                        <SelectTrigger id="materialConstruction">
                          <SelectValue placeholder="Select Material" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="carbon">Carbon Steel</SelectItem>
                          <SelectItem value="stainless">
                            Stainless Steel
                          </SelectItem>
                          <SelectItem value="alloy">Alloy Steel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="area">Area</Label>
                      <Input id="area" placeholder="Enter area" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="system">System</Label>
                      <Input id="system" placeholder="Enter system" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pressureClass">Pressure Class</Label>
                      <Select>
                        <SelectTrigger id="pressureClass">
                          <SelectValue placeholder="Select Pressure Class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="class1">Class 150</SelectItem>
                          <SelectItem value="class2">Class 300</SelectItem>
                          <SelectItem value="class3">Class 600</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vesselType">Vessel Type</Label>
                      <Select>
                        <SelectTrigger id="vesselType">
                          <SelectValue placeholder="Select Vessel Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="separator">Separator</SelectItem>
                          <SelectItem value="tank">Tank</SelectItem>
                          <SelectItem value="reactor">Reactor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shellThickness">Shell Thickness</Label>
                      <Input
                        id="shellThickness"
                        placeholder="Enter shell thickness"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="headType">Head Type</Label>
                      <Select>
                        <SelectTrigger id="headType">
                          <SelectValue placeholder="Select Head Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="elliptical">Elliptical</SelectItem>
                          <SelectItem value="hemispherical">
                            Hemispherical
                          </SelectItem>
                          <SelectItem value="flat">Flat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="headThickness">Head Thickness</Label>
                      <Input
                        id="headThickness"
                        placeholder="Enter head thickness"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Enter description"
                      />
                    </div>

                    <Separator className="md:col-span-2 my-4" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:col-span-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="insulation" />
                        <Label htmlFor="insulation">Insulation</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="h2sService" />
                        <Label htmlFor="h2sService">H2S Service</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="internalLining" />
                        <Label htmlFor="internalLining">Internal Lining</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="pwht" />
                        <Label htmlFor="pwht">PWHT</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="cladding" />
                        <Label htmlFor="cladding">Cladding</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Design Tab Content */}
            <TabsContent value="design">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="internalDiameter">
                        Internal Diameter
                      </Label>
                      <Input
                        id="internalDiameter"
                        placeholder="Enter internal diameter"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="outerDiameter">Outer Diameter</Label>
                      <Input
                        id="outerDiameter"
                        placeholder="Enter outer diameter"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tangentToTangent">
                        Tangent to Tangent Length
                      </Label>
                      <Input
                        id="tangentToTangent"
                        placeholder="Enter tangent to tangent length"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weldJoinEfficiency">
                        Weld Join Efficiency
                      </Label>
                      <Input
                        id="weldJoinEfficiency"
                        placeholder="Enter weld join efficiency"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="designTemperature">
                        Design Temperature
                      </Label>
                      <Input
                        id="designTemperature"
                        placeholder="Enter design temperature"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="operatingTemperature">
                        Operating Temperature
                      </Label>
                      <Input
                        id="operatingTemperature"
                        placeholder="Enter operating temperature"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="designPressure">
                        Design Pressure (MPa)
                      </Label>
                      <Input
                        id="designPressure"
                        placeholder="Enter design pressure"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="operatingPressure">
                        Operating Pressure (MPa)
                      </Label>
                      <Input
                        id="operatingPressure"
                        placeholder="Enter operating pressure"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="allowableStress">
                        Allowable Stress (MPa)
                      </Label>
                      <Input
                        id="allowableStress"
                        placeholder="Enter allowable stress"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="corrosionAllowance">
                        Corrosion Allowance
                      </Label>
                      <Input
                        id="corrosionAllowance"
                        placeholder="Enter corrosion allowance"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="externalEnvironment">
                        External Environment
                      </Label>
                      <Select>
                        <SelectTrigger id="externalEnvironment">
                          <SelectValue placeholder="Select External Environment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="marine">Marine</SelectItem>
                          <SelectItem value="industrial">Industrial</SelectItem>
                          <SelectItem value="desert">Desert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="orientation">Orientation</Label>
                      <Select>
                        <SelectTrigger id="orientation">
                          <SelectValue placeholder="Select Orientation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vertical">Vertical</SelectItem>
                          <SelectItem value="horizontal">Horizontal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Protection Tab Content */}
            <TabsContent value="protection">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="coatingQuality">Coating Quality</Label>
                      <Select>
                        <SelectTrigger id="coatingQuality">
                          <SelectValue placeholder="Select Coating Quality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cathodicProtection">
                        Cathodic Protection
                      </Label>
                      <Select>
                        <SelectTrigger id="cathodicProtection">
                          <SelectValue placeholder="Select Cathodic Protection" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="impressed">
                            Impressed Current
                          </SelectItem>
                          <SelectItem value="sacrificial">
                            Sacrificial Anode
                          </SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="onlineMonitor">Online Monitor</Label>
                      <Select>
                        <SelectTrigger id="onlineMonitor">
                          <SelectValue placeholder="Select Online Monitor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="continuous">Continuous</SelectItem>
                          <SelectItem value="periodic">Periodic</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="minimumThickness">
                        Minimum Thickness (mm)
                      </Label>
                      <Input
                        id="minimumThickness"
                        placeholder="Enter minimum thickness"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="detectionSystem">Detection System</Label>
                      <Select>
                        <SelectTrigger id="detectionSystem">
                          <SelectValue placeholder="Select Detection System" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="automatic">Automatic</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mitigationSystem">
                        Mitigation System
                      </Label>
                      <Select>
                        <SelectTrigger id="mitigationSystem">
                          <SelectValue placeholder="Select Mitigation System" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inhibitor">
                            Chemical Inhibitor
                          </SelectItem>
                          <SelectItem value="coating">
                            Protective Coating
                          </SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="active" />
                      <Label htmlFor="active">Active</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Service Tab Content */}
            <TabsContent value="service">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fluidService">Fluid Service</Label>
                      <Select>
                        <SelectTrigger id="fluidService">
                          <SelectValue placeholder="Select Fluid Service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="oil">Oil</SelectItem>
                          <SelectItem value="gas">Gas</SelectItem>
                          <SelectItem value="mixed">Mixed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="toxicity">Toxicity</Label>
                      <Select>
                        <SelectTrigger id="toxicity">
                          <SelectValue placeholder="Select Toxicity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="toxicMassFraction">
                        Toxic Mass Fraction
                      </Label>
                      <Input
                        id="toxicMassFraction"
                        placeholder="Enter toxic mass fraction"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Risk Tab Content - Placeholder */}
            <TabsContent value="risk">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">
                    Risk data will be added in the future.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Inspection Tab Content - Placeholder */}
            <TabsContent value="inspection">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">
                    Inspection data will be added in the future.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Attachment Tab Content - Placeholder */}
            <TabsContent value="attachment">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">
                    Attachments will be added in the future.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Save Pressure Vessel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PressureVesselFormPage;
