import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DfThinSubTab from "./subsubtab/DfThinSubTab";
import DfExtSubTab from "./subsubtab/DfExtSubTab";
import DfExtClssSubTab from "./subsubtab/DfExtClsccSubTab";
import DfMfatSubTab from "./subsubtab/DfMfatSubTab";
import DfCuiSubTab from "./subsubtab/DfCuiSubTab";
import DfSccSccSubTab from "./subsubtab/DfSccSccSubTab";
import DfSccSohicSubTab from "./subsubtab/DfSccSohicSubTab";

const DfMainSubTab: React.FC<{ formData: any; setFormData: any }> = ({ formData, setFormData }) => {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };
  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value === "yes" }));
  };

  return (
    <Tabs defaultValue="dfThin">
      <TabsList className="mb-4">
        <TabsTrigger value="dfThin">DF THIN.</TabsTrigger>
        <TabsTrigger value="dfExt">DF EXT.</TabsTrigger>
        <TabsTrigger value="dfExtClscc">DF EXT.CLSCC</TabsTrigger>
        <TabsTrigger value="dfMfat">DF MFAT</TabsTrigger>
        <TabsTrigger value="dfCui">DF CUI</TabsTrigger>
        <TabsTrigger value="dfSccScc">DF SCC SCC</TabsTrigger>
        <TabsTrigger value="dfSccSohic">DF SCC SOHIC</TabsTrigger>
      </TabsList>

      <TabsContent value="dfThin">
        <div className="border p-4 rounded-lg space-y-4">
          <p className="text-sm text-muted-foreground">Damage Factor (DF) for Thinning</p>
          <DfThinSubTab formData={formData} handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} />
        </div>
      </TabsContent>
      <TabsContent value="dfExt">
        <div className="border p-4 rounded-lg space-y-4">
          <p className="text-sm text-muted-foreground">Damage Factor (DF) for External Damage</p>
          <DfExtSubTab formData={formData} handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} handleRadioChange={handleRadioChange} />
        </div>
      </TabsContent>
      <TabsContent value="dfExtClscc">
        <div className="border p-4 rounded-lg space-y-4">
          <p className="text-sm text-muted-foreground">DF External Chloride Stress Corrosion Cracking</p>
          <DfExtClssSubTab formData={formData} handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} />
        </div>
      </TabsContent>
      <TabsContent value="dfMfat">
        <div className="border p-4 rounded-lg space-y-4">
          <p className="text-sm text-muted-foreground">DF Mechanical Fatigue</p>
          <DfMfatSubTab formData={formData} handleInputChange={handleInputChange}  handleSelectChange={handleSelectChange} />
        </div>
      </TabsContent>
      <TabsContent value="dfCui">
        <div className="border p-4 rounded-lg space-y-4">
          <p className="text-sm text-muted-foreground">Damage Factor (DF) for Corrosion Under Insulation (CUI)</p>
          <DfCuiSubTab formData={formData} handleInputChange={handleInputChange}  handleSelectChange={handleSelectChange} />
        </div>
      </TabsContent>
      <TabsContent value="dfSccScc">
        <div className="border p-4 rounded-lg space-y-4">
          <p className="text-sm text-muted-foreground">DF Stress Corrosion Cracking - Sulfide Stress Cracking (SSC)</p>
          <DfSccSccSubTab formData={formData} handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} handleRadioChange={handleRadioChange}/>
        </div>
      </TabsContent>
      <TabsContent value="dfSccSohic">
        <div className="border p-4 rounded-lg space-y-4">
          <p className="text-sm text-muted-foreground">DF Stress Corrosion Cracking - Stress-Oriented Hydrogen Induced Cracking (SOHIC)</p>
          <DfSccSohicSubTab formData={formData} handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} handleRadioChange={handleRadioChange}/>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default DfMainSubTab;