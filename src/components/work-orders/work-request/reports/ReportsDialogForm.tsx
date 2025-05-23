import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loading from "@/components/shared/Loading"; // Import the Loading component
import { useShutdownTypeData } from "@/hooks/lookup/lookup-shutdown-type";
import { useMaterialClassData } from "@/hooks/lookup/lookup-material-class";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ReportsDialogFormProps {
  onSubmit: (formData: any) => Promise<void>; // Assuming onSubmit is async
  onCancel: () => void;
  initialData?: any; // Optional initial data for editing
}

const ReportsDialogForm: React.FC<ReportsDialogFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const { data: shutdownTypes } = useShutdownTypeData();
  const { data: materialClasses } = useMaterialClassData();


  const [formData, setFormData] = useState({
    weather_condition: initialData?.weather_condition || "",
    visibility: initialData?.visibility || "",
    wind_speed_direction: initialData?.wind_speed_direction || "",
    sea_well: initialData?.sea_well || "",
    alarm_trigger: initialData?.alarm_trigger || "",
    shutdown_type_id: initialData?.shutdown_type_id?.id || null,
    time_failed: initialData?.time_failed || null,
    time_resume: initialData?.time_resume || null,
    shift: initialData?.shift || "",
    redundant: initialData?.redundant || "",
    other_detail: initialData?.other_detail || "",
    service_asset: initialData?.service_asset || "",
    pressure: initialData?.pressure || null,
    temp: initialData?.temp || null,
    operating_history: initialData?.operating_history || null,
    time_in_servicehr: initialData?.time_in_servicehr || null,
    material_class_id: initialData?.material_class_id?.id || null,
    design_code: initialData?.design_code || "",
  });

  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true
    try {
      await onSubmit(formData); // Wait for the onSubmit function to complete
    } finally {
      setIsLoading(false); // Set loading to false after submission
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {/* Environment Detail Section */}
          <div>
            <h3 className="text-lg font-semibold">Environment Detail</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="weather_condition">Weather Condition</Label>
                <Input
                  id="weather_condition"
                  name="weather_condition"
                  value={formData.weather_condition}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility</Label>
                <Input
                  id="visibility"
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wind_speed_direction">Wind Speed & Direction</Label>
                <Input
                  id="wind_speed_direction"
                  name="wind_speed_direction"
                  value={formData.wind_speed_direction}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sea_well">Sea Well</Label>
                <Input
                  id="sea_well"
                  name="sea_well"
                  value={formData.sea_well}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alarm_trigger">Alarm Trigger</Label>
                <Input
                  id="alarm_trigger"
                  name="alarm_trigger"
                  value={formData.alarm_trigger}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shutdown_type_id">Shutdown Type</Label>
                <Select
                  value={formData.shutdown_type_id?.toString()} // Ensure the value is a string
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, shutdown_type_id: parseInt(value) })) // Store the ID as a number
                  }
                >
                  <SelectTrigger id="shutdown_type_id" className="w-full">
                    <SelectValue
                      placeholder="Select Shutdown Type"
                      defaultValue={
                        shutdownTypes?.find((type) => type.id === formData.shutdown_type_id)?.name || ""
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {shutdownTypes?.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time_failed">Time Failed</Label>
                <Input
                  id="time_failed"
                  name="time_failed"
                  type="datetime-local"
                  value={formData.time_failed}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time_resume">Time Resume</Label>
                <Input
                  id="time_resume"
                  name="time_resume"
                  type="datetime-local"
                  value={formData.time_resume}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shift">Shift</Label>
                <Input
                  id="shift"
                  name="shift"
                  value={formData.shift}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="redundant">Redundant</Label>
                <Input
                  id="redundant"
                  name="redundant"
                  value={formData.redundant}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="other_detail">Other Detail</Label>
                <Input
                  id="other_detail"
                  name="other_detail"
                  value={formData.other_detail}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Operation Detail Section */}
          <div>
            <h3 className="text-lg font-semibold">Operation Detail</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="service_asset">Service Asset</Label>
                <Input
                  id="service_asset"
                  name="service_asset"
                  value={formData.service_asset}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pressure">Pressure</Label>
                <Input
                  id="pressure"
                  name="pressure"
                  type="number"
                  value={formData.pressure}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temp">Temperature</Label>
                <Input
                  id="temp"
                  name="temp"
                  type="number"
                  value={formData.temp}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="operating_history">Operating History</Label>
                <Input
                  id="operating_history"
                  name="operating_history"
                  type="number"
                  value={formData.operating_history}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time_in_servicehr">Time in Service (Hours)</Label>
                <Input
                  id="time_in_servicehr"
                  name="time_in_servicehr"
                  type="number"
                  value={formData.time_in_servicehr}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="material_class_id">Material Class</Label>
                <Select
                  value={formData.material_class_id?.toString()} // Ensure the value is a string
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, material_class_id: parseInt(value) })) // Store the ID as a number
                  }
                >
                  <SelectTrigger id="material_class_id" className="w-full">
                    <SelectValue
                      placeholder="Select Material Class"
                      defaultValue={
                        materialClasses?.find((material) => material.id === formData.material_class_id)?.name || ""
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {materialClasses?.map((material) => (
                      <SelectItem key={material.id} value={material.id.toString()}>
                        {material.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="design_code">Design Code</Label>
                <Input
                  id="design_code"
                  name="design_code"
                  value={formData.design_code}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </>
      )}
    </form>
  );
};

export default ReportsDialogForm;