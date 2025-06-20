import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCoatingQualityData } from "@/hooks/lookup/lookup-coating-quality";

const DfExtClssSubTab: React.FC<{ formData: any; handleInputChange: any; handleSelectChange: any }> = ({ formData, handleInputChange, handleSelectChange }) => {
  const { data: coatingQualities } = useCoatingQualityData();


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <Label htmlFor="last_inspection_date_ext_clscc">Last Inspection Date</Label>
          <Input
            id="last_inspection_date_ext_clscc"
            name="last_inspection_date_ext_clscc"
            type="date"
            value={formData?.last_inspection_date_ext_clscc || ""}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="new_coating_date_ext_clscc">New Coating Date</Label>
          <Input
            id="new_coating_date_ext_clscc"
            name="new_coating_date_ext_clscc"
            type="date"
            value={formData?.new_coating_date_ext_clscc || ""}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <Label htmlFor="coating_quality_id">Coating Quality</Label>
          <Select
            value={formData?.coating_quality_id?.toString() || ""}
            onValueChange={(value) => handleSelectChange("coating_quality_id", parseInt(value))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Coating Quality" />
            </SelectTrigger>
            <SelectContent>
              {coatingQualities?.map((quality) => (
                <SelectItem key={quality.id} value={quality.id.toString()}>
                  {quality.name} - {quality.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default DfExtClssSubTab;