import { formulaService } from "@/services/formulaService";
import { FormulaInput, FormulaResult, FormulaError } from "@/types/formulas";

/**
 * Uti      if (dthinInputs.h2sContent && typeof dthinInputs.h2sContent === 'number' && dthinInputs.h2sContent > 0) {
        variant = 'DTHIN_10'; // Sour water corrosion
      } else if (dthinInputs.temperature && typeof dthinInputs.temperature === 'number' && dthinInputs.temperature > 150) {
        variant = 'DTHIN_8'; // Caustic corrosion (high temp)
      } else if (dthinInputs.phLevel && typeof dthinInputs.phLevel === 'number' && dthinInputs.phLevel < 4) {
        variant = 'DTHIN_7'; // Acid corrosion
      } else if (dthinInputs.flowVelocity && typeof dthinInputs.flowVelocity === 'number' && dthinInputs.flowVelocity > 3) {
        variant = 'DTHIN_5'; // Flow-assisted corrosion
      }tions for integrating formula calculations into forms
 */

/**
 * Extract formula inputs from form data
 */
export const extractFormulaInputs = (
  formData: any,
  formulaType: string
): FormulaInput => {
  const inputs: FormulaInput = {};

  switch (formulaType) {
    case "DTHIN":
      // Extract thinning-related inputs
      if (formData.nominalThickness)
        inputs.nominalThickness = Number(formData.nominalThickness);
      if (formData.currentThickness)
        inputs.currentThickness = Number(formData.currentThickness);
      if (formData.corrosionAllowance)
        inputs.corrosionAllowance = Number(formData.corrosionAllowance);
      if (formData.corrosionRate)
        inputs.corrosionRate = Number(formData.corrosionRate);
      if (formData.internalCorrosion)
        inputs.corrosionRate = Number(formData.internalCorrosion);
      if (formData.externalCorrosion)
        inputs.externalCorrosionRate = Number(formData.externalCorrosion);
      if (formData.age) inputs.age = Number(formData.age);
      if (formData.installationDate) {
        const installDate = new Date(formData.installationDate);
        const currentDate = new Date();
        inputs.age =
          (currentDate.getTime() - installDate.getTime()) /
          (1000 * 60 * 60 * 24 * 365.25);
      }
      if (formData.temperature)
        inputs.temperature = Number(formData.temperature);
      if (formData.pressure) inputs.pressure = Number(formData.pressure);
      if (formData.h2sContent) inputs.h2sContent = Number(formData.h2sContent);
      if (formData.phLevel) inputs.phLevel = Number(formData.phLevel);
      if (formData.fluidVelocity)
        inputs.flowVelocity = Number(formData.fluidVelocity);
      if (formData.inspectionEffectiveness)
        inputs.inspectionEffectiveness = Number(
          formData.inspectionEffectiveness
        );
      break;

    case "DFEXT":
      // Extract external corrosion inputs
      if (formData.externalCorrosion)
        inputs.externalCorrosionRate = Number(formData.externalCorrosion);
      if (formData.coatingType) inputs.coatingCondition = formData.coatingType;
      if (formData.cathodicProtection)
        inputs.cathodicProtection = formData.cathodicProtection === "Yes";
      if (formData.environmentalExposure)
        inputs.environmentalExposure = formData.environmentalExposure;
      if (formData.soilType) inputs.soilType = formData.soilType;
      break;

    case "DFCUI":
      // Extract corrosion under insulation inputs
      if (formData.operatingTemperature)
        inputs.operatingTemperature = Number(formData.operatingTemperature);
      if (formData.temperature)
        inputs.operatingTemperature = Number(formData.temperature);
      if (formData.insulationType)
        inputs.insulationType = formData.insulationType;
      if (formData.insulationCondition)
        inputs.insulationCondition = formData.insulationCondition;
      if (formData.moistureIngress)
        inputs.moistureIngress = formData.moistureIngress;
      if (formData.coatingCondition)
        inputs.coatingCondition = formData.coatingCondition;
      if (formData.coatingType) inputs.coatingCondition = formData.coatingType;
      if (formData.environmentalSeverity)
        inputs.environmentalSeverity = formData.environmentalSeverity;
      if (formData.environmentalExposure)
        inputs.environmentalSeverity = formData.environmentalExposure;
      if (formData.weatherExposure)
        inputs.weatherExposure = formData.weatherExposure;
      if (formData.operatingCycles)
        inputs.operatingCycles = Number(formData.operatingCycles);
      if (formData.maintenanceFrequency)
        inputs.maintenanceFrequency = Number(formData.maintenanceFrequency);
      if (formData.age) inputs.age = Number(formData.age);
      if (formData.installationDate) {
        const installDate = new Date(formData.installationDate);
        const currentDate = new Date();
        inputs.age =
          (currentDate.getTime() - installDate.getTime()) /
          (1000 * 60 * 60 * 24 * 365.25);
      }
      break;

    case "DFSCC":
      // Extract stress corrosion cracking inputs
      if (formData.operatingPressure)
        inputs.stressLevel = Number(formData.operatingPressure);
      if (formData.material)
        inputs.susceptibleMaterial = checkSCCSusceptibility(formData.material);
      if (formData.temperature)
        inputs.temperature = Number(formData.temperature);
      if (formData.h2sContent) inputs.h2sContent = Number(formData.h2sContent);
      if (formData.chlorideContent)
        inputs.chlorideContent = Number(formData.chlorideContent);
      break;

    case "DFMFAT":
      // Extract mechanical fatigue inputs
      if (formData.cycleCount) inputs.cycleCount = Number(formData.cycleCount);
      if (formData.operatingPressure && formData.designPressure) {
        inputs.stressRange = Math.abs(
          Number(formData.operatingPressure) - Number(formData.designPressure)
        );
      }
      if (formData.vibrationLevel)
        inputs.vibrationLevel = Number(formData.vibrationLevel);
      break;

    case "COF_PROD":
      // Extract production COF inputs
      if (formData.productionImpact)
        inputs.productionImpact = Number(formData.productionImpact);
      if (formData.fluidInventory)
        inputs.fluidInventory = Number(formData.fluidInventory);
      if (formData.releaseRate)
        inputs.releaseRate = Number(formData.releaseRate);
      break;

    case "COF_AREA":
      // Extract area COF inputs
      if (formData.areaImpact) inputs.areaImpact = Number(formData.areaImpact);
      if (formData.safetyImpact)
        inputs.safetyImpact = Number(formData.safetyImpact);
      if (formData.environmentalImpact)
        inputs.environmentalImpact = Number(formData.environmentalImpact);
      break;

    case "RISK_MATRIX":
      // Extract risk matrix inputs
      if (formData.pof) inputs.pof = Number(formData.pof);
      if (formData.cof) inputs.cof = Number(formData.cof);
      if (formData.cofFinancial) inputs.cof = Number(formData.cofFinancial);
      if (formData.cofArea) inputs.cof = Number(formData.cofArea);
      break;
  }

  return inputs;
};

