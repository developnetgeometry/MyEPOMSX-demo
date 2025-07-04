import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralSubTab from "./subtab/GeneralSubTab";
import DamageFactorSubTab from "./subtab/DamageFactorSubTab";
import DfMainSubTab from "./subtab/DfSubTab";

const PofTab: React.FC<{ formData: any; setFormData: any }> = ({ formData, setFormData }) => {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value === "true" }));
  };

  return (
    <Tabs  defaultValue="general">
      <TabsList className="mb-4">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="damageFactor">Damage Factor</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <div className="space-y-6">
        <GeneralSubTab
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          handleRadioChange={handleRadioChange}
        />
        <DfMainSubTab
          formData={formData}
          setFormData={setFormData}
        />
        </div>
      </TabsContent>

      <TabsContent value="damageFactor">
        <DamageFactorSubTab formData={formData} />
      </TabsContent>
    </Tabs>
  );
};

export default PofTab;