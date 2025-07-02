type ComponentData = {
    comp: string;
    S: number;
    M: number;
    L: number;
    R: number;
    gff: number;
};

const table1: ComponentData[] = [
    { comp: "COMPC", S: 8.0e-6, M: 2.0e-5, L: 2.0e-6, R: 0, gff: 3.0e-5 },
    { comp: "COMPR", S: 8.0e-6, M: 2.0e-5, L: 2.0e-6, R: 6.0e-7, gff: 3.06e-5 },
    { comp: "HEXSS", S: 8.0e-6, M: 2.0e-5, L: 2.0e-6, R: 6.0e-7, gff: 3.06e-5 },
    { comp: "HEXTS", S: 8.0e-6, M: 2.0e-5, L: 2.0e-6, R: 6.0e-7, gff: 3.06e-5 },
    { comp: "HEXTUBE", S: 8.0e-6, M: 2.0e-5, L: 2.0e-6, R: 6.0e-7, gff: 3.06e-5 },
    { comp: "PIPE-1", S: 2.8e-5, M: 0, L: 0, R: 2.6e-6, gff: 3.06e-5 },
    { comp: "PIPE-2", S: 2.8e-5, M: 0, L: 0, R: 2.6e-6, gff: 3.06e-5 },
    { comp: "PIPE-4", S: 8.0e-6, M: 2.0e-5, L: 0, R: 2.6e-6, gff: 3.06e-5 },
    { comp: "PIPE-6", S: 8.0e-6, M: 2.0e-5, L: 0, R: 2.6e-6, gff: 3.06e-5 },
    { comp: "PIPE-8", S: 8.0e-6, M: 2.0e-5, L: 2.0e-6, R: 6.0e-7, gff: 3.06e-5 },
    { comp: "PIPE-10", S: 8.0e-6, M: 2.0e-5, L: 2.0e-6, R: 6.0e-7, gff: 3.06e-5 },
    { comp: "PIPE-12", S: 8.0e-6, M: 2.0e-5, L: 2.0e-6, R: 6.0e-7, gff: 3.06e-5 },
    { comp: "PIPE-16", S: 8.0e-6, M: 2.0e-5, L: 2.0e-6, R: 6.0e-7, gff: 3.06e-5 },
    { comp: "PIPEGT16", S: 8.0e-6, M: 2.0e-5, L: 2.0e-6, R: 6.0e-7, gff: 3.06e-5 },
    { comp: "PUMP2S", S: 8.0e-6, M: 2.0e-5, L: 2.0e-6, R: 6.0e-7, gff: 3.06e-5 },
    { comp: "PUMPR", S: 8.0e-6, M: 2.0e-5, L: 2.0e-6, R: 6.0e-7, gff: 3.06e-5 },
    { comp: "PUMP1S", S: 8.0e-6, M: 2.0e-5, L: 2.0e-6, R: 6.0e-7, gff: 3.06e-5 },
    { comp: "TANKBOTTOM", S: 7.2e-4, M: 0, L: 0, R: 2.0e-6, gff: 7.2e-4 },
    { comp: "COURSE-1", S: 7.0e-5, M: 2.5e-5, L: 5.0e-6, R: 1.0e-7, gff: 1.0e-4 },
    { comp: "COURSE-2", S: 7.0e-5, M: 2.5e-5, L: 5.0e-6, R: 1.0e-7, gff: 1.0e-4 },
    { comp: "COURSE-3", S: 7.0e-5, M: 2.5e-5, L: 5.0e-6, R: 1.0e-7, gff: 1.0e-4 },
    { comp: "COURSE-4", S: 7.0e-5, M: 2.5e-5, L: 5.0e-6, R: 1.0e-7, gff: 1.0e-4 },
    { comp: "COURSE-5", S: 7.0e-5, M: 2.5e-5, L: 5.0e-6, R: 1.0e-7, gff: 1.0e-4 },
    { comp: "COURSE-6", S: 7.0e-5, M: 2.5e-5, L: 5.0e-6, R: 1.0e-7, gff: 1.0e-4 },
    { comp: "COURSE-7", S: 7.0e-5, M: 2.5e-5, L: 5.0e-6, R: 1.0e-7, gff: 1.0e-4 },
    { comp: "COURSE-8", S: 7.0e-5, M: 2.5e-5, L: 5.0e-6, R: 1.0e-7, gff: 1.0e-4 },
    { comp: "COURSE-9", S: 7.0e-5, M: 2.5e-5, L: 5.0e-6, R: 1.0e-7, gff: 1.0e-4 },
    { comp: "COURSE-10", S: 7.0e-5, M: 2.5e-5, L: 5.0e-6, R: 1.0e-7, gff: 1.0e-4 },
    { comp: "KODRUM", S: 8.0e-6, M: 2.0e-5, L: 2.0e-6, R: 6.0e-7, gff: 3.06e-5 },
    { comp: "COLBTM", S: 8.0e-6, M: 2.0e-5, L: 2.0e-6, R: 6.0e-7, gff: 3.06e-5 },
    { comp: "FINFAN", S: 8.0e-6, M: 2.0e-5, L: 2.0e-6, R: 6.0e-7, gff: 3.06e-5 },
    { comp: "FILTER", S: 8.0e-6, M: 2.0e-5, L: 2.0e-6, R: 6.0e-7, gff: 3.06e-5 },
    { comp: "DRUM", S: 8.0e-6, M: 2.0e-5, L: 2.0e-6, R: 6.0e-7, gff: 3.06e-5 },
    { comp: "REACTOR", S: 8.0e-6, M: 2.0e-5, L: 2.0e-6, R: 6.0e-7, gff: 3.06e-5 },
    { comp: "COLTOP", S: 8.0e-6, M: 2.0e-5, L: 2.0e-6, R: 6.0e-7, gff: 3.06e-5 },
    { comp: "COLMID", S: 8.0e-6, M: 2.0e-5, L: 2.0e-6, R: 6.0e-7, gff: 3.06e-5 },
];