/**
 * Check if material is susceptible to SCC
 */
const checkSCCSusceptibility = (material: string): boolean => {
  const susceptibleMaterials = [
    "austenitic stainless steel",
    "carbon steel",
    "low alloy steel",
    "duplex stainless steel",
  ];

  return susceptibleMaterials.some((mat) =>
    material.toLowerCase().includes(mat.toLowerCase())
  );
};

/**
 * Calculate automatic damage factors based on form data
 */
export const calculateAutomaticDamageFactors = async (formData: any) => {
  const results: { [key: string]: FormulaResult | FormulaError } = {};

  try {
    // Calculate DTHIN if we have enough data
    const dthinInputs = extractFormulaInputs(formData, "DTHIN");
    if (dthinInputs.nominalThickness && dthinInputs.currentThickness) {
      // Determine best DTHIN variant based on available data
      let variant = "DTHIN_17"; // Default to uniform corrosion

      if (
        dthinInputs.h2sContent &&
        typeof dthinInputs.h2sContent === "number" &&
        dthinInputs.h2sContent > 0
      ) {
        variant = "DTHIN_10"; // Sour water corrosion
      } else if (
        dthinInputs.temperature &&
        typeof dthinInputs.temperature === "number" &&
        dthinInputs.temperature > 150
      ) {
        variant = "DTHIN_8"; // Caustic corrosion (high temp)
      } else if (
        dthinInputs.phLevel &&
        typeof dthinInputs.phLevel === "number" &&
        dthinInputs.phLevel < 4
      ) {
        variant = "DTHIN_7"; // Acid corrosion
      } else if (
        dthinInputs.flowVelocity &&
        typeof dthinInputs.flowVelocity === "number" &&
        dthinInputs.flowVelocity > 3
      ) {
        variant = "DTHIN_5"; // Flow-assisted corrosion
      }

      results.dthin = await formulaService.calculate(
        "DTHIN",
        variant,
        dthinInputs
      );
    }

    // Calculate DFEXT if we have external corrosion data
    const dfextInputs = extractFormulaInputs(formData, "DFEXT");
    if (dfextInputs.externalCorrosionRate) {
      results.dfext = await formulaService.calculate(
        "DFEXT",
        "DFEXT_BASIC",
        dfextInputs
      );
    }

    // Calculate DFCUI if we have CUI susceptibility data
    const dfcuiInputs = extractFormulaInputs(formData, "DFCUI");
    if (dfcuiInputs.operatingTemperature && dfcuiInputs.insulationType) {
      // Choose variant based on available data
      const cuiVariant =
        dfcuiInputs.weatherExposure && dfcuiInputs.maintenanceFrequency
          ? "DFCUI_ADVANCED"
          : "DFCUI_BASIC";

      results.dfcui = await formulaService.calculate(
        "DFCUI",
        cuiVariant,
        dfcuiInputs
      );
    }

    // Calculate DFSCC if we have stress corrosion data
    const dfsccInputs = extractFormulaInputs(formData, "DFSCC");
    if (dfsccInputs.stressLevel && dfsccInputs.susceptibleMaterial) {
      results.dfscc = await formulaService.calculate(
        "DFSCC",
        "DFSCC_BASIC",
        dfsccInputs
      );
    }

    // Calculate DFMFAT if we have fatigue data
    const dfmfatInputs = extractFormulaInputs(formData, "DFMFAT");
    if (dfmfatInputs.cycleCount && dfmfatInputs.stressRange) {
      results.dfmfat = await formulaService.calculate(
        "DFMFAT",
        "DFMFAT_BASIC",
        dfmfatInputs
      );
    }

    // Calculate COF if we have consequence data
    const cofProdInputs = extractFormulaInputs(formData, "COF_PROD");
    if (cofProdInputs.productionImpact && cofProdInputs.fluidInventory) {
      results.cofProd = await formulaService.calculate(
        "COF_PROD",
        "COF_PROD_FIN",
        cofProdInputs
      );
    }

    const cofAreaInputs = extractFormulaInputs(formData, "COF_AREA");
    if (cofAreaInputs.areaImpact && cofAreaInputs.safetyImpact) {
      results.cofArea = await formulaService.calculate(
        "COF_AREA",
        "COF_AREA",
        cofAreaInputs
      );
    }

    // Calculate Risk Matrix if we have PoF and CoF
    const riskInputs = extractFormulaInputs(formData, "RISK_MATRIX");
    if (riskInputs.pof && riskInputs.cof) {
      results.riskMatrix = await formulaService.calculate(
        "RISK_MATRIX",
        "RISK_MATRIX",
        riskInputs
      );
    }
  } catch (error) {
    console.error("Error calculating automatic damage factors:", error);
  }

  return results;
};

