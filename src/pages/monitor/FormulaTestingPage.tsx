import React from "react";
import PageHeader from "@/components/shared/PageHeader";
import FormulaCalculator from "@/components/formulas/FormulaCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, TrendingUp, AlertTriangle, Info } from "lucide-react";

const FormulaTestingPage: React.FC = () => {
  const handleResultChange = (result: any) => {
    console.log("Formula result:", result);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title="Formula Testing & Validation"
        subtitle="Test and validate damage factor calculations, risk assessments, and consequence of failure formulas"
      />

      {/* Formula System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              DTHIN Formulas
            </CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">17</div>
            <p className="text-xs text-muted-foreground">
              Thinning damage factor variants
            </p>
            <div className="text-xs mt-2 space-y-1">
              <div>• Basic & Localized Thinning</div>
              <div>• Flow-Assisted Corrosion</div>
              <div>• Acid/Caustic/Amine Corrosion</div>
              <div>• High Temperature H₂/H₂S</div>
              <div>• Atmospheric & Galvanic</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Other Damage Factors
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              Additional damage mechanisms
            </p>
            <div className="text-xs mt-2 space-y-1">
              <div>• DFEXT - External Corrosion</div>
              <div>• DFSCC - Stress Corrosion Cracking</div>
              <div>• DFMFAT - Mechanical Fatigue</div>
              <div>• Risk Matrix & COF</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Risk Assessment
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">API 581</div>
            <p className="text-xs text-muted-foreground">
              Industry standard methodology
            </p>
            <div className="text-xs mt-2 space-y-1">
              <div>• Production & Area COF</div>
              <div>• 5x5 Risk Matrix</div>
              <div>• Inspection Intervals</div>
              <div>• A-E Risk Categories</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formula Calculator Component */}
      <FormulaCalculator
        defaultFormulaType="DTHIN"
        defaultVariant="DTHIN_1"
        onResultChange={handleResultChange}
        showHistory={true}
        className="w-full"
      />

      {/* Formula Documentation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Formula Implementation Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">DTHIN Formula Variants</h4>
              <div className="text-sm space-y-1">
                <div>
                  <strong>DTHIN_1:</strong> Basic thinning damage factor
                </div>
                <div>
                  <strong>DTHIN_2:</strong> Localized thinning with severity
                  factor
                </div>
                <div>
                  <strong>DTHIN_3:</strong> General thinning with uniformity
                  factor
                </div>
                <div>
                  <strong>DTHIN_4:</strong> Erosion-induced thinning
                </div>
                <div>
                  <strong>DTHIN_5:</strong> Flow-assisted corrosion
                </div>
                <div>
                  <strong>DTHIN_6:</strong> Microbiologically influenced
                  corrosion
                </div>
                <div>
                  <strong>DTHIN_7:</strong> Acid corrosion (pH dependent)
                </div>
                <div>
                  <strong>DTHIN_8:</strong> Caustic corrosion (temp dependent)
                </div>
                <div>
                  <strong>DTHIN_9:</strong> Amine-induced corrosion
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Advanced Calculations</h4>
              <div className="text-sm space-y-1">
                <div>
                  <strong>DTHIN_10:</strong> Sour water corrosion (H₂S + H₂O)
                </div>
                <div>
                  <strong>DTHIN_11:</strong> High temperature H₂/H₂S damage
                </div>
                <div>
                  <strong>DTHIN_12:</strong> Sulfidic corrosion
                </div>
                <div>
                  <strong>DTHIN_13:</strong> Naphthenic acid corrosion
                </div>
                <div>
                  <strong>DTHIN_14:</strong> Atmospheric corrosion
                </div>
                <div>
                  <strong>DTHIN_15:</strong> Cooling water system corrosion
                </div>
                <div>
                  <strong>DTHIN_16:</strong> Galvanic corrosion
                </div>
                <div>
                  <strong>DTHIN_17:</strong> Uniform corrosion (default)
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2">Risk Matrix Categories</h4>
            <div className="grid grid-cols-5 gap-2 text-xs">
              <div className="bg-green-100 p-2 rounded text-center">
                <div className="font-bold">Category A</div>
                <div>Low Risk</div>
                <div>60 months</div>
              </div>
              <div className="bg-yellow-100 p-2 rounded text-center">
                <div className="font-bold">Category B</div>
                <div>Medium-Low</div>
                <div>36 months</div>
              </div>
              <div className="bg-orange-100 p-2 rounded text-center">
                <div className="font-bold">Category C</div>
                <div>Medium</div>
                <div>24 months</div>
              </div>
              <div className="bg-red-100 p-2 rounded text-center">
                <div className="font-bold">Category D</div>
                <div>Medium-High</div>
                <div>12 months</div>
              </div>
              <div className="bg-red-200 p-2 rounded text-center">
                <div className="font-bold">Category E</div>
                <div>High Risk</div>
                <div>6 months</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormulaTestingPage;
