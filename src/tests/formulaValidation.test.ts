/**
 * Formula Validation Tests
 *
 * This file contains comprehensive tests to validate the mathematical accuracy
 * of all formula implementations in the EPOMSX system.
 */

import { formulaService } from "@/services/formulaService";
import { FormulaInput } from "@/types/formulas";

describe("Formula Service Validation", () => {
  describe("DTHIN Formula Variants", () => {
    test("DTHIN_1 - Basic Thinning", async () => {
      const inputs: FormulaInput = {
        nominalThickness: 10.0,
        currentThickness: 8.5,
        corrosionAllowance: 1.5,
      };

      const result = await formulaService.calculate("DTHIN", "DTHIN_1", inputs);

      expect(result).toHaveProperty("value");
      if ("value" in result) {
        // Expected: (10 - 8.5) / 10 = 0.15
        expect(result.value).toBeCloseTo(0.15, 3);
      }
    });

    test("DTHIN_2 - Localized Thinning", async () => {
      const inputs: FormulaInput = {
        nominalThickness: 10.0,
        currentThickness: 7.0,
        corrosionAllowance: 1.5,
        localizationFactor: 1.5,
      };

      const result = await formulaService.calculate("DTHIN", "DTHIN_2", inputs);

      expect(result).toHaveProperty("value");
      if ("value" in result) {
        // Expected: ((10 - 7) * 1.5) / 10 = 0.45
        expect(result.value).toBeCloseTo(0.45, 3);
      }
    });

    test("DTHIN_5 - Flow-Assisted Corrosion", async () => {
      const inputs: FormulaInput = {
        nominalThickness: 10.0,
        currentThickness: 8.0,
        flowVelocity: 4.0,
      };

      const result = await formulaService.calculate("DTHIN", "DTHIN_5", inputs);

      expect(result).toHaveProperty("value");
      if ("value" in result) {
        // Flow factor = min(4.0/3.0, 2.0) = 1.33
        // Expected: (2.0 * (1 + 1.33)) / 10 = 0.466
        expect(result.value).toBeCloseTo(0.466, 3);
      }
    });

    test("DTHIN_10 - High Temp H2/H2S", async () => {
      const inputs: FormulaInput = {
        nominalThickness: 12.0,
        currentThickness: 9.0,
        temperature: 200,
        h2sContent: 50,
      };

      const result = await formulaService.calculate(
        "DTHIN",
        "DTHIN_10",
        inputs
      );

      expect(result).toHaveProperty("value");
      if ("value" in result) {
        // Temperature factor = 200/100 = 2.0
        // H2S factor = 50/100 = 0.5
        // Combined factor = 2.0 + 0.5 = 2.5
        // Expected: (3.0 * 2.5) / 12 = 0.625
        expect(result.value).toBeCloseTo(0.625, 3);
      }
    });
  });

  describe("DFEXT - External Corrosion", () => {
    test("DFEXT_BASIC - Basic External Corrosion", async () => {
      const inputs: FormulaInput = {
        externalCorrosionRate: 0.05,
        age: 10,
        coatingCondition: "Poor",
        cathodicProtection: false,
      };

      const result = await formulaService.calculate(
        "DFEXT",
        "DFEXT_BASIC",
        inputs
      );

      expect(result).toHaveProperty("value");
      if ("value" in result) {
        // Base factor = 0.05 * 10 = 0.5
        // Coating factor (Poor) = 2.0
        // CP factor (false) = 1.5
        // Expected: 0.5 * 2.0 * 1.5 = 1.5
        expect(result.value).toBeCloseTo(1.5, 2);
      }
    });
  });

  describe("DFSCC - Stress Corrosion Cracking", () => {
    test("DFSCC_BASIC - Basic SCC", async () => {
      const inputs: FormulaInput = {
        stressLevel: 80,
        susceptibleMaterial: true,
        temperature: 150,
        h2sContent: 20,
      };

      const result = await formulaService.calculate(
        "DFSCC",
        "DFSCC_BASIC",
        inputs
      );

      expect(result).toHaveProperty("value");
      if ("value" in result) {
        // Stress factor = 80/100 = 0.8
        // Material factor = 1.5 (susceptible)
        // Temperature factor = 150/100 = 1.5
        // H2S factor = 20/100 = 0.2
        // Expected: 0.8 * 1.5 * 1.5 * (1 + 0.2) = 2.16
        expect(result.value).toBeCloseTo(2.16, 2);
      }
    });
  });

  describe("DFMFAT - Mechanical Fatigue", () => {
    test("DFMFAT_BASIC - Basic Fatigue", async () => {
      const inputs: FormulaInput = {
        cycleCount: 100000,
        stressRange: 50,
        vibrationLevel: 2.0,
      };

      const result = await formulaService.calculate(
        "DFMFAT",
        "DFMFAT_BASIC",
        inputs
      );

      expect(result).toHaveProperty("value");
      if ("value" in result) {
        // Cycle factor = log10(100000) = 5.0
        // Stress factor = 50/100 = 0.5
        // Vibration factor = 2.0
        // Expected: 5.0 * 0.5 * 2.0 = 5.0
        expect(result.value).toBeCloseTo(5.0, 2);
      }
    });
  });

  describe("COF - Consequence of Failure", () => {
    test("COF_PROD_FIN - Production Financial Impact", async () => {
      const inputs: FormulaInput = {
        productionImpact: 1000000,
        fluidInventory: 500,
        releaseRate: 10,
      };

      const result = await formulaService.calculate(
        "COF_PROD",
        "COF_PROD_FIN",
        inputs
      );

      expect(result).toHaveProperty("value");
      if ("value" in result) {
        expect(result.value).toBeGreaterThan(0);
      }
    });

    test("COF_AREA - Area Impact", async () => {
      const inputs: FormulaInput = {
        areaImpact: 5000,
        safetyImpact: 8,
        environmentalImpact: 6,
      };

      const result = await formulaService.calculate(
        "COF_AREA",
        "COF_AREA",
        inputs
      );

      expect(result).toHaveProperty("value");
      if ("value" in result) {
        expect(result.value).toBeGreaterThan(0);
      }
    });
  });

  describe("RISK_MATRIX - Risk Assessment", () => {
    test("RISK_MATRIX - Risk Calculation", async () => {
      const inputs: FormulaInput = {
        pof: 3,
        cof: 4,
      };

      const result = await formulaService.calculate(
        "RISK_MATRIX",
        "RISK_MATRIX",
        inputs
      );

      expect(result).toHaveProperty("value");
      if ("value" in result) {
        expect(result.value).toBe(12); // 3 * 4 = 12
        expect(result.riskLevel).toBe("Medium");
        expect(result.riskCategory).toBe("B");
        expect(result.inspectionInterval).toBe(36);
      }
    });

    test("RISK_MATRIX - High Risk Scenario", async () => {
      const inputs: FormulaInput = {
        pof: 5,
        cof: 5,
      };

      const result = await formulaService.calculate(
        "RISK_MATRIX",
        "RISK_MATRIX",
        inputs
      );

      expect(result).toHaveProperty("value");
      if ("value" in result) {
        expect(result.value).toBe(25); // 5 * 5 = 25
        expect(result.riskLevel).toBe("High");
        expect(result.riskCategory).toBe("D");
        expect(result.inspectionInterval).toBe(12);
      }
    });
  });

  describe("Formula Configuration", () => {
    test("Should retrieve formula configurations", () => {
      const config = formulaService.getFormulaConfig("DTHIN_1");
      expect(config).toBeDefined();
      expect(config?.name).toBe("Basic Thinning");
      expect(config?.requiredInputs).toContain("nominalThickness");
    });

    test("Should list all available formulas", () => {
      const formulas = formulaService.getAvailableFormulas();
      expect(formulas).toHaveProperty("DTHIN");
      expect(formulas.DTHIN.length).toBeGreaterThanOrEqual(17);
    });
  });

  describe("Error Handling", () => {
    test("Should handle missing required inputs", async () => {
      const inputs: FormulaInput = {
        // Missing required nominalThickness
        currentThickness: 8.5,
      };

      const result = await formulaService.calculate("DTHIN", "DTHIN_1", inputs);

      expect(result).toHaveProperty("error");
      if ("error" in result) {
        expect(result.error).toContain("nominalThickness");
      }
    });

    test("Should handle invalid formula type", async () => {
      const inputs: FormulaInput = {};

      const result = await formulaService.calculate(
        "INVALID_TYPE",
        "INVALID_VARIANT",
        inputs
      );

      expect(result).toHaveProperty("error");
    });
  });
});