/**
 * Update form data with calculated values
 */
export const updateFormWithCalculatedValues = (
  formData: any,
  calculationResults: any
) => {
  const updatedFormData = { ...formData };

  // Update DTHIN results
  if (calculationResults.dthin && "value" in calculationResults.dthin) {
    updatedFormData.dfthin = calculationResults.dthin.value;
  }

  // Update DFEXT results
  if (calculationResults.dfext && "value" in calculationResults.dfext) {
    updatedFormData.dfext = calculationResults.dfext.value;
  }

  // Update DFCUI results
  if (calculationResults.dfcui && "value" in calculationResults.dfcui) {
    updatedFormData.dfcui = calculationResults.dfcui.value;
  }

  // Update DFSCC results
  if (calculationResults.dfscc && "value" in calculationResults.dfscc) {
    updatedFormData.dfscc = calculationResults.dfscc.value;
  }

  // Update DFMFAT results
  if (calculationResults.dfmfat && "value" in calculationResults.dfmfat) {
    updatedFormData.dfmfat = calculationResults.dfmfat.value;
  }

  // Update COF results
  if (calculationResults.cofProd && "value" in calculationResults.cofProd) {
    updatedFormData.cofFinancial = calculationResults.cofProd.value;
  }

  if (calculationResults.cofArea && "value" in calculationResults.cofArea) {
    updatedFormData.cofArea = calculationResults.cofArea.value;
  }

  // Update Risk Matrix results
  if (
    calculationResults.riskMatrix &&
    "value" in calculationResults.riskMatrix
  ) {
    const riskResult = calculationResults.riskMatrix;
    updatedFormData.riskRanking = riskResult.riskLevel;
    updatedFormData.riskLevel = riskResult.riskLevel;
    updatedFormData.riskCategory = riskResult.riskCategory;
    updatedFormData.priority = riskResult.priority;
    if (riskResult.inspectionInterval) {
      updatedFormData.inspectionInterval = riskResult.inspectionInterval;
    }
  }

  return updatedFormData;
};