type DamageCostData = {
    comp: string;
    A: number;
    B: number;
    C: number;
    D: number;
};

const table2: DamageCostData[] = [
    { comp: "PIPE-1", A: 7.3, B: 0, C: 0, D: 29.2 },
    { comp: "PIPE-2", A: 7.3, B: 0, C: 0, D: 58.4 },
    { comp: "PIPE-4", A: 7.3, B: 14.6, C: 0, D: 87.6 },
    { comp: "PIPE-6", A: 7.3, B: 29.2, C: 0, D: 175.2 },
    { comp: "PIPE-8", A: 7.3, B: 43.8, C: 87.6, D: 262.8 },
    { comp: "PIPE-10", A: 7.3, B: 58.4, C: 116.8, D: 350.4 },
    { comp: "PIPE-12", A: 7.3, B: 87.6, C: 175.2, D: 525.6 },
    { comp: "PIPE-16", A: 7.3, B: 116.8, C: 233.6, D: 730 },
    { comp: "PIPEGT16", A: 14.6, B: 175.2, C: 350.4, D: 1022 },
    { comp: "HEXSS", A: 1460, B: 2920, C: 29200, D: 87600 },
    { comp: "HEXTS", A: 1460, B: 2920, C: 29200, D: 87600 },
    { comp: "HEXTUBE", A: 1460, B: 2920, C: 29200, D: 87600 },
    { comp: "KODRUM", A: 7300, B: 17520, C: 29200, D: 58400 },
    { comp: "DRUM", A: 7300, B: 17520, C: 29200, D: 58400 },
    { comp: "FINFAN", A: 1460, B: 2920, C: 29200, D: 58400 },
    { comp: "FILTER", A: 1460, B: 2920, C: 29200, D: 87600 },
    { comp: "COLTOP", A: 14600, B: 36500, C: 73000, D: 146000 },
    { comp: "COLMID", A: 14600, B: 36500, C: 73000, D: 146000 },
    { comp: "COLBTM", A: 14600, B: 36500, C: 73000, D: 146000 },
];

type MaterialFactor = {
    material: string;
    factor: number;
};

const materialFactors: MaterialFactor[] = [
    { material: "Carbon Steel", factor: 1 },
    { material: "1.25Cr-0.5Mo", factor: 1.3 },
    { material: "2.25Cr-1Mo", factor: 1.7 },
    { material: "5Cr-0.5Mo", factor: 1.7 },
    { material: "7Cr-0.5Mo", factor: 2 },
    { material: "Clad 304 SS", factor: 2.1 },
    { material: "Polypropylene Lined (pp)", factor: 2.5 },
    { material: "9Cr-1Mo", factor: 2.6 },
    { material: "405 SS", factor: 2.8 },
    { material: "410 SS", factor: 2.8 },
    { material: "304 SS", factor: 3.2 },
    { material: "Clad 316 SS", factor: 3.3 },
    { material: "CS “Saran” Lined", factor: 3.4 },
    { material: "CS Rubber Lined", factor: 4.4 },
    { material: "316 SS", factor: 4.8 },
    { material: "CS Glass Lined", factor: 5.8 },
    { material: "Clad Alloy 400", factor: 6.4 },
    { material: "90/10 Cu/Ni", factor: 6.8 },
    { material: "Clad Alloy 600", factor: 7 },
    { material: "CS “Teflon” Lined", factor: 7.8 },
    { material: "Clad Nickel", factor: 8 },
    { material: "Alloy 800", factor: 8.4 },
    { material: "70/30 Cu/Ni", factor: 8.5 },
    { material: "904L", factor: 8.8 },
    { material: "Alloy 20", factor: 11 },
    { material: "Alloy 400", factor: 15 },
    { material: "Alloy 600", factor: 15 },
    { material: "Nickel", factor: 18 },
    { material: "Alloy 625", factor: 26 },
    { material: "Titanium", factor: 28 },
    { material: "Alloy “C”", factor: 29 },
    { material: "Zirconium", factor: 34 },
    { material: "Alloy “B”", factor: 36 },
    { material: "Tantalum", factor: 535 },
];

