import {
  FormulaInput,
  FormulaResult,
  FormulaError,
  FormulaType,
  FormulaVariant,
  FormulaConfig,
  DthinInput,
  DFExtInput,
  DFCuiInput,
  DFSccInput,
  DFMfatInput,
  CofInput,
  RiskMatrixInput,
  RiskMatrixResult,
} from "@/types/formulas";

/**
 * Main Formula Service for Enterprise Asset Management System (EPOMSX)
 * Handles all formula calculations including Dthin, DFEXT, DFSCC, DFMFAT, COF, and Risk Matrix
 */
export class FormulaService {
  private static instance: FormulaService;
  private formulaRegistry: Map<string, FormulaConfig> = new Map();

  private constructor() {
    this.initializeFormulaRegistry();
  }

  static getInstance(): FormulaService {
    if (!FormulaService.instance) {
      FormulaService.instance = new FormulaService();
    }
    return FormulaService.instance;
  }

  /**
   * Initialize formula registry with all available formulas
   */
  private initializeFormulaRegistry(): void {
    // Register Dthin formulas (17 variants)
    this.registerDthinFormulas();

    // Register other formula types
    this.registerOtherFormulas();
  }

  /**
   * Register all Dthin formula variants
   */
  private registerDthinFormulas(): void {
    const dthinVariants = [
      {
        variant: "DTHIN_1",
        name: "Basic Thinning",
        description: "Basic thinning damage factor calculation",
      },
      {
        variant: "DTHIN_2",
        name: "Localized Thinning",
        description: "Localized thinning damage factor",
      },
      {
        variant: "DTHIN_3",
        name: "General Thinning",
        description: "General thinning damage factor",
      },
      {
        variant: "DTHIN_4",
        name: "Erosion Thinning",
        description: "Erosion-induced thinning damage factor",
      },
      {
        variant: "DTHIN_5",
        name: "Flow-Assisted Corrosion",
        description: "Flow-assisted corrosion thinning",
      },
      {
        variant: "DTHIN_6",
        name: "Microbiologically Influenced Corrosion",
        description: "MIC-induced thinning",
      },
      {
        variant: "DTHIN_7",
        name: "Acid Corrosion",
        description: "Acid corrosion thinning damage factor",
      },
      {
        variant: "DTHIN_8",
        name: "Caustic Corrosion",
        description: "Caustic corrosion thinning",
      },
      {
        variant: "DTHIN_9",
        name: "Amine Corrosion",
        description: "Amine-induced corrosion thinning",
      },
      {
        variant: "DTHIN_10",
        name: "Sour Water Corrosion",
        description: "Sour water corrosion thinning",
      },
      {
        variant: "DTHIN_11",
        name: "High Temperature H2/H2S",
        description: "High temperature hydrogen damage",
      },
      {
        variant: "DTHIN_12",
        name: "Sulfidic Corrosion",
        description: "Sulfidic corrosion thinning",
      },
      {
        variant: "DTHIN_13",
        name: "Naphthenic Acid Corrosion",
        description: "Naphthenic acid corrosion",
      },
      {
        variant: "DTHIN_14",
        name: "Atmospheric Corrosion",
        description: "Atmospheric corrosion thinning",
      },
      {
        variant: "DTHIN_15",
        name: "Cooling Water Corrosion",
        description: "Cooling water system corrosion",
      },
      {
        variant: "DTHIN_16",
        name: "Galvanic Corrosion",
        description: "Galvanic corrosion thinning",
      },
      {
        variant: "DTHIN_17",
        name: "Uniform Corrosion",
        description: "Uniform corrosion damage factor",
      },
    ];

    dthinVariants.forEach(({ variant, name, description }) => {
      this.formulaRegistry.set(variant, {
        type: "DTHIN",
        variant,
        name,
        description,
        requiredInputs: [
          "nominalThickness",
          "currentThickness",
          "corrosionRate",
          "age",
        ],
        optionalInputs: [
          "corrosionAllowance",
          "inspectionEffectiveness",
          "confidenceFactor",
        ],
        outputUnit: "dimensionless",
        category: "Damage Factor",
        version: "1.0",
      });
    });
  }

