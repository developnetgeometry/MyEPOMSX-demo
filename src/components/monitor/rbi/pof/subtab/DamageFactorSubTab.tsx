import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DamageFactorSubTab: React.FC<{ formData: any }> = ({ formData }) => {
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
        <div className="space-y-2">
          <Label htmlFor="dfthinf_thin">DFThinF</Label>
          <Input
            id="dfthinf_thin"
            name="dfthinf_thin"
            type="number"
            value={formatNumber(formData?.dfthinf_thin) || 0}
            disabled
            className="bg-gray-50"
            placeholder="Calculated value"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="df_ext_cl_scc_ext_clscc">DF Ext CL SCC</Label>
          <Input
            id="df_ext_cl_scc_ext_clscc"
            name="df_ext_cl_scc_ext_clscc"
            type="number"
            value={formatNumber(formData?.df_ext_cl_scc_ext_clscc) || 0}
            disabled
            className="bg-gray-50"
            placeholder="Calculated value"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dfcuiff_cui">DF CUIFF</Label>
          <Input
            id="dfcuiff_cui"
            name="dfcuiff_cui"
            type="number"
            value={formatNumber(formData?.dfcuiff_cui) || 0}
            disabled
            className="bg-gray-50"
            placeholder="Calculated value"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="df_scc_scc_scc_scc">DF SCC SCC</Label>
          <Input
            id="df_scc_scc_scc_scc"
            name="df_scc_scc_scc_scc"
            type="number"
            value={formatNumber(formData?.df_scc_scc_scc_scc) || 0}
            disabled
            className="bg-gray-50"
            placeholder="Calculated value"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dfscc_sohic_scc_sohic">DF SCC SOHIC</Label>
          <Input
            id="dfscc_sohic_scc_sohic"
            name="dfscc_sohic_scc_sohic"
            type="number"
            value={formatNumber(formData?.dfscc_sohic_scc_sohic) || 0}
            disabled
            className="bg-gray-50"
            placeholder="Calculated value"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dmfat_mfat">D MFAT</Label>
          <Input
            id="dmfat_mfat"
            name="dmfat_mfat"
            type="number"
            value={formatNumber(formData?.dmfat_mfat) || 0}
            disabled
            className="bg-gray-50"
            placeholder="Calculated value"
          />
        </div>
      </div>
    </div>
  );
};

export default DamageFactorSubTab;