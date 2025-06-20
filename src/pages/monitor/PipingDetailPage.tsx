import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import PageHeader from "@/components/shared/PageHeader";
import {
  ShieldIcon,
  ArrowLeft,
  Edit,
  Save,
  X,
  FileText,
  Download,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

interface PipingData {
  // General data from i_ims_general
  general: {
    id: number;
    asset_detail_id: number;
    year_in_service: string;
    tmin: string;
    material_construction_id: number;
    description: string;
    normal_wall_thickness: number;
    nominal_bore_diameter: number;
    pressure_rating: number;
    pipe_class_id: number;
    pipe_schedule_id: number;
    circuit_id: number;
    line_no: string;
    insulation: boolean;
    line_h2s: boolean;
    internal_lining: boolean;
    pwht: boolean;
    cladding: boolean;
    inner_diameter: number;
    clad_thickness: number;
  };

  // Design data from i_ims_design
  design: {
    outer_diameter: number;
    internal_diameter: number;
    length: number;
    welding_efficiency: number;
    design_temperature: number;
    operating_temperature: number;
    design_pressure: number;
    operating_pressure_mpa: number;
    allowable_stress_mpa: number;
    corrosion_allowance: number;
    ext_env_id: number;
    geometry_id: number;
    pipe_support: boolean;
    soil_water_interface: boolean;
    dead_legs: boolean;
    mix_point: boolean;
  };

  // Protection data from i_ims_protection
  protection: {
    coating_quality_id: number;
    insulation_type_id: number;
    insulation_complexity_id: number;
    insulation_condition: string;
    design_fabrication_id: number;
    interface_id: number;
    lining_type: string;
    lining_condition: string;
    lining_monitoring: string;
    isolation_system_id: number;
    detection_system_id: number;
    mitigation_system_id: number;
    online_monitor: number;
    post_weld_heat_treatment: number;
    line_description: string;
    replacement_line: string;
    minimum_thickness: number;
  };

  // Service data from i_ims_service
  service: {
    fluid_representive_id: number;
    toxicity_id: number;
    fluid_phase_id: number;
    toxic_mass_fraction: number;
  };

  // Asset detail from e_asset_detail
  assetDetail: {
    equipment_tag: string;
    component_type: string;
    area: string;
    system: string;
  };
}

const PipingDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("general");

  // In a real application, you would fetch data based on the ID
  // For now, we're using the sample data
  const piping = pipingData;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Piping: ${piping.lineNo}`}
        subtitle={`Details for ${piping.description.substring(0, 60)}${
          piping.description.length > 60 ? "..." : ""
        }`}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-pipe"
          >
            <path d="M3 10h18M3 14h18" />
            <path d="M10 3v18M14 3v18" />
          </svg>
        }
      />

      <Button
        variant="outline"
        size="sm"
        className="mb-4"
        onClick={() => navigate("/monitor/integrity")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Integrity
      </Button>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 md:grid-cols-7 w-full mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="protection">Protection</TabsTrigger>
          <TabsTrigger value="service">Service</TabsTrigger>
          <TabsTrigger value="risk">Risk</TabsTrigger>
          <TabsTrigger value="inspection" className="hidden md:block">
            Inspection
          </TabsTrigger>
          <TabsTrigger value="attachment" className="hidden md:block">
            Attachment
          </TabsTrigger>
        </TabsList>

        <Card>
          <CardContent className="pt-6">
            {/* General Tab */}
            <TabsContent value="general" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Asset
                  </h4>
                  <p>{piping.asset}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Year In Service
                  </h4>
                  <p>{new Date(piping.yearInService).toLocaleDateString()}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Material Construction
                  </h4>
                  <p>{piping.materialConstruction}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Area
                  </h4>
                  <p>{piping.area || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    System
                  </h4>
                  <p>{piping.system || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Circuit ID
                  </h4>
                  <p>{piping.circuitId || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Line No
                  </h4>
                  <p>{piping.lineNo || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Tmin
                  </h4>
                  <p>{piping.tmin || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Pipe Class
                  </h4>
                  <p>{piping.pipeClass || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Pipe Schedule
                  </h4>
                  <p>{piping.pipeSchedule || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Nominal Wall Thickness
                  </h4>
                  <p>{piping.nominalWallThickness || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Nominal Bore Diameter
                  </h4>
                  <p>{piping.nominalBoreDiameter || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Pressure Rating
                  </h4>
                  <p>{piping.pressureRating || "N/A"}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Description
                </h4>
                <p>{piping.description || "N/A"}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Insulation
                  </h4>
                  <p>{piping.insulation ? "Yes" : "No"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Line H2S
                  </h4>
                  <p>{piping.lineH2S ? "Yes" : "No"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Internal Lining
                  </h4>
                  <p>{piping.internalLining ? "Yes" : "No"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    PWHT
                  </h4>
                  <p>{piping.pwht ? "Yes" : "No"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Cladding
                  </h4>
                  <p>{piping.cladding ? "Yes" : "No"}</p>
                </div>
              </div>
            </TabsContent>

            {/* Design Tab */}
            <TabsContent value="design" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Internal Diameter
                  </h4>
                  <p>{piping.internalDiameter || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Outer Diameter
                  </h4>
                  <p>{piping.outerDiameter || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Length
                  </h4>
                  <p>{piping.length || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Weld Join Efficiency
                  </h4>
                  <p>{piping.weldJoinEfficiency || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Design Temperature
                  </h4>
                  <p>{piping.designTemperature || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Operating Temperature
                  </h4>
                  <p>{piping.operatingTemperature || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Design Pressure (MPa)
                  </h4>
                  <p>{piping.designPressure || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Operating Pressure (MPa)
                  </h4>
                  <p>{piping.operatingPressure || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Allowable Stress (MPa)
                  </h4>
                  <p>{piping.allowableStress || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Corrosion Allowance
                  </h4>
                  <p>{piping.corrosionAllowance || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    External Environment
                  </h4>
                  <p>{piping.externalEnvironment || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Geometry
                  </h4>
                  <p>{piping.geometry || "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Pipe Support
                  </h4>
                  <p>{piping.pipeSupport ? "Yes" : "No"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Soil Water Interface
                  </h4>
                  <p>{piping.soilWaterInterface ? "Yes" : "No"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Dead Legs
                  </h4>
                  <p>{piping.deadLegs ? "Yes" : "No"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Mix Point
                  </h4>
                  <p>{piping.mixPoint ? "Yes" : "No"}</p>
                </div>
              </div>
            </TabsContent>

            {/* Protection Tab */}
            <TabsContent value="protection" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Coating Quality
                  </h4>
                  <p>{piping.coatingQuality || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Isolation System
                  </h4>
                  <p>{piping.isolationSystem || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Online Monitor
                  </h4>
                  <p>{piping.onlineMonitor || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Trd (mm)
                  </h4>
                  <p>{piping.trd || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Minimum Thickness (mm)
                  </h4>
                  <p>{piping.minimumThickness || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Post Weld Heat Treatment
                  </h4>
                  <p>{piping.postWeldHeatTreatment || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Line Description
                  </h4>
                  <p>{piping.lineDescription || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Replacement Line
                  </h4>
                  <p>{piping.replacementLine || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Detection System
                  </h4>
                  <p>{piping.detectionSystem || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Mitigation System
                  </h4>
                  <p>{piping.mitigationSystem || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    CR Exp
                  </h4>
                  <p>{piping.crExp || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Sret Corr
                  </h4>
                  <p>{piping.sretCorr || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Fsect Corr
                  </h4>
                  <p>{piping.fsectCorr || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Active
                  </h4>
                  <p>{piping.active ? "Yes" : "No"}</p>
                </div>
              </div>
            </TabsContent>

            {/* Service Tab */}
            <TabsContent value="service" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Toxicity
                  </h4>
                  <p>{piping.toxicity || "N/A"}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Toxic Mass Fraction
                  </h4>
                  <p>{piping.toxicMassFraction || "N/A"}</p>
                </div>
              </div>
            </TabsContent>

            {/* Risk Tab */}
            <TabsContent value="risk" className="space-y-6">
              <div className="h-40 flex items-center justify-center border rounded-md bg-muted/20">
                <p className="text-muted-foreground">
                  Risk data is not available for this piping record yet
                </p>
              </div>
            </TabsContent>

            {/* Inspection Tab */}
            <TabsContent value="inspection" className="space-y-6">
              <div className="h-40 flex items-center justify-center border rounded-md bg-muted/20">
                <p className="text-muted-foreground">
                  Inspection data is not available for this piping record yet
                </p>
              </div>
            </TabsContent>

            {/* Attachment Tab */}
            <TabsContent value="attachment" className="space-y-6">
              <div className="h-40 flex items-center justify-center border rounded-md bg-muted/20">
                <p className="text-muted-foreground">
                  No attachments have been added to this piping record yet
                </p>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default PipingDetailPage;
