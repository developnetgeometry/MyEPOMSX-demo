type SpecificHeatData = {
    fluid: string;
    note: string;
    A?: number;
    B?: number;
    C?: number;
    D?: number;
};

const specificHeatTable: SpecificHeatData[] = [
    { fluid: "C1-C2", note: "Note 1", A: 12.3, B: 1.15e-1, C: -2.87e-5, D: -1.30e-9 },
    { fluid: "C3-C4", note: "Note 1", A: 2.632, B: 3.188e-1, C: -1.35e-4, D: 1.47e-8 },
    { fluid: "C5", note: "Note 1", A: -3.626, B: 4.873e-1, C: -2.60e-4, D: 5.30e-8 },
    { fluid: "C6-C8", note: "Note 1", A: -5.146, B: 6.76e-1, C: -3.65e-4, D: 7.66e-8 },
    { fluid: "C9-C12", note: "Note 1", A: -8.5, B: 1.01, C: -5.56e-4, D: 1.18e-7 },
    { fluid: "C13-C16", note: "Note 1", A: -11.7, B: 1.39, C: -7.72e-4, D: 1.67e-7 },
    { fluid: "C17-C25", note: "Note 1", A: -22.4, B: 1.94, C: -1.12e-3, D: -2.53e-7 },
    { fluid: "C25+", note: "Note 1", A: -22.4, B: 1.94, C: -1.12e-3, D: -2.53e-7 },
    { fluid: "Water", note: "Note 3", A: 2.76e5, B: -2.09e3, C: 8.125, D: -1.41e-2 },
    { fluid: "Steam", note: "Note 3", A: 3.34e4, B: 2.68e4, C: 2.61e3, D: 8.90e3 },
    { fluid: "Acid", note: "Note 3", A: 2.76e5, B: -2.09e3, C: 8.125, D: -1.41e-2 },
    { fluid: "H2", note: "Note 1", A: 27.1, B: 9.27e-3, C: -1.38e-5, D: 7.65e-9 },
    { fluid: "H2S", note: "Note 1", A: 31.9, B: 1.44e-3, C: 2.43e-5, D: -1.18e-8 },
    { fluid: "HF", note: "Note 1", A: 29.1, B: 6.61e-4, C: -2.03e-6, D: 2.50e-9 },
    { fluid: "CO", note: "Note 2", A: 2.91e4, B: 8.77e3, C: 3.09e3, D: 8.46e3 },
    { fluid: "DEE", note: "Note 2", A: 8.62e4, B: 2.55e5, C: 1.54e3, D: 1.44e5 },
    { fluid: "HCL", note: "---" },
    { fluid: "Nitric Acid", note: "---" },
    { fluid: "ALCL3", note: "Note 1", A: 4.34e4, B: 3.97e4, C: 4.17e2, D: 2.40e4 },
    { fluid: "NO2", note: "---" },
    { fluid: "Phosgene", note: "---" },
    { fluid: "TDI", note: "---" },
    { fluid: "Methanol", note: "Note 2", A: 3.93e4, B: 8.79e4, C: 1.92e3, D: 5.37e4 },
    { fluid: "PO", note: "Note 2", A: 4.95e4, B: 1.74e5, C: 1.56e3, D: 1.15e5 },
    { fluid: "Styrene (Aromatic)", note: "Note 2", A: 8.93e4, B: 2.15e5, C: 7.72e2, D: 9.99e4 },
    { fluid: "EEA", note: "Note 2", A: 1.06e5, B: 2.40e5, C: 6.59e2, D: 1.50e5 },
    { fluid: "EE", note: "Note 2", A: 3.25e4, B: 3.00e5, C: 1.17e3, D: 2.08e5 },
    { fluid: "EG", note: "Note 2", A: 6.30e4, B: 1.46e5, C: 1.67e3, D: 9.73e4 },
    { fluid: "EO", note: "Note 2", A: 3.35e4, B: 1.21e5, C: 1.61e3, D: 8.24e4 },
    { fluid: "Pyrophoric", note: "Note 1", A: -8.5, B: 1.01, C: -5.56e-4, D: 1.18e-7 },
    { fluid: "Air", note: "Note 3", A: 3.34e4, B: 2.68e4, C: 2.61e3, D: 8.90e3 }
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

type ComponentArea = {
    comp: string;
    diameterMM: number;
    areaMM2: number;
};

const componentAreaTable: ComponentArea[] = [
    { comp: "PIPE-1", diameterMM: 10, areaMM2: 78.54 },
    { comp: "PIPE-2", diameterMM: 22, areaMM2: 380.13 },
    { comp: "PIPE-4", diameterMM: 27, areaMM2: 572.56 },
    { comp: "PIPE-6", diameterMM: 46, areaMM2: 1661.90 },
    { comp: "PIPE-8", diameterMM: 52, areaMM2: 2123.72 },
    { comp: "PIPE-10", diameterMM: 62, areaMM2: 3019.07 },
    { comp: "PIPE-12", diameterMM: 72, areaMM2: 4071.50 },
    { comp: "PIPE-16", diameterMM: 104, areaMM2: 8494.87 },
    { comp: "PIPEGT16", diameterMM: 118, areaMM2: 10935.88 },
    { comp: "KODRUM", diameterMM: 86, areaMM2: 5808.80 },
    { comp: "FILTER", diameterMM: 86, areaMM2: 5808.80 },
    { comp: "DRUM", diameterMM: 86, areaMM2: 5808.80 },
    { comp: "COLTOP", diameterMM: 66, areaMM2: 3421.19 },
    { comp: "COLMID", diameterMM: 66, areaMM2: 3421.19 },
    { comp: "COLBTM", diameterMM: 66, areaMM2: 3421.19 },
    { comp: "HEXSS", diameterMM: 86, areaMM2: 5808.80 },
    { comp: "HEXTS", diameterMM: 86, areaMM2: 5808.80 },
    { comp: "HEXTUBE", diameterMM: 33, areaMM2: 855.30 },
    { comp: "FILTER", diameterMM: 46, areaMM2: 1661.90 }, // Note: duplicate comp, different size
    { comp: "FINFAN", diameterMM: 11, areaMM2: 95.03 },
];

type IsoDet = {
    iso: string;
    value: number;
};

const isoDetTable: IsoDet[] = [
    { iso: "AA", value: 0.25 },
    { iso: "AB", value: 0.2 },
    { iso: "AC", value: 0.1 },
    { iso: "BC", value: 0.1 },
    { iso: "BB", value: 0.15 },
    { iso: "CC", value: 0 },
];

type IsoDetDmm = {
    iso: string;
    values: {
        [dmm: number]: number;
    };
};

const isoDetDmmTable: IsoDetDmm[] = [
    { iso: "AA", values: { 6.4: 20, 25: 10, 102: 5, 118: 5 } },
    { iso: "AB", values: { 6.4: 30, 25: 20, 102: 10, 118: 10 } },
    { iso: "AC", values: { 6.4: 40, 25: 30, 102: 20, 118: 20 } },
    { iso: "BA", values: { 6.4: 40, 25: 30, 102: 20, 118: 20 } },
    { iso: "BB", values: { 6.4: 40, 25: 30, 102: 20, 118: 20 } },
    { iso: "BC", values: { 6.4: 60, 25: 30, 102: 10, 118: 10 } },
    { iso: "CA", values: { 6.4: 60, 25: 40, 102: 20, 118: 20 } },
    { iso: "CB", values: { 6.4: 60, 25: 40, 102: 20, 118: 20 } },
    { iso: "CC", values: { 6.4: 60, 25: 40, 102: 20, 118: 20 } },
];

//
type FluidCaAllProperties = {
    fluid: string;
    gasA?: number;
    gasB?: number;
    liquidA?: number;
    liquidB?: number;
};

//CA-CMDAINL-CONT CAINL 1
const CaCmdAinlCont: FluidCaAllProperties[] = [
    { fluid: "C1-C2", gasA: 8.669, gasB: 0.98 },
    { fluid: "C3-C4", gasA: 10.13, gasB: 1 },
    { fluid: "C5", gasA: 5.115, gasB: 0.99, liquidA: 100.6, liquidB: 0.89 },
    { fluid: "C6-C8", gasA: 5.846, gasB: 0.98, liquidA: 34.17, liquidB: 0.89 },
    { fluid: "C9-C12", gasA: 2.419, gasB: 0.98, liquidA: 24.6, liquidB: 0.9 },
    { fluid: "C13-C16", liquidA: 12.11, liquidB: 0.9 },
    { fluid: "C17-C25", liquidA: 3.785, liquidB: 0.9 },
    { fluid: "C25+", liquidA: 2.098, liquidB: 0.91 },
    { fluid: "H2", gasA: 13.13, gasB: 0.992 },
    { fluid: "H2S", gasA: 6.554, gasB: 1 },
    { fluid: "HF" },
    { fluid: "Styrene (Aromatic)", gasA: 3.952, gasB: 1.097, liquidA: 21.1, liquidB: 1 },
    { fluid: "CO", gasA: 0.04, gasB: 1.752 },
    { fluid: "DEE", gasA: 9.072, gasB: 1.134, liquidA: 164.2, liquidB: 1.106 },
    { fluid: "Methanol", gasA: 0.005, gasB: 0.909, liquidA: 340.4, liquidB: 0.934 },
    { fluid: "PO", gasA: 3.277, gasB: 1.114, liquidA: 257, liquidB: 0.96 },
    { fluid: "EEA", gasA: 0, gasB: 1.035, liquidA: 23.96, liquidB: 1 },
    { fluid: "EE", gasA: 2.595, gasB: 1.005, liquidA: 35.45, liquidB: 1 },
    { fluid: "EG", gasA: 1.548, gasB: 0.973, liquidA: 22.12, liquidB: 1 },
    { fluid: "EO", gasA: 6.712, gasB: 1.069 },
    { fluid: "Pyrophoric", gasA: 2.419, gasB: 0.98, liquidA: 24.6, liquidB: 0.9 },
    { fluid: "Water" },
    { fluid: "Steam" },
    { fluid: "Air" },
];

//CA-CMDAIL-CONT CAIL 2
const CaCmdAilCont: FluidCaAllProperties[] = [
    { fluid: "C1-C2", gasA: 55.13, gasB: 0.95 },
    { fluid: "C3-C4", gasA: 64.23, gasB: 1 },
    { fluid: "C5", gasA: 62.41, gasB: 1 },
    { fluid: "C6-C8", gasA: 63.98, gasB: 1, liquidA: 103.4, liquidB: 0.95 },
    { fluid: "C9-C12", gasA: 76.98, gasB: 0.95, liquidA: 110.3, liquidB: 0.95 },
    { fluid: "C13-C16", liquidA: 196.7, liquidB: 0.92 },
    { fluid: "C17-C25", liquidA: 165.5, liquidB: 0.92 },
    { fluid: "C25+", liquidA: 103, liquidB: 0.9 },
    { fluid: "H2", gasA: 86.02, gasB: 1 },
    { fluid: "H2S", gasA: 38.11, gasB: 0.89 },
    { fluid: "HF" },
    { fluid: "Styrene (Aromatic)", gasA: 80.11, gasB: 1.055 },
    { fluid: "CO" },
    { fluid: "DEE", gasA: 67.42, gasB: 1.033, liquidA: 976, liquidB: 0.649 },
    { fluid: "Methanol" },
    { fluid: "PO" },
    { fluid: "EEA" },
    { fluid: "EE" },
    { fluid: "EG" },
    { fluid: "EO" },
    { fluid: "Pyrophoric", gasA: 76.98, gasB: 0.95, liquidA: 110.3, liquidB: 0.95 },
    { fluid: "Water" },
    { fluid: "Steam" },
    { fluid: "Air" },
];

//CA-CMDAINL-INST IAINL 3
const CaCmdAinlInst: FluidCaAllProperties[] = [
    { fluid: "C1-C2", gasA: 6.469, gasB: 0.67 },
    { fluid: "C3-C4", gasA: 4.59, gasB: 0.72 },
    { fluid: "C5", gasA: 2.214, gasB: 0.73, liquidA: 0.271, liquidB: 0.85 },
    { fluid: "C6-C8", gasA: 2.188, gasB: 0.66, liquidA: 0.749, liquidB: 0.78 },
    { fluid: "C9-C12", gasA: 1.111, gasB: 0.66, liquidA: 0.559, liquidB: 0.76 },
    { fluid: "C13-C16", liquidA: 0.086, liquidB: 0.88 },
    { fluid: "C17-C25", liquidA: 0.021, liquidB: 0.91 },
    { fluid: "C25+", liquidA: 0.006, liquidB: 0.99 },
    { fluid: "H2", gasA: 9.605, gasB: 0.657 },
    { fluid: "H2S", gasA: 22.63, gasB: 0.63 },
    { fluid: "HF" },
    { fluid: "Styrene (Aromatic)", gasA: 1.804, gasB: 0.667, liquidA: 14.36, liquidB: 1 },
    { fluid: "CO", gasA: 10.97, gasB: 0.667 },
    { fluid: "DEE", gasA: 24.51, gasB: 0.667, liquidA: 0.981, liquidB: 0.919 },
    { fluid: "Methanol", gasA: 4.425, gasB: 0.667, liquidA: 0.363, liquidB: 0.9 },
    { fluid: "PO", gasA: 10.32, gasB: 0.667, liquidA: 0.629, liquidB: 0.869 },
    { fluid: "EEA", gasA: 1.261, gasB: 0.667, liquidA: 14.13, liquidB: 1 },
    { fluid: "EE", gasA: 6.119, gasB: 0.667, liquidA: 14.79, liquidB: 1 },
    { fluid: "EG", gasA: 1.027, gasB: 0.667, liquidA: 14.13, liquidB: 1 },
    { fluid: "EO", liquidA: 21.46, liquidB: 0.667 },
    { fluid: "Pyrophoric", gasA: 1.111, gasB: 0.66, liquidA: 0.559, liquidB: 0.76 },
    { fluid: "Water" },
    { fluid: "Steam" },
    { fluid: "Air" },
];

//CA-CMDAIL-INST IAIL 4
const CaCmdAilInst: FluidCaAllProperties[] = [
    { fluid: "C1-C2", gasA: 163.7, gasB: 0.62 },
    { fluid: "C3-C4", gasA: 79.94, gasB: 0.63 },
    { fluid: "C5", gasA: 41.38, gasB: 0.61 },
    { fluid: "C6-C8", gasA: 41.49, gasB: 0.61, liquidA: 8.18, liquidB: 0.55 },
    { fluid: "C9-C12", gasA: 42.28, gasB: 0.61, liquidA: 0.848, liquidB: 0.53 },
    { fluid: "C13-C16", liquidA: 1.714, liquidB: 0.88 },
    { fluid: "C17-C25", liquidA: 1.068, liquidB: 0.91 },
    { fluid: "C25+", liquidA: 0.284, liquidB: 0.99 },
    { fluid: "H2", gasA: 216.5, gasB: 0.618 },
    { fluid: "H2S", gasA: 53.72, gasB: 0.61 },
    { fluid: "HF" },
    { fluid: "Styrene (Aromatic)", gasA: 83.68, gasB: 0.713, liquidA: 143.6, liquidB: 1 },
    { fluid: "CO" },
    { fluid: "DEE", liquidA: 1.09, liquidB: 0.919 },
    { fluid: "Methanol" },
    { fluid: "PO" },
    { fluid: "EEA" },
    { fluid: "EE" },
    { fluid: "EG" },
    { fluid: "EO" },
    { fluid: "Pyrophoric", gasA: 42.28, gasB: 0.61, liquidA: 0.848, liquidB: 0.53 },
    { fluid: "Water" },
    { fluid: "Steam" },
    { fluid: "Air" },
];

//CA-INJAINL-CONT CAINL 5
const CaInjAinlCont: FluidCaAllProperties[] = [
    { fluid: "C1-C2", gasA: 21.83, gasB: 0.96 },
    { fluid: "C3-C4", gasA: 25.64, gasB: 1 },
    { fluid: "C5", gasA: 12.71, gasB: 1, liquidA: 290.1, liquidB: 0.89 },
    { fluid: "C6-C8", gasA: 13.49, gasB: 0.96, liquidA: 96.88, liquidB: 0.89 },
    { fluid: "C9-C12", gasA: 5.755, gasB: 0.96, liquidA: 70.03, liquidB: 0.89 },
    { fluid: "C13-C16", liquidA: 34.36, liquidB: 0.89 },
    { fluid: "C17-C25", liquidA: 10.7, liquidB: 0.89 },
    { fluid: "C25+", liquidA: 6.196, liquidB: 0.89 },
    { fluid: "H2", gasA: 32.05, gasB: 0.933 },
    { fluid: "H2S", gasA: 10.65, gasB: 1 },
    { fluid: "HF" },
    { fluid: "Styrene (Aromatic)", gasA: 12.76, gasB: 0.963, liquidA: 66.01, liquidB: 0.883 },
    { fluid: "CO", gasA: 5.491, gasB: 0.991 },
    { fluid: "DEE", gasA: 26.76, gasB: 1.025, liquidA: 236.7, liquidB: 1.219 },
    { fluid: "Methanol", gasA: 0, gasB: 1.008, liquidA: 849.9, liquidB: 0.902 },
    { fluid: "PO", gasA: 8.239, gasB: 1.047, liquidA: 352.8, liquidB: 0.84 },
    { fluid: "EEA", gasA: 0, gasB: 0.946, liquidA: 79.66, liquidB: 0.835 },
    { fluid: "EE", gasA: 7.107, gasB: 0.969, liquidA: 8.142, liquidB: 0.8 },
    { fluid: "EG", gasA: 5.042, gasB: 0.947, liquidA: 59.96, liquidB: 0.869 },
    { fluid: "EO", gasA: 11, gasB: 1.105 },
    { fluid: "Pyrophoric", gasA: 5.755, gasB: 0.96, liquidA: 70.03, liquidB: 0.89 },
    { fluid: "Water" },
    { fluid: "Steam" },
    { fluid: "Air" },
];

//CA-INJAIL-CONT CAIL 6
const CaInjAilCont: FluidCaAllProperties[] = [
    { fluid: "C1-C2", gasA: 143.2, gasB: 0.92 },
    { fluid: "C3-C4", gasA: 171.4, gasB: 1 },
    { fluid: "C5", gasA: 166.1, gasB: 1 },
    { fluid: "C6-C8", gasA: 169.7, gasB: 1, liquidA: 252.8, liquidB: 0.92 },
    { fluid: "C9-C12", gasA: 188.6, gasB: 0.92, liquidA: 269.4, liquidB: 0.92 },
    { fluid: "C13-C16", liquidA: 539.4, liquidB: 0.9 },
    { fluid: "C17-C25", liquidA: 458, liquidB: 0.9 },
    { fluid: "C25+", liquidA: 303.6, liquidB: 0.9 },
    { fluid: "H2", gasA: 228.8, gasB: 1 },
    { fluid: "H2S", gasA: 73.25, gasB: 0.94 },
    { fluid: "HF" },
    { fluid: "Styrene (Aromatic)", gasA: 261.9, gasB: 0.937, liquidA: 56, liquidB: 0.268 },
    { fluid: "CO" },
    { fluid: "DEE", gasA: 241.5, gasB: 0.997, liquidA: 488.9, liquidB: 0.864 },
    { fluid: "Methanol" },
    { fluid: "PO" },
    { fluid: "EEA" },
    { fluid: "EE" },
    { fluid: "EG" },
    { fluid: "EO" },
    { fluid: "Pyrophoric", gasA: 188.6, gasB: 0.92, liquidA: 269.4, liquidB: 0.92 },
    { fluid: "Water" },
    { fluid: "Steam" },
    { fluid: "Air" },
];

//CA-INJAINL-INST IAINL 7
const CaInjAinlInst: FluidCaAllProperties[] = [
    { fluid: "C1-C2", gasA: 12.46, gasB: 0.67 },
    { fluid: "C3-C4", gasA: 9.702, gasB: 0.75 },
    { fluid: "C5", gasA: 4.82, gasB: 0.76, liquidA: 0.79, liquidB: 0.85 },
    { fluid: "C6-C8", gasA: 4.216, gasB: 0.67, liquidA: 2.186, liquidB: 0.78 },
    { fluid: "C9-C12", gasA: 2.035, gasB: 0.66, liquidA: 1.609, liquidB: 0.76 },
    { fluid: "C13-C16", liquidA: 0.242, liquidB: 0.88 },
    { fluid: "C17-C25", liquidA: 0.061, liquidB: 0.91 },
    { fluid: "C25+", liquidA: 0.016, liquidB: 0.99 },
    { fluid: "H2", gasA: 18.43, gasB: 0.652 },
    { fluid: "H2S", gasA: 41.43, gasB: 0.63 },
    { fluid: "HF" },
    { fluid: "Styrene (Aromatic)", gasA: 2.889, gasB: 0.686, liquidA: 0.027, liquidB: 0.935 },
    { fluid: "CO", gasA: 16.91, gasB: 0.692 },
    { fluid: "DEE", gasA: 31.71, gasB: 0.682, liquidA: 8.333, liquidB: 0.814 },
    { fluid: "Methanol", gasA: 6.035, gasB: 0.688, liquidA: 1.157, liquidB: 0.871 },
    { fluid: "PO", gasA: 13.33, gasB: 0.682, liquidA: 2.732, liquidB: 0.834 },
    { fluid: "EEA", gasA: 1.825, gasB: 0.687, liquidA: 0.03, liquidB: 0.924 },
    { fluid: "EE", gasA: 25.36, gasB: 0.66, liquidA: 0.029, liquidB: 0.927 },
    { fluid: "EG", gasA: 1.435, gasB: 0.687, liquidA: 0.027, liquidB: 0.922 },
    { fluid: "EO", gasA: 34.7, gasB: 0.665 },
    { fluid: "Pyrophoric", gasA: 2.035, gasB: 0.66, liquidA: 1.609, liquidB: 0.76 },
    { fluid: "Water" },
    { fluid: "Steam" },
    { fluid: "Air" },
];

//CA-INJAIL-INST IAIL 8
const CaInjAilInst: FluidCaAllProperties[] = [
    { fluid: "C1-C2", gasA: 473.9, gasB: 0.63 },
    { fluid: "C3-C4", gasA: 270.4, gasB: 0.63 },
    { fluid: "C5", gasA: 146.7, gasB: 0.63 },
    { fluid: "C6-C8", gasA: 147.2, gasB: 0.63, liquidA: 31.89, liquidB: 0.54 },
    { fluid: "C9-C12", gasA: 151, gasB: 0.63, liquidA: 2.847, liquidB: 0.54 },
    { fluid: "C13-C16", liquidA: 4.843, liquidB: 0.88 },
    { fluid: "C17-C25", liquidA: 3.052, liquidB: 0.91 },
    { fluid: "C25+", liquidA: 0.833, liquidB: 0.99 },
    { fluid: "H2", gasA: 636.5, gasB: 0.621 },
    { fluid: "H2S", gasA: 191.5, gasB: 0.63 },
    { fluid: "HF" },
    { fluid: "Styrene (Aromatic)", gasA: 83.68, gasB: 0.713, liquidA: 0.273, liquidB: 0.935 },
    { fluid: "CO" },
    { fluid: "DEE", gasA: 128.3, gasB: 0.657, liquidA: 9.258, liquidB: 0.814 },
    { fluid: "Methanol" },
    { fluid: "PO" },
    { fluid: "EEA" },
    { fluid: "EE" },
    { fluid: "EG" },
    { fluid: "EO" },
    { fluid: "Pyrophoric", gasA: 151, gasB: 0.63, liquidA: 2.847, liquidB: 0.54 },
    { fluid: "Water" },
    { fluid: "Steam" },
    { fluid: "Air" },
];

export interface FluidAutoIgnition {
  fluid: string;
  autoIgnition: number | string;
}

export const FluidAutoIgnitionTable: FluidAutoIgnition[] = [
  { fluid: "C1-C2", autoIgnition: 558 },
  { fluid: "C3-C4", autoIgnition: 369 },
  { fluid: "C5", autoIgnition: 284 },
  { fluid: "C6-C8", autoIgnition: 223 },
  { fluid: "C9-C12", autoIgnition: 208 },
  { fluid: "C13-C16", autoIgnition: 202 },
  { fluid: "C17-C25", autoIgnition: 202 },
  { fluid: "C25+", autoIgnition: 202 },
  { fluid: "Water", autoIgnition: 1000 },
  { fluid: "Steam", autoIgnition: "N/A" },
  { fluid: "Acid", autoIgnition: "N/A" },
  { fluid: "H2", autoIgnition: 400 },
  { fluid: "H2S", autoIgnition: 260 },
  { fluid: "HF", autoIgnition: 17760 },
  { fluid: "CO", autoIgnition: 609 },
  { fluid: "DEE", autoIgnition: 160 },
  { fluid: "HCL", autoIgnition: "N/A" },
  { fluid: "Nitric Acid", autoIgnition: "N/A" },
  { fluid: "ALCL3", autoIgnition: 558 },
  { fluid: "NO2", autoIgnition: "N/A" },
  { fluid: "Phosgene", autoIgnition: "N/A" },
  { fluid: "TDI", autoIgnition: 620 },
  { fluid: "Methanol", autoIgnition: 464 },
  { fluid: "PO", autoIgnition: 449 },
  { fluid: "Styrene (Aromatic)", autoIgnition: 490 },
  { fluid: "EEA", autoIgnition: 379 },
  { fluid: "EE", autoIgnition: 235 },
  { fluid: "EG", autoIgnition: 396 },
  { fluid: "EO", autoIgnition: 429 },
  { fluid: "Pyrophoric", autoIgnition: "Note 3" },
  { fluid: "Air", autoIgnition: 1000 },
];




// ************************************************ END OF COF AREA LOOKUP TABLE ************************************************


// ************************************************ START OF COF AREA CALCULATIONS ************************************************

export function calculatePsCofArea(opPressureMpa: number): number {
    try {
        return opPressureMpa * 1000;
    } catch (error) {
        return 0;
    }
}

export function calculateOpTempCofArea(opTempC: number): number {
    try {
        return opTempC + 273.15;
    } catch (error) {
        return 0;
    }
}

export function calculateCpCofArea(
    fluid: string,
    note: string,
    opTempK: number,
): number {
    try {
        const data = specificHeatTable.find(item => item.fluid === fluid);
        if (!data || data.A === undefined || data.B === undefined || data.C === undefined || data.D === undefined) {
            return 0;
        }

        const { A, B, C, D } = data;
        const T = opTempK;

        if (note === "Note 1") {
            return A + B * T + C * T ** 2 + D * T ** 3;
        } else {
            return A + B * T + C * T ** 2 + D * T ** 3 + D * T ** 4;
        }
    } catch (error) {
        return 0;
    }
}

export function calculateKCofArea(cp: number): number {
    try {
        const denominator = cp - 8.314;
        if (denominator === 0) return 0; // Avoid division by zero
        return cp / denominator;
    } catch {
        return 0;
    }
}

export function calculatePTransCofArea(k: number): number {
    try {
        const base = (k + 1) / 2;
        const exponent = k / (k - 1);
        return 101.325 * Math.pow(base, exponent);
    } catch {
        return 0;
    }
}

// export function calculateW1CofArea(
//     fluidPhase: string,
//     fluidRep: string,
//     comp: string,
//     psKpa: number,
//     pTransKpa: number,
//     k: number,
//     opTempK: number
// ): number {
//     try {
//         const Cd = 0.61;
//         const g = 1;
//         const R = 8.314;
//         const factor = 0.9 / 1000;
//         const atmPressure = 101.325;

//         const fluid = fluidTable.find(f => f.fluid === fluidRep);
//         if (!fluid) return 0;

//         const component = componentAreaTable.find(c => c.comp === comp);
//         if (!component) return 0;

//         const { liqDensity, mw } = fluid;
//         const areaMM2 = component.areaMM2;

//         if (fluidPhase === "Liquid") {
//             const area = areaMM2 / 31623;
//             const sqrtPart = Math.sqrt((2 * g * (psKpa - 103.25)) / liqDensity);
//             return Cd * g * liqDensity * area * sqrtPart;
//         }

//         if (psKpa > pTransKpa) {
//             const part1 = factor * areaMM2 * psKpa;
//             const part2 = Math.sqrt((k * mw) / (R * opTempK));
//             const part3 = Math.pow(2 / (k + 1), (k + 1) / (k - 1));
//             return part1 * part2 * part3;
//         } else {
//             const part1 = factor * areaMM2 * psKpa;
//             const part2 = Math.sqrt(mw / (R * opTempK));
//             const pressureRatio = atmPressure / psKpa;
//             const part3 = (2 * k) / (k - 1);
//             const part4 = Math.pow(pressureRatio, 2 / k);
//             const part5 = 1 - Math.pow(pressureRatio, (k - 1) / k);
//             return part1 * part2 * part3 * part4 * part5;
//         }
//     } catch {
//         return 0;
//     }
// }

export function calculateW1CofArea(
  fluidPhase: string,
  pSKpa: number,
  pTransKpa: number,
  opTempK: number,
  k: number,
  repFluid: string,
  compType: string
): number {
  try {
    const ATMOSPHERIC_KPA = 101.325;
    const SPECIFIC_PRESSURE_REF = 103.25;
    const GAS_CONSTANT = 8.314;

    const fluid = fluidTable.find(f => f.fluid.toLowerCase() === repFluid.toLowerCase());
    const comp = componentAreaTable.find(c => c.comp.toLowerCase() === compType.toLowerCase());

    if (!fluid || !comp) return 0;

    const liquidDensity = fluid.liqDensity;
    const mW = fluid.mw;
    const areaMM2 = comp.areaMM2;

    if (fluidPhase === "Liquid ") {
      const deltaPressure = 2 * (pSKpa - SPECIFIC_PRESSURE_REF);
      const densityRatio = deltaPressure / liquidDensity;
      const sqrtTerm = Math.sqrt(densityRatio);
      const areaConversion = areaMM2 / 31623;
      return 0.61 * liquidDensity * areaConversion * sqrtTerm;
    } else {
      const commonFactor = (0.9 / 1000) * areaMM2 * pSKpa;

      if (pSKpa > pTransKpa) {
        const gasProperty = k * mW;
        const tempFactor = GAS_CONSTANT * opTempK;
        const compressibilityRatio = gasProperty / tempFactor;
        const criticalRatio1 = 2 / (k + 1);
        const criticalExponent = (k + 1) / (k - 1);
        const criticalFlowValue = compressibilityRatio * Math.pow(criticalRatio1, criticalExponent);
        return commonFactor * Math.sqrt(criticalFlowValue);
      } else {
        const gasProperty = mW / (GAS_CONSTANT * opTempK);
        const gammaRatio = (2 * k) / (k - 1);
        const pressureRatio = ATMOSPHERIC_KPA / pSKpa;
        const pressureExponent1 = 2 / k;
        const pressureExponent2 = (k - 1) / k;
        const pressureTerm = Math.pow(pressureRatio, pressureExponent1);
        const expansionTerm = 1 - Math.pow(pressureRatio, pressureExponent2);
        const subcriticalExpression = gasProperty * gammaRatio * pressureTerm * expansionTerm;
        return commonFactor * Math.sqrt(subcriticalExpression);
      }
    }
  } catch {
    return 0;
  }
}

export function calculateInventoryCofArea(fluidPhase: string): number {
    try {
        return fluidPhase.trim() === "Gas" ? 4536 : 18144;
    } catch {
        return 0;
    }
}

export function calculateTimeEmptyCofArea(inventoryKg: number, w1KgPerSec: number): number {
    try {
        if (w1KgPerSec === 0) return 0; // avoid division by zero
        return inventoryKg / w1KgPerSec;
    } catch {
        return 0;
    }
}

export function calculateMReleaseCofArea(w1KgPerSec: number): number {
    try {
        return 180 * w1KgPerSec;
    } catch {
        return 0;
    }
}

export function calculateReleaseTypeCofArea(timeEmptySec: number, massReleaseKg: number): string {
    try {
        if (timeEmptySec <= 180 && massReleaseKg > 4536) {
            return "Instantaneous";
        } else {
            return "Continuous";
        }
    } catch {
        return "N/A"; // fallback default
    }
}

export function calculateFactDiCofArea(iso: string, des: string): number {
    try {
        const key = (iso + des).toUpperCase();
        const entry = isoDetTable.find(item => item.iso === key);
        return entry ? entry.value : 0;
    } catch {
        return 0;
    }
}

export function calculateLdMaxCofArea(
    iso: string,
    det: string,
    comp: string
): number {
    try {
        const combinedKey = (iso + det).toUpperCase();

        // Step 1: Find component's diameter
        const component = componentAreaTable.find(c => c.comp === comp);
        if (!component) return 0;
        const diameter = component.diameterMM;

        // Step 2: Find iso-det entry
        const isoEntry = isoDetDmmTable.find(e => e.iso === combinedKey);
        if (!isoEntry) return 0;

        // Step 3: Find the largest D(mm) <= diameter
        const availableDmm = Object.keys(isoEntry.values)
            .map(Number)
            .filter(d => d <= diameter)
            .sort((a, b) => b - a); // descending

        const chosenDmm = availableDmm[0];
        if (chosenDmm === undefined) return 0;

        // Step 4: Return corresponding value
        return isoEntry.values[chosenDmm] ?? 0;
    } catch {
        return 0;
    }
}

export function calculateRateNCofArea(w1KgPerSec: number, factdi: number): number {
    try {
        return w1KgPerSec * (1 - factdi);
    } catch {
        return 0;
    }
}

export function calculateLdSCofArea(
    inventoryKg: number,
    ratenKgPerSec: number,
    ldmaxMinutes: number
): number {
    try {
        if (ratenKgPerSec === 0) return 0; // Avoid division by zero

        const rawTimeSec = inventoryKg / ratenKgPerSec;
        const maxTimeSec = 60 * ldmaxMinutes;

        return Math.min(rawTimeSec, maxTimeSec);
    } catch {
        return 0;
    }
}

export function calculateMassNCofArea(w1KgPerSec: number, ldSec: number, inventoryKg: number): number {
    try {
        const estimatedMass = w1KgPerSec * ldSec;
        return Math.min(estimatedMass, inventoryKg);
    } catch {
        return 0;
    }
}

export function calculateEneffCofArea(massnKg: number): number {
    try {
        if (massnKg <= 0) return 0; // avoid log of 0 or negative

        const value = 4 * Math.log10(2.205 * massnKg) - 15;
        return value;
    } catch {
        return 0;
    }
}

export function calculateFactIcCofArea(releaseType: string, ratenKgPerSec: number): number {
    try {
        if (releaseType.trim().toLowerCase() === "instantaneous") {
            return 1;
        }

        const ratio = ratenKgPerSec / 25.2;
        return Math.min(ratio, 1);
    } catch {
        return 0;
    }
}

export function calculateCaContValues(
    fluidPhase: string,
    fluidRep: string,
    raten: number,
    factmit: number
): {
    ca_cmd_ainl_cont_cof_area: number;
    ca_cmd_ail_cont_cof_area: number;
    ca_inj_ainl_cont_cof_area: number;
    ca_inj_ail_cont_cof_area: number;
} {
    try {
        const isGas = fluidPhase.trim().toLowerCase() === "gas";

        // Lookup from each respective table
        const fluidCmdAinl = CaCmdAinlCont.find(f => f.fluid.toLowerCase() === fluidRep.toLowerCase());
        const fluidCmdAil = CaCmdAilCont.find(f => f.fluid.toLowerCase() === fluidRep.toLowerCase());
        const fluidInjAinl = CaInjAinlCont.find(f => f.fluid.toLowerCase() === fluidRep.toLowerCase());
        const fluidInjAil = CaInjAilCont.find(f => f.fluid.toLowerCase() === fluidRep.toLowerCase());

        const getValue = (fluid: any) => {
            if (!fluid) return { A: undefined, B: undefined };
            return {
                A: isGas ? fluid.gasA : fluid.liquidA,
                B: isGas ? fluid.gasB : fluid.liquidB
            };
        };

        const { A: A1, B: B1 } = getValue(fluidCmdAinl);
        const { A: A2, B: B2 } = getValue(fluidCmdAil);
        const { A: A3, B: B3 } = getValue(fluidInjAinl);
        const { A: A4, B: B4 } = getValue(fluidInjAil);

        return {
            ca_cmd_ainl_cont_cof_area: A1 !== undefined && B1 !== undefined ? A1 * Math.pow(raten, B1) * (1 - factmit) : 0,
            ca_cmd_ail_cont_cof_area: A2 !== undefined && B2 !== undefined ? A2 * Math.pow(raten, B2) * (1 - factmit) : 0,
            ca_inj_ainl_cont_cof_area: A3 !== undefined && B3 !== undefined ? A3 * Math.pow(raten, B3) * (1 - factmit) : 0,
            ca_inj_ail_cont_cof_area: A4 !== undefined && B4 !== undefined ? A4 * Math.pow(raten, B4) * (1 - factmit) : 0,
        };
    } catch {
        return {
            ca_cmd_ainl_cont_cof_area: 0,
            ca_cmd_ail_cont_cof_area: 0,
            ca_inj_ainl_cont_cof_area: 0,
            ca_inj_ail_cont_cof_area: 0,
        };
    }
}

export function calculateCaInstValues(
    fluidPhase: string,
    fluidRep: string,
    massn: number,
    factmit: number,
    eneff: number
): {
    ca_cmd_ainl_inst_cof_area: number;
    ca_cmd_ail_inst_cof_area: number;
    ca_inj_ainl_inst_cof_area: number;
    ca_inj_ail_inst_cof_area: number;
} {
    try {
        const isGas = fluidPhase.trim().toLowerCase() === "gas";
        if (eneff === 0) return defaultResult(); // Prevent divide-by-zero

        // Lookup from each respective table
        const fluidCmdAinl = CaCmdAinlInst.find(f => f.fluid.toLowerCase() === fluidRep.toLowerCase());
        const fluidCmdAil = CaCmdAilInst.find(f => f.fluid.toLowerCase() === fluidRep.toLowerCase());
        const fluidInjAinl = CaInjAinlInst.find(f => f.fluid.toLowerCase() === fluidRep.toLowerCase());
        const fluidInjAil = CaInjAilInst.find(f => f.fluid.toLowerCase() === fluidRep.toLowerCase());

        const getValue = (fluid: any) => {
            if (!fluid) return { A: undefined, B: undefined };
            return {
                A: isGas ? fluid.gasA : fluid.liquidA,
                B: isGas ? fluid.gasB : fluid.liquidB
            };
        };

        const { A: A1, B: B1 } = getValue(fluidCmdAinl);
        const { A: A2, B: B2 } = getValue(fluidCmdAil);
        const { A: A3, B: B3 } = getValue(fluidInjAinl);
        const { A: A4, B: B4 } = getValue(fluidInjAil);

        return {
            ca_cmd_ainl_inst_cof_area: A1 !== undefined && B1 !== undefined ? A1 * Math.pow(massn, B1) * (1 - factmit / eneff) : 0,
            ca_cmd_ail_inst_cof_area: A2 !== undefined && B2 !== undefined ? A2 * Math.pow(massn, B2) * (1 - factmit / eneff) : 0,
            ca_inj_ainl_inst_cof_area: A3 !== undefined && B3 !== undefined ? A3 * Math.pow(massn, B3) * (1 - factmit / eneff) : 0,
            ca_inj_ail_inst_cof_area: A4 !== undefined && B4 !== undefined ? A4 * Math.pow(massn, B4) * (1 - factmit / eneff) : 0,
        };
    } catch {
        return defaultResult();
    }

    function defaultResult() {
        return {
            ca_cmd_ainl_inst_cof_area: 0,
            ca_cmd_ail_inst_cof_area: 0,
            ca_inj_ainl_inst_cof_area: 0,
            ca_inj_ail_inst_cof_area: 0,
        };
    }
}

export function calculateCaCmdAil(
    ca_cmd_ail_inst: number,
    ca_cmd_ail_cont: number,
    factIC: number
): number {
    try {
        return ca_cmd_ail_inst * factIC + ca_cmd_ail_cont * (1 - factIC);
    } catch {
        return 0;
    }
}

export function calculateCaInjAil(
    ca_inj_ail_inst: number,
    ca_inj_ail_cont: number,
    factIC: number
): number {
    try {
        return ca_inj_ail_inst * factIC + ca_inj_ail_cont * (1 - factIC);
    } catch {
        return 0;
    }
}

export function calculateCaCmdAinl(
    ca_cmd_ainl_inst: number,
    ca_cmd_ainl_cont: number,
    factIC: number
): number {
    try {
        return ca_cmd_ainl_inst * factIC + ca_cmd_ainl_cont * (1 - factIC);
    } catch {
        return 0;
    }
}

export function calculateCaInjAinl(
    ca_inj_ainl_inst: number,
    ca_inj_ainl_cont: number,
    factIC: number
): number {
    try {
        return ca_inj_ainl_inst * factIC + ca_inj_ainl_cont * (1 - factIC);
    } catch {
        return 0;
    }
}

export function calculateFactAIT(opTempK: number, repFluid: string): number {
  try {
    const fluid = FluidAutoIgnitionTable.find(
      f => f.fluid.toLowerCase() === repFluid.toLowerCase()
    );

    if (!fluid || typeof fluid.autoIgnition !== "number") return 0;

    const autoIgnitionK = fluid.autoIgnition + 273.15;

    if (opTempK + 55.6 <= autoIgnitionK) {
      return 0;
    } else if (opTempK - 55.6 > autoIgnitionK) {
      return 1;
    } else {
      return (opTempK - autoIgnitionK + 55.6) / (2 * 55.6);
    }
  } catch {
    return 0;
  }
}

export function calculateCaCmdFlam(
  ca_cmd_ail: number,
  ca_cmd_ainl: number,
  factAIT: number
): number {
  try {
    return (ca_cmd_ail * factAIT) + (ca_cmd_ainl * (1 - factAIT));
  } catch {
    return 0;
  }
}

export function calculateCaInjFlam(
  ca_inj_ail: number,
  ca_inj_ainl: number,
  factAIT: number
): number {
  try {
    return (ca_inj_ail * factAIT) + (ca_inj_ainl * (1 - factAIT));
  } catch {
    return 0;
  }
}