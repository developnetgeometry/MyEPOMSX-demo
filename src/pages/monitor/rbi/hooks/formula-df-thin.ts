export function calculateAgeTk(
  lastInspectionDate: Date | string | null,
  yearInServiceDate: Date
): number {
  try {
    const today = new Date();

    const toValidDate = (value: Date | string | null): Date | null => {
      if (!value) return null;

      if (value instanceof Date) {
        return isNaN(value.getTime()) ? null : value;
      }

      if (typeof value === "string" && value.trim()) {
        const parsed = new Date(value);
        return isNaN(parsed.getTime()) ? null : parsed;
      }

      return null;
    };

    const inspectionDate = toValidDate(lastInspectionDate);
    const inServiceDate = toValidDate(yearInServiceDate);
    const referenceDate = inspectionDate ?? inServiceDate;

    if (!referenceDate) return 0;

    const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365; // more accurate with leap years
    const ageYears = (today.getTime() - referenceDate.getTime()) / millisecondsPerYear;

    return ageYears < 0 ? 0 : parseFloat(ageYears.toFixed(6));
  } catch {
    return 0;
  }
}

export function calculateCrExp(
  corrAllow: number | string | null | undefined
): number {
  const numericValue = Number(corrAllow);

  if (isNaN(numericValue)) {
    return 0.01;
  }

  const scaled = numericValue / 25;

  return parseFloat(Math.max(scaled, 0.01).toFixed(6));
}

export function calculateCrAct(
  nominal_thickness: number,
  current_thickness: number,
  last_inspection_date: Date | string,
  year_in_service_date: Date | string | null
): number {
  try {
    const parsedDate = new Date(last_inspection_date);
    const referenceDate = new Date(year_in_service_date);

    if (isNaN(parsedDate.getTime())) return 0;

    const diffInYears =
      (parsedDate.getTime() - referenceDate.getTime()) /
      (1000 * 60 * 60 * 24 * 365);

    if (diffInYears === 0) return 0;

    const rate = (nominal_thickness - current_thickness) / diffInYears;

    return parseFloat(rate.toFixed(6));   // e.g. 0.02
  } catch {
    return 0;
  }
}

export function calculateCrCm(isClad: boolean): number {
  return isClad ? 0.01 : 0;
}

export function calculateArt(
  crAct: number,
  crExp: number,
  ageTk: number,
  trd: number,
  tNom: number
): number {
  try {
    const numerator = crAct > 0 ? crAct * ageTk : crExp * ageTk;
    const denominator = trd === 0 ? tNom : trd;

    if (denominator === 0) return 0; // avoid division by 0
    const final = numerator / denominator
    return parseFloat(final.toFixed(6));
  } catch {
    return 0;
  }
}


export function calculateFsThin(
  assetType: number,         // "PIPING" or "VESSEL"
  weldingEfficiency: number, // WELD EFF. (fraction, e.g. 0.85)
  avgMtsMpa: number,         // average MTS from ASME table, MPa
  avgMysMpa: number          // average MYS from ASME table, MPa
): number {
  try {
    if (weldingEfficiency <= 0 || weldingEfficiency > 1) {
      throw new Error("weldingEfficiency must be between 0 and 1");
    }

    const averageStrength = (avgMtsMpa + avgMysMpa) / 2;
    const baseFactor = 1.1;                 // common safety factor
    const unitConv = assetType === 2 ? 6.89476 : 1; // PSI→kPa→MPa for piping

    const final = averageStrength * unitConv * baseFactor * weldingEfficiency;
    return parseFloat(final.toFixed(6));   // e.g. 138.95 MPa
  } catch {
    return 0;
  }
}

