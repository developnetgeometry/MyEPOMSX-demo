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

export interface PofCategoryThreshold {
  thresholds: number[];  // numeric thresholds for comparison
  categories: string[];  // corresponding category labels
}

const pofCategoryTable: PofCategoryThreshold = {
  thresholds: [0, 3.06e-5, 3.06e-4, 3.06e-3, 3.06e-2, 1.0],
  categories: ["", "A", "B", "C", "D", "E"]
};

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
  if (fc <= 2500) return 1;
  else if (fc <= 99999) return 2;
  else if (fc <= 999999) return 3;
  else if (fc <= 9999999) return 4;
  else return 5;
}

export function calculateCofAreaRiskIrp(caCmdFlam: number, caInjFlam: number): number {
  try {
    const maxValue = Math.max(caCmdFlam, caInjFlam);

    // Filter values that are <= maxValue, then find the one with the highest cofm2
    const matched = cofm2SeverityTable
      .filter(entry => entry.cofm2 <= maxValue)
      .sort((a, b) => b.cofm2 - a.cofm2)[0];

    return matched ? matched.severity : 0;
  } catch {
    return 0;
  }
}

export function calculatePofValueRiskIrp(pof: number): string {
  const { thresholds, categories } = pofCategoryTable;

  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (pof >= thresholds[i]) {
      return categories[i];
    }
  }

  return ""; // fallback if no threshold is matched
}