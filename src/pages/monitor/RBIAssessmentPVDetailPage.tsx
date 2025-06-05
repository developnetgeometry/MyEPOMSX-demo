import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Save, X, Upload } from "lucide-react";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import PageHeader from "@/components/shared/PageHeader";

// Define the form schema
const rbiPVFormSchema = z.object({
  // General Section
  asset: z.string().min(1, "Asset ID is required"),
  yearInService: z.string().min(1, "Year in service is required"),
  materialConstruction: z.string().min(1, "Material construction is required"),
  area: z.string().min(1, "Area is required"),
  system: z.string().min(1, "System is required"),
  equipmentTag: z.string().min(1, "Equipment tag is required"),
  description: z.string().optional(),

  // Design Section
  innerDiameter: z.string().min(1, "Inner diameter is required"),
  outerDiameter: z.string().min(1, "Outer diameter is required"),
  designPressure: z.string().min(1, "Design pressure is required"),
  designTemperature: z.string().min(1, "Design temperature is required"),
  operatingPressure: z.string().min(1, "Operating pressure is required"),
  operatingTemperature: z.string().min(1, "Operating temperature is required"),
  jointEfficiency: z.string().min(1, "Joint efficiency is required"),
  shellThickness: z.string().min(1, "Shell thickness is required"),
  headThickness: z.string().min(1, "Head thickness is required"),
  pwht: z.boolean().default(false),
  hasCladding: z.boolean().default(false),
  cladThickness: z.string().optional(),

  // Protection Section
  coatingQuality: z.string().min(1, "Coating quality is required"),
  coatingDate: z.string().optional(),
  insulationType: z.string().optional(),
  insulationCondition: z.string().optional(),
  hasInternalLining: z.boolean().default(false),
  internalLiningType: z.string().optional(),
  internalLiningCondition: z.string().optional(),

  // Service Section
  fluidRepresentative: z.string().min(1, "Fluid representative is required"),
  toxicity: z.string().min(1, "Toxicity is required"),
  fluidPhase: z.string().min(1, "Fluid phase is required"),
  h2sPresent: z.boolean().default(false),

  // Risk Section
  riskRanking: z.string().min(1, "Risk ranking is required"),
  dThin: z.string().optional(),
  dSCC: z.string().optional(),
  dBrit: z.string().optional(),
  dMfat: z.string().optional(),
  pofValue: z.string().optional(),
  cofFinancial: z.string().optional(),
  cofArea: z.string().optional(),

  // Inspection Section
  inspectionPlan: z.string().optional(),

  // No validation for attachments as they're handled separately
});

type RBIFormValues = z.infer<typeof rbiPVFormSchema>;

// Mock data for select options
const materialOptions = [
  { label: "Carbon Steel", value: "carbon_steel" },
  { label: "Stainless Steel", value: "stainless_steel" },
  { label: "Alloy Steel", value: "alloy_steel" },
  { label: "Duplex Steel", value: "duplex_steel" },
];

const areaOptions = [
  { label: "Process Area", value: "process" },
  { label: "Storage Area", value: "storage" },
  { label: "Utility Area", value: "utility" },
];

const systemOptions = [
  { label: "Cooling Water", value: "cooling_water" },
  { label: "Steam", value: "steam" },
  { label: "Process", value: "process" },
  { label: "Utility", value: "utility" },
];

const coatingQualityOptions = [
  { label: "1-Poor-0", value: "1-poor-0" },
  { label: "2-Fair-0", value: "2-fair-0" },
  { label: "3-Good-0", value: "3-good-0" },
];

const insulationTypeOptions = [
  { label: "Calcium Silicate", value: "calcium_silicate" },
  { label: "Mineral Wool", value: "mineral_wool" },
  { label: "Fiberglass", value: "fiberglass" },
  { label: "None", value: "none" },
];

const conditionOptions = [
  { label: "Good", value: "good" },
  { label: "Fair", value: "fair" },
  { label: "Poor", value: "poor" },
];

const liningTypeOptions = [
  { label: "Rubber", value: "rubber" },
  { label: "Epoxy", value: "epoxy" },
  { label: "Glass", value: "glass" },
  { label: "None", value: "none" },
];

const fluidOptions = [
  { label: "Water", value: "water" },
  { label: "Steam", value: "steam" },
  { label: "Oil", value: "oil" },
  { label: "Gas", value: "gas" },
];

const toxicityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const phaseOptions = [
  { label: "Liquid", value: "liquid" },
  { label: "Gas", value: "gas" },
  { label: "Two-Phase", value: "two_phase" },
];

const riskOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
];

// Default form values for the example
const defaultValues: Partial<RBIFormValues> = {
  asset: "PV-101",
  yearInService: "2015",
  materialConstruction: "carbon_steel",
  area: "process",
  system: "cooling_water",
  equipmentTag: "E-PV-101",
  description: "Main process vessel for cooling water system",

  innerDiameter: "1200",
  outerDiameter: "1250",
  designPressure: "16",
  designTemperature: "150",
  operatingPressure: "15",
  operatingTemperature: "120",
  jointEfficiency: "0.85",
  shellThickness: "25",
  headThickness: "30",
  pwht: true,
  hasCladding: true,
  cladThickness: "5",

  coatingQuality: "1-poor-0",
  coatingDate: "2020-06-15",
  insulationType: "mineral_wool",
  insulationCondition: "fair",
  hasInternalLining: true,
  internalLiningType: "epoxy",
  internalLiningCondition: "good",

  fluidRepresentative: "water",
  toxicity: "low",
  fluidPhase: "liquid",
  h2sPresent: false,

  riskRanking: "medium",
  dThin: "0.25",
  dSCC: "0.15",
  dBrit: "0.10",
  dMfat: "0.05",
  pofValue: "2.3e-5",
  cofFinancial: "250000",
  cofArea: "15",

  inspectionPlan: "Bi-annual thickness inspection, visual corrosion check.",
};