  /**
   * Register other formula types
   */
  private registerOtherFormulas(): void {
    // DFEXT formulas
    this.formulaRegistry.set("DFEXT_BASIC", {
      type: "DFEXT",
      variant: "DFEXT_BASIC",
      name: "External Corrosion Damage Factor",
      description: "Basic external corrosion damage factor calculation",
      requiredInputs: ["externalCorrosionRate", "coatingCondition"],
      optionalInputs: ["cathodicProtection", "environmentalExposure"],
      outputUnit: "dimensionless",
      category: "Damage Factor",
      version: "1.0",
    });

    // DFSCC formulas
    this.formulaRegistry.set("DFSCC_BASIC", {
      type: "DFSCC",
      variant: "DFSCC_BASIC",
      name: "Stress Corrosion Cracking Damage Factor",
      description: "Basic SCC damage factor calculation",
      requiredInputs: ["stressLevel", "susceptibleMaterial", "temperature"],
      optionalInputs: ["h2sContent", "chlorideContent"],
      outputUnit: "dimensionless",
      category: "Damage Factor",
      version: "1.0",
    });

    // DFMFAT formulas
    this.formulaRegistry.set("DFMFAT_BASIC", {
      type: "DFMFAT",
      variant: "DFMFAT_BASIC",
      name: "Mechanical Fatigue Damage Factor",
      description: "Basic mechanical fatigue damage factor calculation",
      requiredInputs: ["cycleCount", "stressRange"],
      optionalInputs: ["fatigueLife", "vibrationLevel"],
      outputUnit: "dimensionless",
      category: "Damage Factor",
      version: "1.0",
    });

    // COF formulas
    this.formulaRegistry.set("COF_PROD_FIN", {
      type: "COF_PROD",
      variant: "COF_PROD_FIN",
      name: "Production Financial COF",
      description: "Production financial consequence of failure",
      requiredInputs: ["productionImpact", "fluidInventory"],
      optionalInputs: ["releaseRate"],
      outputUnit: "RM",
      category: "Consequence of Failure",
      version: "1.0",
    });

    this.formulaRegistry.set("COF_AREA", {
      type: "COF_AREA",
      variant: "COF_AREA",
      name: "Area COF",
      description: "Area-based consequence of failure",
      requiredInputs: ["areaImpact", "safetyImpact"],
      optionalInputs: ["environmentalImpact"],
      outputUnit: "m²",
      category: "Consequence of Failure",
      version: "1.0",
    });

    // DFCUI formulas
    this.formulaRegistry.set("DFCUI_BASIC", {
      type: "DFCUI",
      variant: "DFCUI_BASIC",
      name: "Corrosion Under Insulation Damage Factor",
      description: "Basic CUI damage factor calculation",
      requiredInputs: ["operatingTemperature", "insulationType", "insulationCondition"],
      optionalInputs: ["moistureIngress", "coatingCondition", "environmentalSeverity", "operatingCycles"],
      outputUnit: "dimensionless",
      category: "Damage Factor",
      version: "1.0",
    });

    this.formulaRegistry.set("DFCUI_ADVANCED", {
      type: "DFCUI",
      variant: "DFCUI_ADVANCED",
      name: "Advanced CUI Damage Factor",
      description: "Advanced CUI calculation with weather exposure factors",
      requiredInputs: ["operatingTemperature", "insulationType", "insulationCondition", "weatherExposure"],
      optionalInputs: ["moistureIngress", "coatingCondition", "environmentalSeverity", "operatingCycles", "maintenanceFrequency"],
      outputUnit: "dimensionless",
      category: "Damage Factor",
      version: "1.0",
    });

    // Risk Matrix
    this.formulaRegistry.set("RISK_MATRIX", {
      type: "RISK_MATRIX",
      variant: "RISK_MATRIX",
      name: "Risk Matrix Calculation",
      description: "Risk matrix ranking and categorization",
      requiredInputs: ["pof", "cof"],
      optionalInputs: [],
      outputUnit: "risk_level",
      category: "Risk Assessment",
      version: "1.0",
    });
  }

