import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

const GeneralSubTab: React.FC<{
    formData: any;
    handleInputChange: any;
    handleSelectChange: any;
    handleRadioChange: any;
}> = ({ formData, handleInputChange, handleSelectChange, handleRadioChange }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <div>
                    <Label htmlFor="asset">Asset</Label>
                    <Select
                        value={formData.asset}
                        onValueChange={(value) => handleSelectChange("asset", value)}
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select Asset" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Asset1">Asset1</SelectItem>
                            <SelectItem value="Asset2">Asset2</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="coatingQuality">Coating Quality</Label>
                    <Select
                        value={formData.coatingQuality}
                        onValueChange={(value) => handleSelectChange("coatingQuality", value)}
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select coating quality" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Excellent">Excellent</SelectItem>
                            <SelectItem value="Good">Good</SelectItem>
                            <SelectItem value="Fair">Fair</SelectItem>
                            <SelectItem value="Poor">Poor</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="dataConfidence">Data Confidence</Label>
                    <Select
                        value={formData.dataConfidence}
                        onValueChange={(value) => handleSelectChange("dataConfidence", value)}
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select data confidence" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Cladding</Label>
                    <RadioGroup
                        value={formData.hasCladding ? "yes" : "no"}
                        onValueChange={(value) => handleRadioChange("hasCladding", value)}
                        className="flex flex-row space-x-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="cladding-yes" />
                            <Label htmlFor="cladding-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="cladding-no" />
                            <Label htmlFor="cladding-no">No</Label>
                        </div>
                    </RadioGroup>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">

                <div>
                    <Label htmlFor="nominalThickness">Nominal Thickness (MM)</Label>
                    <Input
                        id="nominalThickness"
                        name="nominalThickness"
                        type="number"
                        value={formData.nominalThickness}
                        onChange={handleInputChange}
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="tMin">TMin (Calculated)</Label>
                    <Input
                        id="tMin"
                        name="tMin"
                        type="number"
                        value={formData.tMin}
                        disabled
                        className="mt-1 bg-gray-50"
                    />
                </div>
                <div>
                    <Label htmlFor="currentThickness">Current Thickness (mm)</Label>
                    <Input
                        id="currentThickness"
                        name="currentThickness"
                        type="number"
                        value={formData.currentThickness}
                        onChange={handleInputChange}
                        className="mt-1"
                    />
                </div>
                <div className="col-span-full">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="mt-1 min-h-[100px]"
                        placeholder="Enter description"
                    />
                </div>
            </div>
        </div>
    );
};

export default GeneralSubTab;