export default function RBIAssessmentPVDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isAddMode, setIsAddMode] = useState(!id || id === "new");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<RBIFormValues>({
    resolver: zodResolver(rbiPVFormSchema),
    defaultValues: isAddMode ? {} : defaultValues,
  });

  const handleSubmit = async (values: RBIFormValues) => {
    setIsSubmitting(true);
    try {
      // In a real app, you would call an API here
      console.log("Form values submitted:", values);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      toast({
        title: "Success",
        description: isAddMode
          ? "RBI assessment has been created successfully"
          : "RBI assessment has been updated successfully",
      });

      // If in add mode, navigate to view mode
      if (isAddMode) {
        navigate("/monitor/rbi-assessment/4");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "An error occurred while saving the RBI assessment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="container px-4 py-6">
      <Breadcrumbs
        overrideItems={[
          { href: "/monitor/rbi-assessment", label: "RBI Assessments" },
          { label: isAddMode ? "Add New Assessment" : `Assessment ${id}` },
        ]}
      />

      <PageHeader
        title={
          isAddMode
            ? "Add New RBI Assessment (Pressure Vessel)"
            : "Pressure Vessel RBI Assessment"
        }
        subtitle={
          isAddMode
            ? "Create a new RBI assessment for a pressure vessel"
            : `Viewing details for assessment ${id || ""}`
        }
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <div className="sticky top-0 z-10 bg-background pb-4">
              <TabsList className="grid grid-cols-2 md:grid-cols-7 w-full">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="protection">Protection</TabsTrigger>
                <TabsTrigger value="service">Service</TabsTrigger>
                <TabsTrigger value="risk">Risk</TabsTrigger>
                <TabsTrigger value="inspection">Inspection</TabsTrigger>
                <TabsTrigger value="attachment">Attachment</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader className="bg-slate-50">
                  <CardTitle>General Information</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="asset"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Asset ID</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isAddMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="yearInService"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year In Service</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isAddMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="materialConstruction"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Material Construction</FormLabel>
                          <Select
                            disabled={!isAddMode}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select material" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {materialOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Area</FormLabel>
                          <Select
                            disabled={!isAddMode}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select area" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {areaOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="system"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>System</FormLabel>
                          <Select
                            disabled={!isAddMode}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select system" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {systemOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="equipmentTag"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Equipment Tag</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isAddMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="col-span-1 md:col-span-2">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              disabled={!isAddMode}
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="design" className="space-y-4">
              <Card>
                <CardHeader className="bg-slate-50">
                  <CardTitle>Design Data</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="innerDiameter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inner Diameter (mm)</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isAddMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="outerDiameter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Outer Diameter (mm)</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isAddMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="designPressure"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Design Pressure (MPa)</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isAddMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="designTemperature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Design Temperature (°C)</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isAddMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="operatingPressure"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Operating Pressure (MPa)</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isAddMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="operatingTemperature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Operating Temperature (°C)</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isAddMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="jointEfficiency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Joint Efficiency</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isAddMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shellThickness"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shell Thickness (mm)</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isAddMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="headThickness"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Head Thickness (mm)</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isAddMode} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pwht"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>
                              Post Weld Heat Treatment (PWHT)
                            </FormLabel>
                            <FormDescription>
                              Specify if PWHT has been performed
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={!isAddMode}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasCladding"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Cladding</FormLabel>
                            <FormDescription>
                              Specify if vessel has cladding
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={!isAddMode}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {form.watch("hasCladding") && (
                      <FormField
                        control={form.control}
                        name="cladThickness"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Clad Thickness (mm)</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isAddMode} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="protection" className="space-y-4">
              <Card>
                <CardHeader className="bg-slate-50">
                  <CardTitle>Protection Systems</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="coatingQuality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coating Quality</FormLabel>
                          <Select
                            disabled={!isAddMode}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select coating quality" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {coatingQualityOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="coatingDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coating Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              disabled={!isAddMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="insulationType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Insulation Type</FormLabel>
                          <Select
                            disabled={!isAddMode}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select insulation type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {insulationTypeOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="insulationCondition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Insulation Condition</FormLabel>
                          <Select
                            disabled={!isAddMode}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select condition" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {conditionOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hasInternalLining"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Internal Lining</FormLabel>
                            <FormDescription>
                              Specify if vessel has internal lining
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={!isAddMode}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {form.watch("hasInternalLining") && (
                      <>
                        <FormField
                          control={form.control}
                          name="internalLiningType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Internal Lining Type</FormLabel>
                              <Select
                                disabled={!isAddMode}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select lining type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {liningTypeOptions.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="internalLiningCondition"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Internal Lining Condition</FormLabel>
                              <Select
                                disabled={!isAddMode}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select condition" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {conditionOptions.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="service" className="space-y-4">
              <Card>
                <CardHeader className="bg-slate-50">
                  <CardTitle>Service Data</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fluidRepresentative"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fluid Representative</FormLabel>
                          <Select
                            disabled={!isAddMode}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select fluid" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {fluidOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="toxicity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Toxicity</FormLabel>
                          <Select
                            disabled={!isAddMode}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select toxicity" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {toxicityOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fluidPhase"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fluid Phase</FormLabel>
                          <Select
                            disabled={!isAddMode}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select phase" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {phaseOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="h2sPresent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>H₂S Present</FormLabel>
                            <FormDescription>
                              Indicate if H₂S is present in the service
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={!isAddMode}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risk" className="space-y-4">
              <Card>
                <CardHeader className="bg-slate-50">
                  <CardTitle>Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="riskRanking"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Risk Ranking</FormLabel>
                          <Select
                            disabled={!isAddMode}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select risk ranking" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {riskOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6">
                    <h3 className="font-medium text-lg mb-4">PoF Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="dThin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>DThin</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isAddMode} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dSCC"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>DSCC</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isAddMode} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dBrit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>DBrit</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isAddMode} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dMfat"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>DMfat</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isAddMode} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="pofValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>PoF Value</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isAddMode} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-medium text-lg mb-4">CoF Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="cofFinancial"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Financial Impact ($)</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isAddMode} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cofArea"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Impact Area (m²)</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isAddMode} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inspection" className="space-y-4">
              <Card>
                <CardHeader className="bg-slate-50">
                  <CardTitle>Inspection Data</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 gap-6">
                    <FormField
                      control={form.control}
                      name="inspectionPlan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inspection Plan</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              disabled={!isAddMode}
                              rows={5}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {!isAddMode && (
                      <div className="border rounded-md p-4">
                        <h3 className="font-medium text-lg mb-4">
                          Inspection Reports
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                Thickness_Report_2023.pdf
                              </span>
                            </div>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                Visual_Inspection_2022.pdf
                              </span>
                            </div>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attachment" className="space-y-4">
              <Card>
                <CardHeader className="bg-slate-50">
                  <CardTitle>Attachments</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {isAddMode ? (
                    <div className="border-2 border-dashed rounded-lg p-10 text-center">
                      <div className="flex flex-col items-center">
                        <Upload className="h-10 w-10 text-gray-400 mb-2" />
                        <h3 className="text-lg font-medium">Upload Files</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Drag and drop files here or click to browse
                        </p>
                        <Button variant="outline">Select Files</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="border rounded-md p-4">
                        <h3 className="font-medium text-lg mb-4">Documents</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                Design_Specification.pdf
                              </span>
                            </div>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                Material_Certificate.pdf
                              </span>
                            </div>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                Risk_Analysis_Report.xlsx
                              </span>
                            </div>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {isAddMode && (
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          )}

          {!isAddMode && (
            <div className="flex justify-start">
              <Button type="button" variant="outline" onClick={handleCancel}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to RBI List
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
