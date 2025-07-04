export function calculateSusceptibilitySccSohic(
    assetType: number, // 1 = Pressure Vessel, 2 = Piping
    composition: string, // e.g. "Carbon steel"
    isClad?: boolean // only required for pressure vessel
): "Y" | "N" {
    const isCarbonSteel = composition.toLowerCase() === "carbon steel";

    // Piping: if carbon steel → Y, else N
    if (assetType === 2) {
        return isCarbonSteel ? "Y" : "N";
    }

    // Pressure Vessel: XOR between Clad? and Composition
    if (assetType === 1) {
        const clad = Boolean(isClad); // assume false if undefined
        const xorResult = clad !== isCarbonSteel; // XOR logic
        return xorResult ? "Y" : "N";
    }

    // Default fallback
    return "N";
}

type Severity = "Low" | "Moderate" | "High" | "Moderate*" | "High*" | "N/A";

/**
 * Get CUI severity level based on pH and H2S (ppm) if susceptible
 */
export function calculateEnvSeveritySccSohic(
    susceptibility: string, // "Y" or "N"
    pH: number,
    h2sPpm: number
): Severity {
    if (susceptibility.toUpperCase() !== "Y") return "N/A";

    const h2sThresholds = [0, 50, 1000, 10000];
    const phThresholds = [5.5, 7.5, 8.3, 8.9, 14.0];

    const severityTable: Severity[][] = [
        ["Low", "Moderate", "High", "High"],
        ["Low", "Low", "Low", "Moderate"],
        ["Low", "Moderate", "Moderate", "Moderate"],
        ["Low", "Moderate", "Moderate*", "High*"],
        ["Low", "Moderate", "High*", "High*"],
    ];

    // Find row index for pH
    const row = phThresholds.findIndex((threshold, i) => {
        const next = phThresholds[i + 1];
        return pH <= threshold || (next && pH < next);
    });

    // Find column index for H2S ppm
    const col = h2sThresholds.findIndex((threshold, i) => {
        const next = h2sThresholds[i + 1];
        return h2sPpm <= threshold || (next && h2sPpm < next);
    });

    // Fallback if no match
    if (row === -1 || col === -1) return "N/A";

    return severityTable[row][col];
}

export type EnvSeverity = "High" | "Moderate" | "Low";

export function normalizeEnvSeverity(env: string): EnvSeverity | null {
    const trimmed = env.trim().toLowerCase();
    if (trimmed.startsWith("high")) return "High";
    if (trimmed.startsWith("moderate")) return "Moderate";
    if (trimmed.startsWith("low")) return "Low";
    return null;
}

export function calculateSuscToCrackSccSohic(
    steelSContent: number, // 1 = >0.01% S, 2 = <0.01% S, 3 = Seamless/Extruded
    pwht: boolean,
    rawEnvSeverity: string // accept raw input, will be normalized
): string {
    // Normalize the environment severity first
    const envSeverity = normalizeEnvSeverity(rawEnvSeverity);

    if (!envSeverity) return "N/A"; // If not recognizable, return fallback

    const columnMap = {
        "1_false": 0,
        "1_true": 1,
        "2_false": 2,
        "2_true": 3,
        "3_false": 4,
        "3_true": 5
    };

    const table: Record<EnvSeverity, string[]> = {
        High: ["High", "High", "High", "Medium", "Medium", "Low"],
        Moderate: ["High", "Medium", "Medium", "Low", "Low", "Low"],
        Low: ["Medium", "Low", "Low", "Low", "Low", "Low"]
    };

    const colKey = `${steelSContent}_${pwht}`;
    const colIndex = columnMap[colKey as keyof typeof columnMap];

    return colIndex !== undefined ? table[envSeverity][colIndex] : "N/A";
}

export function calculateSviSccSohic(sscSusceptibility: string): number {
    const normalized = sscSusceptibility.trim().toLowerCase();

    switch (normalized) {
        case "high":
            return 100;
        case "medium":
            return 10;
        case "low":
            return 1;
        case "not":
            return 0;
        default:
            return 0; // fallback for unknown values
    }
}

type DfSccFbRow = {
    svi: number;
    [eff: string]: number; // Dynamic keys like "1D", "2A", etc.
};

