export interface GffData {
  equipment: string;
  comp: string;
  S: number;
  M: number;
  L: number;
  R: number;
  gff: number;
}

const gffTable: GffData[] = [
  { equipment: "Compressor", comp: "COMPC", S: 8e-6, M: 2e-5, L: 2e-6, R: 0, gff: 3e-5 },
  { equipment: "Compressor", comp: "COMPR", S: 8e-6, M: 2e-5, L: 2e-6, R: 6e-7, gff: 3.06e-5 },
  { equipment: "Heat Exchanger", comp: "HEXSS", S: 8e-6, M: 2e-5, L: 2e-6, R: 6e-7, gff: 3.06e-5 },
  { equipment: "Heat Exchanger", comp: "HEXTS", S: 8e-6, M: 2e-5, L: 2e-6, R: 6e-7, gff: 3.06e-5 },
  { equipment: "Heat Exchanger", comp: "HEXTUBE", S: 8e-6, M: 2e-5, L: 2e-6, R: 6e-7, gff: 3.06e-5 },
  { equipment: "Pipe", comp: "PIPE-1", S: 2.8e-5, M: 0, L: 0, R: 2.6e-6, gff: 3.06e-5 },
  { equipment: "Pipe", comp: "PIPE-2", S: 2.8e-5, M: 0, L: 0, R: 2.6e-6, gff: 3.06e-5 },
  { equipment: "Pipe", comp: "PIPE-4", S: 8e-6, M: 2e-5, L: 0, R: 2.6e-6, gff: 3.06e-5 },
  { equipment: "Pipe", comp: "PIPE-6", S: 8e-6, M: 2e-5, L: 0, R: 2.6e-6, gff: 3.06e-5 },
  { equipment: "Pipe", comp: "PIPE-8", S: 8e-6, M: 2e-5, L: 2e-6, R: 6e-7, gff: 3.06e-5 },
  { equipment: "Pipe", comp: "PIPE-10", S: 8e-6, M: 2e-5, L: 2e-6, R: 6e-7, gff: 3.06e-5 },
  { equipment: "Pipe", comp: "PIPE-12", S: 8e-6, M: 2e-5, L: 2e-6, R: 6e-7, gff: 3.06e-5 },
  { equipment: "Pipe", comp: "PIPE-16", S: 8e-6, M: 2e-5, L: 2e-6, R: 6e-7, gff: 3.06e-5 },
  { equipment: "Pipe", comp: "PIPEGT16", S: 8e-6, M: 2e-5, L: 2e-6, R: 6e-7, gff: 3.06e-5 },
  { equipment: "Pump", comp: "PUMP2S", S: 8e-6, M: 2e-5, L: 2e-6, R: 6e-7, gff: 3.06e-5 },
  { equipment: "Pump", comp: "PUMPR", S: 8e-6, M: 2e-5, L: 2e-6, R: 6e-7, gff: 3.06e-5 },
  { equipment: "Pump", comp: "PUMP1S", S: 8e-6, M: 2e-5, L: 2e-6, R: 6e-7, gff: 3.06e-5 },
  { equipment: "Tank650", comp: "TANKBOTTOM", S: 7.2e-4, M: 0, L: 0, R: 2e-6, gff: 7.2e-4 },
  { equipment: "Tank650", comp: "COURSE-1", S: 7e-5, M: 2.5e-5, L: 5e-6, R: 1e-7, gff: 1e-4 },
  { equipment: "Tank650", comp: "COURSE-2", S: 7e-5, M: 2.5e-5, L: 5e-6, R: 1e-7, gff: 1e-4 },
  { equipment: "Tank650", comp: "COURSE-3", S: 7e-5, M: 2.5e-5, L: 5e-6, R: 1e-7, gff: 1e-4 },
  { equipment: "Tank650", comp: "COURSE-4", S: 7e-5, M: 2.5e-5, L: 5e-6, R: 1e-7, gff: 1e-4 },
  { equipment: "Tank650", comp: "COURSE-5", S: 7e-5, M: 2.5e-5, L: 5e-6, R: 1e-7, gff: 1e-4 },
  { equipment: "Tank650", comp: "COURSE-6", S: 7e-5, M: 2.5e-5, L: 5e-6, R: 1e-7, gff: 1e-4 },
  { equipment: "Tank650", comp: "COURSE-7", S: 7e-5, M: 2.5e-5, L: 5e-6, R: 1e-7, gff: 1e-4 },
  { equipment: "Tank650", comp: "COURSE-8", S: 7e-5, M: 2.5e-5, L: 5e-6, R: 1e-7, gff: 1e-4 },
  { equipment: "Tank650", comp: "COURSE-9", S: 7e-5, M: 2.5e-5, L: 5e-6, R: 1e-7, gff: 1e-4 },
  { equipment: "Tank650", comp: "COURSE-10", S: 7e-5, M: 2.5e-5, L: 5e-6, R: 1e-7, gff: 1e-4 },
  { equipment: "Vessel/FinFan", comp: "KODRUM", S: 8e-6, M: 2e-5, L: 2e-6, R: 6e-7, gff: 3.06e-5 },
  { equipment: "Vessel/FinFan", comp: "COLBTM", S: 8e-6, M: 2e-5, L: 2e-6, R: 6e-7, gff: 3.06e-5 },
  { equipment: "Vessel/FinFan", comp: "FINFAN", S: 8e-6, M: 2e-5, L: 2e-6, R: 6e-7, gff: 3.06e-5 },
  { equipment: "Vessel/FinFan", comp: "FILTER", S: 8e-6, M: 2e-5, L: 2e-6, R: 6e-7, gff: 3.06e-5 },
  { equipment: "Vessel/FinFan", comp: "DRUM", S: 8e-6, M: 2e-5, L: 2e-6, R: 6e-7, gff: 3.06e-5 },
  { equipment: "Vessel/FinFan", comp: "REACTOR", S: 8e-6, M: 2e-5, L: 2e-6, R: 6e-7, gff: 3.06e-5 },
  { equipment: "Vessel/FinFan", comp: "COLTOP", S: 8e-6, M: 2e-5, L: 2e-6, R: 6e-7, gff: 3.06e-5 },
  { equipment: "Vessel/FinFan", comp: "COLMID", S: 8e-6, M: 2e-5, L: 2e-6, R: 6e-7, gff: 3.06e-5 },
];

