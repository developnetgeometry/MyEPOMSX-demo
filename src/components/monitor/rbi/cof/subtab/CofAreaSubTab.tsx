import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const CofAreaSubTab: React.FC<{ formData: any; handleSelectChange: any }> = ({
    formData,
    handleSelectChange,
}) => {
    return (
        <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    Consequence of Failure, Area (CoF, m²)
                </h3>
                <p className="text-sm text-blue-600">
                    This section calculates the area-based consequences of potential equipment failure.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <Label htmlFor="isoSys">Iso Sys</Label>
                    <Select
                        value={formData.isoSys}
                        onValueChange={(value) => handleSelectChange("isoSys", value)}
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select Iso Sys" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Manual">Manual</SelectItem>
                            <SelectItem value="Auto">Auto</SelectItem>
                            <SelectItem value="Semi-Auto">Semi-Auto</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="detSys">Det Sys</Label>
                    <Select
                        value={formData.detSys}
                        onValueChange={(value) => handleSelectChange("detSys", value)}
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select Det Sys" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Manual">Manual</SelectItem>
                            <SelectItem value="Auto">Auto</SelectItem>
                            <SelectItem value="Semi-Auto">Semi-Auto</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="mitigationSystem">Mitigation System</Label>
                    <Select
                        value={formData.mitigationSystem}
                        onValueChange={(value) => handleSelectChange("mitigationSystem", value)}
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select Mitigation System" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="System1">System1</SelectItem>
                            <SelectItem value="System2">System2</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="idealGasSpecificHeatEQ">
                        Ideal Gas Specific Heat EQ
                    </Label>
                    <Select
                        value={formData.idealGasSpecificHeatEQ}
                        onValueChange={(value) => handleSelectChange("idealGasSpecificHeatEQ", value)}
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select Heat EQ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="System1">System1</SelectItem>
                            <SelectItem value="System2">System2</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Disabled Input Fields with Default Values - 31 Fields Total */}
                <div>
                    <Label htmlFor="ptransKpa">Ptrans Kpa</Label>
                    <Input
                        id="ptransKpa"
                        name="ptransKpa"
                        type="number"
                        value={formData.ptransKpa || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Default: 0"
                    />
                </div>

                <div>
                    <Label htmlFor="mreleaseKg">Mrelease Kg</Label>
                    <Input
                        id="mreleaseKg"
                        name="mreleaseKg"
                        type="number"
                        value={formData.mreleaseKg || 180}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Default: 180"
                    />
                </div>

                <div>
                    <Label htmlFor="releaseType">Release Type</Label>
                    <Input
                        id="releaseType"
                        name="releaseType"
                        type="text"
                        value="Continuous"
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Default: Continuous"
                    />
                </div>

                <div>
                    <Label htmlFor="psKpa">Ps Kpa</Label>
                    <Input
                        id="psKpa"
                        name="psKpa"
                        type="number"
                        value={formData.psKpa || 2200}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Default: 2200"
                    />
                </div>

                <div>
                    <Label htmlFor="opTempK">Op Temp K</Label>
                    <Input
                        id="opTempK"
                        name="opTempK"
                        type="number"
                        value={formData.opTempK || 533}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Default: 533"
                    />
                </div>

                <div>
                    <Label htmlFor="cp">CP</Label>
                    <Input
                        id="cp"
                        name="cp"
                        type="number"
                        value={formData.cp || 2.3}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Default: 2.3"
                    />
                </div>

                <div>
                    <Label htmlFor="k">K</Label>
                    <Input
                        id="k"
                        name="k"
                        type="number"
                        value={formData.k || 1.26}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Default: 1.26"
                    />
                </div>

                <div>
                    <Label htmlFor="w1Kg">W1 Kg</Label>
                    <Input
                        id="w1Kg"
                        name="w1Kg"
                        type="number"
                        value={formData.w1Kg || 29.8}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Default: 29.8"
                    />
                </div>

                <div>
                    <Label htmlFor="inventoryKg">Inventory Kg</Label>
                    <Input
                        id="inventoryKg"
                        name="inventoryKg"
                        type="number"
                        value={formData.inventoryKg || 180}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Default: 180"
                    />
                </div>

                <div>
                    <Label htmlFor="timeempty">Timeempty</Label>
                    <Input
                        id="timeempty"
                        name="timeempty"
                        type="number"
                        value={formData.timeempty || 6.04}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Default: 6.04"
                    />
                </div>

                <div>
                    <Label htmlFor="factdi">Factdi</Label>
                    <Input
                        id="factdi"
                        name="factdi"
                        type="number"
                        value={formData.factdi || 0.1}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Default: 0.1"
                    />
                </div>

                <div>
                    <Label htmlFor="ldmax">Ldmax</Label>
                    <Input
                        id="ldmax"
                        name="ldmax"
                        type="number"
                        value={formData.ldmax || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Default: 0"
                    />
                </div>

                <div>
                    <Label htmlFor="raten">Raten</Label>
                    <Input
                        id="raten"
                        name="raten"
                        type="number"
                        value={formData.raten || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Default: 0"
                    />
                </div>

                <div>
                    <Label htmlFor="idField">Id</Label>
                    <Input
                        id="idField"
                        name="idField"
                        type="number"
                        value={formData.idField || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Default: 0"
                    />
                </div>

                <div>
                    <Label htmlFor="eneff">Eneff</Label>
                    <Input
                        id="eneff"
                        name="eneff"
                        type="number"
                        value={formData.eneff || 1}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Default: 1"
                    />
                </div>

                <div>
                    <Label htmlFor="factic">Factic</Label>
                    <Input
                        id="factic"
                        name="factic"
                        type="number"
                        value={formData.factic || 0.1}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Default: 0.1"
                    />
                </div>

                <div>
                    <Label htmlFor="caCmdailCont">Ca Cmdail Cont</Label>
                    <Input
                        id="caCmdailCont"
                        name="caCmdailCont"
                        type="number"
                        value={formData.caCmdailCont || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Default: 0"
                    />
                </div>

                <div>
                    <Label htmlFor="caCmdailInst">Ca Cmdail Inst</Label>
                    <Input
                        id="caCmdailInst"
                        name="caCmdailInst"
                        type="number"
                        value={formData.caCmdailInst || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Default: 0"
                    />
                </div>

                <div>
                    <Label htmlFor="caCmdailInjail">Ca Injail Cont</Label>
                    <Input
                        id="caCmdailInjail"
                        name="caCmdailInjail"
                        type="number"
                        value={formData.caCmdailInjail || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Default: 0"
                    />
                </div>

                <div>
                    <Label htmlFor="factait">Factait</Label>
                    <Input
                        id="factait"
                        name="factait"
                        type="number"
                        value={formData.factait || 0.05}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Default: 0.05"
                    />
                </div>

                <div>
                    <Label htmlFor="caCmdflam">Ca Cmdflam</Label>
                    <Input
                        id="caCmdflam"
                        name="caCmdflam"
                        type="number"
                        value={formData.caCmdflam || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Default: 0"
                    />
                </div>

                <div>
                    <Label htmlFor="caInjflam">Ca Injflam</Label>
                    <Input
                        id="caInjflam"
                        name="caInjflam"
                        type="number"
                        value={formData.caInjflam || 0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Default: 0"
                    />
                </div>

                {/* Additional Fields to Complete 31 Total */}
                <div>
                    <Label htmlFor="molWeight">Mol Weight</Label>
                    <Input
                        id="molWeight"
                        name="molWeight"
                        type="number"
                        value={16.04}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Default: 16.04"
                    />
                </div>

                <div>
                    <Label htmlFor="ambTemp">Ambient Temp</Label>
                    <Input
                        id="ambTemp"
                        name="ambTemp"
                        type="number"
                        value={25}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Default: 25"
                    />
                </div>

                <div>
                    <Label htmlFor="windSpeed">Wind Speed</Label>
                    <Input
                        id="windSpeed"
                        name="windSpeed"
                        type="number"
                        value={5}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Default: 5"
                    />
                </div>

                <div>
                    <Label htmlFor="atmStability">Atm Stability</Label>
                    <Input
                        id="atmStability"
                        name="atmStability"
                        type="text"
                        value="D"
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Default: D"
                    />
                </div>

                <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                        id="duration"
                        name="duration"
                        type="number"
                        value={600}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Default: 600"
                    />
                </div>

                <div>
                    <Label htmlFor="height">Height</Label>
                    <Input
                        id="height"
                        name="height"
                        type="number"
                        value={2}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Default: 2"
                    />
                </div>

                <div>
                    <Label htmlFor="surfaceRoughness">
                        Surface Roughness
                    </Label>
                    <Input
                        id="surfaceRoughness"
                        name="surfaceRoughness"
                        type="number"
                        value={0.1}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Default: 0.1"
                    />
                </div>

                <div>
                    <Label htmlFor="caTotal">CA Total</Label>
                    <Input
                        id="caTotal"
                        name="caTotal"
                        type="number"
                        value={0}
                        disabled
                        className="mt-1 bg-gray-100"
                        placeholder="Calculated: 0"
                    />
                </div>
            </div>
        </div>
    );
};

export default CofAreaSubTab;