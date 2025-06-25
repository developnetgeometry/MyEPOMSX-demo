export function calculateAgeCoat(inputDate: Date | string): number {
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

export function calculateAge(
    ageTk: number,
    coarAdj: number
): number {
    try {

        const final = ageTk - coarAdj;
        return parseFloat(final.toFixed(6));   // e.g. 138.95 MPa
    } catch {
        return 0;
    }
}

export function calculateCoatAdj(
    coatingQuality: number, // Expecting a number like 1, 2, 3
    ageTk: number,
    ageCoat: number
): number {
    try {
        const lookupTable: Record<number, number> = {
            1: 0,
            2: 5,
            3: 15
        };

        const lookupVal = lookupTable[coatingQuality];
        if (lookupVal === undefined) return 0;

        if (ageTk >= ageCoat) {
            return lookupVal;
        } else {
            const min1 = Math.min(lookupVal, ageCoat);
            const min2 = Math.min(lookupVal, ageCoat - ageTk);
            return min1 - min2;
        }
    } catch {
        return 0;
    }
}

export function calculateCrExpExt(
    assetType: number,            // 1 = Pressure Vessel, 2 = Piping
    composition: string,          // e.g. "Carbon steel"
    externalEnvId: number,        // 1 = Marine, 2 = Temperate, etc.
    pipeSupport: boolean,         // Table 2: pipe support = true → 2, false → 1
    soilWaterInterface: boolean,  // Table 2: soil interface = true → 2, false → 1
    temp: number,                 // operating temperature (°C)
    pressure: number              // design pressure (MPa)
): number {
    try {
        const isCarbonSteel = composition.toLowerCase() === "carbon steel";
        const maxSupportFactor = Math.max(
            pipeSupport ? 2 : 1,
            soilWaterInterface ? 2 : 1
        );

        // Table 1 values (Env x Temp)
        const corrosionEnvTable: { temp: number; factors: number[] }[] = [
            { temp: -12, factors: [0, 0, 0, 0] },
            { temp: -8, factors: [0.025, 0, 0, 0] },
            { temp: 6, factors: [0.127, 0.076, 0.025, 0.254] },
            { temp: 32, factors: [0.127, 0.076, 0.025, 0.254] },
            { temp: 71, factors: [0.127, 0.051, 0.025, 0.254] },
            { temp: 107, factors: [0.025, 0, 0, 0.051] },
            { temp: 121, factors: [0, 0, 0, 0] },
        ];

        const getCorrosionRate = (
            value: number,
            isTemp: boolean,
            envId: number
        ): number => {
            const index = Math.max(1, Math.min(4, envId)) - 1;

            const sorted = [...corrosionEnvTable].sort((a, b) =>
                isTemp ? a.temp - b.temp : a.temp - b.temp // same sort logic
            );

            const lower = sorted.filter(r => r.temp <= value).pop();
            const upper = sorted.find(r => r.temp > value);

            if (lower && upper) {
                const ratio = (value - lower.temp) / (upper.temp - lower.temp);
                const lowerVal = lower.factors[index];
                const upperVal = upper.factors[index];
                return lowerVal + ratio * (upperVal - lowerVal);
            } else if (lower) {
                return lower.factors[index];
            }

            return 0;
        };

        if (assetType === 1 && isCarbonSteel) {
            // Pressure Vessel
            const rate = getCorrosionRate(temp, true, externalEnvId);
            return rate * maxSupportFactor;
        }

        if (assetType === 2) {
            // Piping (assumes CS is part of EQ. ID externally)
            const rate = getCorrosionRate(pressure, false, externalEnvId);
            return rate * maxSupportFactor;
        }

        return 0.01;
    } catch {
        return 0.01;
    }
}

export function calculateCrActExt(lastInspectionDate: Date | string, newCoatingDate: Date | string): number {
    try {
        const lastDate = new Date(lastInspectionDate);
        const coatDate = new Date(newCoatingDate);

        if (isNaN(lastDate.getTime()) || isNaN(coatDate.getTime())) return 0;

        const yearDiff = (lastDate.getTime() - coatDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
        if (yearDiff <= 0) return 0;

        return parseFloat((2 / yearDiff).toFixed(6));
    } catch {
        return 0;
    }
}

export function calculateArtExt(
  crAct: number,
  crExp: number,
  age: number,
  trd: number,
  nomThk: number,
  assetType: number // 1 = VESSEL, 2 = PIPING
): number {
  try {
    const thickness = trd > 0 ? trd : nomThk;
    if (thickness === 0) return 0;

    let result: number;

    if (assetType === 2) {
      // PIPING
      const corrosionRate = crAct > 0 ? crAct : crExp;
      result = (corrosionRate * age) / thickness;
    } else if (assetType === 1) {
      // VESSEL
      const numerator = crAct > 0 ? crAct : crExp * age;
      result = numerator / thickness;
    } else {
      return 0; // unknown asset type
    }

    return parseFloat(result.toFixed(6));
  } catch {
    return 0;
  }
}

export function calculateFSextcorr(
  mts: number, // Minimum Tensile Strength (MPa)
  mys: number, // Minimum Yield Strength (MPa)
  weldEfficiency: number,
  assetType: number // 1 = VESSEL, 2 = PIPING
): number {
  try {
    if (weldEfficiency <= 0 || isNaN(mts) || isNaN(mys)) return 0;

    const averageStrength = (mts + mys) / 2;
    const baseFactor = assetType === 1 ? 6.89476 : 1;

    const result = averageStrength * baseFactor * 1.1 * weldEfficiency;
    return parseFloat(result.toFixed(6));
  } catch {
    return 0;
  }
}

export function calculateSRextcorr(
  allowableStress: number,     // MPa
  weldEfficiency: number,      // 0 to 1
  fsExtCorr: number,           // FSextcorr
  tMin: number,                // Tmin (mm)
  trd: number,                 // Trd (mm)
  nomThk: number,              // Nom Thk (mm)
  designPress: number,         // Design Pressure (MPa)
  id: number,                  // Internal Diameter (mm)
  od: number,                  // Outer Diameter (mm)
  assetType: number            // 1 = Pressure Vessel, 2 = Piping
): number {
  try {
    const thickness = trd > 0 ? trd : nomThk;
    if (thickness === 0 || fsExtCorr === 0) return 0;

    // First part: (Allowable Stress * Weld Eff / FSextcorr) * (Tmin / Thickness)
    const part1 = ((allowableStress * weldEfficiency) / fsExtCorr) * (tMin / thickness);

    // Select correct diameter
    const diameter = assetType === 1 ? id : od;

    // Second part: (Diameter * Design Pressure) / (2 * FSextcorr * Thickness)
    const part2 = (diameter * designPress) / (2 * fsExtCorr * thickness);

    const result = Math.max(part1, part2);
    return parseFloat(result.toFixed(6));
  } catch {
    return 0;
  }
}

export function calculateIextCorrsAndPoExtcorrs(
  damageState: number,         // "Low" | "Medium" | "High"
  nextCorrA: number,
  nextCorrB: number,
  nextCorrC: number,
  nextCorrD: number
): {
  lextcorr1: number;
  lextcorr2: number;
  lextcorr3: number;
  poextcorrP1: number;
  poextcorrP2: number;
  poextcorrP3: number;
} {
  // PRP values based on damage state
   const prpMap: Record<number, [number, number, number]> = {
    1: [0.5, 0.3, 0.2],   // Low
    2: [0.7, 0.2, 0.1],   // Medium
    3: [0.8, 0.15, 0.05], // High
  };

  const prp = prpMap[damageState];
  if (!prp) {
    return {
      lextcorr1: 0,
      lextcorr2: 0,
      lextcorr3: 0,
      poextcorrP1: 0,
      poextcorrP2: 0,
      poextcorrP3: 0,
    };
  }

  const [prp1, prp2, prp3] = prp;

  const cop1 = { A: 0.9, B: 0.7, C: 0.5, D: 0.4 };
  const cop2 = { A: 0.09, B: 0.2, C: 0.3, D: 0.33 };
  const cop3 = { A: 0.01, B: 0.1, C: 0.2, D: 0.27 };

  const calc = (prp: number, cop: { A: number; B: number; C: number; D: number }) =>
    prp *
    Math.pow(cop.A, nextCorrA) *
    Math.pow(cop.B, nextCorrB) *
    Math.pow(cop.C, nextCorrC) *
    Math.pow(cop.D, nextCorrD);

  const lextcorr1 = calc(prp1, cop1);
  const lextcorr2 = calc(prp2, cop2);
  const lextcorr3 = calc(prp3, cop3);

  const total = lextcorr1 + lextcorr2 + lextcorr3 || 1;

  return {
    lextcorr1: parseFloat(lextcorr1.toFixed(6)),
    lextcorr2: parseFloat(lextcorr2.toFixed(6)),
    lextcorr3: parseFloat(lextcorr3.toFixed(6)),
    poextcorrP1: parseFloat((lextcorr1 / total).toFixed(6)),
    poextcorrP2: parseFloat((lextcorr2 / total).toFixed(6)),
    poextcorrP3: parseFloat((lextcorr3 / total).toFixed(6)),
  };
}

export function calculateBetaExtcorrs(
  art: number,         // ART value
  srExtcorr: number    // SRextcorr value
): {
  betaExtcorr1: number;
  betaExtcorr2: number;
  betaExtcorr3: number;
} {
  // Constants
  const sigmaArt = 0.2;
  const sigmaSR = 0.05;

  function calcBeta(n: number): number {
    const numerator = (1 - n * art) - srExtcorr;

    const variance =
      Math.pow(n, 2) * Math.pow(art, 2) * Math.pow(sigmaArt, 2) +
      Math.pow(1 - n * art, 2) * Math.pow(sigmaArt, 2) +
      Math.pow(srExtcorr, 2) * Math.pow(sigmaSR, 2);

    const denominator = Math.sqrt(variance);

    if (denominator === 0) return 0;
    return parseFloat((numerator / denominator).toFixed(6));
  }

  return {
    betaExtcorr1: calcBeta(1),
    betaExtcorr2: calcBeta(2),
    betaExtcorr3: calcBeta(4),
  };
}

// Approximation of standard normal CDF using Abramowitz & Stegun formula
function normSDist(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const prob =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 +
        t * (1.781478 +
          t * (-1.821256 + t * 1.330274))));
  return z < 0 ? prob : 1 - prob;
}

export function calculateDFextcorrF(
  po1: number,
  po2: number,
  po3: number,
  beta1: number,
  beta2: number,
  beta3: number
): number {
  try {
    const term1 = po1 * normSDist(-beta1);
    const term2 = po2 * normSDist(-beta2);
    const term3 = po3 * normSDist(-beta3);

    const dfExtcorrF = (term1 + term2 + term3) / 0.000156;
    return parseFloat(dfExtcorrF.toFixed(6));
  } catch {
    return 0;
  }
}