export interface CofM2Severity {
  cofm2: number;
  severity: number;
}

const cofm2SeverityTable: CofM2Severity[] = [
  { cofm2: 9.29, severity: 1 },
  { cofm2: 92.9, severity: 2 },
  { cofm2: 929, severity: 3 },
  { cofm2: 9290, severity: 4 },
  { cofm2: 10000000, severity: 5 }
];


interface CofThreshold {
  min: number;
  max: number;
  level: 1 | 2 | 3 | 4 | 5;
}

export const cofDollarThresholds: CofThreshold[] = [
  { min: 0, max: 10_000, level: 1 },
  { min: 10_000, max: 100_000, level: 1 },
  { min: 100_000, max: 1_000_000, level: 2 },
  { min: 1_000_000, max: 10_000_000, level: 3 },
  { min: 10_000_000, max: Number.MAX_SAFE_INTEGER, level: 4 }, // fallback for huge values
];

export interface PofCategoryThreshold {
  thresholds: number[];  // numeric thresholds for comparison
  categories: string[];  // corresponding category labels
}

const pofCategoryTable: PofCategoryThreshold = {
  thresholds: [0, 3.06e-5, 3.06e-4, 3.06e-3, 3.06e-2, 1.0],
  categories: ["", "A", "B", "C", "D", "E"]
};

type RowLabel = "A" | "B" | "C" | "D" | "E";
type ColumnIndex = 1 | 2 | 3 | 4 | 5;

