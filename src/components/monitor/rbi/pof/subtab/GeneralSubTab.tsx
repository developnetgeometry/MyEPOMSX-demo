import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useAssetData } from "@/pages/work-orders/hooks/use-apsf-by-project-data";
import { useCoatingQualityData } from "@/hooks/lookup/lookup-coating-quality";
import { useDataConfidenceData } from "@/hooks/lookup/lookup-data-confidence";

const GeneralSubTab: React.FC<{
    formData: any;
    handleInputChange: any;
    handleSelectChange: any;
    handleRadioChange: any;
}> = ({ formData, handleInputChange, handleSelectChange, handleRadioChange }) => {

    const { data: assets } = useAssetData();
    const { data: coatingQualities } = useCoatingQualityData();
    const { data: dataConfidences } = useDataConfidenceData();


    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <div>
                    <Label htmlFor="asset">Asset</Label>
                    <Select
                        value={formData?.asset_detail_id?.toString() || ""}
                        onValueChange={(value) => handleSelectChange("asset_detail_id", parseInt(value))}
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select Asset" />
                        </SelectTrigger>
                        <SelectContent>
                            {assets?.map((asset) => (
                                <SelectItem key={asset.asset_detail_id} value={asset.asset_detail_id.toString()}>
                                    {asset.asset_no} - {asset.asset_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="coating_quality_id">Coating Quality</Label>
                    <Select
                        value={formData?.coating_quality_id?.toString() || ""}
                        onValueChange={(value) => handleSelectChange("coating_quality_id", parseInt(value))}
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select Coating Quality" />
                        </SelectTrigger>
                        <SelectContent>
                            {coatingQualities?.map((quality) => (
                                <SelectItem key={quality.id} value={quality.id.toString()}>
                                    {quality.name} - {quality.value}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="data_confidence_id">Data Confidence</Label>
                    <Select
                        value={formData?.data_confidence_id?.toString() || ""}
                        onValueChange={(value) => handleSelectChange("data_confidence_id", value)}
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select Data Confidence" />
                        </SelectTrigger>
                        <SelectContent>
                            {dataConfidences?.map((confidence) => (
                                <SelectItem key={confidence.id} value={confidence.id.toString()}>
                                    {confidence.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Cladding</Label>
                    <RadioGroup
                        value={formData?.cladding ? "yes" : "no"}
                        onValueChange={(value) => handleRadioChange("cladding", value)}
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
                    <Label htmlFor="nominal_thickness">Nominal Thickness (MM)</Label>
                    <Input
                        id="nominal_thickness"
                        name="nominal_thickness"
                        type="number"
                        value={formData?.nominal_thickness || 0}
                        onChange={handleInputChange}
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="tmin">TMin (Calculated)</Label>
                    <Input
                        id="tmin"
                        name="tmin"
                        type="number"
                        value={formData?.tmin || 0}
                        disabled
                        className="mt-1 bg-gray-50"
                    />
                </div>
                <div>
                    <Label htmlFor="current_thickness">Current Thickness (mm)</Label>
                    <Input
                        id="current_thickness"
                        name="current_thickness"
                        type="number"
                        value={formData?.current_thickness || 0}
                        onChange={handleInputChange}
                        className="mt-1"
                    />
                </div>
                <div className="col-span-full">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={formData?.description || ""}
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