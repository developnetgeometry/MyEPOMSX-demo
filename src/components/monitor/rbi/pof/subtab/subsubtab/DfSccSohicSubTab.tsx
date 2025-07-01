import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useInspectionEfficiencyData } from "@/hooks/lookup/lookup-inspection-efficiency";
import { useSteelsContentData } from "@/hooks/lookup/lookup-steels-content";
import { useOnlineMonitorDfSccSohicData } from "@/hooks/lookup/lookup-online-monitor-df-scc-sohic";

const DfSccSohicSubTab: React.FC<{ formData: any; handleInputChange: any; handleSelectChange: any; handleRadioChange: any }> = ({ formData, handleInputChange, handleSelectChange, handleRadioChange }) => {
  const { data: inspectionEfficiencies } = useInspectionEfficiencyData();
  const { data: steelsContents } = useSteelsContentData();
  const { data: onlineMonitorDfSccSohics } = useOnlineMonitorDfSccSohicData();
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
          <Label htmlFor="last_inspection_date_scc_sohic">Last Inspection Date</Label>
          <Input
            id="last_inspection_date_scc_sohic"
            name="last_inspection_date_scc_sohic"
            type="date"
            value={formData?.last_inspection_date_scc_sohic || ""}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="inspection_efficiency_id_scc_sohic">Inspection Efficiency</Label>
          <Select
            value={formData?.inspection_efficiency_id_scc_sohic?.toString() || ""}
            onValueChange={(value) => {
              const selectedEfficiency = inspectionEfficiencies?.find(
                (efficiency) => efficiency.id.toString() === value
              );
              handleSelectChange("inspection_efficiency_id_scc_sohic", parseInt(value));
              handleSelectChange("inspection_efficiency_name_scc_sohic", selectedEfficiency?.name || "");
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
          <Label htmlFor="susceptibility_scc_sohic">Susceptibility</Label>
          <Input
            id="susceptibility_scc_sohic"
            name="susceptibility_scc_sohic"
            value={formData?.susceptibility_scc_sohic || ""}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="h2s_in_water_scc_sohic">H2S In Water</Label>
          <Input
            id="h2s_in_water_scc_sohic"
            name="h2s_in_water_scc_sohic"
            type="number"
            step="any"
            value={formData?.h2s_in_water_scc_sohic || ""}
            onChange={handleInputChange}
            className="mt-1"
            placeholder="Enter H2S in Water"
          />
        </div>
        <div>
          <Label htmlFor="ph_scc_sohic">pH</Label>
          <Input
            id="ph_scc_sohic"
            name="ph_scc_sohic"
            type="number"
            step="any"
            value={formData?.ph_scc_sohic || ""}
            onChange={handleInputChange}
            className="mt-1"
            placeholder="Enter pH value"
          />
        </div>
        <div>
          <Label htmlFor="envseverity_scc_sohic">Env Severity</Label>
          <Input
            id="envseverity_scc_sohic"
            name="envseverity_scc_sohic"
            type="text"
            value={formData?.envseverity_scc_sohic || ""}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <Label htmlFor="steelscontent_id_scc_sohic">Steel S Content</Label>
          <Select
            value={formData?.steelscontent_id_scc_sohic?.toString() || ""}
            onValueChange={(value) => handleSelectChange("steelscontent_id_scc_sohic", parseInt(value))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Steels S Content" />
            </SelectTrigger>
            <SelectContent>
              {steelsContents?.map((steel) => (
                <SelectItem key={steel.id} value={steel.id.toString()}>
                  {steel.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="sucs_to_crack_scc_sohic">Susc To Crack</Label>
          <Input
            id="sucs_to_crack_scc_sohic"
            name="sucs_to_crack_scc_sohic"
            type="text"
            value={formData?.sucs_to_crack_scc_sohic || ""}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="svi_scc_sohic">SVI</Label>
          <Input
            id="svi_scc_sohic"
            name="svi_scc_sohic"
            type="number"
            value={formatNumber(formData?.svi_scc_sohic) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="online_monitor_id_scc_sohic">Online Monitor</Label>
          <Select
            value={formData?.online_monitor_id_scc_sohic?.toString() || ""}
            onValueChange={(value) => {
              const selectedMonitor = onlineMonitorDfSccSohics?.find(
                (monitor) => monitor.id.toString() === value
              );
              handleSelectChange("online_monitor_id_scc_sohic", parseInt(value));
              handleSelectChange("online_monitor_value_scc_sohic", selectedMonitor?.value || 0);
            }}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Online Monitor" />
            </SelectTrigger>
            <SelectContent>
              {onlineMonitorDfSccSohics?.map((monitor) => (
                <SelectItem key={monitor.id} value={monitor.id.toString()}>
                  {monitor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="dfsohicfb_scc_sohic">DF SOHIC FB</Label>
          <Input
            id="dfsohicfb_scc_sohic"
            name="dfsohicfb_scc_sohic"
            type="number"
            value={formatNumber(formData?.dfsohicfb_scc_sohic) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="dfscc_sohic_scc_sohic">DF SCC SOHIC</Label>
          <Input
            id="dfscc_sohic_scc_sohic"
            name="dfscc_sohic_scc_sohic"
            type="number"
            value={formatNumber(formData?.dfscc_sohic_scc_sohic) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default DfSccSohicSubTab;