/**
 * Validate if form data is sufficient for calculations
 */
export const validateCalculationInputs = (
  formData: any,
  formulaType: string
): string[] => {
  const errors: string[] = [];
  const config = formulaService.getFormulaConfig(`${formulaType}_BASIC`);

  if (!config) {
    errors.push(`Formula configuration not found for ${formulaType}`);
    return errors;
  }

  const inputs = extractFormulaInputs(formData, formulaType);

  for (const required of config.requiredInputs) {
    if (
      !(required in inputs) ||
      inputs[required] === undefined ||
      inputs[required] === null
    ) {
      errors.push(
        `Required field '${required}' is missing for ${formulaType} calculation`
      );
    }
  }

  return errors;
};

/**
 * Get recommended formula variant based on form data
 */
export const getRecommendedFormulaVariant = (
  formData: any,
  formulaType: string
): string => {
  if (formulaType !== "DTHIN") {
    return `${formulaType}_BASIC`;
  }

  // Determine best DTHIN variant based on available data
  if (formData.h2sContent && Number(formData.h2sContent) > 0) {
    return "DTHIN_10"; // Sour water corrosion
  }

  if (formData.temperature && Number(formData.temperature) > 150) {
    if (
      formData.service &&
      formData.service.toLowerCase().includes("caustic")
    ) {
      return "DTHIN_8"; // Caustic corrosion
    }
    return "DTHIN_11"; // High temperature
  }

  if (formData.phLevel && Number(formData.phLevel) < 4) {
    return "DTHIN_7"; // Acid corrosion
  }

  if (formData.fluidVelocity && Number(formData.fluidVelocity) > 3) {
    return "DTHIN_5"; // Flow-assisted corrosion
  }

  if (formData.service && formData.service.toLowerCase().includes("amine")) {
    return "DTHIN_9"; // Amine corrosion
  }

  if (
    formData.environmentalExposure &&
    formData.environmentalExposure.toLowerCase().includes("atmospheric")
  ) {
    return "DTHIN_14"; // Atmospheric corrosion
  }

  return "DTHIN_17"; // Default to uniform corrosion
};

export default {
  extractFormulaInputs,
  calculateAutomaticDamageFactors,
  updateFormWithCalculatedValues,
  validateCalculationInputs,
  getRecommendedFormulaVariant,
};