type FluidProperty = {
    fluid: string;
    mw: number;            // Molecular Weight
    liqDensity: number;    // Liquid Density (kg/m³)
    npb: number;           // Normal Boiling Point (°C)
};

const fluidTable: FluidProperty[] = [
    { fluid: "C1-C2", mw: 23, liqDensity: 250.512, npb: -125 },
    { fluid: "C3-C4", mw: 51, liqDensity: 538.379, npb: -21 },
    { fluid: "C5", mw: 72, liqDensity: 625.199, npb: 36 },
    { fluid: "C6-C8", mw: 100, liqDensity: 684.018, npb: 99 },
    { fluid: "C9-C12", mw: 149, liqDensity: 734.012, npb: 184 },
    { fluid: "C13-C16", mw: 205, liqDensity: 764.527, npb: 261 },
    { fluid: "C17-C25", mw: 280, liqDensity: 775.019, npb: 344 },
    { fluid: "C25+", mw: 422, liqDensity: 900.026, npb: 527 },
    { fluid: "Water", mw: 18, liqDensity: 997.947, npb: 100 },
    { fluid: "Steam", mw: 18, liqDensity: 997.947, npb: 100 },
    { fluid: "Acid", mw: 18, liqDensity: 997.947, npb: 100 },
    { fluid: "H2", mw: 2, liqDensity: 71.01, npb: -253 },
    { fluid: "H2S", mw: 34, liqDensity: 993.029, npb: -59 },
    { fluid: "HF", mw: 20, liqDensity: 967.031, npb: 20 },
    { fluid: "CO", mw: 28, liqDensity: 800.92, npb: -191 },
    { fluid: "DEE", mw: 74, liqDensity: 720.828, npb: 35 },
    { fluid: "HCL", mw: 36, liqDensity: 1185.362, npb: -85 },
    { fluid: "Nitric Acid", mw: 63, liqDensity: 1521.749, npb: 121 },
    { fluid: "ALCL3", mw: 133.5, liqDensity: 2434.798, npb: 194 },
    { fluid: "NO2", mw: 90, liqDensity: 929.068, npb: 135 },
    { fluid: "Phosgene", mw: 99, liqDensity: 1377.583, npb: 83 },
    { fluid: "TDI", mw: 174, liqDensity: 1217.399, npb: 251 },
    { fluid: "Methanol", mw: 32, liqDensity: 800.92, npb: 65 },
    { fluid: "PO", mw: 58, liqDensity: 832.957, npb: 34 },
    { fluid: "Styrene (Aromatic)", mw: 104, liqDensity: 683.986, npb: 145 },
    { fluid: "EEA", mw: 132, liqDensity: 977.123, npb: 156 },
    { fluid: "EE", mw: 90, liqDensity: 929.068, npb: 135 },
    { fluid: "EG", mw: 62, liqDensity: 1105.27, npb: 197 },
    { fluid: "EO", mw: 44, liqDensity: 881.013, npb: 11 },
    { fluid: "Pyrophoric", mw: 149, liqDensity: 734.012, npb: 184 },
    { fluid: "Air", mw: 18, liqDensity: 997.947, npb: 100 },
];
// ************************************************ END OF COF PROD LOOKUP TABLE ************************************************


// ************************************************ START OF COF PROD CALCULATIONS ************************************************

export function calculateFcCmdCofProd(
    assetType: 1 | 2, // 1 = Pressure Vessel, 2 = Piping
    comp: string,
    composition: string
): number | null {
    const compData = table1.find(item => item.comp === comp);
    const damageCost = table2.find(item => item.comp === comp);
    const materialFactor = materialFactors.find(item => item.material === composition);

    if (!compData || !damageCost || !materialFactor || compData.gff === 0) {
        console.warn("Missing or invalid data for:", { comp, composition });
        return null;
    }

    const { S, M, L, R, gff } = compData;
    const { A, B, C, D } = damageCost;
    const factor = materialFactor.factor;

    if (assetType === 2) {
        // Piping formula
        const pipingCost = (((S * A) + (M * B) + (L * C) + (R * D)) / gff) * factor;
        return pipingCost;
    } else if (assetType === 1) {
        // Pressure vessel formula
        const vesselCost = ((L * D) / gff) * factor;
        return vesselCost;
    } else {
        console.warn("Invalid asset type");
        return null;
    }
}

