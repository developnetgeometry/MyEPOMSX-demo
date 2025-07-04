import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCoatingQualityData } from "@/hooks/lookup/lookup-coating-quality";
import { useExtEnvData } from "@/hooks/lookup/lookup-ext-env";
import { useInspectionEfficiencyData } from "@/hooks/lookup/lookup-inspection-efficiency";

const DfExtClssSubTab: React.FC<{ formData: any; handleInputChange: any; handleSelectChange: any }> = ({ formData, handleInputChange, handleSelectChange }) => {
  const { data: coatingQualities } = useCoatingQualityData();
  const { data: extEnvs } = useExtEnvData();
  const { data: inspectionEfficiencies } = useInspectionEfficiencyData();
  const [precision, setPrecision] = useState<2 | 8>(2);

  const formatNumber = (val: number | null) => {
    if (val === null || val === undefined) return "";
    return parseFloat(Number(val).toFixed(precision)).toString();
  };


  return (
    <div className="space-y-6">
      {/* Toggle precision */}
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => setPrecision((prev) => (prev === 2 ? 8 : 2))}
          variant="outline"
          size="sm"
        >
          Accuracy: {precision} decimals
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
        <div>
          <Label htmlFor="coating_quality_id_ext_clscc">Coating Quality</Label>
          <Select
            value={formData?.coating_quality_id_ext_clscc?.toString() || ""}
            onValueChange={(value) => handleSelectChange("coating_quality_id_ext_clscc", parseInt(value))}
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div>
          <Label htmlFor="agecrack_ext_clscc">Age Crack</Label>
          <Input
            id="agecrack_ext_clscc"
            name="agecrack_ext_clscc"
            type="number"
            value={formatNumber(formData?.agecrack_ext_clscc) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="agecoat_ext_clscc">Age Coat</Label>
          <Input
            id="agecoat_ext_clscc"
            name="agecoat_ext_clscc"
            type="number"
            value={formatNumber(formData?.agecoat_ext_clscc) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="coatadj_ext_clscc">Coat Adj</Label>
          <Input
            id="coatadj_ext_clscc"
            name="coatadj_ext_clscc"
            type="number"
            value={formatNumber(formData?.coatadj_ext_clscc) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="age_ext_clscc">Age</Label>
          <Input
            id="age_ext_clscc"
            name="age_ext_clscc"
            type="number"
            value={formatNumber(formData?.age_ext_clscc) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <Label htmlFor="external_environment_id_ext_clscc">External Environment</Label>
          <Select
            value={formData?.external_environment_id_ext_clscc?.toString() || ""}
            onValueChange={(value) => handleSelectChange("external_environment_id_ext_clscc", parseInt(value))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select External Environment" />
            </SelectTrigger>
            <SelectContent>
              {extEnvs?.map((extEnv) => (
                <SelectItem key={extEnv.id} value={extEnv.id.toString()}>
                  {extEnv.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="inspection_efficiency_id_ext_clscc">Inspection Efficiency</Label>
          <Select
            value={formData?.inspection_efficiency_id_ext_clscc?.toString() || ""}
            onValueChange={(value) => {
              const selectedEfficiency = inspectionEfficiencies?.find(
                (inspect) => inspect.id.toString() === value
              );
              handleSelectChange("inspection_efficiency_id_ext_clscc", parseInt(value));
              handleSelectChange("inspection_efficiency_name_ext_clscc", selectedEfficiency?.name || "");
            }}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Inspection Efficiency" />
            </SelectTrigger>
            <SelectContent>
              {inspectionEfficiencies?.map((inspect) => (
                <SelectItem key={inspect.id} value={inspect.id.toString()}>
                  {inspect.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div>
          <Label htmlFor="ext_cl_scc_susc_ext_clscc">ExtC CL SCC Susc</Label>
          <Input
            id="ext_cl_scc_susc_ext_clscc"
            name="ext_cl_scc_susc_ext_clscc"
            type="text"
            value={formData?.ext_cl_scc_susc_ext_clscc || ""}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="svi_ext_clscc">SVI</Label>
          <Input
            id="svi_ext_clscc"
            name="svi_ext_clscc"
            type="number"
            value={formatNumber(formData?.svi_ext_clscc) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="df_ext_cl_scc_fb_ext_clscc">DF Ext CL SCC FB</Label>
          <Input
            id="df_ext_cl_scc_fb_ext_clscc"
            name="df_ext_cl_scc_fb_ext_clscc"
            type="number"
            value={formatNumber(formData?.df_ext_cl_scc_fb_ext_clscc) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="df_ext_cl_scc_ext_clscc">DF Ext CL SCC</Label>
          <Input
            id="df_ext_cl_scc_ext_clscc"
            name="df_ext_cl_scc_ext_clscc"
            type="number"
            value={formatNumber(formData?.df_ext_cl_scc_ext_clscc) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default DfExtClssSubTab;