import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useAssetIntegrityData } from "@/pages/work-orders/hooks/use-apsf-by-project-data";
import { useCoatingQualityData } from "@/hooks/lookup/lookup-coating-quality";
import { useDataConfidenceData } from "@/hooks/lookup/lookup-data-confidence";
import { InputBlock } from "@/components/ui/input-block";
import { Button } from "@/components/ui/button";

const GeneralSubTab: React.FC<{
    formData: any;
    handleInputChange: any;
    handleSelectChange: any;
    handleRadioChange: any;
}> = ({ formData, handleInputChange, handleSelectChange, handleRadioChange }) => {
    const [precision, setPrecision] = useState<2 | 8>(2);
    const [isCollapsed, setIsCollapsed] = useState(true);

    const formatNumber = (val: number | null) => {
        if (val === null || val === undefined) return "";
        return parseFloat(Number(val).toFixed(precision)).toString();
    };


    const { data: assets } = useAssetIntegrityData();
    const { data: coatingQualities } = useCoatingQualityData();
    const { data: dataConfidences } = useDataConfidenceData();


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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <div>
                    <Label htmlFor="asset">Asset</Label>
                    <Select
                        value={formData?.asset_detail_id?.toString() || ""}
                        onValueChange={(value) => {
                            const selectedAsset = assets?.find(
                                (asset) => asset.asset_detail_id.toString() === value
                            );
                            handleSelectChange("asset_detail_id", parseInt(value));
                            handleSelectChange("asset_name", selectedAsset?.asset_name || "");
                        }}
                        disabled={!formData?.editMode} // Disable the select list if editMode is false
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
                <div className="space-y-2">
                    <Label>Cladding</Label>
                    <RadioGroup
                        value={formData?.cladding ? "true" : "false"}
                        onValueChange={(value) => handleRadioChange("cladding", value)}
                        className="flex flex-row space-x-4"
                        disabled
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="true" id="cladding-yes" />
                            <Label htmlFor="cladding-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="false" id="cladding-no" />
                            <Label htmlFor="cladding-no">No</Label>
                        </div>
                    </RadioGroup>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                    <Label htmlFor="normal_wall_thickness">Nominal Thickness (MM)</Label>
                    <Input
                        id="normal_wall_thickness"
                        name="normal_wall_thickness"
                        type="number"
                        value={formatNumber(formData?.normal_wall_thickness) || 0}
                        onChange={handleInputChange}
                        className="mt-1"
                        disabled
                    />
                </div>
                <div>
                    <Label htmlFor="tmin">TMin (Calculated)</Label>
                    <Input
                        id="tmin"
                        name="tmin"
                        type="number"
                        value={formatNumber(formData?.tmin) || 0}
                        disabled
                        className="mt-1 bg-gray-50"
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
                        placeholder="Asset Description"
                        disabled
                    />
                </div>
            </div>

            {/* Toggle Collapse Button */}
            <div className="flex justify-end">
                <Button
                    type="button"
                    onClick={() => setIsCollapsed((prev) => !prev)}
                    variant="outline"
                    size="sm"
                >
                    {isCollapsed ? "Expand Section" : "Collapse Section"}
                </Button>
            </div>
            {/* General & Design Fields */}
            {!isCollapsed && (

                <>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
                        {/* ims_general */}
                        <InputBlock
                            label="Asset Type"
                            value={
                                formData?.ims_asset_type_id === 1
                                    ? "1 - Pressure Vessel"
                                    : formData?.ims_asset_type_id === 2
                                        ? "2 - Piping"
                                        : "N/A"
                            }
                        />
                        <InputBlock label="Line No" value={formData?.line_no} />
                        <InputBlock label="Pipe Schedule ID" value={formData?.pipe_schedule_id} />
                        <InputBlock label="Pressure Rating" value={formatNumber(formData?.pressure_rating)} />
                        <InputBlock label="Year in Service" value={formData?.year_in_service} />
                        <InputBlock label="Normal Wall Thickness" value={formatNumber(formData?.normal_wall_thickness)} />
                        <InputBlock label="TMin" value={formatNumber(formData?.tmin)} />
                        <InputBlock label="Material Construction ID" value={formData?.material_construction_id} />
                        <InputBlock label="Spec Code" value={formData?.spec_code} />
                        <InputBlock label="Avg mts" value={formData?.avg_mts_mpa} />
                        <InputBlock label="Avg Mpa" value={formData?.avg_mys_mpa} />
                        <InputBlock label="Composition" value={formData?.composition} />
                        <InputBlock label="Circuit ID" value={formData?.circuit_id} />
                        <InputBlock label="Nominal Bore Diameter" value={formData?.nominal_bore_diameter} />
                        <InputBlock label="Pipe Class ID" value={formData?.pipe_class_id} />
                        <InputBlock label="IMS Asset Type ID" value={formData?.ims_asset_type_id} />
                        <InputBlock label="Clad Thickness" value={formatNumber(formData?.clad_thickness)} />

                        {/* ims_design */}
                        <InputBlock label="Internal Diameter" value={formatNumber(formData?.internal_diameter)} />
                        <InputBlock label="Outer Diameter" value={formatNumber(formData?.outer_diameter)} />
                        <InputBlock label="Welding Efficiency" value={formatNumber(formData?.welding_efficiency)} />
                        <InputBlock label="Design Pressure" value={formatNumber(formData?.design_pressure)} />
                        <InputBlock label="Design Temperature" value={formatNumber(formData?.design_temperature)} />
                        <InputBlock label="Operating Pressure (MPa)" value={formatNumber(formData?.operating_pressure_mpa)} />
                        <InputBlock label="Operating Temperature" value={formatNumber(formData?.operating_temperature)} />
                        <InputBlock label="Corrosion Allowance" value={formatNumber(formData?.corrosion_allowance)} />
                        <InputBlock label="Allowable Stress (MPa)" value={formatNumber(formData?.allowable_stress_mpa)} />
                        <InputBlock label="Length" value={formatNumber(formData?.length)} />
                        <InputBlock label="Ext Env ID" value={formData?.ext_env_id} />
                        <InputBlock label="Ext Env Name" value={formData?.ext_env_name} />
                        <InputBlock label="Geometry ID" value={formData?.geometry_id} />

                        {/* ims_protection */}
                        <InputBlock label="Coating Quality ID" value={formData?.coating_quality_id} />
                        <InputBlock label="Isolation System ID" value={formData?.isolation_system_id} />
                        <InputBlock label="Online Monitor ID" value={formData?.online_monitor_id} />
                        <InputBlock label="Online Monitor Name" value={formData?.online_monitor_name} />
                        <InputBlock label="Minimum Thickness" value={formatNumber(formData?.minimum_thickness)} />
                        <InputBlock label="Post Weld Heat Treatment" value={formatNumber(formData?.post_weld_heat_treatment)} />
                        <InputBlock label="Line Description" value={formData?.line_description} />
                        <InputBlock label="Replacement Line" value={formData?.replacement_line} />
                        <InputBlock label="Detection System ID" value={formData?.detection_system_id} />
                        <InputBlock label="Mitigation System ID" value={formData?.mitigation_system_id} />
                        <InputBlock label="Design Fabrication ID" value={formData?.design_fabrication_id} />
                        <InputBlock label="Design Fabrication Name" value={formData?.design_fabrication_name} />
                        <InputBlock label="Design Fabrication Value" value={formatNumber(formData?.design_fabrication_value)} />
                        <InputBlock label="Insulation Type ID" value={formData?.insulation_type_id} />
                        <InputBlock label="Insulation Type Name" value={formData?.insulation_type_name} />
                        <InputBlock label="Insulation Type Value" value={formatNumber(formData?.insulation_type_value)} />
                        <InputBlock label="Interface ID" value={formData?.interface_id} />
                        <InputBlock label="Interface Name" value={formData?.interface_name} />
                        <InputBlock label="Interface Value" value={formatNumber(formData?.interface_value)} />
                        <InputBlock label="Insulation Complexity ID" value={formData?.insulation_complexity_id} />
                        <InputBlock label="Insulation Complexity Name" value={formData?.insulation_complexity_name} />
                        <InputBlock label="Insulation Complexity Value" value={formatNumber(formData?.insulation_complexity_value)} />
                        <InputBlock label="Insulation Condition ID" value={formData?.insulation_condition_id} />
                        <InputBlock label="Insulation Condition Name" value={formData?.insulation_condition_name} />
                        <InputBlock label="Insulation Condition Value" value={formatNumber(formData?.insulation_condition_value)} />
                        <InputBlock label="Lining Type" value={formData?.lining_type} />
                        <InputBlock label="Lining Condition" value={formData?.lining_condition} />
                        <InputBlock label="Lining Monitoring" value={formData?.lining_monitoring} />
                    </div>

                    {/* Booleans */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <InputBlock label="Insulation" value={formData?.insulation ? "Yes" : "No"} />
                        <InputBlock label="Line H2S" value={formData?.line_h2s ? "Yes" : "No"} />
                        <InputBlock label="Internal Lining" value={formData?.internal_lining ? "Yes" : "No"} />
                        <InputBlock label="PWHT" value={formData?.pwht ? "Yes" : "No"} />
                        <InputBlock label="Pipe Support" value={formData?.pipe_support ? "Yes" : "No"} />
                        <InputBlock label="Soil Water Interface" value={formData?.soil_water_interface ? "Yes" : "No"} />
                        <InputBlock label="Dead Legs" value={formData?.dead_legs ? "Yes" : "No"} />
                        <InputBlock label="Mix Point" value={formData?.mix_point ? "Yes" : "No"} />
                    </div>
                </>
            )}
        </div>
    );
};

export default GeneralSubTab;