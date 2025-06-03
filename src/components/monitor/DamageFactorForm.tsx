import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RBIAssessment } from "@/types/monitoring";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

export type DamageFactorFormProps = {
  formType:
    | "ext"
    | "ext.clscc"
    | "thin"
    | "hta"
    | "brit"
    | "mfat"
    | "scc-ssc"
    | "scc-sohic"
    | "lin"
    | "cui"
    | "cui-clscc";
  assessment?: RBIAssessment;
  onSubmit?: (data: any) => void;
  onAssessmentChange?: (assessment: RBIAssessment) => void;
  isSubmitting?: boolean;
  readOnly?: boolean;
};

// Helper function to convert any value to string safely
const toStringValue = (
  value: string | number | boolean | undefined
): string => {
  if (value === undefined || value === null) {
    return "";
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  return String(value);
};

export default function DamageFactorForm({
  formType,
  assessment,
  onSubmit,
  onAssessmentChange,
  isSubmitting = false,
  readOnly = false,
}: DamageFactorFormProps) {
  const [selectedTab, setSelectedTab] = useState("form");

  const formSchema = z.object({
    // We'll keep this schema flexible as each form type has different fields
    // The validation will be minimal for now
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...assessment,
    },
  });

  const handleFormSubmit = (data: any) => {
    if (onSubmit) {
      onSubmit({
        ...data,
        formType,
      });
    }
  };

  const handleAssessmentChange = (updatedAssessment: RBIAssessment) => {
    if (readOnly || !onAssessmentChange) return;
    onAssessmentChange(updatedAssessment);
  };

  // Handle select changes specifically for boolean conversions
  const handleSelectChange = (field: any, value: string) => {
    // Convert string "true"/"false" back to boolean for boolean fields
    if (value === "true" || value === "false") {
      field.onChange(value === "true");
    } else {
      field.onChange(value);
    }

    // If we have onAssessmentChange, call it too
    if (onAssessmentChange && assessment) {
      onAssessmentChange({
        ...assessment,
        [field.name]:
          value === "true" ? true : value === "false" ? false : value,
      });
    }
  };

  const formConfig = getFormConfig(formType);

  return (
    <Tabs
      defaultValue="form"
      value={selectedTab}
      onValueChange={setSelectedTab}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="form">Form</TabsTrigger>
        <TabsTrigger value="summary">Summary</TabsTrigger>
      </TabsList>
      <TabsContent value="form" className="space-y-4 py-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            {formConfig.map((section, idx) => (
              <Card key={idx} className="shadow-md">
                <CardHeader className="bg-slate-50">
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {section.fields.map((field) => (
                      <FormField
                        key={field.id}
                        control={form.control}
                        name={field.id as any} // Cast to any for now to avoid TypeScript errors
                        render={({ field: formField }) => (
                          <FormItem>
                            <FormLabel
                              className={
                                field.isCritical
                                  ? "text-red-500 font-medium"
                                  : ""
                              }
                            >
                              {field.label}
                            </FormLabel>
                            <FormControl>
                              {field.type === "select" ? (
                                <Select
                                  // Convert all values to string to avoid type errors
                                  value={toStringValue(formField.value)}
                                  onValueChange={(value) =>
                                    handleSelectChange(formField, value)
                                  }
                                  disabled={readOnly}
                                >
                                  <SelectTrigger>
                                    <SelectValue
                                      placeholder={`Select ${field.label}`}
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {field.options?.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : field.type === "date" ? (
                                <Input
                                  type="date"
                                  value={toStringValue(formField.value)}
                                  onChange={(e) => {
                                    formField.onChange(e);
                                    if (onAssessmentChange && assessment) {
                                      onAssessmentChange({
                                        ...assessment,
                                        [formField.name]: e.target.value,
                                      });
                                    }
                                  }}
                                  readOnly={readOnly}
                                />
                              ) : (
                                <Input
                                  type={field.type}
                                  value={toStringValue(formField.value)}
                                  onChange={(e) => {
                                    formField.onChange(e);
                                    if (onAssessmentChange && assessment) {
                                      const value =
                                        field.type === "number"
                                          ? Number(e.target.value)
                                          : e.target.value;
                                      onAssessmentChange({
                                        ...assessment,
                                        [formField.name]: value,
                                      });
                                    }
                                  }}
                                  readOnly={readOnly}
                                />
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            {!readOnly && (
              <div className="flex justify-end space-x-2">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </TabsContent>
      <TabsContent value="summary">
        <Card>
          <CardHeader className="bg-slate-50">
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="prose">
              <p>
                Summary of the damage factor assessment will be displayed here.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function getFormConfig(formType: DamageFactorFormProps["formType"]) {
  switch (formType) {
    case "ext":
      return [
        {
          title: "External Corrosion Parameters",
          fields: [
            { id: "asset", label: "EQ. ID", type: "text" },
            {
              id: "dataConfidence",
              label: "Data Confidence",
              type: "select",
              options: [
                { label: "High", value: "High" },
                { label: "Medium", value: "Medium" },
                { label: "Low", value: "Low" },
              ],
            },
            {
              id: "lastInspectionDate",
              label: "Last Inspection Date",
              type: "date",
            },
            { id: "extAge", label: "External Age (years)", type: "number" },
            {
              id: "extEnvironment",
              label: "External Environment",
              type: "text",
            },
            { id: "pipeSupport", label: "Pipe Support", type: "text" },
            {
              id: "soilWaterInterface",
              label: "Soil Water Interface",
              type: "text",
            },
            {
              id: "crexp",
              label: "Expected Corrosion Rate",
              type: "number",
              isCritical: true,
            },
            {
              id: "cract",
              label: "Actual Corrosion Rate",
              type: "number",
              isCritical: true,
            },
            { id: "art", label: "Remaining Thickness (RT)", type: "number" },
            { id: "fsextcorr", label: "Severity Factor", type: "number" },
            { id: "srextcorr", label: "Surface Ratio", type: "number" },
            {
              id: "remainingLife",
              label: "Remaining Life (yrs)",
              type: "number",
            },
            { id: "rl", label: "Rate of Loss", type: "number" },
            { id: "remarks", label: "Remarks", type: "text" },
          ],
        },
      ];
    case "ext.clscc":
      return [
        {
          title: "External CLSCC Parameters",
          fields: [
            { id: "asset", label: "EQ. ID", type: "text" },
            {
              id: "dataConfidence",
              label: "Data Confidence",
              type: "select",
              options: [
                { label: "High", value: "High" },
                { label: "Medium", value: "Medium" },
                { label: "Low", value: "Low" },
              ],
            },
            {
              id: "agecrack",
              label: "Age Since Last Cracking (yrs)",
              type: "number",
            },
            {
              id: "agecoat",
              label: "Age Since Last Coating (yrs)",
              type: "number",
            },
            { id: "coatadj", label: "Coating Adjustment", type: "number" },
            { id: "extClSccSusc", label: "CLSCC Susceptibility", type: "text" },
            { id: "svi", label: "Shell/Support Interface", type: "number" },
            {
              id: "inspectionEfficiency",
              label: "Inspection Efficiency",
              type: "number",
            },
            {
              id: "dfExtClSccFb",
              label: "DF EXT CLSCC FB",
              type: "number",
              isCritical: true,
            },
          ],
        },
      ];
    case "thin":
      return [
        {
          title: "Thinning Parameters",
          fields: [
            { id: "asset", label: "EQ. ID", type: "text" },
            {
              id: "dataConfidence",
              label: "DATA CONFIDENCE",
              type: "select",
              options: [
                { label: "High", value: "High" },
                { label: "Medium", value: "Medium" },
                { label: "Low", value: "Low" },
              ],
            },
            {
              id: "lastInspectionDate",
              label: "Last Inspection Date",
              type: "date",
            },
            { id: "nthinA", label: "N THIN A", type: "number" },
            { id: "nthinB", label: "N THIN B", type: "number" },
            { id: "fsThin", label: "FS THIN", type: "number" },
            { id: "srThin", label: "SR THIN", type: "number" },
            { id: "dfThin1", label: "DF THIN 1", type: "number" },
            {
              id: "dfThin2",
              label: "DF THIN 2",
              type: "number",
              isCritical: true,
            },
          ],
        },
      ];
    case "hta":
      return [
        {
          title: "High Temperature Attack Parameters",
          fields: [
            { id: "asset", label: "EQ. ID", type: "text" },
            {
              id: "dataConfidence",
              label: "DATA CONFIDENCE",
              type: "select",
              options: [
                { label: "High", value: "High" },
                { label: "Medium", value: "Medium" },
                { label: "Low", value: "Low" },
              ],
            },
            {
              id: "lastInspectionDate",
              label: "Last Inspection Date",
              type: "date",
            },
            { id: "dfhta", label: "DF HTA", type: "number", isCritical: true },
          ],
        },
      ];
    case "brit":
      return [
        {
          title: "Brittle Fracture Parameters",
          fields: [
            { id: "asset", label: "EQ. ID", type: "text" },
            {
              id: "dataConfidence",
              label: "DATA CONFIDENCE",
              type: "select",
              options: [
                { label: "High", value: "High" },
                { label: "Medium", value: "Medium" },
                { label: "Low", value: "Low" },
              ],
            },
            {
              id: "lastInspectionDate",
              label: "Last Inspection Date",
              type: "date",
            },
            {
              id: "dbrint",
              label: "DF BRIT",
              type: "number",
              isCritical: true,
            },
          ],
        },
      ];
    case "mfat":
      return [
        {
          title: "General Information",
          fields: [
            { id: "asset", label: "EQ. ID", type: "text" },
            {
              id: "dataConfidence",
              label: "DATA CONFIDENCE",
              type: "select",
              options: [
                { label: "High", value: "High" },
                { label: "Medium", value: "Medium" },
                { label: "Low", value: "Low" },
              ],
            },
            {
              id: "lastInspectionDate",
              label: "Last Inspection Date",
              type: "date",
            },
          ],
        },
        {
          title: "Mechanical Fatigue Parameters",
          fields: [
            {
              id: "dmfat",
              label: "Damage Factor (MFAT)",
              type: "number",
              isCritical: true,
            },
          ],
        },
      ];
    case "scc-ssc":
      return [
        {
          title: "General Information",
          fields: [
            { id: "asset", label: "EQ. ID", type: "text" },
            {
              id: "lastInspectionDate",
              label: "Last Inspection Date",
              type: "date",
            },
          ],
        },
        {
          title: "SCC SSC Parameters",
          fields: [
            {
              id: "dmsccssc",
              label: "Damage Factor (SCC SSC)",
              type: "number",
              isCritical: true,
            },
          ],
        },
      ];
    case "scc-sohic":
      return [
        {
          title: "General Information",
          fields: [
            { id: "asset", label: "EQ. ID", type: "text" },
            {
              id: "lastInspectionDate",
              label: "Last Inspection Date",
              type: "date",
            },
          ],
        },
        {
          title: "SCC SOHIC Parameters",
          fields: [
            {
              id: "dpSCCSOHIC",
              label: "Damage Factor (SCC SOHIC)",
              type: "number",
              isCritical: true,
            },
          ],
        },
      ];
    case "lin":
      return [
        {
          title: "General Information",
          fields: [
            { id: "asset", label: "EQ. ID", type: "text" },
            {
              id: "lastInspectionDate",
              label: "Last Inspection Date",
              type: "date",
            },
          ],
        },
        {
          title: "Linear Thinning Parameters",
          fields: [
            {
              id: "dfthin",
              label: "Damage Factor (Linear Thinning)",
              type: "number",
              isCritical: true,
            },
          ],
        },
      ];
    case "cui":
      return [
        {
          title: "General Information",
          fields: [
            { id: "asset", label: "EQ. ID", type: "text" },
            {
              id: "lastInspectionDate",
              label: "Last Inspection Date",
              type: "date",
            },
          ],
        },
        {
          title: "CUI Parameters",
          fields: [
            {
              id: "dfcui",
              label: "Damage Factor (CUI)",
              type: "number",
              isCritical: true,
            },
          ],
        },
      ];
    case "cui-clscc":
      return [
        {
          title: "General Information",
          fields: [
            { id: "asset", label: "EQ. ID", type: "text" },
            {
              id: "lastInspectionDate",
              label: "Last Inspection Date",
              type: "date",
            },
            {
              id: "hasCladding",
              label: "Has Cladding",
              type: "select",
              options: [
                { label: "Yes", value: "true" },
                { label: "No", value: "false" },
              ],
            },
          ],
        },
        {
          title: "CUI CLSCC Parameters",
          fields: [
            {
              id: "dfcuiiff",
              label: "DF CUI IFF",
              type: "number",
              isCritical: true,
            },
            {
              id: "dfextclsc",
              label: "DF CLSCC",
              type: "number",
              isCritical: true,
            },
          ],
        },
      ];
    default:
      return [
        {
          title: "Form Under Development",
          fields: [{ id: "asset", label: "EQ. ID", type: "text" }],
        },
      ];
  }
}
