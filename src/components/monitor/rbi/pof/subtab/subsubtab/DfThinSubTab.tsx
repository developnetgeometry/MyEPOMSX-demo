import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDataConfidenceData } from "@/hooks/lookup/lookup-data-confidence";

const DfThinSubTab: React.FC<{ formData: any; handleInputChange: any; handleSelectChange: any }> = ({ formData, handleInputChange, handleSelectChange }) => {
  const { data: dataConfidences } = useDataConfidenceData();
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>
          <Label htmlFor="last_inspection_date_thin">Last Inspection Date</Label>
          <Input
            id="last_inspection_date_thin"
            name="last_inspection_date_thin"
            type="date"
            value={formData?.last_inspection_date_thin || ""}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="data_confidence_id_thin">Data Confidence</Label>
          <Select
            value={formData?.data_confidence_id_thin?.toString() || ""}
            onValueChange={(value) => handleSelectChange("data_confidence_id_thin", parseInt(value))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Data Confidence" />
            </SelectTrigger>
            <SelectContent>
              {dataConfidences?.map((confidence) => (
                <SelectItem key={confidence.id} value={confidence.id.toString()}>
                  {confidence.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="current_thickness_thin">Current thickness (mm)</Label>
          <Input
            id="current_thickness_thin"
            name="current_thickness_thin"
            type="number"
            step="any"
            value={formData?.current_thickness_thin || ""}
            onChange={handleInputChange}
            className="mt-1"
            placeholder="Enter current thickness"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        <div>
          <Label htmlFor="agetk_thin">Age Tk (year)</Label>
          <Input
            id="agetk_thin"
            name="agetk_thin"
            type="number"
            value={formatNumber(formData?.agetk_thin) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="agerc_thin">Age Rc (year)</Label>
          <Input
            id="agerc_thin"
            name="agerc_thin"
            type="date"
            value={formData?.agerc_thin || ""}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="crexp_thin">Cr Exp</Label>
          <Input
            id="crexp_thin"
            name="crexp_thin"
            type="number"
            value={formatNumber(formData?.crexp_thin) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="cract_thin">Cr Act</Label>
          <Input
            id="cract_thin"
            name="cract_thin"
            type="number"
            step="any"
            value={formData?.cract_thin || ""}
            onChange={handleInputChange}
            className="mt-1"
            placeholder="Enter Cr Act"
          />
        </div>
        <div>
          <Label htmlFor="crcm_thin">Cr Cm</Label>
          <Input
            id="crcm_thin"
            name="crcm_thin"
            type="number"
            value={formatNumber(formData?.crcm_thin) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div>
          <Label htmlFor="ca_thin">CA (mm)</Label>
          <Input
            id="ca_thin"
            name="ca_thin"
            type="number"
            value={formatNumber(formData?.ca_thin) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="art_thin">Art</Label>
          <Input
            id="art_thin"
            name="art_thin"
            type="number"
            value={formatNumber(formData?.art_thin) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="fsthin_thin">FS Thin</Label>
          <Input
            id="fsthin_thin"
            name="fsthin_thin"
            type="number"
            value={formatNumber(formData?.fsthin_thin) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>

        <div>
          <Label htmlFor="srthin_thin">SR Thin</Label>
          <Input
            id="srthin_thin"
            name="srthin_thin"
            type="number"
            value={formatNumber(formData?.srthin_thin) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div>
          <Label htmlFor="nthin_a_thin">NThin A</Label>
          <Input
            id="nthin_a_thin"
            name="nthin_a_thin"
            type="number"
            step="any"
            value={formData?.nthin_a_thin || ""}
            onChange={handleInputChange}
            className="mt-1"
            placeholder="Enter NThin A"
          />
        </div>
        <div>
          <Label htmlFor="nthin_b_thin">NThin B</Label>
          <Input
            id="nthin_b_thin"
            name="nthin_b_thin"
            type="number"
            step="any"
            value={formData?.nthin_b_thin || ""}
            onChange={handleInputChange}
            className="mt-1"
            placeholder="Enter NThin B"
          />
        </div>
        <div>
          <Label htmlFor="nthin_c_thin">NThin C</Label>
          <Input
            id="nthin_c_thin"
            name="nthin_c_thin"
            type="number"
            step="any"
            value={formData?.nthin_c_thin || ""}
            onChange={handleInputChange}
            className="mt-1"
            placeholder="Enter NThin C"
          />
        </div>
        <div>
          <Label htmlFor="nthin_d_thin">NThin D</Label>
          <Input
            id="nthin_d_thin"
            name="nthin_d_thin"
            type="number"
            step="any"
            value={formData?.nthin_d_thin || ""}
            onChange={handleInputChange}
            className="mt-1"
            placeholder="Enter NThin D"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>
          <Label htmlFor="ithin1_thin">IThin 1</Label>
          <Input
            id="ithin1_thin"
            name="ithin1_thin"
            type="number"
            value={formatNumber(formData?.ithin1_thin) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="ithin2_thin">IThin 2</Label>
          <Input
            id="ithin2_thin"
            name="ithin2_thin"
            type="number"
            value={formatNumber(formData?.ithin2_thin) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="ithin3_thin">IThin 3</Label>
          <Input
            id="ithin3_thin"
            name="ithin3_thin"
            type="number"
            value={formatNumber(formData?.ithin3_thin) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>
          <Label htmlFor="pothin1_thin">PoThin 1</Label>
          <Input
            id="pothin1_thin"
            name="pothin1_thin"
            type="number"
            value={formatNumber(formData?.pothin1_thin) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="pothin2_thin">PoThin 2</Label>
          <Input
            id="pothin2_thin"
            name="pothin2_thin"
            type="number"
            value={formatNumber(formData?.pothin2_thin) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="pothin3_thin">PoThin 3</Label>
          <Input
            id="pothin3_thin"
            name="pothin3_thin"
            type="number"
            value={formatNumber(formData?.pothin3_thin) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>
          <Label htmlFor="bthin1_thin">BThin 1</Label>
          <Input
            id="bthin1_thin"
            name="bthin1_thin"
            type="number"
            value={formatNumber(formData?.bthin1_thin) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="bthin2_thin">BThin 2</Label>
          <Input
            id="bthin2_thin"
            name="bthin2_thin"
            type="number"
            value={formatNumber(formData?.bthin2_thin) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="bthin3_thin">BThin 3</Label>
          <Input
            id="bthin3_thin"
            name="bthin3_thin"
            type="number"
            value={formatNumber(formData?.bthin3_thin) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <Label htmlFor="dfthinfb_thin">DFThinFB</Label>
          <Input
            id="dfthinfb_thin"
            name="dfthinfb_thin"
            type="number"
            value={formatNumber(formData?.dfthinfb_thin) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="dfthinf_thin">DFThinF</Label>
          <Input
            id="dfthinf_thin"
            name="dfthinf_thin"
            type="number"
            value={formatNumber(formData?.dfthinf_thin) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default DfThinSubTab;