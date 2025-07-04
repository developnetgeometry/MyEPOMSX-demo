import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const RiskIrpTab: React.FC<{ formData: any; setFormData: any }> = ({
  formData,
  setFormData,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const [precision, setPrecision] = useState<2 | 8>(2);

  const formatNumber = (val: number | null) => {
    if (val === null || val === undefined) return "";
    return parseFloat(Number(val).toFixed(precision)).toString();
  };

  return (
    <div className="space-y-6">
      {/* Info Section */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          Risk & Incident Response Plan (IRP)
        </h3>
        <p className="text-sm text-blue-600">
          This section calculates the overall risk assessment and incident response planning.
        </p>
      </div>
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

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Input Fields */}
        <div>
          <Label htmlFor="dhtha_risk_irp">Dhtha</Label>
          <Input
            id="dhtha_risk_irp"
            name="dhtha_risk_irp"
            type="number"
            value={formData?.dhtha_risk_irp || 0}
            onChange={handleInputChange}
            className="mt-1 bg-gray-100"
            disabled
          />
        </div>

        <div>
          <Label htmlFor="dbrit_risk_irp">Dbrit</Label>
          <Input
            id="dbrit_risk_irp"
            name="dbrit_risk_irp"
            type="number"
            value={formData?.dbrit_risk_irp || 0}
            onChange={handleInputChange}
            className="mt-1 bg-gray-100"
            disabled
          />
        </div>

        <div>
          <Label htmlFor="dextd_risk_irp">Dextd</Label>
          <Input
            id="dextd_risk_irp"
            name="dextd_risk_irp"
            type="number"
            value={formData?.dextd_risk_irp || ""}
            onChange={handleInputChange}
            className="mt-1"
            step="any"
            disabled={formData?.ims_asset_type_id !== 1} // Disable unless ims_asset_type_id is 1
            placeholder={
              formData?.ims_asset_type_id !== 1
                ? "Calculated value"
                : "Enter Dextd value"
            }
          />
        </div>

        {/* Disabled Fields */}
        <div>
          <Label htmlFor="dthin_risk_irp">Dthin</Label>
          <Input
            id="dthin_risk_irp"
            name="dthin_risk_irp"
            type="number"
            value={formatNumber(formData?.dthin_risk_irp) || 0}
            onChange={handleInputChange}
            className="mt-1 bg-gray-100"
            disabled
          />
        </div>

        <div>
          <Label htmlFor="dscc_risk_irp">Dscc</Label>
          <Input
            id="dscc_risk_irp"
            name="dscc_risk_irp"
            type="number"
            value={formatNumber(formData?.dscc_risk_irp) || 0}
            onChange={handleInputChange}
            disabled
            className="mt-1 bg-gray-100"
            placeholder="Calculated value"
          />
        </div>

        <div>
          <Label htmlFor="dmfat_risk_irp">Dmfat</Label>
          <Input
            id="dmfat_risk_irp"
            name="dmfat_risk_irp"
            type="number"
            value={formData?.dmfat_risk_irp || ""}
            onChange={handleInputChange}
            disabled={formData?.ims_asset_type_id !== 1} // Disable unless ims_asset_type_id is 1
            className="mt-1"
            step="any"
            placeholder={
              formData?.ims_asset_type_id !== 1
                ? "Calculated value"
                : "Enter Dmfat value"
            }
          />
        </div>

        <div>
          <Label htmlFor="pof_risk_irp">Pof</Label>
          <Input
            id="pof_risk_irp"
            name="pof_risk_irp"
            type="number"
            value={formatNumber(formData?.pof_risk_irp) || 0}
            onChange={handleInputChange}
            disabled
            className="mt-1 bg-gray-100"
            placeholder="Calculated POF"
          />
        </div>

        <div>
          <Label htmlFor="cofFinancial_risk_irp">Cof (Financial)</Label>
          <Input
            id="cofFinancial_risk_irp"
            name="cofFinancial_risk_irp"
            type="number"
            value={formatNumber(formData?.cofFinancia_risk_irpl) || 0}
            onChange={handleInputChange}
            disabled
            className="mt-1 bg-gray-100"
            placeholder="From COF Financial"
          />
        </div>

        <div>
          <Label htmlFor="cofArea_risk_irp">Cof (Area)</Label>
          <Input
            id="cofArea_risk_irp"
            name="cofArea_risk_irp"
            type="number"
            value={formatNumber(formData?.cofArea_risk_irp) || 0}
            onChange={handleInputChange}
            disabled
            className="mt-1 bg-gray-100"
            placeholder="From COF Area"
          />
        </div>

{/* TEST */}
        <div>
          <Label htmlFor="pof_value_risk_irp">Pof Value</Label>
          <Input
            id="pof_value_risk_irp"
            name="pof_value_risk_irp"
            value={formData?.pof_value_risk_irp || ""}
            onChange={handleInputChange}
            disabled
            className="mt-1 bg-gray-100"
            placeholder="Calculated POF Value"
          />
        </div>

        <div>
          <Label htmlFor="risk_level_risk_irp">Risk Level</Label>
          <Input
            id="risk_level_risk_irp"
            name="risk_level_risk_irp"
            type="text"
            value={formData?.risk_level_risk_irp || ""}
            onChange={handleInputChange}
            disabled
            className="mt-1 bg-gray-100"
            placeholder="Calculated Risk Level"
          />
        </div>

        <div>
          <Label htmlFor="risk_ranking_risk_irp">Risk Ranking</Label>
          <Input
            id="risk_ranking_risk_irp"
            name="risk_ranking_risk_irp"
            type="text"
            value={formData?.risk_ranking_risk_irp || ""}
            onChange={handleInputChange}
            disabled
            className="mt-1 bg-gray-100"
            placeholder="Calculated Risk Ranking"
          />
        </div>
      </div>
    </div>
  );
};

export default RiskIrpTab;