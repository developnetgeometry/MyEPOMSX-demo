import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CofProdSubTab: React.FC<{ formData: any; handleInputChange: any }> = ({
    formData,
    handleInputChange,
}) => {
    return (
        <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    Consequence of Failure, Financial (CoF, $)
                </h3>
                <p className="text-sm text-blue-600">
                    This section calculates the financial consequences of potential equipment failure.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <Label htmlFor="fccmd">Fccmd</Label>
                    <Input
                        id="fccmd"
                        name="fccmd"
                        type="number"
                        value={formData.fccmd}
                        disabled
                        className="mt-1 bg-gray-50"
                        placeholder="Calculated value"
                    />
                </div>
                <div>
                    <Label htmlFor="fcaffa">Fcaffa</Label>
                    <Input
                        id="fcaffa"
                        name="fcaffa"
                        type="number"
                        value={formData.fcaffa}
                        disabled
                        className="mt-1 bg-gray-50"
                        placeholder="Default: 1"
                    />
                </div>
                <div>
                    <Label htmlFor="outageaffa">Outageaffa</Label>
                    <Input
                        id="outageaffa"
                        name="outageaffa"
                        type="number"
                        value={formData.outageaffa}
                        disabled
                        className="mt-1 bg-gray-50"
                        placeholder="Default: 17.46"
                    />
                </div>
                <div>
                    <Label htmlFor="outagemult">Outagemult</Label>
                    <Input
                        id="outagemult"
                        name="outagemult"
                        type="number"
                        value={formData.outagemult}
                        onChange={handleInputChange}
                        className="mt-1"
                        step="0.01"
                    />
                </div>
                <div>
                    <Label htmlFor="lraprod">Lraprod</Label>
                    <Input
                        id="lraprod"
                        name="lraprod"
                        type="number"
                        value={formData.lraprod}
                        onChange={handleInputChange}
                        className="mt-1"
                        step="0.01"
                    />
                </div>
                <div>
                    <Label htmlFor="fcprod">Fcprod</Label>
                    <Input
                        id="fcprod"
                        name="fcprod"
                        type="number"
                        value={formData.fcprod}
                        disabled
                        className="mt-1 bg-gray-50"
                        placeholder="Default: 17.46"
                    />
                </div>
                <div>
                    <Label htmlFor="popdens">Popdens</Label>
                    <Input
                        id="popdens"
                        name="popdens"
                        type="number"
                        value={formData.popdens}
                        disabled
                        className="mt-1 bg-gray-50"
                        placeholder="Default: 0.06"
                    />
                </div>

                <div>
                    <Label htmlFor="injcost">Injcost</Label>
                    <Input
                        id="injcost"
                        name="injcost"
                        type="number"
                        value={formData.injcost}
                        onChange={handleInputChange}
                        className="mt-1"
                        step="0.01"
                    />
                </div>

                <div>
                    <Label htmlFor="fcinj">Fcinj</Label>
                    <Input
                        id="fcinj"
                        name="fcinj"
                        type="number"
                        value={formData.fcinj}
                        disabled
                        className="mt-1 bg-gray-50"
                        placeholder="Default: 0.06"
                    />
                </div>

                <div>
                    <Label htmlFor="envcost">Envcost</Label>
                    <Input
                        id="envcost"
                        name="envcost"
                        type="number"
                        value={formData.envcost}
                        onChange={handleInputChange}
                        className="mt-1"
                        step="0.01"
                    />
                </div>

                <div>
                    <Label htmlFor="fracevap">Fracevap</Label>
                    <Input
                        id="fracevap"
                        name="fracevap"
                        type="number"
                        value={formData.fracevap}
                        disabled
                        className="mt-1 bg-gray-50"
                        placeholder="Calculated value"
                    />
                </div>

                <div>
                    <Label htmlFor="volenv">Volenv</Label>
                    <Input
                        id="volenv"
                        name="volenv"
                        type="number"
                        value={formData.volenv}
                        disabled
                        className="mt-1 bg-gray-50"
                        placeholder="Calculated value"
                    />
                </div>

                <div>
                    <Label htmlFor="fcenviron">Fcenviron</Label>
                    <Input
                        id="fcenviron"
                        name="fcenviron"
                        type="number"
                        value={formData.fcenviron}
                        disabled
                        className="mt-1 bg-gray-50"
                        placeholder="Calculated value"
                    />
                </div>

                <div>
                    <Label htmlFor="fc">Fc</Label>
                    <Input
                        id="fc"
                        name="fc"
                        type="number"
                        value={formData.fc}
                        disabled
                        className="mt-1 bg-gray-50"
                        placeholder="Default: 77.784"
                    />
                </div>
            </div>
        </div>
    );
};

export default CofProdSubTab;