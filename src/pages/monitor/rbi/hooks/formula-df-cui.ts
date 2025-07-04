
export function calculateAgeCoatCui(
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

    return parseFloat(diffYears.toFixed(8));
  } catch {
    return 0;
  }
}

export function calculateCoatAdjCui(
  coatQuality: number, // 1 = No/Poor, 2 = Medium, 3 = High
  ageTk: number,
  ageCoat: number
): number {
  try {
    // Lookup coat quality adjustment values
    const coatQualityMap: Record<number, number> = {
      1: 0,   // No/Poor
      2: 5,   // Medium
      3: 15   // High
    };

    const coatAdj = coatQualityMap[coatQuality] ?? 0;

    if (ageTk >= ageCoat) {
      return coatAdj;
    }

    const min1 = Math.min(coatAdj, ageCoat);
    const min2 = Math.min(coatAdj, ageCoat - ageTk);

    return parseFloat((min1 - min2).toFixed(8));
  } catch {
    return 0;
  }
}

export function calculateAgeCui(
  ageTk: number,
  coarAdj: number
): number {
  try {

    const final = ageTk - coarAdj;
    return parseFloat(final.toFixed(8));   // e.g. 138.95 MPa
  } catch {
    return 0;
  }
}

type EnvCategory = 1 | 2 | 3 | 4; // 1 = Marine, 2 = Temperate, 3 = Arid/Dry, 4 = Severe

export function calculateCrExpCui(
  composition: string,
  opTemp: number,
  extEnv: EnvCategory,
  fins: number, // Table 2: Insulation Type (FINS)
  fcm: number,  // Table 3: Insulation Complexity (FCM)
  fic: number,  // Table 4: Insulation Condition (FIC)
  fps: number,  // Table 5: Eq. Design & Fabrication
  fip: number   // Table 6: Interface
): number {
  try {
    const isCarbonSteel = composition.toLowerCase() === "carbon steel";
    if (!isCarbonSteel) return 0.01;

    const corrosionEnvTable = [
      { temp: -12, factors: [0, 0, 0, 0] },
      { temp: -8, factors: [0.025, 0, 0, 0] },
      { temp: 6, factors: [0.127, 0.076, 0.025, 0.254] },
      { temp: 32, factors: [0.127, 0.076, 0.025, 0.254] },
      { temp: 71, factors: [0.127, 0.051, 0.025, 0.254] },
      { temp: 107, factors: [0.025, 0, 0, 0.051] },
      { temp: 121, factors: [0, 0, 0, 0] },
      { temp: 1000, factors: [0, 0, 0, 0] },
    ];

    // Find the row with the largest temp less than or equal to opTemp (Excel MATCH(..., ..., 1))
    const matched = corrosionEnvTable
      .filter(row => row.temp <= opTemp)
      .reduce((prev, curr) => (curr.temp > prev.temp ? curr : prev), corrosionEnvTable[0]);

    // Ensure valid environment index
    const envIndex = Math.max(0, Math.min(3, extEnv - 1));

    // Lookup the corrosion rate (envFactor)
    const envFactor = matched?.factors[envIndex] ?? 0;

    const maxFactor = Math.max(fps, fip); // MAX(Eq. Design & Fabrication, Interface)

    const crExp = envFactor * fins * fcm * fic * maxFactor;

    return crExp; // 6 decimals like Excel
  } catch {
    return 0.01;
  }
}


export function calculateArtCui(
  crAct: number,       // CRact (mm/year)
  crExp: number,       // CRexp (mm/year)
  age: number,         // Age (years)
  trd: number,         // Trd (mm)
  nominalThk: number   // Nominal Thickness (mm)
): number {
  try {
    const crRate = crAct > 0 ? crAct : crExp;
    const denominator = trd > 0 ? trd : nominalThk;

    if (denominator === 0) return 0; // Avoid division by zero

    const art = (crRate * age) / denominator;
    return parseFloat(art.toFixed(8)); // Match Excel precision
  } catch {
    return 0;
  }
}


export function calculateFSCUIFCui(
  mts: number,       // Maximum Tensile Strength (MPa)
  mys: number,       // Minimum Yield Strength (MPa)
  weldEff: number    // Weld Efficiency (0–1)
): number {
  try {
    const averageStrength = (mts + mys) / 2;
    const fscuif = averageStrength * 1.1 * weldEff;
    return parseFloat(fscuif.toFixed(8)); // Round to 6 decimals like Excel
  } catch {
    return 0;
  }
}