export function calculateFcAffaCofProd(caCmdFlam: number, fcCmd: number): number {
    try {
        return caCmdFlam * fcCmd;
    } catch (error) {
        console.error("Error calculating FCaffa:", error);
        return 0;
    }
}

export function calculateOutageAffaCofProd(fcAffaValue: number): number {
    try {
        const microValue = fcAffaValue * 1e-6;
        if (microValue <= 0) return 0; // log10 of 0 or negative is invalid
        const result = Math.pow(10, 1.242 + 0.585 * Math.log10(microValue));
        return result;
    } catch (error) {
        console.error("Error in calculateFromFCaffa:", error);
        return 0;
    }
}

export function calculateOutageCmdCofProd(
    assetType: 1 | 2,
    comp: string,
    outageMult: number
): number {
    try {
        const compData = table1.find(item => item.comp === comp);
        const damageData = table2.find(item => item.comp === comp);

        if (!compData || !damageData || compData.gff === 0) {
            console.warn("Missing or invalid data for:", comp);
            return 0;
        }

        const { S, M, L, R, gff } = compData;
        const { A, B, C, D } = damageData;

        let baseCost: number;

        if (assetType === 2) {
            // Piping
            baseCost = ((S * A) + (M * B) + (L * C) + (R * D)) / gff;
        } else if (assetType === 1) {
            // Pressure Vessel
            baseCost = ((S * A) + (M * B) + (L * C) + (R * D)) / gff;
        } else {
            console.warn("Invalid asset type:", assetType);
            return 0;
        }

        return baseCost * outageMult;
    } catch (error) {
        console.error("Error calculating Outagecmd:", error);
        return 0;
    }
}

export function calculateFcProdCofProd(
    outageAffa: number,
    outageCmd: number,
    LRA_Prod: number
): number {
    try {
        return (outageAffa + outageCmd) * LRA_Prod;
    } catch (error) {
        console.error("Error calculating FCprod:", error);
        return 0;
    }
}

export function calculatePopDensCofProd(): number {
    try {
        return 10 / ((12000 * 13990) / Math.pow(1000, 2));
    } catch (error) {
        console.error("Error in calculateSimpleRatio:", error);
        return 0;
    }
}

export function calculateFcInjCostCofProd(mrelease: number, injCost: number, popDens: number): number {
    try {
        return mrelease * injCost * popDens;
    } catch (error) {
        console.error("Error calculating FCinjs:", error);
        return 0;
    }
}

export function calculateFracEvapCofProd(fluid: string): number {
    try {
        const match = fluidTable.find(f => f.fluid.toLowerCase() === fluid.toLowerCase());

        if (!match) {
            console.warn(`Fluid "${fluid}" not found in fluidTable`);
            return 0;
        }
        const AF14 = 1.8;
        const npb = match.npb;
        const baseTemp = npb + 32;
        const T = AF14 * baseTemp;

        // Calculate individual components
        const term1 = -7.1408;
        const term2 = (8.5827e-3) * T;  // 8.5827 * 10^-3
        const term3 = (3.5594e-6) * (T ** 2);  // 3.5594 * 10^-6
        const term4 = 2331.1 / T;
        const term5 = 203545 / (T ** 2);

        const result = term1 + term2 - term3 + term4 - term5;


        return result;
    } catch (error) {
        console.error("Error in fracEvap:", error);
        return 0;
    }
}

export function calculateVolEnvCofProd(
  massKg: number,
  fracevap: number,
  fluid: string
): number {
  try {
    const fluidData = fluidTable.find(
      (item) => item.fluid.toLowerCase() === fluid.toLowerCase()
    );
    if (!fluidData || fluidData.liqDensity === 0) return 0;

    return 6.29 * massKg * (1 - fracevap) / fluidData.liqDensity;
  } catch (error) {
    return 0;
  }
}

export function calculateFcEnvironCofProd(
  comp: string,
  volenv: number,
  envcost: number
): number {
  try {
    const item = table1.find(
      (c) => c.comp.toLowerCase() === comp.toLowerCase()
    );
    if (!item || item.gff === 0) return 0;

    const totalRelease =
      (item.S + item.M + item.L + item.R) * volenv;

    return (totalRelease / item.gff) * envcost;
  } catch (error) {
    return 0;
  }
}

export function calculateFcCofProd(
  fcCmd: number,
  fcAffa: number,
  fcProd: number,
  fcInj: number,
  fcEnviron: number
): number {
  try {
    const safe = (val: any) => (typeof val === "number" && !isNaN(val) ? val : 0);

    const total =
      safe(fcCmd) +
      safe(fcAffa) +
      safe(fcProd) +
      safe(fcInj) +
      safe(fcEnviron);

    return total * 4.2;
  } catch (error) {
    return 0;
  }
}