// Table 1 data (partial for example, you can fill in the rest)
const dfSccFbTable: DfSccFbRow[] = [
    { svi: 0, E: 0, "1D": 0, "1C": 0, "1B": 0, "1A": 0, "2D": 0, "2C": 0, "2B": 0, "2A": 0, "3D": 0, "3C": 0, "3B": 0, "3A": 0, "4D": 0, "4C": 0, "4B": 0, "4A": 0, "5D": 0, "5C": 0, "5B": 0, "5A": 0, "6D": 0, "6C": 0, "6B": 0, "6A": 0 },
    { svi: 1, E: 1, "1D": 1, "1C": 1, "1B": 1, "1A": 1, "2D": 1, "2C": 1, "2B": 1, "2A": 1, "3D": 1, "3C": 1, "3B": 1, "3A": 1, "4D": 1, "4C": 1, "4B": 1, "4A": 1, "5D": 1, "5C": 1, "5B": 1, "5A": 1, "6D": 1, "6C": 1, "6B": 1, "6A": 1 },
    { svi: 10, E: 10, "1D": 8, "1C": 3, "1B": 1, "1A": 1, "2D": 6, "2C": 2, "2B": 1, "2A": 1, "3D": 4, "3C": 1, "3B": 1, "3A": 1, "4D": 2, "4C": 1, "4B": 1, "4A": 1, "5D": 1, "5C": 1, "5B": 1, "5A": 1, "6D": 1, "6C": 1, "6B": 1, "6A": 1 },
    { svi: 500, E: 500, "1D": 400, "1C": 170, "1B": 50, "1A": 25, "2D": 300, "2C": 100, "2B": 20, "2A": 5, "3D": 200, "3C": 50, "3B": 8, "3A": 1, "4D": 100, "4C": 25, "4B": 2, "4A": 1, "5D": 50, "5C": 10, "5B": 1, "5A": 1, "6D": 25, "6C": 5, "6B": 1, "6A": 1 },
    { svi: 1000, E: 1000, "1D": 800, "1C": 330, "1B": 100, "1A": 50, "2D": 600, "2C": 200, "2B": 40, "2A": 10, "3D": 400, "3C": 100, "3B": 16, "3A": 2, "4D": 200, "4C": 50, "4B": 5, "4A": 1, "5D": 100, "5C": 25, "5B": 2, "5A": 1, "6D": 50, "6C": 10, "6B": 1, "6A": 1 },
    { svi: 5000, E: 5000, "1D": 4000, "1C": 1670, "1B": 500, "1A": 250, "2D": 3000, "2C": 1000, "2B": 250, "2A": 50, "3D": 2000, "3C": 500, "3B": 80, "3A": 10, "4D": 1000, "4C": 250, "4B": 25, "4A": 2, "5D": 500, "5C": 125, "5B": 5, "5A": 1, "6D": 250, "6C": 50, "6B": 2, "6A": 1 }
];

export function calculateDfSohicFbSccSohic(svi: number, inspEff: string): number {
    // First, find the row where the SVI matches
    const row = dfSccFbTable.find(entry => entry.svi === svi);

    // If not found, return 0
    if (!row) return 0;

    // Look up the value by column
    const value = row[inspEff];

    // If the column doesn't exist, return 0
    return value ?? 0;
}


export function calculateDfSccSohic(
  dfSohicFb: number,
  lastInspectionDate: string,
  onlineMonitoringValue: number // Direct numeric value, e.g. 1.0, 0.5, etc.
): number {
  try {
    const today = new Date();
    const lastInspection = new Date(lastInspectionDate);

    if (isNaN(lastInspection.getTime()) || onlineMonitoringValue === 0) return 0;

    const diffInDays = (today.getTime() - lastInspection.getTime()) / (1000 * 60 * 60 * 24);
    const years = diffInDays / 365;

    const yearFactor = Math.max(years, 1); // keep fractional years
    const ageFactor = Math.pow(yearFactor, 1.1);

    const result = dfSohicFb * ageFactor / onlineMonitoringValue;
    return parseFloat(result.toFixed(6));
  } catch {
    return 0;
  }
}
