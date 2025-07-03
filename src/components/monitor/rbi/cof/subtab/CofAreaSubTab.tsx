import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { InputBlock } from "@/components/ui/input-block";
import { useIdealGasSpecificHeatEqData } from "@/hooks/lookup/lookup-ideal-gas-specific-heat-eq";
import { useIsolationSystemData } from "@/hooks/lookup/lookup-isolation-system";
import { useDetectionSystemData } from "@/hooks/lookup/lookup-detection-system";


const CofAreaSubTab: React.FC<{ formData: any; handleSelectChange: any }> = ({
    formData,
    handleSelectChange,
}) => {
    const { data: idealGasses } = useIdealGasSpecificHeatEqData();
    const { data: isolationSystems } = useIsolationSystemData();
    const { data: detectionSystems } = useDetectionSystemData();
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [precision, setPrecision] = useState<2 | 8>(2);

    const formatNumber = (val: number | null) => {
        if (val === null || val === undefined) return "";
        return parseFloat(Number(val).toFixed(precision)).toString();
    };
    return (
        <div className="space-y-6">
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        <InputBlock label="Comp." value={formData?.comp_type_cof} />
                        <InputBlock label="Spec Code" value={formData?.spec_code} />
                        <InputBlock label="Composition" value={formData?.composition} />
                        <InputBlock label="Fluid Representative" value={formData?.fluid_representative_name} />
                        <InputBlock label="Fluid Phase" value={formData?.fluid_phase_name} />
                        <InputBlock label="Mitigation System ID" value={formData?.mitigation_system_id} />
                        <InputBlock label="Mitigation System Name" value={formData?.mitigation_system_name} />
                        <InputBlock label="Mitigation System Value / factmit" value={formData?.mitigation_system_value} />
                    </div>
                </>
            )}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    Consequence of Failure, Area (CoF, m²)
                </h3>
                <p className="text-sm text-blue-600">
                    This section calculates the area-based consequences of potential equipment failure.
                </p>
            </div>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <Label htmlFor="ideal_gas_specific_heat_eq_id">Ideal Gas Specific Heat EQ</Label>
                    <Select
                        value={formData?.ideal_gas_specific_heat_eq_id?.toString() || ""}
                        onValueChange={(value) => {
                            const selectedGas = idealGasses?.find(
                                (gas) => gas.id.toString() === value
                            );
                            handleSelectChange("ideal_gas_specific_heat_eq_id", parseInt(value));
                            handleSelectChange("ideal_gas_specific_heat_eq_name", selectedGas?.name || "");
                        }}
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select Ideal Gas Specific Heat EQ" />
                        </SelectTrigger>
                        <SelectContent>
                            {idealGasses?.map((gas) => (
                                <SelectItem key={gas.id} value={gas.id.toString()}>
                                    {gas.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="iso_sys_id_cof_area">Isolation System</Label>
                    <Select
                        value={formData?.iso_sys_id_cof_area?.toString() || ""}
                        onValueChange={(value) => {
                            const selectedSystem = isolationSystems?.find(
                                (system) => system.id.toString() === value
                            );
                            handleSelectChange("iso_sys_id_cof_area", parseInt(value));
                            handleSelectChange("iso_sys_name_cof_area", selectedSystem?.name || "");
                        }}
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select Isolation System" />
                        </SelectTrigger>
                        <SelectContent>
                            {isolationSystems?.map((system) => (
                                <SelectItem key={system.id} value={system.id.toString()}>
                                    {system.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="det_sys_id_cof_area">Detection System</Label>
                    <Select
                        value={formData?.det_sys_id_cof_area?.toString() || ""}
                        onValueChange={(value) => {
                            const selectedSystem = detectionSystems?.find(
                                (system) => system.id.toString() === value
                            );
                            handleSelectChange("det_sys_id_cof_area", parseInt(value));
                            handleSelectChange("det_sys_name_cof_area", selectedSystem?.name || "");
                        }}
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select Detection System" />
                        </SelectTrigger>
                        <SelectContent>
                            {detectionSystems?.map((system) => (
                                <SelectItem key={system.id} value={system.id.toString()}>
                                    {system.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div>
                    <Label htmlFor="p_s_cof_area">Ps (kPa)</Label>
                    <Input
                        id="p_s_cof_area"
                        name="p_s_cof_area"
                        type="number"
                        value={formatNumber(formData?.p_s_cof_area) || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="op_temp_cof_area">Op. Temp (K)</Label>
                    <Input
                        id="op_temp_cof_area"
                        name="op_temp_cof_area"
                        type="number"
                        value={formatNumber(formData?.op_temp_cof_area) || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="cp_cof_area">Cp</Label>
                    <Input
                        id="cp_cof_area"
                        name="cp_cof_area"
                        type="number"
                        value={formatNumber(formData?.cp_cof_area) || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="k_cof_area">k</Label>
                    <Input
                        id="k_cof_area"
                        name="k_cof_area"
                        type="number"
                        value={formatNumber(formData?.k_cof_area) || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="p_trans_cof_area">P trans</Label>
                    <Input
                        id="p_trans_cof_area"
                        name="p_trans_cof_area"
                        type="number"
                        value={formatNumber(formData?.p_trans_cof_area) || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="w1_cof_area">W1 (kg/s)</Label>
                    <Input
                        id="w1_cof_area"
                        name="w1_cof_area"
                        type="number"
                        value={formatNumber(formData?.w1_cof_area) || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="inventory_cof_area">Inventory (kg)</Label>
                    <Input
                        id="inventory_cof_area"
                        name="inventory_cof_area"
                        type="number"
                        value={formatNumber(formData?.inventory_cof_area) || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="time_empty_cof_area">Time empty (s)</Label>
                    <Input
                        id="time_empty_cof_area"
                        name="time_empty_cof_area"
                        type="number"
                        value={formatNumber(formData?.time_empty_cof_area) || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="m_release_cof_area">m release (kg)</Label>
                    <Input
                        id="m_release_cof_area"
                        name="m_release_cof_area"
                        type="number"
                        value={formatNumber(formData?.m_release_cof_area) || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="release_type_cof_area">Release Type</Label>
                    <Input
                        id="release_type_cof_area"
                        name="release_type_cof_area"
                        value={formData?.release_type_cof_area || ""}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="fact_di_cof_area">Fact di</Label>
                    <Input
                        id="fact_di_cof_area"
                        name="fact_di_cof_area"
                        type="number"
                        value={formatNumber(formData?.fact_di_cof_area) || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="ld_max_cof_area">Ld max (Min)</Label>
                    <Input
                        id="ld_max_cof_area"
                        name="ld_max_cof_area"
                        type="number"
                        value={formatNumber(formData?.ld_max_cof_area) || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="rate_n_cof_area">Rate n (kg/s)</Label>
                    <Input
                        id="rate_n_cof_area"
                        name="rate_n_cof_area"
                        type="number"
                        value={formatNumber(formData?.rate_n_cof_area) || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="ld_s_cof_area">Ld (s)</Label>
                    <Input
                        id="ld_s_cof_area"
                        name="ld_s_cof_area"
                        type="number"
                        value={formatNumber(formData?.ld_s_cof_area) || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="mass_n_cof_area">Mass n (kg)</Label>
                    <Input
                        id="mass_n_cof_area"
                        name="mass_n_cof_area"
                        type="number"
                        value={formatNumber(formData?.mass_n_cof_area) || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="eneff_cof_area">eneff</Label>
                    <Input
                        id="eneff_cof_area"
                        name="eneff_cof_area"
                        type="number"
                        value={formatNumber(formData?.eneff_cof_area) || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="fact_ic_cof_area">Fact IC</Label>
                    <Input
                        id="fact_ic_cof_area"
                        name="fact_ic_cof_area"
                        type="number"
                        value={formatNumber(formData?.fact_ic_cof_area) || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                    <Label htmlFor="ca_cmd_ainl_cont_cof_area">CA-CMD AINL-CONT</Label>
                    <Input
                        id="ca_cmd_ainl_cont_cof_area"
                        name="ca_cmd_ainl_cont_cof_area"
                        type="number"
                        value={formatNumber(formData?.ca_cmd_ainl_cont_cof_area) || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="ca_cmd_ail_cont_cof_area">CA-CMD AIL-CONT</Label>
                    <Input
                        id="ca_cmd_ail_cont_cof_area"
                        name="ca_cmd_ail_cont_cof_area"
                        type="number"
                        value={formatNumber(formData?.ca_cmd_ail_cont_cof_area) || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="ca_cmd_ainl_inst_cof_area">CA-CMD AINL-INST</Label>
                    <Input
                        id="ca_cmd_ainl_inst_cof_area"
                        name="ca_cmd_ainl_inst_cof_area"
                        type="number"
                        value={formatNumber(formData?.ca_cmd_ainl_inst_cof_area) || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="ca_cmd_ail_inst_cof_area">CA-CMD AIL-INST</Label>
                    <Input
                        id="ca_cmd_ail_inst_cof_area"
                        name="ca_cmd_ail_inst_cof_area"
                        type="number"
                        value={formatNumber(formData?.ca_cmd_ail_inst_cof_area) || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                    <Label htmlFor="ca_inj_ainl_cont_cof_area">CA-INJ AINL-CONT</Label>
                    <Input
                        id="ca_inj_ainl_cont_cof_area"
                        name="ca_inj_ainl_cont_cof_area"
                        type="number"
                        value={formatNumber(formData?.ca_inj_ainl_cont_cof_area) || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="ca_inj_ail_cont_cof_area">CA-INJ AIL-CONT</Label>
                    <Input
                        id="ca_inj_ail_cont_cof_area"
                        name="ca_inj_ail_cont_cof_area"
                        type="number"
                        value={formatNumber(formData?.ca_inj_ail_cont_cof_area) || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="ca_inj_ainl_inst_cof_area">CA-INJ AINL-INST</Label>
                    <Input
                        id="ca_inj_ainl_inst_cof_area"
                        name="ca_inj_ainl_inst_cof_area"
                        type="number"
                        value={formatNumber(formData?.ca_inj_ainl_inst_cof_area) || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="ca_inj_ail_inst_cof_area">CA-INJ AIL-INST</Label>
                    <Input
                        id="ca_inj_ail_inst_cof_area"
                        name="ca_inj_ail_inst_cof_area"
                        type="number"
                        value={formatNumber(formData?.ca_inj_ail_inst_cof_area) || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                    <Label htmlFor="ca_cmd_ail_cof_area">CA-CMD AIL</Label>
                    <Input
                        id="ca_cmd_ail_cof_area"
                        name="ca_cmd_ail_cof_area"
                        type="number"
                        value={formatNumber(formData?.ca_cmd_ail_cof_area) || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="ca_inj_ail_cof_area">CA-INJ AIL</Label>
                    <Input
                        id="ca_inj_ail_cof_area"
                        name="ca_inj_ail_cof_area"
                        type="number"
                        value={formatNumber(formData?.ca_inj_ail_cof_area) || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="ca_cmd_ainl_cof_area">CA-CMD AINL</Label>
                    <Input
                        id="ca_cmd_ainl_cof_area"
                        name="ca_cmd_ainl_cof_area"
                        type="number"
                        value={formatNumber(formData?.ca_cmd_ainl_cof_area) || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="ca_inj_ainl_cof_area">CA-INJ AINL</Label>
                    <Input
                        id="ca_inj_ainl_cof_area"
                        name="ca_inj_ainl_cof_area"
                        type="number"
                        value={formatNumber(formData?.ca_inj_ainl_cof_area) || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <Label htmlFor="fact_ait_cof_area">Fact AIT</Label>
                    <Input
                        id="fact_ait_cof_area"
                        name="fact_ait_cof_area"
                        type="number"
                        value={formatNumber(formData?.fact_ait_cof_area) || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="ca_cmd_flam_cof_area">CA-CMD FLAM</Label>
                    <Input
                        id="ca_cmd_flam_cof_area"
                        name="ca_cmd_flam_cof_area"
                        type="number"
                        value={formatNumber(formData?.ca_cmd_flam_cof_area) || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="ca_inj_flam_cof_area">CA-INJ FLAM</Label>
                    <Input
                        id="ca_inj_flam_cof_area"
                        name="ca_inj_flam_cof_area"
                        type="number"
                        value={formatNumber(formData?.ca_inj_flam_cof_area) || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated value"
                    />
                </div>
            </div>

        </div>
    );
};

export default CofAreaSubTab;