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

const PipingFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the form submission
    toast.success("Piping data saved successfully!");
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
        title="Add New Piping"
        subtitle="Enter piping details for integrity management"
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
                      <Label htmlFor="asset">Asset</Label>
                      <Select>
                        <SelectTrigger id="asset">
                          <SelectValue placeholder="Select Asset" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asset1">Asset 1</SelectItem>
                          <SelectItem value="asset2">Asset 2</SelectItem>
                          <SelectItem value="asset3">Asset 3</SelectItem>
                        </SelectContent>
                      </Select>
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
                      <Label htmlFor="circuitId">Circuit ID</Label>
                      <Select>
                        <SelectTrigger id="circuitId">
                          <SelectValue placeholder="Select Circuit ID" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="circuit1">Circuit 1</SelectItem>
                          <SelectItem value="circuit2">Circuit 2</SelectItem>
                          <SelectItem value="circuit3">Circuit 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lineNo">Line No</Label>
                      <Input id="lineNo" placeholder="Enter line number" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tmin">Tmin</Label>
                      <Input id="tmin" placeholder="Enter Tmin" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pipeClass">Pipe Class</Label>
                      <Select>
                        <SelectTrigger id="pipeClass">
                          <SelectValue placeholder="Select Pipe Class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="class1">Class 1</SelectItem>
                          <SelectItem value="class2">Class 2</SelectItem>
                          <SelectItem value="class3">Class 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pipeSchedule">Pipe Schedule</Label>
                      <Select>
                        <SelectTrigger id="pipeSchedule">
                          <SelectValue placeholder="Select Pipe Schedule" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sch10">Schedule 10</SelectItem>
                          <SelectItem value="sch40">Schedule 40</SelectItem>
                          <SelectItem value="sch80">Schedule 80</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nominalWallThickness">
                        Nominal Wall Thickness
                      </Label>
                      <Input
                        id="nominalWallThickness"
                        placeholder="Enter nominal wall thickness"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nominalBoreDiameter">
                        Nominal Bore Diameter
                      </Label>
                      <Select>
                        <SelectTrigger id="nominalBoreDiameter">
                          <SelectValue placeholder="Select Nominal Bore Diameter" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="25mm">25mm</SelectItem>
                          <SelectItem value="50mm">50mm</SelectItem>
                          <SelectItem value="100mm">100mm</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pressureRating">Pressure Rating</Label>
                      <Input
                        id="pressureRating"
                        placeholder="Enter pressure rating"
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
                        <Switch id="lineH2S" />
                        <Label htmlFor="lineH2S">Line H2S</Label>
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
                      <Label htmlFor="length">Length</Label>
                      <Input id="length" placeholder="Enter length" />
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
                      <Label htmlFor="geometry">Geometry</Label>
                      <Select>
                        <SelectTrigger id="geometry">
                          <SelectValue placeholder="Select Geometry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="straight">Straight</SelectItem>
                          <SelectItem value="elbow">Elbow</SelectItem>
                          <SelectItem value="tee">Tee</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator className="md:col-span-2 my-4" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="pipeSupport" />
                        <Label htmlFor="pipeSupport">Pipe Support</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="soilWaterInterface" />
                        <Label htmlFor="soilWaterInterface">
                          Soil Water Interface
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="deadLegs" />
                        <Label htmlFor="deadLegs">Dead Legs</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="mixPoint" />
                        <Label htmlFor="mixPoint">Mix Point</Label>
                      </div>
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
                      <Label htmlFor="isolationSystem">Isolation System</Label>
                      <Select>
                        <SelectTrigger id="isolationSystem">
                          <SelectValue placeholder="Select Isolation System" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="type1">Type 1</SelectItem>
                          <SelectItem value="type2">Type 2</SelectItem>
                          <SelectItem value="type3">Type 3</SelectItem>
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
                      <Label htmlFor="trd">Trd (mm)</Label>
                      <Input id="trd" placeholder="Enter Trd" />
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
                      <Label htmlFor="postWeldHeatTreatment">
                        Post Weld Heat Treatment
                      </Label>
                      <Input
                        id="postWeldHeatTreatment"
                        placeholder="Enter post weld heat treatment"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lineDescription">Line Description</Label>
                      <Input
                        id="lineDescription"
                        placeholder="Enter line description"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="replacementLine">Replacement Line</Label>
                      <Input
                        id="replacementLine"
                        placeholder="Enter replacement line"
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
                          <SelectItem value="cathodic">
                            Cathodic Protection
                          </SelectItem>
                          <SelectItem value="inhibitor">
                            Chemical Inhibitor
                          </SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="crExp">CR Exp</Label>
                      <Input id="crExp" placeholder="Enter CR Exp" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sretCorr">Sret Corr</Label>
                      <Input id="sretCorr" placeholder="Enter Sret Corr" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fsectCorr">Fsect Corr</Label>
                      <Input id="fsectCorr" placeholder="Enter Fsect Corr" />
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
              Save Piping
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PipingFormPage;