  /**
   * Calculate formula based on type and inputs
   */
  async calculate(
    formulaType: FormulaType,
    variant: FormulaVariant,
    inputs: FormulaInput
  ): Promise<FormulaResult | FormulaError> {
    try {
      const formulaKey = variant || `${formulaType}_BASIC`;
      const config = this.formulaRegistry.get(formulaKey);

      if (!config) {
        return {
          code: "FORMULA_NOT_FOUND",
          message: `Formula ${formulaKey} not found in registry`,
        };
      }

      // Validate required inputs
      const validationError = this.validateInputs(config, inputs);
      if (validationError) {
        return validationError;
      }

      // Route to appropriate calculation method
      switch (formulaType) {
        case "DTHIN":
          return this.calculateDthin(variant, inputs as DthinInput);
        case "DFEXT":
          return this.calculateDFExt(inputs as DFExtInput);
        case "DFCUI":
          return this.calculateDFCui(variant, inputs);
        case "DFSCC":
          return this.calculateDFScc(inputs as DFSccInput);
        case "DFMFAT":
          return this.calculateDFMfat(inputs as DFMfatInput);
        case "COF_PROD":
        case "COF_AREA":
          return this.calculateCOF(formulaType, inputs as CofInput);
        case "RISK_MATRIX":
          return this.calculateRiskMatrix(inputs as RiskMatrixInput);
        default:
          return {
            code: "UNSUPPORTED_FORMULA",
            message: `Formula type ${formulaType} is not supported`,
          };
      }
    } catch (error) {
      return {
        code: "CALCULATION_ERROR",
        message: `Error during calculation: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  /**
   * Validate formula inputs
   */
  private validateInputs(
    config: FormulaConfig,
    inputs: FormulaInput
  ): FormulaError | null {
    for (const required of config.requiredInputs) {
      if (
        !(required in inputs) ||
        inputs[required] === undefined ||
        inputs[required] === null
      ) {
        return {
          code: "MISSING_REQUIRED_INPUT",
          message: `Required input '${required}' is missing`,
          input: required,
        };
      }
    }
    return null;
  }

  /**
   * Calculate Dthin formulas (17 variants)
   */
  private calculateDthin(variant: string, inputs: DthinInput): FormulaResult {
    const {
      nominalThickness = 0,
      currentThickness = 0,
      corrosionRate = 0,
      age = 0,
    } = inputs;

    // Base calculation components
    const thinningLoss = nominalThickness - currentThickness;
    const predictedLoss = corrosionRate * age;
    const remainingThickness = currentThickness;
    const minimumThickness = nominalThickness * 0.5; // Assuming 50% of nominal as minimum

    let result = 0;
    let formula = "";

    switch (variant) {
      case "DTHIN_1": // Basic Thinning
        result = thinningLoss / nominalThickness;
        formula = "(tnom - tcurrent) / tnom";
        break;

      case "DTHIN_2": // Localized Thinning
        const localizationFactor = inputs.localizationFactor || 1.5;
        result = (thinningLoss * localizationFactor) / nominalThickness;
        formula = "((tnom - tcurrent) * localization_factor) / tnom";
        break;

      case "DTHIN_3": // General Thinning
        const uniformityFactor = inputs.uniformityFactor || 1.0;
        result = (thinningLoss * uniformityFactor) / nominalThickness;
        formula = "((tnom - tcurrent) * uniformity_factor) / tnom";
        break;

      case "DTHIN_4": // Erosion Thinning
        const erosionRate = inputs.erosionRate || corrosionRate * 2;
        const erosionFactor = erosionRate / corrosionRate;
        result = (thinningLoss * erosionFactor) / nominalThickness;
        formula = "((tnom - tcurrent) * erosion_factor) / tnom";
        break;

      case "DTHIN_5": // Flow-Assisted Corrosion
        const flowVelocity = inputs.flowVelocity || 1.0;
        const flowFactor = Math.min(flowVelocity / 3.0, 2.0); // Cap at 2.0
        result = (thinningLoss * (1 + flowFactor)) / nominalThickness;
        formula = "((tnom - tcurrent) * (1 + flow_factor)) / tnom";
        break;

      case "DTHIN_6": // Microbiologically Influenced Corrosion
        const micFactor = inputs.microbialActivity || 1.2;
        const oxygenLevel = inputs.oxygenLevel || 1.0;
        result = (thinningLoss * micFactor * oxygenLevel) / nominalThickness;
        formula = "((tnom - tcurrent) * mic_factor * oxygen_level) / tnom";
        break;

      case "DTHIN_7": // Acid Corrosion
        const phLevel = inputs.phLevel || 7.0;
        const acidFactor = phLevel < 4 ? Math.pow(7 - phLevel, 1.5) : 1.0;
        result = (thinningLoss * acidFactor) / nominalThickness;
        formula = "((tnom - tcurrent) * acid_factor) / tnom";
        break;

      case "DTHIN_8": // Caustic Corrosion
        const causticity = inputs.causticity || 1.0;
        const temperature = inputs.temperature || 25;
        const causticFactor = causticity * (1 + (temperature - 25) / 100);
        result = (thinningLoss * causticFactor) / nominalThickness;
        formula = "((tnom - tcurrent) * caustic_factor) / tnom";
        break;

      case "DTHIN_9": // Amine Corrosion
        const amineConc = inputs.amineConcentration || 0;
        const amineFactor = 1 + (amineConc / 100) * 0.5;
        result = (thinningLoss * amineFactor) / nominalThickness;
        formula = "((tnom - tcurrent) * amine_factor) / tnom";
        break;

      case "DTHIN_10": // Sour Water Corrosion
        const h2sContent = inputs.h2sContent || 0;
        const waterContent = inputs.waterContent || 0;
        const sourFactor = 1 + (h2sContent * waterContent) / 10000;
        result = (thinningLoss * sourFactor) / nominalThickness;
        formula = "((tnom - tcurrent) * sour_factor) / tnom";
        break;

      case "DTHIN_11": // High Temperature H2/H2S
        const h2Pressure = inputs.h2Pressure || 0;
        const tempFactor = Math.max(1.0, (inputs.temperature || 25) / 200);
        const h2Factor = 1 + (h2Pressure / 100) * tempFactor;
        result = (thinningLoss * h2Factor) / nominalThickness;
        formula = "((tnom - tcurrent) * h2_factor) / tnom";
        break;

      case "DTHIN_12": // Sulfidic Corrosion
        const sulfurContent = inputs.sulfurContent || 0;
        const sulfideFactor = 1 + (sulfurContent / 1000) * 2;
        result = (thinningLoss * sulfideFactor) / nominalThickness;
        formula = "((tnom - tcurrent) * sulfide_factor) / tnom";
        break;

      case "DTHIN_13": // Naphthenic Acid Corrosion
        const acidNumber = inputs.acidNumber || 0;
        const naphtheneFactor = 1 + (acidNumber / 10) * 1.5;
        result = (thinningLoss * naphtheneFactor) / nominalThickness;
        formula = "((tnom - tcurrent) * naphthene_factor) / tnom";
        break;

      case "DTHIN_14": // Atmospheric Corrosion
        const humidity = inputs.humidity || 50;
        const salinity = inputs.salinity || 0;
        const atmFactor = (humidity / 100) * (1 + salinity / 100);
        result = (thinningLoss * atmFactor) / nominalThickness;
        formula = "((tnom - tcurrent) * atmospheric_factor) / tnom";
        break;

      case "DTHIN_15": // Cooling Water Corrosion
        const chlorideLevel = inputs.chlorideContent || 0;
        const coolingFactor = 1 + (chlorideLevel / 1000) * 0.8;
        result = (thinningLoss * coolingFactor) / nominalThickness;
        formula = "((tnom - tcurrent) * cooling_factor) / tnom";
        break;

      case "DTHIN_16": // Galvanic Corrosion
        const potentialDiff = inputs.potentialDifference || 0;
        const galvanicFactor = 1 + Math.abs(potentialDiff) / 1000;
        result = (thinningLoss * galvanicFactor) / nominalThickness;
        formula = "((tnom - tcurrent) * galvanic_factor) / tnom";
        break;

      case "DTHIN_17": // Uniform Corrosion
      default:
        const inspectionEffectiveness = inputs.inspectionEffectiveness || 0.8;
        const confidenceFactor = inputs.confidenceFactor || 0.9;
        result =
          thinningLoss /
          nominalThickness /
          (inspectionEffectiveness * confidenceFactor);
        formula =
          "((tnom - tcurrent) / tnom) / (inspection_eff * confidence_factor)";
        break;
    }

    // Apply common adjustments
    const managementFactor = inputs.managementFactor || 1.0;
    const environmentalSeverity = inputs.environmentalSeverity || 1.0;

    result = result * managementFactor * environmentalSeverity;

    // Clamp result between 0 and 1
    result = Math.max(0, Math.min(1, result));

    return {
      value: Number(result.toFixed(4)),
      formula,
      inputs: {
        nominalThickness,
        currentThickness,
        corrosionRate,
        age,
        thinningLoss,
        managementFactor,
        environmentalSeverity,
      },
      metadata: {
        description: `Dthin calculation variant ${variant}`,
        unit: "dimensionless",
        range: { min: 0, max: 1 },
        notes: `Calculated using ${formula} with management and environmental adjustments`,
      },
    };
  }

  /**
   * Calculate DFEXT (External Corrosion Damage Factor)
   */
  private calculateDFExt(inputs: DFExtInput): FormulaResult {
    const {
      externalCorrosionRate = 0,
      coatingCondition = "Fair",
      cathodicProtection = false,
    } = inputs;

    // Coating condition factors
    const coatingFactors = {
      Excellent: 0.1,
      Good: 0.3,
      Fair: 0.6,
      Poor: 0.8,
      "Very Poor": 1.0,
    };

    const coatingFactor = coatingFactors[coatingCondition];
    const cpFactor = cathodicProtection ? 0.3 : 1.0;

    const result = (externalCorrosionRate / 1.0) * coatingFactor * cpFactor;

    return {
      value: Number(Math.min(1, result).toFixed(4)),
      formula: "(ext_corr_rate / 1.0) * coating_factor * cp_factor",
      inputs: {
        externalCorrosionRate,
        coatingFactor,
        cpFactor,
      },
      metadata: {
        description: "External corrosion damage factor",
        unit: "dimensionless",
        range: { min: 0, max: 1 },
      },
    };
  }

  /**
   * Calculate DFSCC (Stress Corrosion Cracking Damage Factor)
   */
  private calculateDFScc(inputs: DFSccInput): FormulaResult {
    const {
      stressLevel = 0,
      susceptibleMaterial = false,
      temperature = 25,
      h2sContent = 0,
      chlorideContent = 0,
    } = inputs;

    const stressFactor = Math.min(stressLevel / 100, 1.0);
    const materialFactor = susceptibleMaterial ? 1.0 : 0.1;
    const tempFactor = Math.max(1.0, (temperature - 60) / 100);
    const environmentFactor = 1 + (h2sContent + chlorideContent) / 10000;

    const result =
      stressFactor * materialFactor * tempFactor * environmentFactor;

    return {
      value: Number(Math.min(1, result).toFixed(4)),
      formula: "stress_factor * material_factor * temp_factor * env_factor",
      inputs: {
        stressFactor,
        materialFactor,
        tempFactor,
        environmentFactor,
      },
      metadata: {
        description: "Stress corrosion cracking damage factor",
        unit: "dimensionless",
        range: { min: 0, max: 1 },
      },
    };
  }

  /**
   * Calculate DFCUI (Corrosion Under Insulation Damage Factor)
   */
  private calculateDFCui(variant: string, inputs: DFCuiInput): FormulaResult {
    const {
      operatingTemperature = 25,
      insulationType = "Mineral Wool",
      insulationCondition = "Good",
      moistureIngress = "Low",
      coatingCondition = "Good",
      environmentalSeverity = "Moderate",
      weatherExposure = "Sheltered",
      operatingCycles = 10,
      maintenanceFrequency = 1,
      age = 10,
    } = inputs;

    // Temperature susceptibility factor (CUI most active 60-175°C)
    let tempFactor = 1.0;
    if (operatingTemperature >= 60 && operatingTemperature <= 175) {
      tempFactor = 2.0; // High susceptibility range
    } else if (operatingTemperature > 175 && operatingTemperature <= 300) {
      tempFactor = 1.5; // Moderate susceptibility
    } else if (operatingTemperature < 60) {
      tempFactor = 0.5; // Low susceptibility
    }

    // Insulation type factor
    const insulationFactors = {
      "Mineral Wool": 1.2,
      "Calcium Silicate": 1.0,
      "Cellular Glass": 0.3,
      "Perlite": 1.5,
      "Polyurethane": 0.8,
      "Other": 1.0,
    };
    const insulationFactor = insulationFactors[insulationType] || 1.0;

    // Insulation condition factor
    const conditionFactors = {
      "Excellent": 0.2,
      "Good": 0.5,
      "Fair": 1.0,
      "Poor": 2.0,
      "Very Poor": 3.0,
    };
    const insulationConditionFactor = conditionFactors[insulationCondition] || 1.0;

    // Moisture ingress factor
    const moistureFactors = {
      "None": 0.1,
      "Low": 0.5,
      "Moderate": 1.0,
      "High": 2.0,
      "Severe": 3.0,
    };
    const moistureFactor = moistureFactors[moistureIngress] || 1.0;

    // Coating condition factor
    const coatingFactor = conditionFactors[coatingCondition] || 1.0;

    // Environmental severity factor
    const environmentFactors = {
      "Low": 0.5,
      "Moderate": 1.0,
      "High": 1.5,
      "Severe": 2.0,
    };
    const environmentFactor = environmentFactors[environmentalSeverity] || 1.0;

    // Weather exposure factor
    const weatherFactors = {
      "Indoor": 0.3,
      "Sheltered": 0.7,
      "Exposed": 1.0,
      "Marine": 1.5,
    };
    const weatherFactor = weatherFactors[weatherExposure] || 1.0;

    // Thermal cycling factor
    const cyclingFactor = Math.min(operatingCycles / 50, 2.0);

    // Maintenance factor (inverse relationship - more maintenance = lower factor)
    const maintenanceFactor = Math.max(0.3, 1.0 - (maintenanceFrequency - 1) * 0.2);

    // Age factor
    const ageFactor = Math.min(age / 20, 1.5);

    // Calculate base DFCUI
    let result = tempFactor * 
                 insulationFactor * 
                 insulationConditionFactor * 
                 moistureFactor * 
                 coatingFactor * 
                 environmentFactor * 
                 weatherFactor * 
                 cyclingFactor * 
                 maintenanceFactor * 
                 ageFactor;

    // Apply variant-specific adjustments
    if (variant === "DFCUI_ADVANCED") {
      // Advanced variant includes additional weather and maintenance considerations
      result *= 1.2; // Additional complexity factor
    }

    // Normalize result to 0-1 range but allow values > 1 for high-risk scenarios
    result = Math.min(result, 5.0);

    return {
      value: Number(result.toFixed(4)),
      formula: variant === "DFCUI_ADVANCED" 
        ? "temp_factor * insulation_factor * condition_factor * moisture_factor * coating_factor * env_factor * weather_factor * cycling_factor * maintenance_factor * age_factor * 1.2"
        : "temp_factor * insulation_factor * condition_factor * moisture_factor * coating_factor * env_factor * weather_factor * cycling_factor * maintenance_factor * age_factor",
      inputs: {
        tempFactor,
        insulationFactor,
        insulationConditionFactor,
        moistureFactor,
        coatingFactor,
        environmentFactor,
        weatherFactor,
        cyclingFactor,
        maintenanceFactor,
        ageFactor,
      },
      metadata: {
        description: variant === "DFCUI_ADVANCED" 
          ? "Advanced corrosion under insulation damage factor with weather exposure considerations"
          : "Basic corrosion under insulation damage factor",
        unit: "dimensionless",
        range: { min: 0, max: 5 },
        notes: `CUI most active in temperature range 60-175°C. Current operating temperature: ${operatingTemperature}°C`,
      },
    };
  }

  /**
   * Calculate DFMFAT (Mechanical Fatigue Damage Factor)
   */
  private calculateDFMfat(inputs: DFMfatInput): FormulaResult {
    const { cycleCount = 0, stressRange = 0, fatigueLife = 1000000 } = inputs;

    const cycleFactor = cycleCount / fatigueLife;
    const stressFactor = Math.pow(stressRange / 100, 2);

    const result = cycleFactor * stressFactor;

    return {
      value: Number(Math.min(1, result).toFixed(4)),
      formula: "(cycle_count / fatigue_life) * (stress_range / 100)^2",
      inputs: {
        cycleCount,
        fatigueLife,
        stressRange,
        cycleFactor,
        stressFactor,
      },
      metadata: {
        description: "Mechanical fatigue damage factor",
        unit: "dimensionless",
        range: { min: 0, max: 1 },
      },
    };
  }

  /**
   * Calculate COF (Consequence of Failure)
   */
  private calculateCOF(
    type: "COF_PROD" | "COF_AREA",
    inputs: CofInput
  ): FormulaResult {
    if (type === "COF_PROD") {
      const { productionImpact = 0, fluidInventory = 0 } = inputs;
      const result = productionImpact * fluidInventory * 1000; // Convert to RM

      return {
        value: Number(result.toFixed(2)),
        formula: "production_impact * fluid_inventory * 1000",
        inputs: { productionImpact, fluidInventory },
        metadata: {
          description: "Production financial consequence of failure",
          unit: "RM",
          range: { min: 0, max: 10000000 },
        },
      };
    } else {
      const { areaImpact = 0, safetyImpact = 0 } = inputs;
      const result = areaImpact * safetyImpact;

      return {
        value: Number(result.toFixed(2)),
        formula: "area_impact * safety_impact",
        inputs: { areaImpact, safetyImpact },
        metadata: {
          description: "Area-based consequence of failure",
          unit: "m²",
          range: { min: 0, max: 10000 },
        },
      };
    }
  }

  /**
   * Calculate Risk Matrix
   */
  private calculateRiskMatrix(inputs: RiskMatrixInput): RiskMatrixResult {
    const { pof, cof } = inputs;

    // Risk matrix calculation
    const riskScore = pof * cof;

    let riskLevel: RiskMatrixResult["riskLevel"];
    let riskCategory: RiskMatrixResult["riskCategory"];
    let priority: RiskMatrixResult["priority"];
    let inspectionInterval: number;

    if (riskScore < 0.001) {
      riskLevel = "Low";
      riskCategory = "A";
      priority = "Very Low";
      inspectionInterval = 60;
    } else if (riskScore < 0.01) {
      riskLevel = "Medium-Low";
      riskCategory = "B";
      priority = "Low";
      inspectionInterval = 36;
    } else if (riskScore < 0.1) {
      riskLevel = "Medium";
      riskCategory = "C";
      priority = "Medium";
      inspectionInterval = 24;
    } else if (riskScore < 1.0) {
      riskLevel = "Medium-High";
      riskCategory = "D";
      priority = "High";
      inspectionInterval = 12;
    } else {
      riskLevel = "High";
      riskCategory = "E";
      priority = "Very High";
      inspectionInterval = 6;
    }

    return {
      value: Number(riskScore.toFixed(6)),
      formula: "pof * cof",
      inputs: { pof, cof },
      riskLevel,
      riskCategory,
      inspectionInterval,
      priority,
      metadata: {
        description: "Risk matrix calculation",
        unit: "risk_score",
        range: { min: 0, max: 10 },
        notes: `Risk Level: ${riskLevel}, Category: ${riskCategory}, Priority: ${priority}`,
      },
    };
  }

  /**
   * Get available formulas
   */
  getAvailableFormulas(): FormulaConfig[] {
    return Array.from(this.formulaRegistry.values());
  }

  /**
   * Get formula configuration
   */
  getFormulaConfig(variant: string): FormulaConfig | undefined {
    return this.formulaRegistry.get(variant);
  }

  /**
   * Get formulas by type
   */
  getFormulasByType(type: FormulaType): FormulaConfig[] {
    return Array.from(this.formulaRegistry.values()).filter(
      (config) => config.type === type
    );
  }
}

// Export singleton instance
export const formulaService = FormulaService.getInstance();
export default formulaService;