export function calculateSrThin(
  assetType: number,         // "PIPING" or "VESSEL"
  allowableStress: number, // ALLOWABLE STRESS (MPa)
  weldEfficiency: number, // WELD EFF. (fraction, e.g. 0.85)
  fsThin: number, // FS THIN (MPa)
  tMin: number, // MIN THICKNESS (mm)
  tNom: number, // NOMINAL THICKNESS (mm)
  tRd: number, // RD THICKNESS (mm)
  designPressure: number, // DESIGN PRESSURE (MPa)
  od: number | null, // OUTER DIAMETER (mm) for PIPING
  id: number | null        // average MYS from ASME table, MPa
): number {
  try {
    const tDesign = tRd > 0 ? tRd : tNom;

    // Part A – thinning controlled
    const partA = ((allowableStress * weldEfficiency) / fsThin) * (tMin / tDesign);

    // Part B – pressure controlled
    let partB: number;
    if (assetType === 2) {
      if (!od) throw new Error("OD is required for PIPING");
      const denom = 2 * fsThin * Math.max(tNom, tRd);
      partB = (designPressure * od) / denom;
    } else {
      if (!id) throw new Error("ID is required for VESSEL");
      const denom = 2 * fsThin * tDesign;
      partB = (designPressure * id) / denom;
    }

    const final = Math.max(partA, partB);
    return parseFloat(final.toFixed(6));   // e.g. 0.85
  } catch {
    return 0;
  }
}

interface IThinOutputRow {
  iThin1: number;
  iThin2: number;
  iThin3: number;
  p1: number;
  p2: number;
  p3: number;
}

export function calcIThinAndProportions(
  confidence: number, // 1 = Low, 2 = Medium, 3 = High
  a: number,
  b: number,
  c: number,
  d: number
): IThinOutputRow {
  try {
    const idx = confidence - 1;

    // Updated multipliers from Excel V58:X61
    const damageMultipliers = {
      row2: [0.5, 0.7, 0.8],   // Prp1 → IThin1
      row3: [0.3, 0.2, 0.15],  // Prp2 → IThin2
      row4: [0.2, 0.1, 0.05],  // Prp3 → IThin3
    };

    // Updated decay constants from AD/AC/AB/AA rows
    const decayRows = {
      row59: [0.9, 0.7, 0.5, 0.4],   // for IThin1
      row60: [0.09, 0.2, 0.3, 0.33], // for IThin2
      row61: [0.01, 0.1, 0.2, 0.27], // for IThin3
    };

    const exps = [a, b, c, d];

    const powProd = (row: number[]): number =>
      row.reduce((prod, base, i) => prod * Math.pow(base, exps[i]), 1);

    const i1 = damageMultipliers.row2[idx] * powProd(decayRows.row59);
    const i2 = damageMultipliers.row3[idx] * powProd(decayRows.row60);
    const i3 = damageMultipliers.row4[idx] * powProd(decayRows.row61);

    const sum = i1 + i2 + i3 || 1;

    return {
      iThin1: i1,
      iThin2: i2,
      iThin3: i3,
      p1: i1 / sum,
      p2: i2 / sum,
      p3: i3 / sum,
    };
  } catch {
    return {
      iThin1: 0,
      iThin2: 0,
      iThin3: 0,
      p1: 0,
      p2: 0,
      p3: 0,
    };
  }
}

export interface BThinOutput {
  bThin1: number;
  bThin2: number;
  bThin3: number;
}

export function calculateBThins(art: number, srThin: number): BThinOutput {
  try {
    const zFactor = 0.2;
    const srFactor = 0.05;

    const computeB = (multiplier: number): number => {
      const top = (1 - multiplier * art) - srThin;
      const bottom = Math.sqrt(
        Math.pow(multiplier, 2) * Math.pow(art, 2) * Math.pow(zFactor, 2) +
        Math.pow(1 - multiplier * art, 2) * Math.pow(zFactor, 2) +
        Math.pow(srThin, 2) * Math.pow(srFactor, 2)
      );
      return top / bottom;
    };

    return {
      bThin1: computeB(1),
      bThin2: computeB(2),
      bThin3: computeB(4),
    };
  } catch {
    return {
      bThin1: 0,
      bThin2: 0,
      bThin3: 0,
    };
  }
}

// Standard Normal Cumulative Distribution Function (Φ(-β))
function normSDist(z: number): number {
  // Approximation of standard normal CDF using Abramowitz & Stegun formula
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const prob =
    d *
    t *
    (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z < 0 ? prob : 1 - prob;
}

// Main function
export function calculateDFThinFb(
  poThinP1: number,
  poThinP2: number,
  poThinP3: number,
  bThin1: number,
  bThin2: number,
  bThin3: number
): number {
  try {
    const failure1 = poThinP1 * normSDist(-bThin1);
    const failure2 = poThinP2 * normSDist(-bThin2);
    const failure3 = poThinP3 * normSDist(-bThin3);
    const totalFailure = failure1 + failure2 + failure3;

    return totalFailure / 0.000156;
  } catch {
    return 0;
  }
}