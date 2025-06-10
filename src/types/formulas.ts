// Base interface for all formula inputs
export interface FormulaInput {
  [key: string]: number | string | boolean;
}

// Base interface for formula results
export interface FormulaResult {
  value: number;
  formula: string;
  inputs: Record<string, number>;
  metadata?: {
    description?: string;
    unit?: string;
    range?: { min: number; max: number };
    notes?: string;
  };
}

// Dthin Formula Types
export interface DthinInput extends FormulaInput {
  // Common parameters across all Dthin formulas
  nominalThickness?: number; // mm
  currentThickness?: number; // mm
  corrosionAllowance?: number; // mm
  corrosionRate?: number; // mm/year
  age?: number; // years

  // Specific parameters for different formula variants
  inspectionEffectiveness?: number; // 0-1
  confidenceFactor?: number; // 0-1
  managementFactor?: number; // 0-1
  complexityFactor?: number; // 0-1

  // Environmental factors
  environmentalSeverity?: number; // 0-1
  operatingConditions?: number; // 0-1

  // Material and design factors
  materialFactor?: number; // 0-1
  designMargin?: number; // 0-1

  // Inspection history
  lastInspectionDate?: string;
  inspectionQuality?: "Poor" | "Fair" | "Good" | "Excellent";

  // Additional parameters for specific formulas
  [key: string]: any;
}

// DFEXT Formula Types
export interface DFExtInput extends FormulaInput {
  externalCorrosionRate?: number;
  coatingCondition?: "Excellent" | "Good" | "Fair" | "Poor" | "Very Poor";
  cathodicProtection?: boolean;
  environmentalExposure?: string;
  soilType?: string;
  // Add more DFEXT specific parameters
}

// DFCUI Formula Types (Corrosion Under Insulation)
export interface DFCuiInput extends FormulaInput {
  operatingTemperature?: number; // °C
  insulationType?: "Mineral Wool" | "Calcium Silicate" | "Cellular Glass" | "Perlite" | "Polyurethane" | "Other";
  insulationCondition?: "Excellent" | "Good" | "Fair" | "Poor" | "Very Poor";
  moistureIngress?: "None" | "Low" | "Moderate" | "High" | "Severe";
  coatingCondition?: "Excellent" | "Good" | "Fair" | "Poor" | "Very Poor";
  environmentalSeverity?: "Low" | "Moderate" | "High" | "Severe";
  weatherExposure?: "Indoor" | "Sheltered" | "Exposed" | "Marine";
  operatingCycles?: number; // thermal cycles per year
  maintenanceFrequency?: number; // inspections per year
  age?: number; // years since installation
  // Add more DFCUI specific parameters
}

// DFSCC Formula Types (Stress Corrosion Cracking)
export interface DFSccInput extends FormulaInput {
  stressLevel?: number;
  susceptibleMaterial?: boolean;
  h2sContent?: number; // ppm
  chlorideContent?: number; // ppm
  temperature?: number; // °C
  // Add more DFSCC specific parameters
}

// DFMFAT Formula Types (Mechanical Fatigue)
export interface DFMfatInput extends FormulaInput {
  cycleCount?: number;
  stressRange?: number;
  fatigueLife?: number;
  vibrationLevel?: number;
  // Add more DFMFAT specific parameters
}

// COF Formula Types
export interface CofInput extends FormulaInput {
  productionImpact?: number;
  areaImpact?: number;
  safetyImpact?: number;
  environmentalImpact?: number;
  fluidInventory?: number;
  releaseRate?: number;
  // Add more COF specific parameters
}

// Risk Matrix Types
export interface RiskMatrixInput extends FormulaInput {
  pof: number; // Probability of Failure
  cof: number; // Consequence of Failure
}

export interface RiskMatrixResult extends FormulaResult {
  riskLevel: "Low" | "Medium-Low" | "Medium" | "Medium-High" | "High";
  riskCategory: "A" | "B" | "C" | "D" | "E";
  inspectionInterval?: number; // months
  priority: "Very Low" | "Low" | "Medium" | "High" | "Very High";
}

// Formula Registry Types
export type FormulaType =
  | "DTHIN"
  | "DFEXT"
  | "DFCUI"
  | "DFSCC"
  | "DFMFAT"
  | "COF_PROD"
  | "COF_AREA"
  | "RISK_MATRIX";

export type FormulaVariant = string; // e.g., 'DTHIN_1', 'DTHIN_2', etc.

export interface FormulaConfig {
  type: FormulaType;
  variant: FormulaVariant;
  name: string;
  description: string;
  requiredInputs: string[];
  optionalInputs?: string[];
  outputUnit?: string;
  category: string;
  version: string;
}

// Error handling
export interface FormulaError {
  code: string;
  message: string;
  input?: string;
  value?: any;
}
