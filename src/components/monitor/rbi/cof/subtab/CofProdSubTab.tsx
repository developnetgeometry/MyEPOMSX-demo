import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputBlock } from "@/components/ui/input-block";

const CofProdSubTab: React.FC<{ formData: any; handleInputChange: any }> = ({
    formData,
    handleInputChange,
}) => {
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
                    Consequence of Failure, Financial (CoF, $)
                </h3>
                <p className="text-sm text-blue-600">
                    This section calculates the financial consequences of potential equipment failure.
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="fc_cmd_cof_prod">FC cmd</Label>
                    <Input
                        id="fc_cmd_cof_prod"
                        name="fc_cmd_cof_prod"
                        type="number"
                        value={formatNumber(formData?.fc_cmd_cof_prod) || 0}
                        disabled
                        className="mt-1 bg-gray-50"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="fc_affa_cof_prod">FC affa</Label>
                    <Input
                        id="fc_affa_cof_prod"
                        name="fc_affa_cof_prod"
                        type="number"
                        value={formatNumber(formData?.fc_affa_cof_prod) || 0}
                        disabled
                        className="mt-1 bg-gray-50"
                        placeholder="Calculated value"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div>
                    <Label htmlFor="outage_affa_cof_prod">Outage affa</Label>
                    <Input
                        id="outage_affa_cof_prod"
                        name="outage_affa_cof_prod"
                        type="number"
                        value={formatNumber(formData?.outage_affa_cof_prod) || 0}
                        disabled
                        className="mt-1 bg-gray-50"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="outage_mult_cof_prod">Outage mult</Label>
                    <Input
                        id="outage_mult_cof_prod"
                        name="outage_mult_cof_prod"
                        type="number"
                        value={formData?.outage_mult_cof_prod || ""}
                        onChange={handleInputChange}
                        className="mt-1"
                        step="any"
                        placeholder="Enter outage mult"
                    />
                </div>
                <div>
                    <Label htmlFor="outage_cmd_cof_prod">Outage cmd</Label>
                    <Input
                        id="outage_cmd_cof_prod"
                        name="outage_cmd_cof_prod"
                        type="number"
                        value={formatNumber(formData?.outage_cmd_cof_prod) || 0}
                        disabled
                        className="mt-1 bg-gray-50"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="lra_prod_cof_prod">LRA prod</Label>
                    <Input
                        id="lra_prod_cof_prod"
                        name="lra_prod_cof_prod"
                        type="number"
                        value={formData?.lra_prod_cof_prod || ""}
                        onChange={handleInputChange}
                        className="mt-1"
                        step="any"
                        placeholder="Enter LRA prod"
                    />
                </div>
                <div>
                    <Label htmlFor="fc_prod_cof_prod">FC prod</Label>
                    <Input
                        id="fc_prod_cof_prod"
                        name="fc_prod_cof_prod"
                        type="number"
                        value={formatNumber(formData?.fc_prod_cof_prod) || 0}
                        disabled
                        className="mt-1 bg-gray-50"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="pop_dens_cof_prod">Pop Dens</Label>
                    <Input
                        id="pop_dens_cof_prod"
                        name="pop_dens_cof_prod"
                        type="number"
                        value={formatNumber(formData?.pop_dens_cof_prod) || 0}
                        disabled
                        className="mt-1 bg-gray-50"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="inj_cost_cof_prod">Inj Cost</Label>
                    <Input
                        id="inj_cost_cof_prod"
                        name="inj_cost_cof_prod"
                        type="number"
                        value={formData?.inj_cost_cof_prod || ""}
                        onChange={handleInputChange}
                        className="mt-1"
                        step="any"
                        placeholder="Enter Inj cost"
                    />
                    {/* <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">RM</span>
                        <Input
                            id="inj_cost_cof_prod"
                            name="inj_cost_cof_prod"
                            type="number"
                            value={formData?.inj_cost_cof_prod || ""}
                            onChange={handleInputChange}
                            step="any"
                            placeholder="Enter Inj cost"
                            className="pl-10" // padding-left to make room for 'RM'
                        />
                    </div> */}
                </div>

                <div>
                    <Label htmlFor="fc_inj_cost_cof_prod">Fc Inj</Label>
                    <Input
                        id="fc_inj_cost_cof_prod"
                        name="fc_inj_cost_cof_prod"
                        type="number"
                        value={formatNumber(formData?.fc_inj_cost_cof_prod) || 0}
                        disabled
                        className="mt-1 bg-gray-50"
                        placeholder="Calculated value"
                    />
                </div>

                <div>
                    <Label htmlFor="envcost_cof_prod">Env cost</Label>
                    <Input
                        id="envcost_cof_prod"
                        name="envcost_cof_prod"
                        type="number"
                        value={formData?.envcost_cof_prod || ""}
                        onChange={handleInputChange}
                        className="mt-1"
                        step="any"
                        placeholder="Enter env cost"
                    />
                </div>

                <div>
                    <Label htmlFor="frac_evap_cof_prod">Frac Evap</Label>
                    <Input
                        id="frac_evap_cof_prod"
                        name="frac_evap_cof_prod"
                        type="number"
                        value={formatNumber(formData?.frac_evap_cof_prod) || 0}
                        disabled
                        className="mt-1 bg-gray-50"
                        placeholder="Calculated value"
                    />
                </div>

                <div>
                    <Label htmlFor="vol_env_cof_prod">Vol Env</Label>
                    <Input
                        id="vol_env_cof_prod"
                        name="vol_env_cof_prod"
                        type="number"
                        value={formatNumber(formData?.vol_env_cof_prod) || 0}
                        disabled
                        className="mt-1 bg-gray-50"
                        placeholder="Calculated value"
                    />
                </div>

                <div>
                    <Label htmlFor="fc_environ_cof_prod">FC Environ</Label>
                    <Input
                        id="fc_environ_cof_prod"
                        name="fc_environ_cof_prod"
                        type="number"
                        value={formatNumber(formData?.fc_environ_cof_prod) || 0}
                        disabled
                        className="mt-1 bg-gray-50"
                        placeholder="Calculated value"
                    />
                </div>

                <div>
                    <Label htmlFor="fc_cof_prod">FC</Label>
                    <Input
                        id="fc_cof_prod"
                        name="fc_cof_prod"
                        type="number"
                        value={formatNumber(formData?.fc_cof_prod) || 0}
                        disabled
                        className="mt-1 bg-gray-50"
                        placeholder="Calculated value"
                    />
                </div>
            </div>
        </div>
    );
};

export default CofProdSubTab;