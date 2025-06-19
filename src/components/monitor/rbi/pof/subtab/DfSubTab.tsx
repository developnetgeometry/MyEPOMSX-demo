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
        <DfThinSubTab formData={formData} handleInputChange={handleInputChange} />
      </TabsContent>
      <TabsContent value="dfExt">
        <DfExtSubTab formData={formData} handleInputChange={handleInputChange} />
      </TabsContent>
      <TabsContent value="dfExtClscc">
        <DfExtClssSubTab formData={formData} handleInputChange={handleInputChange} />
      </TabsContent>
      <TabsContent value="dfMfat">
        <DfMfatSubTab formData={formData} handleInputChange={handleInputChange} />
      </TabsContent>
      <TabsContent value="dfCui">
        <DfCuiSubTab formData={formData} handleInputChange={handleInputChange} />
      </TabsContent>
      <TabsContent value="dfSccScc">
        <DfSccSccSubTab formData={formData} handleInputChange={handleInputChange} />
      </TabsContent>
      <TabsContent value="dfSccSohic">
        <DfSccSohicSubTab formData={formData} handleInputChange={handleInputChange} />
      </TabsContent>
    </Tabs>
  );
};

export default DfMainSubTab;