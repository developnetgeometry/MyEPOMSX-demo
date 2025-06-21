import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const RiskIrpTab: React.FC<{ formData: any; setFormData: any }> = ({
  formData,
  setFormData,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
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

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Input Fields */}
        <div>
          <Label htmlFor="dhtha">Dhtha</Label>
          <Input
            id="dhtha"
            name="dhtha"
            type="number"
            value={formData.dhtha || ""}
            onChange={handleInputChange}
            className="mt-1"
            step="0.01"
          />
        </div>

        <div>
          <Label htmlFor="dbrit">Dbrit</Label>
          <Input
            id="dbrit"
            name="dbrit"
            type="number"
            value={formData.dbrit || ""}
            onChange={handleInputChange}
            className="mt-1"
            step="0.01"
          />
        </div>

        <div>
          <Label htmlFor="dextd">Dextd</Label>
          <Input
            id="dextd"
            name="dextd"
            type="number"
            value={formData.dextd || ""}
            onChange={handleInputChange}
            className="mt-1"
            step="0.01"
          />
        </div>

        {/* Disabled Fields */}
        <div>
          <Label htmlFor="dthin">Dthin</Label>
          <Input
            id="dthin"
            name="dthin"
            type="number"
            value={formData.dthinf || 0}
            disabled
            className="mt-1 bg-gray-100"
            placeholder="Calculated from damage factors"
          />
        </div>

        <div>
          <Label htmlFor="dscc">Dscc</Label>
          <Input
            id="dscc"
            name="dscc"
            type="number"
            value={formData.dscc || 0}
            disabled
            className="mt-1 bg-gray-100"
            placeholder="Calculated value"
          />
        </div>

        <div>
          <Label htmlFor="dmfat">Dmfat</Label>
          <Input
            id="dmfat"
            name="dmfat"
            type="number"
            value={formData.dmfat || 0}
            disabled
            className="mt-1 bg-gray-100"
            placeholder="From damage factors"
          />
        </div>

        <div>
          <Label htmlFor="pof">Pof</Label>
          <Input
            id="pof"
            name="pof"
            type="number"
            value={formData.pof || 0}
            disabled
            className="mt-1 bg-gray-100"
            placeholder="Calculated POF"
          />
        </div>

        <div>
          <Label htmlFor="cofFinancial">Cof (Financial)</Label>
          <Input
            id="cofFinancial"
            name="cofFinancial"
            type="number"
            value={formData.cofFinancial || formData.fc || 0}
            disabled
            className="mt-1 bg-gray-100"
            placeholder="From COF Financial"
          />
        </div>

        <div>
          <Label htmlFor="cofArea">Cof (Area)</Label>
          <Input
            id="cofArea"
            name="cofArea"
            type="number"
            value={formData.cofArea || formData.caTotal || 0}
            disabled
            className="mt-1 bg-gray-100"
            placeholder="From COF Area"
          />
        </div>

        <div>
          <Label htmlFor="pofValue">Pof Value</Label>
          <Input
            id="pofValue"
            name="pofValue"
            type="number"
            value={formData.pofValue || 0}
            disabled
            className="mt-1 bg-gray-100"
            placeholder="Calculated POF Value"
          />
        </div>

        <div>
          <Label htmlFor="riskLevel">Risk Level</Label>
          <Input
            id="riskLevel"
            name="riskLevel"
            type="text"
            value={formData.riskLevel || "Low"}
            disabled
            className="mt-1 bg-gray-100"
            placeholder="Calculated Risk Level"
          />
        </div>

        <div>
          <Label htmlFor="riskRanking">Risk Ranking</Label>
          <Input
            id="riskRanking"
            name="riskRanking"
            type="text"
            value={formData.riskRanking || "Low"}
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