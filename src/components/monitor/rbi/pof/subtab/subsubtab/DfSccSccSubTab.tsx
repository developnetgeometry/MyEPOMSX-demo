import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useInspectionEfficiencyData } from "@/hooks/lookup/lookup-inspection-efficiency";

const DfSccSccSubTab: React.FC<{ formData: any; handleInputChange: any; handleSelectChange: any; handleRadioChange: any }> = ({ formData, handleInputChange, handleSelectChange, handleRadioChange }) => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="last_inspection_date_scc_scc">Last Inspection Date</Label>
          <Input
            id="last_inspection_date_scc_scc"
            name="last_inspection_date_scc_scc"
            type="date"
            value={formData?.last_inspection_date_scc_scc || ""}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="inspection_efficiency_id_scc_scc">Inspection Efficiency</Label>
          <Select
            value={formData?.inspection_efficiency_id_scc_scc?.toString() || ""}
            onValueChange={(value) => {
              const selectedEfficiency = inspectionEfficiencies?.find(
                (efficiency) => efficiency.id.toString() === value
              );
              handleSelectChange("inspection_efficiency_id_scc_scc", parseInt(value));
              handleSelectChange("inspection_efficiency_name_scc_scc", selectedEfficiency?.name || "");
            }}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Inspection Efficiency" />
            </SelectTrigger>
            <SelectContent>
              {inspectionEfficiencies?.map((efficiency) => (
                <SelectItem key={efficiency.id} value={efficiency.id.toString()}>
                  {efficiency.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <Label htmlFor="susceptibility_scc_scc">Susceptibility</Label>
          <Input
            id="susceptibility_scc_scc"
            name="susceptibility_scc_scc"
            value={formData?.susceptibility_scc_scc || ""}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="h2s_in_water_scc_scc">H2S In Water</Label>
          <Input
            id="h2s_in_water_scc_scc"
            name="h2s_in_water_scc_scc"
            type="number"
            step="any"
            value={formData?.h2s_in_water_scc_scc || ""}
            onChange={handleInputChange}
            className="mt-1"
            placeholder="Enter H2S in Water"
          />
        </div>
        <div>
          <Label htmlFor="ph_scc_scc">pH</Label>
          <Input
            id="ph_scc_scc"
            name="ph_scc_scc"
            type="number"
            step="any"
            value={formData?.ph_scc_scc || ""}
            onChange={handleInputChange}
            className="mt-1"
            placeholder="Enter pH"
          />
        </div>
        <div>
          <Label htmlFor="envseverity_scc_scc">Env Severity</Label>
          <Input
            id="envseverity_scc_scc"
            name="envseverity_scc_scc"
            type="text"
            value={formData?.envseverity_scc_scc || ""}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="hardness_brinnel_scc_scc">Hardness Brinnel SCC</Label>
          <Input
            id="hardness_brinnel_scc_scc"
            name="hardness_brinnel_scc_scc"
            type="number"
            step="any"
            value={formData?.hardness_brinnel_scc_scc || ""}
            onChange={handleInputChange}
            className="mt-1"
            placeholder="Enter Hardness Brinnel"
          />
        </div>
        <div>
          <Label htmlFor="ssc_sucs_f_to_ht_scc_scc">SSC Susc F to HT</Label>
          <Input
            id="ssc_sucs_f_to_ht_scc_scc"
            name="ssc_sucs_f_to_ht_scc_scc"
            type="text"
            value={formData?.ssc_sucs_f_to_ht_scc_scc || ""}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="svi_scc_scc">SVI</Label>
          <Input
            id="svi_scc_scc"
            name="svi_scc_scc"
            type="number"
            value={formatNumber(formData?.svi_scc_scc) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="dfsccfb_scc_scc">DF SCC FB</Label>
          <Input
            id="dfsccfb_scc_scc"
            name="dfsccfb_scc_scc"
            type="number"
            value={formatNumber(formData?.dfsccfb_scc_scc) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="df_scc_scc_scc_scc">DF SCC SCC</Label>
          <Input
            id="df_scc_scc_scc_scc"
            name="df_scc_scc_scc_scc"
            type="number"
            value={formatNumber(formData?.df_scc_scc_scc_scc) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default DfSccSccSubTab;