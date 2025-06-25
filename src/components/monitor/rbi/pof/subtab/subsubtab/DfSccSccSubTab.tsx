import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useInspectionEfficiencyData } from "@/hooks/lookup/lookup-inspection-efficiency";

const DfSccSccSubTab: React.FC<{ formData: any; handleInputChange: any; handleSelectChange: any; handleRadioChange: any }> = ({ formData, handleInputChange, handleSelectChange, handleRadioChange }) => {
  const { data: inspectionEfficiencies } = useInspectionEfficiencyData();

  return (
    <div className="space-y-6">
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
            onValueChange={(value) => handleSelectChange("inspection_efficiency_id_scc_scc", parseInt(value))}
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
            type="boolean"
            value={formData?.susceptibility_scc_scc || false}
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
            value={formData?.h2s_in_water_scc_scc || 0}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="ph_scc_scc">pH</Label>
          <Input
            id="ph_scc_scc"
            name="ph_scc_scc"
            type="number"
            value={formData?.ph_scc_scc || 0}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="envseverity_scc_scc">Env Severity</Label>
          <Input
            id="envseverity_scc_scc"
            name="envseverity_scc_scc"
            type="text"
            value={formData?.envseverity_scc_scc || "Low"}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-2">
          <Label>PWHT</Label>
          <RadioGroup
            value={formData?.pwht_scc_scc ? "yes" : "no"}
            onValueChange={(value) => handleRadioChange("pwht_scc_scc", value)}
            className="flex flex-row space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="pwht_scc_scc-yes" />
              <Label htmlFor="pwht_scc_scc-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="pwht_scc_scc-no" />
              <Label htmlFor="pwht_scc_scc-no">No</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label htmlFor="hardness_brinnel_scc_scc">Hardness Brinnel SCC</Label>
          <Input
            id="hardness_brinnel_scc_scc"
            name="hardness_brinnel_scc_scc"
            type="number"
            value={formData?.hardness_brinnel_scc_scc || 0}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="ssc_sucs_f_to_ht_scc_scc">SSC Susc F to HT</Label>
          <Input
            id="ssc_sucs_f_to_ht_scc_scc"
            name="ssc_sucs_f_to_ht_scc_scc"
            type="text"
            value={formData?.ssc_sucs_f_to_ht_scc_scc || "Low"}
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
            value={formData?.svi_scc_scc || 0}
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
            value={formData?.dfsccfb_scc_scc || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="df_scc_scc_scc_scc">DF SCC</Label>
          <Input
            id="df_scc_scc_scc_scc"
            name="df_scc_scc_scc_scc"
            type="number"
            value={formData?.df_scc_scc_scc_scc || 0}
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