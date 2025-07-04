import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CofProdSubTab from "./subtab/CofProdSubTab";
import CofAreaSubTab from "./subtab/CofAreaSubTab";

const CofTab: React.FC<{ formData: any; setFormData: any }> = ({ formData, setFormData }) => {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <Tabs defaultValue="cofProd">
      <TabsList className="mb-4">
        <TabsTrigger value="cofProd">COF PROD</TabsTrigger>
        <TabsTrigger value="cofArea">COF AREA</TabsTrigger>
      </TabsList>

      <TabsContent value="cofProd">
        <CofProdSubTab formData={formData} handleInputChange={handleInputChange} />
      </TabsContent>

      <TabsContent value="cofArea">
        <CofAreaSubTab formData={formData} handleSelectChange={handleSelectChange} />
      </TabsContent>
    </Tabs>
  );
};

export default CofTab;