export function calculateSRCUIFCui(
  weldEff: number,         // Weld Efficiency (0–1)
  allowStress: number,     // Allowable Stress (MPa)
  fscuif: number,          // FSCUIF value (from previous formula)
  tmin: number,            // Tmin (mm)
  trd: number,             // Trd (mm), can be 0
  nominalThk: number,      // Nominal Thickness (mm)
  designPress: number,     // Design Pressure (MPa)
  id: number               // Internal Diameter (mm)
): number {
  try {
    const thickness = trd > 0 ? trd : nominalThk;

    const firstPart = (weldEff * allowStress) / fscuif;
    const ratio = tmin / thickness;
    const maxVal = Math.max(firstPart * ratio);

    const numerator = maxVal * designPress * id;
    const denominator = 2 * fscuif * thickness;

    const srcuif = numerator / denominator;

    return parseFloat(srcuif.toFixed(8)); // Optional: round like Excel
  } catch {
    return 0;
  }
}

interface ICUIFResult {
  icuif1: number;
  icuif2: number;
  icuif3: number;
  poCUIFP1: number;
  poCUIFP2: number;
  poCUIFP3: number;
}

export function calculateICuiFsAndPoCuiFsCui(
  dataConfidence: number, // 1 = Low, 2 = Medium, 3 = High
  ncA: number,
  ncB: number,
  ncC: number,
  ncD: number
): ICUIFResult {
  try {
    // Map confidence index to row in the table
    const index = dataConfidence - 1;

    const table: number[][] = [
      [0.5, 0.3, 0.2],   // Low
      [0.7, 0.2, 0.1],   // Medium
      [0.8, 0.15, 0.05], // High
    ];

    if (index < 0 || index >= table.length) {
      throw new Error("Invalid data confidence level");
    }

    const [base1, base2, base3] = table[index];

    const icuif1 = base1 * Math.pow(0.9, ncA) * Math.pow(0.7, ncB) * Math.pow(0.5, ncC) * Math.pow(0.4, ncD);
    const icuif2 = base2 * Math.pow(0.09, ncA) * Math.pow(0.2, ncB) * Math.pow(0.3, ncC) * Math.pow(0.33, ncD);
    const icuif3 = base3 * Math.pow(0.01, ncA) * Math.pow(0.1, ncB) * Math.pow(0.2, ncC) * Math.pow(0.27, ncD);

    const total = icuif1 + icuif2 + icuif3 || 1;

    return {
      icuif1,
      icuif2,
      icuif3,
      poCUIFP1: icuif1 / total,
      poCUIFP2: icuif2 / total,
      poCUIFP3: icuif3 / total,
    };
  } catch {
    return {
      icuif1: 0,
      icuif2: 0,
      icuif3: 0,
      poCUIFP1: 0,
      poCUIFP2: 0,
      poCUIFP3: 0,
    };
  }
}

export function calculateBCuiFsCui(art: number, srcuif: number) {
  try {
    const beta = (factor: number): number => {
      const numerator = (1 - factor * art) - srcuif;

      const term1 = Math.pow(factor, 2) * Math.pow(art, 2) * Math.pow(0.2, 2);
      const term2 = Math.pow(1 - factor * art, 2) * Math.pow(0.2, 2);
      const term3 = Math.pow(srcuif, 2) * Math.pow(0.05, 2);

      const denominator = Math.sqrt(term1 + term2 + term3);

      return numerator / denominator;
    };

    return {
      bCUIF1: beta(1),
      bCUIF2: beta(2),
      bCUIF3: beta(4),
    };
  } catch {
    return {
      bCUIF1: 0,
      bCUIF2: 0,
      bCUIF3: 0,
    };
  }
}

export function calculateDFCuiFFCui(
  isInsulated: boolean,
  composition: string,
  beta1: number,
  beta2: number,
  beta3: number,
  p1: number,
  p2: number,
  p3: number
): number {
  try {
    const isCarbonSteel = composition.toLowerCase() === "carbon steel";

    if (isInsulated && isCarbonSteel) {
      const normS = (z: number): number =>
        0.5 * (1 + erf(-z / Math.sqrt(2))); // Standard normal CDF approximation

      const numerator =
        (p1 * normS(beta1)) +
        (p2 * normS(beta2)) +
        (p3 * normS(beta3));

      const denominator = 0.000156;

      return numerator / denominator;
    }

    return 0;
  } catch {
    return 0;
  }
}

// Error function approximation
function erf(x: number): number {
  // Abramowitz and Stegun approximation
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1 / (1 + p * x);
  const y = 1 - (((((
    a5 * t + a4
  ) * t + a3
  ) * t + a2
  ) * t + a1
  ) * t * Math.exp(-x * x));

  return sign * y;
}