/**
 * Integration tests for the formula system
 */
describe("Formula Integration Tests", () => {
  test("Complete DTHIN calculation workflow", async () => {
    // Simulate form data from NewPipingPage
    const formData = {
      nominalThickness: "10.0",
      currentThickness: "8.5",
      corrosionRate: "0.1",
      temperature: "120",
      h2sContent: "0",
      phLevel: "7",
      fluidVelocity: "2.5",
    };

    // Extract inputs
    const { extractFormulaInputs } = await import("@/utils/formulaIntegration");
    const inputs = extractFormulaInputs(formData, "DTHIN");

    expect(inputs.nominalThickness).toBe(10.0);
    expect(inputs.currentThickness).toBe(8.5);
    expect(inputs.temperature).toBe(120);

    // Calculate DTHIN
    const result = await formulaService.calculate("DTHIN", "DTHIN_1", inputs);

    expect(result).toHaveProperty("value");
    if ("value" in result) {
      expect(result.value).toBeCloseTo(0.15, 3);
    }
  });

  test("Automatic damage factor calculation", async () => {
    const formData = {
      nominalThickness: "12.0",
      currentThickness: "9.0",
      externalCorrosion: "0.05",
      temperature: "180",
      h2sContent: "30",
      operatingPressure: "85",
      material: "carbon steel",
    };

    const { calculateAutomaticDamageFactors } = await import(
      "@/utils/formulaIntegration"
    );
    const results = await calculateAutomaticDamageFactors(formData);

    expect(results).toHaveProperty("dthin");
    expect(results).toHaveProperty("dfext");

    if (results.dthin && "value" in results.dthin) {
      expect(results.dthin.value).toBeGreaterThan(0);
    }
  });
});

// Performance tests
describe("Formula Performance Tests", () => {
  test("Should calculate formulas within acceptable time limits", async () => {
    const inputs: FormulaInput = {
      nominalThickness: 10.0,
      currentThickness: 8.5,
      corrosionAllowance: 1.5,
    };

    const startTime = performance.now();

    for (let i = 0; i < 100; i++) {
      await formulaService.calculate("DTHIN", "DTHIN_1", inputs);
    }

    const endTime = performance.now();
    const avgTime = (endTime - startTime) / 100;

    // Should complete each calculation in less than 10ms
    expect(avgTime).toBeLessThan(10);
  });
});

export default {};
