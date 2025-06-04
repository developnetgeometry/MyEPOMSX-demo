import { useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { isMonetaryField } from "@/utils/formatters";

interface ManageFormProps {
  schema: z.ZodSchema<any>;
  defaultValues: any;
  fields: {
    name: string;
    label: string;
    type: "text" | "number" | "select" | "date" | "textarea" | "checkbox";
    options?: { value: string; label: string }[];
    required?: boolean;
    placeholder?: string;
    richText?: boolean;
    section?: "main" | "dates" | "maintenance" | "additional";
    width?: "full" | "half";
    isCurrencyField?: boolean;
  }[];
  onSubmit: (values: any) => void;
  isEdit?: boolean;
  onCancel?: () => void;
  isSubmitting?: boolean;
  showFileUploads?: boolean;
}

const ManageForm = ({
  schema,
  defaultValues,
  fields,
  onSubmit,
  isEdit = false,
  onCancel,
  isSubmitting = false,
  showFileUploads = false,
}: ManageFormProps) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // Group fields by section
  const mainFields = fields.filter(f => !f.section || f.section === "main");
  const dateLocationFields = fields.filter(f => f.section === "dates");
  const maintenanceFields = fields.filter(f => f.section === "maintenance");
  const additionalFields = fields.filter(f => f.section === "additional");

  const [attachReport, setAttachReport] = useState(defaultValues.attachReport || false);
  const [childIncidentReport, setChildIncidentReport] = useState(defaultValues.childIncidentReport || false);

  const handleSubmit = (values: any) => {
    const finalValues = {
      ...values,
      attachReport,
      childIncidentReport
    };
    onSubmit(finalValues);
  };

  // Determine if a field is monetary
  const isCurrencyField = (fieldName: string, fieldLabel: string): boolean => {
    return isMonetaryField(fieldName) || isMonetaryField(fieldLabel);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Main Fields */}
        <div className="space-y-4">
          {mainFields.map((field) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
              render={({ field: formField }) => (
                <FormItem className={field.width === "half" ? "" : "col-span-2"}>
                  <FormLabel>
                    {field.label} {field.required && <span className="text-destructive">*</span>}
                    {isCurrencyField(field.name, field.label) && field.type === 'number' && (
                      <span className="text-xs text-muted-foreground ml-1">(RM)</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    {field.type === "select" ? (
                      <Select
                        value={formField.value}
                        onValueChange={formField.onChange}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${field.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : field.type === "number" ? (
                      <div className={isCurrencyField(field.name, field.label) ? "relative" : ""}>
                        {isCurrencyField(field.name, field.label) && (
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">RM</span>
                          </div>
                        )}
                        <Input
                          type="number"
                          step={field.isCurrencyField ? 0.01 : 1}
                          {...formField}
                          onChange={(e) => formField.onChange(Number(e.target.value))}
                          disabled={isSubmitting}
                          placeholder={field.placeholder}
                          className={isCurrencyField(field.name, field.label) ? "pl-10" : ""}
                        />
                      </div>
                    ) : field.type === "date" ? (
                      <Input
                        type="date"
                        {...formField}
                        disabled={isSubmitting}
                      />
                    ) : field.type === "textarea" ? (
                      <Textarea
                        {...formField}
                        disabled={isSubmitting}
                        placeholder={field.placeholder}
                        className="min-h-[150px]"
                      />
                    ) : (
                      <Input {...formField} disabled={isSubmitting} placeholder={field.placeholder} />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        {/* Dates & Location Section */}
        {dateLocationFields.length > 0 && (
          <>
            <h3 className="text-sm font-medium text-muted-foreground mt-6">📅 Dates & Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dateLocationFields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>{field.label} {field.required && <span className="text-destructive">*</span>}</FormLabel>
                      <FormControl>
                        {field.type === "select" ? (
                          <Select
                            value={formField.value}
                            onValueChange={formField.onChange}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={`Select ${field.label}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options?.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : field.type === "date" ? (
                          <Input
                            type="date"
                            {...formField}
                            disabled={isSubmitting}
                          />
                        ) : (
                          <Input {...formField} disabled={isSubmitting} placeholder={field.placeholder} />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </>
        )}

        {/* Maintenance Details Section */}
        {maintenanceFields.length > 0 && (
          <>
            <h3 className="text-sm font-medium text-muted-foreground mt-6">🛠 Maintenance Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {maintenanceFields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>
                        {field.label} {field.required && <span className="text-destructive">*</span>}
                        {isCurrencyField(field.name, field.label) && field.type === 'number' && (
                          <span className="text-xs text-muted-foreground ml-1">(RM)</span>
                        )}
                      </FormLabel>
                      <FormControl>
                        {field.type === "select" ? (
                          <Select
                            value={formField.value}
                            onValueChange={formField.onChange}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={`Select ${field.label}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options?.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : field.type === "number" ? (
                          <div className={isCurrencyField(field.name, field.label) ? "relative" : ""}>
                            {isCurrencyField(field.name, field.label) && (
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500">RM</span>
                              </div>
                            )}
                            <Input
                              type="number"
                              step={field.isCurrencyField ? 0.01 : 1}
                              {...formField}
                              onChange={(e) => formField.onChange(Number(e.target.value))}
                              disabled={isSubmitting}
                              placeholder={field.placeholder}
                              className={isCurrencyField(field.name, field.label) ? "pl-10" : ""}
                            />
                          </div>
                        ) : field.type === "date" ? (
                          <Input
                            type="date"
                            {...formField}
                            disabled={isSubmitting}
                          />
                        ) : (
                          <Input {...formField} disabled={isSubmitting} placeholder={field.placeholder} />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </>
        )}

        {/* Additional Fields */}
        {additionalFields.length > 0 && (
          <>
            <h3 className="text-sm font-medium text-muted-foreground mt-6">🧾 Additional Fields</h3>
            <div className="space-y-4">
              {additionalFields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>{field.label} {field.required && <span className="text-destructive">*</span>}</FormLabel>
                      <FormControl>
                        {field.type === "textarea" ? (
                          <Textarea
                            {...formField}
                            disabled={isSubmitting}
                            placeholder={field.placeholder}
                            className="min-h-[150px]"
                          />
                        ) : (
                          <Input {...formField} disabled={isSubmitting} placeholder={field.placeholder} />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </>
        )}

        {/* File Upload Section */}
        {showFileUploads && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="attachReport" 
                checked={attachReport}
                onCheckedChange={(checked) => setAttachReport(checked as boolean)}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="attachReport"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Attach Report
                </label>
                {attachReport && (
                  <div className="flex items-center mt-2 border rounded p-2 bg-muted/30">
                    <Upload className="h-4 w-4 mr-2" />
                    <span className="text-xs text-muted-foreground">Click to upload or drag and drop</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="childIncidentReport" 
                checked={childIncidentReport}
                onCheckedChange={(checked) => setChildIncidentReport(checked as boolean)}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="childIncidentReport"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Child Incident Report
                </label>
                {childIncidentReport && (
                  <div className="flex items-center mt-2 border rounded p-2 bg-muted/30">
                    <Upload className="h-4 w-4 mr-2" />
                    <span className="text-xs text-muted-foreground">Click to upload or drag and drop</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="ml-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? "Updating..." : "Creating..."}
              </>
            ) : (
              isEdit ? "Update" : "Add Facilities"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ManageForm;