const riskMatrixMap: Record<RowLabel, Record<ColumnIndex, string>> = {
  E: { 1: "MEDIUM", 2: "HIGH", 3: "VERY HIGH", 4: "VERY HIGH", 5: "VERY HIGH" },
  D: { 1: "LOW", 2: "MEDIUM", 3: "HIGH", 4: "VERY HIGH", 5: "VERY HIGH" },
  C: { 1: "LOW", 2: "LOW", 3: "MEDIUM", 4: "HIGH", 5: "VERY HIGH" },
  B: { 1: "LOW", 2: "LOW", 3: "LOW", 4: "MEDIUM", 5: "HIGH" },
  A: { 1: "LOW", 2: "LOW", 3: "LOW", 4: "LOW", 5: "MEDIUM" },
};

type RiskLevel = "VERY HIGH" | "HIGH" | "MEDIUM" | "LOW";

interface InspectionPlan {
  riskLevel: RiskLevel;
  coverage: string;
  interval: number;
}

const inspectionPlans: InspectionPlan[] = [
  { riskLevel: "VERY HIGH", coverage: "UT - 50% of potential locations by category", interval: 5 },
  { riskLevel: "HIGH", coverage: "UT - 25% of potential locations by category", interval: 5 },
  { riskLevel: "MEDIUM", coverage: "UT - 10% of potential locations by category", interval: 7 },
  { riskLevel: "LOW", coverage: "UT - 5% of potential locations by category", interval: 10 },
];

interface ExternalInspectionPlan {
  riskLevel: RiskLevel;
  coverage: string;
  interval: number;
}

const externalInspectionPlans: ExternalInspectionPlan[] = [
  { riskLevel: "VERY HIGH", coverage: "CVI - 100% Coverage", interval: 1 },
  { riskLevel: "HIGH", coverage: "CVI - 100% Coverage", interval: 2 },
  { riskLevel: "MEDIUM", coverage: "CVI - 100% Coverage", interval: 3 },
  { riskLevel: "LOW", coverage: "CVI - 100% Coverage", interval: 5 },
];

interface EnvironmentalCrackPlan {
  riskLevel: RiskLevel;
  coverage: string;
  interval: number;
}

const environmentalCrackPlans: EnvironmentalCrackPlan[] = [
  { riskLevel: "VERY HIGH", coverage: "Shear Wave UT - 100% of potential locations", interval: 5 },
  { riskLevel: "HIGH", coverage: "Shear Wave UT - 50% of potential locations", interval: 5 },
  { riskLevel: "MEDIUM", coverage: "Shear Wave UT - 10% of potential locations", interval: 7 },
  { riskLevel: "LOW", coverage: "Shear Wave UT - Not Required", interval: 10 },
];



export function calculateDthinRiskIrp(assetType: number, dthin: number): number {
  try {
    if (isNaN(assetType) || isNaN(dthin)) return 0;

    if (assetType === 2) {
      // Piping: show DThinF as-is
      return dthin;
    } else if (assetType === 1) {
      // Pressure Vessel: return MIN(dthin, dthin + 1)
      return Math.min(dthin, dthin + 1);
    } else {
      // Unknown assetType
      return 0;
    }
  } catch {
    return 0;
  }
}

export function calculateDextdRiskIrp(
  assetType: number,
  dfExtCorrF: number,
  dfExtClscc: number,
  dfCuif: number,
): number {
  try {
    if (assetType !== 2) return 0; // Only process for Piping

    const values = [
      isNaN(dfExtCorrF) ? 0 : dfExtCorrF,
      isNaN(dfExtClscc) ? 0 : dfExtClscc,
      isNaN(dfCuif) ? 0 : dfCuif,
    ];

    return Math.max(...values);
  } catch {
    return 0;
  }
}

export function calculateDsccRiskIrp(dfSccScc: number, dfSccSohic: number): number {
  try {
    const scc = isNaN(dfSccScc) ? 0 : dfSccScc;
    const sohic = isNaN(dfSccSohic) ? 0 : dfSccSohic;

    return Math.max(scc, sohic);
  } catch {
    return 0;
  }
}

