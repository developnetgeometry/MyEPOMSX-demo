export function calculateAgeCrackExtClscc(inputDate: Date | string): number {
  try {
    const past = new Date(inputDate);
    const today = new Date();

    // Calculate the difference in milliseconds
    const diffMs = today.getTime() - past.getTime();

    // Convert ms → days → years
    const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365);

    return diffYears;
  } catch {
    return 0;
  }
}

export function calculateAgeCoatExtClscc(
  newCoatDate: Date | string,
  serviceDate: Date | string,
  assetType: number // 1 = Pressure Vessel (use newCoatDate), 2 = Piping (use serviceDate)
): number {
  try {
    const referenceDate =
      assetType === 1 ? new Date(newCoatDate) : new Date(serviceDate);
    const today = new Date();

    const diffMs = today.getTime() - referenceDate.getTime();
    const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25); // Use 365.25 for leap year accuracy

    return parseFloat(diffYears.toFixed(6));
  } catch {
    return 0;
  }
}

export function calculateCoatAdjExtClscc(
  ageCrack: number,
  ageCoat: number,
  coatQuality: number // 1, 2, or 3
): number {
  try {
    // Table 1: Coat Quality → Years
    const coatQualityYearsMap: Record<number, number> = {
      1: 0,
      2: 5,
      3: 15,
    };

    const maxYears = coatQualityYearsMap[coatQuality] ?? 0;

    if (ageCrack >= ageCoat) {
      return Math.min(maxYears, ageCoat);
    } else {
      return Math.min(maxYears, ageCoat) - Math.min(maxYears, ageCrack);
    }
  } catch {
    return 0;
  }
}

export function calculateAgeExtClscc(
  ageCrack: number,
  coarAdj: number
): number {
  try {

    const final = ageCrack - coarAdj;
    return parseFloat(final.toFixed(6));   // e.g. 138.95 MPa
  } catch {
    return 0;
  }
}

export function calculateClSccSuscAndSviExtClscc(
  opTemp: number,
  extEnvCode: number
): { susceptibility: string; svi: number } {
  try {
    // Map environment code to table keys
    const envMap: Record<number, string> = {
      1: "marine/cooling",
      2: "temperate",
      3: "arid/dry",
      4: "severe"
    };

    const envKey = envMap[extEnvCode];
    if (!envKey) return { susceptibility: "Unknown", svi: 0 };

    // Susceptibility Table
    const thresholds = [0, 49, 93, 149, 1000];

    const table: Record<number, Record<string, string>> = {
      0: { "marine/cooling": "None", "temperate": "None", "arid/dry": "None", "severe": "None" },
      49: { "marine/cooling": "Medium", "temperate": "Low", "arid/dry": "None", "severe": "High" },
      93: { "marine/cooling": "Medium", "temperate": "Low", "arid/dry": "None", "severe": "High" },
      149: { "marine/cooling": "Low", "temperate": "Low", "arid/dry": "None", "severe": "Medium" },
      1000: { "marine/cooling": "None", "temperate": "None", "arid/dry": "None", "severe": "None" }
    };

    // SVI Mapping
    const sviMap: Record<string, number> = {
      High: 50,
      Medium: 10,
      Low: 1,
      None: 0
    };

    // Find matching temperature threshold
    let matchedThreshold = 0;
    for (let i = 0; i < thresholds.length; i++) {
      if (opTemp >= thresholds[i]) {
        matchedThreshold = thresholds[i];
      } else {
        break;
      }
    }

    const susceptibility = table[matchedThreshold][envKey] ?? "Unknown";
    const svi = sviMap[susceptibility as keyof typeof sviMap] ?? 0;

    return { susceptibility, svi };
  } catch {
    return { susceptibility: "Unknown", svi: 0 };
  }
}

export function calculateExtClsccFb(svi: number, inspEff: string): number {
  try {
    // Define inspection effectiveness column headers
    const inspHeaders = [
      "E", "1D", "1C", "1B", "1A",
      "2D", "2C", "2B", "2A",
      "3D", "3C", "3B", "3A",
      "4D", "4C", "4B", "4A",
      "5D", "5C", "5B", "5A",
      "6D", "6C", "6B", "6A"
    ];

    // Define SVI rows and corresponding values for each inspection effectiveness
    const sviTable: Record<number, number[]> = {
      0: Array(25).fill(0),
      1: Array(25).fill(1),
      10: [10, 8, 3, 1, 1, 6, 2, 1, 1, 4, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      50: [50, 40, 17, 5, 3, 30, 10, 2, 1, 20, 5, 1, 1, 10, 2, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1],
      100: [100, 80, 33, 10, 5, 60, 20, 4, 1, 40, 10, 2, 1, 20, 5, 1, 1, 10, 2, 1, 1, 5, 1, 1, 1],
      500: [500, 400, 170, 50, 25, 300, 100, 20, 5, 200, 50, 8, 1, 100, 25, 2, 1, 50, 10, 1, 1, 25, 5, 1, 1],
      1000: [1000, 800, 330, 100, 50, 600, 200, 40, 10, 400, 100, 16, 2, 200, 50, 5, 1, 100, 25, 2, 1, 50, 10, 1, 1],
      5000: [5000, 4000, 1670, 500, 250, 3000, 1000, 250, 50, 2000, 500, 80, 10, 1000, 250, 25, 2, 500, 125, 5, 1, 250, 50, 2, 1]
    };

    // Find row for SVI
    const row = sviTable[svi];
    if (!row) return 0;

    // Find column index for inspection effectiveness
    const colIndex = inspHeaders.indexOf(inspEff.toUpperCase());
    if (colIndex === -1) return 0;

    return row[colIndex];
  } catch {
    return 0;
  }
}

export function calculateDfExtClsccFinal(
  dfExtClsccFb: number,
  age: number,
  assetType: number // 1 = Pressure Vessel, 2 = Piping
): number {
  try {
    if (assetType === 1) {
      return 0; // Pressure Vessel
    } else if (assetType === 2) {
      const adjustedAge = Math.max(age, 1);
      const result = dfExtClsccFb * Math.pow(adjustedAge, 1.1);
      return parseFloat(result.toFixed(6));
    } else {
      return 0; // Invalid asset type
    }
  } catch {
    return 0;
  }
}
