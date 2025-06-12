// RBI Assessment Types
export interface RBIAssessment {
  id: string;
  rbiId: string;
  asset: string;
  likelihood: "Low" | "Medium" | "High";
  consequence: "Low" | "Medium" | "High";
  riskRank: "Low" | "Medium" | "High" | "Critical";
  nextAssessmentDate: string;
  status: "Active" | "Complete" | "On Hold";

  // POF Assessment - General
  coatingQuality: "Excellent" | "Good" | "Fair" | "Poor";
  dataConfidence: "High" | "Medium" | "Low";
  hasCladding: boolean;
  nominalThickness: number;
  tMin: number;
  currentThickness: number;
  description: string;

  // Damage Factor (simplified - 6 disabled fields only)
  dthinf: number;
  dfextclscc: number;
  dfcuiff: number;
  dfsccscc: number;
  dfSCCSOHIC: number;
  dmfat: number;

  // COF Assessment - COF PROD
  fccmd: number; // disabled
  fcaffa: number; // disabled, default=1
  outageaffa: number; // disabled, default=17.46
  outagemult: number;
  lraprod: number;
  injcost: number;
  fcprod: number; // disabled, default=17.46
  popdens: number; // disabled, default=0.06
  fcinj: number; // disabled, default=0.06
  envcost: number;
  fracevap: number; // disabled
  volenv: number; // disabled
  fcenviron: number; // disabled
  fc: number; // disabled, default=77.784

  // COF Assessment - COF AREA
  isoSys: "Manual" | "Auto" | "Semi-Auto";
  detSys: "Manual" | "Auto" | "Semi-Auto";
  mitigationSystem: string;
  idealGasSpecificHeatEQ: string;

  // 31 Disabled Input Fields with Default Values
  ptransKpa: number; // disabled, default=0
  mreleaseKg: number; // disabled, default=180
  releaseType: string; // disabled, default="Continuous"
  psKpa: number; // disabled, default=2200
  opTempK: number; // disabled, default=533
  cp: number; // disabled, default=2.3
  k: number; // disabled, default=1.26
  w1Kg: number; // disabled, default=29.8
  inventoryKg: number; // disabled, default=180
  timeempty: number; // disabled, default=6.04
  factdi: number; // disabled, default=0.1
  ldmax: number; // disabled, default=0
  raten: number; // disabled, default=0
  idField: number; // disabled, default=0
  eneff: number; // disabled, default=1
  factic: number; // disabled, default=0.1
  caCmdailCont: number; // disabled, default=0
  caCmdailInst: number; // disabled, default=0
  caCmdailInjail: number; // disabled, default=0
  factait: number; // disabled, default=0.05
  caCmdflam: number; // disabled, default=0
  caInjflam: number; // disabled, default=0
  molWeight: number; // disabled, default=16.04
  ambTemp: number; // disabled, default=25
  windSpeed: number; // disabled, default=5
  atmStability: string; // disabled, default="D"
  duration: number; // disabled, default=600
  height: number; // disabled, default=2
  surfaceRoughness: number; // disabled, default=0.1
  caTotal: number; // disabled, calculated=0

  // Risk & IRP
  dhtha: number; // input
  dbrit: number; // input
  // dthin: already exists as dthinf in damage factors
  dextd: number; // input
  dscc: number; // disabled
  // dmfat: already exists in damage factors
  pof: number; // disabled
  cofFinancial: number; // disabled
  cofArea: number; // disabled
  pofValue: number; // disabled
  riskLevel: "Low" | "Medium" | "High" | "Critical"; // disabled
  riskRanking: "Low" | "Medium" | "High" | "Critical"; // disabled
}
