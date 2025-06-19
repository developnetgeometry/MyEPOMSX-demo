import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DfExtSubTab: React.FC<{ formData: any; handleInputChange: any }> = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="field1">Field 1</Label>
          <Input
            id="field1"
            name="field1"
            type="text"
            value={formData.field1}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="field2">Field 2</Label>
          <Input
            id="field2"
            name="field2"
            type="text"
            value={formData.field2}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};

export default DfExtSubTab;