export function calculateDmfatRiskIrp(assetType: number, dmfatValue: number): number {
  try {
    if (assetType === 2) {
      // 2 = Piping → use the provided DMFAT value
      return dmfatValue;
    }
    return 0;
  } catch {
    return 0;
  }
}

export function calculatePofRiskIrp(
  comp: string,           // e.g. "PIPE-1", "COMPR"
  dthin: number,
  dextd: number,
  dscc: number,
  dhtha: number,
  dbrit: number,
  dmfat: number
): number {
  try {
    // Lookup gff from table
    const gffEntry = gffTable.find(item => item.comp === comp);
    if (!gffEntry) return 0;

    const eqGff = gffEntry.gff;

    // Helper: if value ≤ 1, return 0
    const safe = (v: number): number => (v <= 1 ? 0 : v);

    const sumBase =
      (dthin <= 1 ? 0 : dthin) +
      (dextd <= 1 ? 0 : dextd) +
      (dscc <= 1 ? 0 : dscc) +
      (dhtha <= 1 ? 0 : dhtha) +
      (dbrit <= 1 ? 0 : dbrit) +
      (dmfat <= 1 ? 0 : dmfat);

    if (sumBase < 1) {
      return eqGff * 1;
    }

    const sumSafe =
      safe(dthin) +
      safe(dextd) +
      safe(dscc) +
      safe(dhtha) +
      safe(dbrit) +
      safe(dmfat);

    // 10^1 = 10 based on formula simplification
    const multiplier = 10;

    return eqGff * sumSafe * multiplier;
  } catch {
    return 0;
  }
}

export function calculateCofFinancialRiskIrp(fc: number): number {
  try {
    const matched = cofDollarThresholds.find(
      (entry) => fc >= entry.min && fc < entry.max
    );
    return matched ? matched.level : 1;
  } catch {
    return 1;
  }
}


export function calculateCofAreaRiskIrp(caCmdFlam: number, caInjFlam: number): number {
  try {
    const maxValue = Math.max(caCmdFlam, caInjFlam);

    // Filter values that are <= maxValue, then find the one with the highest cofm2
    const matched = cofm2SeverityTable
      .filter(entry => entry.cofm2 <= maxValue)
      .sort((a, b) => b.cofm2 - a.cofm2)[0];

    return matched ? matched.severity : 1;
  } catch {
    return 1;
  }
}

export function calculatePofValueRiskIrp(pof: number): string {
  const { thresholds, categories } = pofCategoryTable;

  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (pof >= thresholds[i]) {
      return categories[i];
    }
  }

  return "A"; // fallback if no threshold is matched
}
export function calculateMatrixesRiskIrp(
  pofValue: RowLabel,
  cofFinance: ColumnIndex,
  cofArea: ColumnIndex
): {
  riskLevel: string;
  intInsp: string;
  intInspInterval: number;
  extInsp: string;
  extInspInterval: number;
  envCrack: string;
  envCrackInterval: number;
} {
  try {
    const column: ColumnIndex = Math.max(cofFinance, cofArea) as ColumnIndex;
    const riskLevel = riskMatrixMap[pofValue][column];

    const getPlan = (plans: InspectionPlan[]) => {
      const plan = plans.find((p) => p.riskLevel === riskLevel);
      return plan
        ? { coverage: plan.coverage, interval: plan.interval }
        : { coverage: "", interval: 0 };
    };

    const intPlan = getPlan(inspectionPlans);
    const extPlan = getPlan(externalInspectionPlans);
    const envPlan = getPlan(environmentalCrackPlans);

    return {
      riskLevel,
      intInsp: intPlan.coverage,
      intInspInterval: intPlan.interval,
      extInsp: extPlan.coverage,
      extInspInterval: extPlan.interval,
      envCrack: envPlan.coverage,
      envCrackInterval: envPlan.interval,
    };
  } catch (error) {
    return {
      riskLevel: "",
      intInsp: "",
      intInspInterval: 0,
      extInsp: "",
      extInspInterval: 0,
      envCrack: "",
      envCrackInterval: 0,
    };
  }
}
