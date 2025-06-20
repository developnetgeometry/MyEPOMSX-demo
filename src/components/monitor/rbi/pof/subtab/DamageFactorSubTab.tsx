import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DamageFactorSubTab: React.FC<{ formData: any }> = ({ formData }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="dthinf">Dthinf</Label>
          <Input
            id="dthinf"
            name="dthinf"
            type="number"
            value={formData.dthinf}
            disabled
            className="bg-gray-50"
            placeholder="Calculated value"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dfextclscc">Dfextclscc</Label>
          <Input
            id="dfextclscc"
            name="dfextclscc"
            type="number"
            value={formData.dfextclscc}
            disabled
            className="bg-gray-50"
            placeholder="Calculated value"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dfcuiff">DFCUIFF</Label>
          <Input
            id="dfcuiff"
            name="dfcuiff"
            type="number"
            value={formData.dfcuiff}
            disabled
            className="bg-gray-50"
            placeholder="Calculated value"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dfsccscc">DFSCCSCC</Label>
          <Input
            id="dfsccscc"
            name="dfsccscc"
            type="number"
            value={formData.dfsccscc}
            disabled
            className="bg-gray-50"
            placeholder="Calculated value"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dfSCCSOHIC">DF SCC SOHIC</Label>
          <Input
            id="dfSCCSOHIC"
            name="dfSCCSOHIC"
            type="number"
            value={formData.dfSCCSOHIC}
            disabled
            className="bg-gray-50"
            placeholder="Calculated value"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dmfat">DMFAT</Label>
          <Input
            id="dmfat"
            name="dmfat"
            type="number"
            value={formData.dmfat}
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