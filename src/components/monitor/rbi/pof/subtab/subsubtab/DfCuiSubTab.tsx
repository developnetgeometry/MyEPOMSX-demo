import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCoatingQualityData } from "@/hooks/lookup/lookup-coating-quality";
import { useExtEnvData } from "@/hooks/lookup/lookup-ext-env";
import { useDataConfidenceData } from "@/hooks/lookup/lookup-data-confidence";
import { useInsulationTypeData } from "@/hooks/lookup/lookup-insulation-type";
import { useInsulationComplexityData } from "@/hooks/lookup/lookup-insulation-complexity";
import { useInsulationConditionData } from "@/hooks/lookup/lookup-insulation-condition";
import { useDesignFabricationData } from "@/hooks/lookup/lookup-design-fabrication";
import { useInterfaceData } from "@/hooks/lookup/lookup-interface";

const DfCuiSubTab: React.FC<{ formData: any; handleInputChange: any; handleSelectChange: any }> = ({ formData, handleInputChange, handleSelectChange }) => {
  const { data: coatingQualities } = useCoatingQualityData();
  const { data: extEnvs } = useExtEnvData();
  const { data: dataConfidences } = useDataConfidenceData();
  const { data: insulationTypes } = useInsulationTypeData();
  const { data: insulationComplexities } = useInsulationComplexityData();
  const { data: insulationConditions } = useInsulationConditionData();
  const { data: designFabrications } = useDesignFabricationData();
  const { data: interfaces } = useInterfaceData();
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <Label htmlFor="last_inspection_date_cui">Last Inspection Date</Label>
          <Input
            id="last_inspection_date_cui"
            name="last_inspection_date_cui"
            type="date"
            value={formData?.last_inspection_date_cui || ""}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="new_coating_date_cui">New Coating Date</Label>
          <Input
            id="new_coating_date_cui"
            name="new_coating_date_cui"
            type="date"
            value={formData?.new_coating_date_cui || ""}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="coating_quality_id_cui">Coating Quality</Label>
          <Select
            value={formData?.coating_quality_id_cui?.toString() || ""}
            onValueChange={(value) => handleSelectChange("coating_quality_id_cui", parseInt(value))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Coating Quality" />
            </SelectTrigger>
            <SelectContent>
              {coatingQualities?.map((coating) => (
                <SelectItem key={coating.id} value={coating.id.toString()}>
                  {coating.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="current_thickness_cui">Current Thickness (mm)</Label>
          <Input
            id="current_thickness_cui"
            name="current_thickness_cui"
            type="number"
            step="any"
            value={formData?.current_thickness_cui ?? ""}
            onChange={handleInputChange}
            className="mt-1"
            placeholder="Enter Current Thickness (mm)"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <Label htmlFor="agetk_cui">Age Tk (year)</Label>
          <Input
            id="agetk_cui"
            name="agetk_cui"
            type="number"
            value={formatNumber(formData?.agetk_cui) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="agecoat_cui">Age Coat (year)</Label>
          <Input
            id="agecoat_cui"
            name="agecoat_cui"
            type="number"
            value={formatNumber(formData?.agecoat_cui) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="coatadj_cui">Coat Adj</Label>
          <Input
            id="coatadj_cui"
            name="coatadj_cui"
            type="number"
            value={formatNumber(formData?.coatadj_cui) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="age_cui">Age</Label>
          <Input
            id="age_cui"
            name="age_cui"
            type="number"
            value={formatNumber(formData?.age_cui) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="external_environment_id_cui">External Environment</Label>
          <Select
            value={formData?.external_environment_id_cui?.toString() || ""}
            onValueChange={(value) => handleSelectChange("external_environment_id_cui", parseInt(value))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select External Environment" />
            </SelectTrigger>
            <SelectContent>
              {extEnvs?.map((env) => (
                <SelectItem key={env.id} value={env.id.toString()}>
                  {env.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="data_confidence_id_cui">Data Confidence</Label>
          <Select
            value={formData?.data_confidence_id_cui?.toString() || ""}
            onValueChange={(value) => handleSelectChange("data_confidence_id_cui", parseInt(value))}
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
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div>
          <Label htmlFor="crexp_cui">CR Exp</Label>
          <Input
            id="crexp_cui"
            name="crexp_cui"
            type="number"
            value={formatNumber(formData?.crexp_cui) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="cract_cui">CR Act</Label>
          <Input
            id="cract_cui"
            name="cract_cui"
            type="number"
            step="any"
            value={formData?.cract_cui ?? ""}
            onChange={handleInputChange}
            className="mt-1"
            placeholder="Enter CR Act"
          />
        </div>
        <div>
          <Label htmlFor="art_cui">Art</Label>
          <Input
            id="art_cui"
            name="art_cui"
            type="number"
            value={formatNumber(formData?.art_cui) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="fscuif_cui">FS CUIF</Label>
          <Input
            id="fscuif_cui"
            name="fscuif_cui"
            type="number"
            value={formatNumber(formData?.fscuif_cui) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="srcuif_cui">SR CUIF</Label>
          <Input
            id="srcuif_cui"
            name="srcuif_cui"
            type="number"
            value={formatNumber(formData?.srcuif_cui) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <Label htmlFor="ncuifa_cui">NCUIF A</Label>
          <Input
            id="ncuifa_cui"
            name="ncuifa_cui"
            type="number"
            step="any"
            value={formData?.ncuifa_cui || ""}
            onChange={handleInputChange}
            className="mt-1"
            placeholder="Enter NCUIF A"
          />
        </div>
        <div>
          <Label htmlFor="ncuifb_cui">NCUIF B</Label>
          <Input
            id="ncuifb_cui"
            name="ncuifb_cui"
            type="number"
            step="any"
            value={formData?.ncuifb_cui || ""}
            onChange={handleInputChange}
            className="mt-1"
            placeholder="Enter NCUIF B"
          />
        </div>
        <div>
          <Label htmlFor="ncuifc_cui">NCUIF C</Label>
          <Input
            id="ncuifc_cui"
            name="ncuifc_cui"
            type="number"
            step="any"
            value={formData?.ncuifc_cui || ""}
            onChange={handleInputChange}
            className="mt-1"
            placeholder="Enter NCUIF C"
          />
        </div>
        <div>
          <Label htmlFor="ncuifd_cui">NCUIF D</Label>
          <Input
            id="ncuifd_cui"
            name="ncuifd_cui"
            type="number"
            step="any"
            value={formData?.ncuifd_cui || ""}
            onChange={handleInputChange}
            className="mt-1"
            placeholder="Enter NCUIF D"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="icuif1_cui">ICUIF 1</Label>
          <Input
            id="icuif1_cui"
            name="icuif1_cui"
            type="number"
            value={formatNumber(formData?.icuif1_cui) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="icuif2_cui">ICUIF 2</Label>
          <Input
            id="icuif2_cui"
            name="icuif2_cui"
            type="number"
            value={formatNumber(formData?.icuif2_cui) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="icuif3_cui">ICUIF 3</Label>
          <Input
            id="icuif3_cui"
            name="icuif3_cui"
            type="number"
            value={formatNumber(formData?.icuif3_cui) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>

      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="pociufp1_cui">PoCIUF P1</Label>
          <Input
            id="pociufp1_cui"
            name="pociufp1_cui"
            type="number"
            value={formatNumber(formData?.pociufp1_cui) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="pociufp2_cui">PoCIUF P2</Label>
          <Input
            id="pociufp2_cui"
            name="pociufp2_cui"
            type="number"
            value={formatNumber(formData?.pociufp2_cui) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="pociufp3_cui">PoCIUF P3</Label>
          <Input
            id="pociufp3_cui"
            name="pociufp3_cui"
            type="number"
            value={formatNumber(formData?.pociufp3_cui) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="bcuif1_cui">BCUIF 1I</Label>
          <Input
            id="bcuif1_cui"
            name="bcuif1_cui"
            type="number"
            value={formatNumber(formData?.bcuif1_cui) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="bcuif2_cui">BCUIF 2</Label>
          <Input
            id="bcuif2_cui"
            name="bcuif2_cui"
            type="number"
            value={formatNumber(formData?.bcuif2_cui) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
        <div>
          <Label htmlFor="bcuif3_cui">BCUIF 3</Label>
          <Input
            id="bcuif3_cui"
            name="bcuif3_cui"
            type="number"
            value={formatNumber(formData?.bcuif3_cui) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>

      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div>
          <Label htmlFor="dfcuiff_cui">DF CUIFF</Label>
          <Input
            id="dfcuiff_cui"
            name="dfcuiff_cui"
            type="number"
            value={formatNumber(formData?.dfcuiff_cui) || 0}
            onChange={handleInputChange}
            className="mt-1"
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default DfCuiSubTab;