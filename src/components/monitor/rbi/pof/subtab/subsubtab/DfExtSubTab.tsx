import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDataConfidenceData } from "@/hooks/lookup/lookup-data-confidence";
import { useExtEnvData } from "@/hooks/lookup/lookup-ext-env";

const DfExtSubTab: React.FC<{ formData: any; handleInputChange: any; handleSelectChange: any; handleRadioChange: any }> = ({ formData, handleInputChange, handleSelectChange, handleRadioChange }) => {
  const { data: dataConfidences } = useDataConfidenceData();
  const { data: extEnvs } = useExtEnvData();
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div>
          <Label htmlFor="last_inspection_date_ext">Last Inspection Date</Label>
          <Input
            id="last_inspection_date_ext"
            name="last_inspection_date_ext"
            type="date"
            value={formData?.last_inspection_date_ext || ""}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="new_coating_date_ext">New Coating Date</Label>
          <Input
            id="new_coating_date_ext"
            name="new_coating_date_ext"
            type="date"
            value={formData?.new_coating_date_ext || ""}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="data_confidence_id_ext">Data Confidence</Label>
          <Select
            value={formData?.data_confidence_id_ext?.toString() || ""}
            onValueChange={(value) => handleSelectChange("data_confidence_id_ext", parseInt(value))}
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
          <Label htmlFor="current_thickness_ext">Current thickness (mm)</Label>
          <Input
            id="current_thickness_ext"
            name="current_thickness_ext"
            type="number"
            step="any"
            value={formData?.current_thickness_ext || ""}
            onChange={handleInputChange}
            className="mt-1"
            placeholder="Enter Current Thickness"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div>
          <Label htmlFor="agetk_ext">Age Tk (year)</Label>
          <Input
            id="agetk_ext"
            name="agetk_ext"
            type="number"
            value={formatNumber(formData?.agetk_ext) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="agecoat_ext">Age Coat (year)</Label>
          <Input
            id="agecoat_ext"
            name="agecoat_ext"
            type="number"
            value={formatNumber(formData?.agecoat_ext) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="coatadj_ext">Coat Adj</Label>
          <Input
            id="coatadj_ext"
            name="coatadj_ext"
            type="number"
            value={formatNumber(formData?.coatadj_ext) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="age_ext">Age</Label>
          <Input
            id="age_ext"
            name="age_ext"
            type="number"
            value={formatNumber(formData?.age_ext) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        <div>
          <Label htmlFor="crexp_ext">CR Exp</Label>
          <Input
            id="crexp_ext"
            name="crexp_ext"
            type="number"
            value={formatNumber(formData?.crexp_ext) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="cract_ext">CR Act</Label>
          <Input
            id="cract_ext"
            name="cract_ext"
            type="number"
            value={formatNumber(formData?.cract_ext) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="art_ext">Art</Label>
          <Input
            id="art_ext"
            name="art_ext"
            type="number"
            value={formatNumber(formData?.art_ext) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="fsextcorr_ext">FS Ext Corr</Label>
          <Input
            id="fsextcorr_ext"
            name="fsextcorr_ext"
            type="number"
            value={formatNumber(formData?.fsextcorr_ext) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="srextcorr_ext">SR Ext Corr</Label>
          <Input
            id="srextcorr_ext"
            name="srextcorr_ext"
            type="number"
            value={formatNumber(formData?.srextcorr_ext) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div>
          <Label htmlFor="nextcorra_ext">NExt Corr A</Label>
          <Input
            id="nextcorra_ext"
            name="nextcorra_ext"
            type="number"
            step="any"
            value={formData?.nextcorra_ext || ""}
            onChange={handleInputChange}
            className="mt-1"
            placeholder="Enter NExt Corr A"
          />
        </div>
        <div>
          <Label htmlFor="nextcorrb_ext">NExt Corr B</Label>
          <Input
            id="nextcorrb_ext"
            name="nextcorrb_ext"
            type="number"
            step="any"
            value={formData?.nextcorrb_ext || ""}
            onChange={handleInputChange}
            className="mt-1"
            placeholder="Enter NExt Corr B"
          />
        </div>
        <div>
          <Label htmlFor="nextcorrc_ext">NExt Corr C</Label>
          <Input
            id="nextcorrc_ext"
            name="nextcorrc_ext"
            type="number"
            step="any"
            value={formData?.nextcorrc_ext || ""}
            onChange={handleInputChange}
            className="mt-1"
            placeholder="Enter NExt Corr C"
          />
        </div>
        <div>
          <Label htmlFor="nextcorrd_ext">NExt Corr D</Label>
          <Input
            id="nextcorrd_ext"
            name="nextcorrd_ext"
            type="number"
            step="any"
            value={formData?.nextcorrd_ext || ""}
            onChange={handleInputChange}
            className="mt-1"
            placeholder="Enter NExt Corr D"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>
          <Label htmlFor="iextcorr1_ext">IExt Corr 1</Label>
          <Input
            id="iextcorr1_ext"
            name="iextcorr1_ext"
            type="number"
            value={formatNumber(formData?.iextcorr1_ext) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="iextcorr2_ext">IExt Corr 2</Label>
          <Input
            id="iextcorr2_ext"
            name="iextcorr2_ext"
            type="number"
            value={formatNumber(formData?.iextcorr2_ext) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="iextcorr3_ext">IExt Corr 3</Label>
          <Input
            id="iextcorr3_ext"
            name="iextcorr3_ext"
            type="number"
            value={formatNumber(formData?.iextcorr3_ext) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>
          <Label htmlFor="poextcorrp1_ext">PoExt Corrp 1</Label>
          <Input
            id="poextcorrp1_ext"
            name="poextcorrp1_ext"
            type="number"
            value={formatNumber(formData?.poextcorrp1_ext) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="poextcorrp2_ext">PoExt Corrp 2</Label>
          <Input
            id="poextcorrp2_ext"
            name="poextcorrp2_ext"
            type="number"
            value={formatNumber(formData?.poextcorrp2_ext) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="poextcorrp3_ext">PoExt Corrp 3</Label>
          <Input
            id="poextcorrp3_ext"
            name="poextcorrp3_ext"
            type="number"
            value={formatNumber(formData?.poextcorrp3_ext) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>
          <Label htmlFor="bextcorpp1_ext">BExt Corrp 1</Label>
          <Input
            id="bextcorpp1_ext"
            name="bextcorpp1_ext"
            type="number"
            value={formatNumber(formData?.bextcorpp1_ext) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="bextcorpp2_ext">BExt Corrp 2</Label>
          <Input
            id="bextcorpp2_ext"
            name="bextcorpp2_ext"
            type="number"
            value={formatNumber(formData?.bextcorpp2_ext) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="bextcorpp3_ext">BExt Corrp 3</Label>
          <Input
            id="bextcorpp3_ext"
            name="bextcorpp3_ext"
            type="number"
            value={formatNumber(formData?.bextcorpp3_ext) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
        <div>
          <Label htmlFor="dfextcorrf_ext">DFExtCorrF</Label>
          <Input
            id="dfextcorrf_ext"
            name="dfextcorrf_ext"
            type="number"
            value={formatNumber(formData?.dfextcorrf_ext) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default DfExtSubTab;