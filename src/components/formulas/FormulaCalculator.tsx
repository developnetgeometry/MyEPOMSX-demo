import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calculator, History, Info, AlertCircle } from "lucide-react";
import { useFormula } from "@/hooks/useFormula";
import {
  FormulaType,
  FormulaVariant,
  FormulaInput,
  FormulaConfig,
} from "@/types/formulas";

interface FormulaCalculatorProps {
  defaultFormulaType?: FormulaType;
  defaultVariant?: FormulaVariant;
  onResultChange?: (result: any) => void;
  showHistory?: boolean;
  className?: string;
}

interface FormInputs {
  [key: string]: string | number | boolean;
}

const FormulaCalculator: React.FC<FormulaCalculatorProps> = ({
  defaultFormulaType = "DTHIN",
  defaultVariant = "DTHIN_1",
  onResultChange,
  showHistory = true,
  className = "",
}) => {
  const {
    result,
    error,
    isCalculating,
    history,
    calculate,
    clearResult,
    clearHistory,
    getAvailableFormulas,
    getFormulasByType,
    getFormulaConfig,
  } = useFormula();

  const [selectedType, setSelectedType] =
    useState<FormulaType>(defaultFormulaType);
  const [selectedVariant, setSelectedVariant] =
    useState<FormulaVariant>(defaultVariant);
  const [formInputs, setFormInputs] = useState<FormInputs>({});
  const [activeTab, setActiveTab] = useState("calculator");

  // Get available formulas and configs
  const allFormulas = getAvailableFormulas();
  const formulasByType = getFormulasByType(selectedType);
  const currentConfig = getFormulaConfig(selectedVariant);

  // Update variant when type changes
  useEffect(() => {
    const typeFormulas = getFormulasByType(selectedType);
    if (
      typeFormulas.length > 0 &&
      !typeFormulas.find((f) => f.variant === selectedVariant)
    ) {
      setSelectedVariant(typeFormulas[0].variant);
    }
  }, [selectedType, selectedVariant, getFormulasByType]);

  // Reset form inputs when variant changes
  useEffect(() => {
    setFormInputs({});
  }, [selectedVariant]);

  // Notify parent of result changes
  useEffect(() => {
    if (onResultChange && (result || error)) {
      onResultChange(result || error);
    }
  }, [result, error, onResultChange]);

  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setFormInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCalculate = async () => {
    if (!currentConfig) return;

    // Convert form inputs to proper types
    const inputs: FormulaInput = {};
    Object.entries(formInputs).forEach(([key, value]) => {
      if (typeof value === "string" && !isNaN(Number(value)) && value !== "") {
        inputs[key] = Number(value);
      } else if (
        typeof value === "string" &&
        (value === "true" || value === "false")
      ) {
        inputs[key] = value === "true";
      } else {
        inputs[key] = value;
      }
    });

    await calculate(selectedType, selectedVariant, inputs);
  };

  const renderInputField = (field: string, isRequired: boolean = false) => {
    const value = formInputs[field] || "";

    // Special handling for certain fields
    if (field === "coatingCondition") {
      return (
        <div key={field} className="space-y-2">
          <Label htmlFor={field}>
            {field.charAt(0).toUpperCase() +
              field.slice(1).replace(/([A-Z])/g, " $1")}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Select
            value={value.toString()}
            onValueChange={(val) => handleInputChange(field, val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select coating condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Excellent">Excellent</SelectItem>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Fair">Fair</SelectItem>
              <SelectItem value="Poor">Poor</SelectItem>
              <SelectItem value="Very Poor">Very Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (field === "inspectionQuality") {
      return (
        <div key={field} className="space-y-2">
          <Label htmlFor={field}>
            Inspection Quality
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Select
            value={value.toString()}
            onValueChange={(val) => handleInputChange(field, val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select inspection quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Poor">Poor</SelectItem>
              <SelectItem value="Fair">Fair</SelectItem>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Excellent">Excellent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (
      field.includes("susceptible") ||
      field.includes("Protection") ||
      field.includes("Activity")
    ) {
      return (
        <div key={field} className="space-y-2">
          <Label htmlFor={field}>
            {field.charAt(0).toUpperCase() +
              field.slice(1).replace(/([A-Z])/g, " $1")}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Select
            value={value.toString()}
            onValueChange={(val) => handleInputChange(field, val === "true")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    }

    return (
      <div key={field} className="space-y-2">
        <Label htmlFor={field}>
          {field.charAt(0).toUpperCase() +
            field.slice(1).replace(/([A-Z])/g, " $1")}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <Input
          id={field}
          type="number"
          step="0.0001"
          value={String(value)}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={`Enter ${field
            .replace(/([A-Z])/g, " $1")
            .toLowerCase()}`}
        />
      </div>
    );
  };

  const renderResult = () => {
    if (error) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Error:</strong> {error.message}
            {error.input && (
              <div className="mt-1 text-sm">Field: {error.input}</div>
            )}
          </AlertDescription>
        </Alert>
      );
    }

    if (!result) return null;

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Calculation Result
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">
                Result Value
              </Label>
              <div className="text-2xl font-bold text-primary">
                {result.value}
                {result.metadata?.unit && (
                  <span className="text-sm ml-1">({result.metadata.unit})</span>
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Formula</Label>
              <div className="text-sm font-mono bg-muted p-2 rounded">
                {result.formula}
              </div>
            </div>
          </div>

          {result.metadata && (
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Metadata</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {result.metadata.description && (
                  <div>
                    <strong>Description:</strong> {result.metadata.description}
                  </div>
                )}
                {result.metadata.range && (
                  <div>
                    <strong>Range:</strong> {result.metadata.range.min} -{" "}
                    {result.metadata.range.max}
                  </div>
                )}
                {result.metadata.notes && (
                  <div className="col-span-full">
                    <strong>Notes:</strong> {result.metadata.notes}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Risk Matrix specific result */}
          {result && "riskLevel" in result && (
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                Risk Assessment
              </Label>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  Level: {String(result.riskLevel)}
                </Badge>
                {"riskCategory" in result && (
                  <Badge variant="outline">
                    Category: {String(result.riskCategory)}
                  </Badge>
                )}
                {"priority" in result && (
                  <Badge variant="outline">
                    Priority: {String(result.priority)}
                  </Badge>
                )}
                {"inspectionInterval" in result &&
                  result.inspectionInterval && (
                    <Badge variant="outline">
                      Interval: {String(result.inspectionInterval)} months
                    </Badge>
                  )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderHistory = () => {
    if (history.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <History className="h-8 w-8 mx-auto mb-2" />
          <p>No calculation history available</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Calculation History</h3>
          <Button variant="outline" size="sm" onClick={clearHistory}>
            Clear History
          </Button>
        </div>
        <div className="space-y-3">
          {history.map((item, index) => (
            <Card key={index} className="p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <Badge variant="secondary" className="mb-1">
                    {item.formulaType} - {item.variant}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    {item.timestamp.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  {"value" in item.result ? (
                    <div className="font-semibold">{item.result.value}</div>
                  ) : (
                    <div className="text-red-500 text-sm">Error</div>
                  )}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Inputs: {Object.keys(item.inputs).length} parameters
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Formula Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="calculator">Calculator</TabsTrigger>
              {showHistory && (
                <TabsTrigger value="history">History</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="calculator" className="space-y-6">
              {/* Formula Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Formula Type</Label>
                  <Select
                    value={selectedType}
                    onValueChange={(value) =>
                      setSelectedType(value as FormulaType)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select formula type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DTHIN">
                        DTHIN - Thinning Damage Factor
                      </SelectItem>
                      <SelectItem value="DFEXT">
                        DFEXT - External Corrosion
                      </SelectItem>
                      <SelectItem value="DFCUI">
                        DFCUI - Corrosion Under Insulation
                      </SelectItem>
                      <SelectItem value="DFSCC">
                        DFSCC - Stress Corrosion Cracking
                      </SelectItem>
                      <SelectItem value="DFMFAT">
                        DFMFAT - Mechanical Fatigue
                      </SelectItem>
                      <SelectItem value="COF_PROD">
                        COF PROD - Production COF
                      </SelectItem>
                      <SelectItem value="COF_AREA">
                        COF AREA - Area COF
                      </SelectItem>
                      <SelectItem value="RISK_MATRIX">Risk Matrix</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Formula Variant</Label>
                  <Select
                    value={selectedVariant}
                    onValueChange={setSelectedVariant}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select variant" />
                    </SelectTrigger>
                    <SelectContent>
                      {formulasByType.map((formula) => (
                        <SelectItem
                          key={formula.variant}
                          value={formula.variant}
                        >
                          {formula.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Formula Info */}
              {currentConfig && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{currentConfig.name}</strong>
                    <br />
                    {currentConfig.description}
                    <br />
                    <span className="text-sm">
                      Required inputs: {currentConfig.requiredInputs.join(", ")}
                    </span>
                  </AlertDescription>
                </Alert>
              )}

              {/* Input Fields */}
              {currentConfig && (
                <div className="space-y-4">
                  <Separator />
                  <h4 className="font-medium">Required Inputs</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentConfig.requiredInputs.map((field) =>
                      renderInputField(field, true)
                    )}
                  </div>

                  {currentConfig.optionalInputs &&
                    currentConfig.optionalInputs.length > 0 && (
                      <>
                        <h4 className="font-medium">Optional Inputs</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {currentConfig.optionalInputs.map((field) =>
                            renderInputField(field, false)
                          )}
                        </div>
                      </>
                    )}
                </div>
              )}

              {/* Calculate Button */}
              <div className="flex justify-between items-center">
                <Button
                  onClick={handleCalculate}
                  disabled={isCalculating || !currentConfig}
                  className="px-8"
                >
                  {isCalculating ? "Calculating..." : "Calculate"}
                </Button>
                {(result || error) && (
                  <Button variant="outline" onClick={clearResult} size="sm">
                    Clear Result
                  </Button>
                )}
              </div>

              {/* Result Display */}
              {renderResult()}
            </TabsContent>

            {showHistory && (
              <TabsContent value="history">{renderHistory()}</TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormulaCalculator;
