import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import PofTab from "@/components/monitor/rbi/pof/PofTab";
import CofTab from "@/components/monitor/rbi/cof/CofTab";
import RiskIrpTab from "@/components/monitor/rbi/risk/RiskIrpTab";
import Loading from "@/components/shared/Loading";
import { useAverageMtsMpaMysMpaByName } from "./hooks/use-average-mts_mpa-mys_mpa-by-name";
import { useImsGeneralDataByAssetDetailId } from "./hooks/use-ims-general-data";
import { useImsProtectionByAssetDetailId } from "./hooks/use-ims-protection-by-asset-detail-id";
import { useImsDesignByAssetDetailId } from "./hooks/use-ims-design-by-asset-detail-id";
import { calcIThinAndProportions, calculateArt, calculateBThins, calculateCrAct, calculateCrCm, calculateCrExp, calculateDFThinFDFThinFB, calculateFsThin, calculateSrThin } from "./hooks/formula-df-thin";
import { calculateAgeTk } from "./hooks/formula";
import { calculateAge, calculateAgeCoat, calculateArtExt, calculateBetaExtcorrs, calculateCoatAdj, calculateCrActExt, calculateCrExpExt, calculateDFextcorrF, calculateFSextcorr, calculateIextCorrsAndPoExtcorrs, calculateSRextcorr } from "./hooks/formula-df-ext";


const RBIAssessmentCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<any | null>({
    // ims_general
    asset_detail_id: null,
    line_no: "",
    pipe_schedule_id: null,
    pressure_rating: 0,
    year_in_service: "",
    normal_wall_thickness: 0, // Nominal Thickness Tnom nominal_thickness
    tmin: 0, // Tmin
    material_construction_id: null,
    spec_code: "", // Spec Code
    description: "",
    circuit_id: null,
    nominal_bore_diameter: null,
    insulation: false,
    line_h2s: false,
    internal_lining: false,
    pwht: false,
    cladding: false,
    ims_asset_type_id: null,
    clad_thickness: 0,
    pipe_class_id: null,
    // ims_design
    internal_diameter: 0,
    welding_efficiency: 0,
    design_pressure: 0,
    corrosion_allowance: 0,
    outer_diameter: 0,
    design_temperature: 0,
    operating_pressure_mpa: 0,
    ext_env_id: null,
    ext_env_name: "",
    geometry_id: null,
    length: 0,
    operating_temperature: 0,
    allowable_stress_mpa: 0,
    pipe_support: false,
    soil_water_interface: false,
    dead_legs: false,
    mix_point: false,
    // ims_protection
    coating_quality_id: null,
    isolation_system_id: null,
    online_monitor_id: null,
    online_monitor_name: "",
    minimum_thickness: 0,
    post_weld_heat_treatment: 0,
    line_description: "",
    replacement_line: "",
    detection_system_id: null,
    mitigation_system_id: null,
    design_fabrication_id: null,
    insulation_type_id: null,
    interface_id: null,
    insulation_complexity_id: null,
    insulation_condition: "",
    lining_type: "",
    lining_condition: "",
    lining_monitoring: "",
    // useAverageMtsMpaMysMpaByName
    avg_mts_mpa: 0,
    avg_mys_mpa: 0,
    composition: "",

    // i_df_thin (1)
    last_inspection_date_thin: "",
    current_thickness_thin: 0, //Trd
    agetk_thin: 0,
    agerc_thin: "",
    crexp_thin: 0,
    cract_thin: 0,
    crcm_thin: 0,
    ca_thin: 0,
    art_thin: 0,
    fsthin_thin: 0,
    srthin_thin: 0,
    nthin_a_thin: 0,
    nthin_b_thin: 0,
    nthin_c_thin: 0,
    nthin_d_thin: 0,
    data_confidence_id_thin: null,
    ithin1_thin: 0,
    ithin2_thin: 0,
    ithin3_thin: 0,
    pothin1_thin: 0,
    pothin2_thin: 0,
    pothin3_thin: 0,
    bthin1_thin: 0,
    bthin2_thin: 0,
    bthin3_thin: 0,
    dfthinfb_thin: 0,
    dthinf_thin: 0,

    // *** i_df_ext (2)
    current_thickness_ext: 0, //Trd
    coating_quality_id_ext: null,
    new_coating_date_ext: "",
    last_inspection_date_ext: "",
    agetk_ext: 0,
    agecoat_ext: 0,
    coatadj_ext: 0,
    age_ext: 0,
    crexp_ext: 0,
    cract_ext: 0,
    art_ext: 0,
    fsextcorr_ext: 0,
    srextcorr_ext: 0,
    nextcorra_ext: 0,
    nextcorrb_ext: 0,
    nextcorrc_ext: 0,
    nextcorrd_ext: 0,
    data_confidence_id_ext: null,
    iextcorr1_ext: 0,
    iextcorr2_ext: 0,
    iextcorr3_ext: 0,
    poextcorrp1_ext: 0,
    poextcorrp2_ext: 0,
    poextcorrp3_ext: 0,
    bextcorr1_ext: 0,
    bextcorr2_ext: 0,
    bextcorr3_ext: 0,
    dfextcorrf_ext: 0,
  });
  const { data: imsGeneral, isLoading: isImsGeneralLoading } = useImsGeneralDataByAssetDetailId(formData?.asset_detail_id ?? 0);
  const { data: imsDesign, isLoading: isImsDesignLoading } = useImsDesignByAssetDetailId(formData?.asset_detail_id ?? 0);
  const { data: imsProtection, isLoading: isImsProtectionLoading } = useImsProtectionByAssetDetailId(formData?.asset_detail_id ?? 0);
  const { data: avgs, isLoading: isAvgsLoading } = useAverageMtsMpaMysMpaByName(formData?.spec_code ?? ""); // Example calculation

  const allLoaded = !isImsDesignLoading && !isImsGeneralLoading && !isImsProtectionLoading;

  useEffect(() => {
    if (formData && allLoaded) {
      setFormData((prev: any) => ({
        ...prev,
        // ims_general
        line_no: imsGeneral?.line_no ?? "",
        pipe_schedule_id: imsGeneral?.pipe_schedule_id ?? null,
        pressure_rating: imsGeneral?.pressure_rating ?? 0,
        year_in_service: imsGeneral?.year_in_service ?? "",
        normal_wall_thickness: imsGeneral?.normal_wall_thickness ?? 0,
        tmin: imsGeneral?.tmin ?? 0,
        material_construction_id: imsGeneral?.material_construction_id?.id ?? null,
        spec_code: imsGeneral?.material_construction_id?.spec_code ?? null,
        description: imsGeneral?.description ?? "",
        circuit_id: imsGeneral?.circuit_id ?? null,
        nominal_bore_diameter: imsGeneral?.nominal_bore_diameter ?? null,
        insulation: imsGeneral?.insulation ?? false,
        line_h2s: imsGeneral?.line_h2s ?? false,
        internal_lining: imsGeneral?.internal_lining ?? false,
        pwht: imsGeneral?.pwht ?? false,
        cladding: imsGeneral?.cladding ?? false,
        ims_asset_type_id: imsGeneral?.ims_asset_type_id ?? null,
        clad_thickness: imsGeneral?.clad_thickness ?? 0,
        pipe_class_id: imsGeneral?.pipe_class_id ?? null,

        // ims_design
        internal_diameter: imsDesign?.internal_diameter ?? 0,
        welding_efficiency: imsDesign?.welding_efficiency ?? 0,
        design_pressure: imsDesign?.design_pressure ?? 0,
        corrosion_allowance: imsDesign?.corrosion_allowance ?? 0,
        outer_diameter: imsDesign?.outer_diameter ?? 0,
        design_temperature: imsDesign?.design_temperature ?? 0,
        operating_pressure_mpa: imsDesign?.operating_pressure_mpa ?? 0,
        ext_env_id: imsDesign?.ext_env_id?.id ?? null,
        ext_env_name: imsDesign?.ext_env_id?.name ?? null,
        geometry_id: imsDesign?.geometry_id ?? null,
        length: imsDesign?.length ?? 0,
        operating_temperature: imsDesign?.operating_temperature ?? 0,
        allowable_stress_mpa: imsDesign?.allowable_stress_mpa ?? 0,
        pipe_support: imsDesign?.pipe_support ?? false,
        soil_water_interface: imsDesign?.soil_water_interface ?? false,
        dead_legs: imsDesign?.dead_legs ?? false,
        mix_point: imsDesign?.mix_point ?? false,

        // ims_protection
        coating_quality_id: imsProtection?.coating_quality_id ?? null,
        isolation_system_id: imsProtection?.isolation_system_id ?? null,
        online_monitor_id: imsProtection?.online_monitor?.id ?? null,
        online_monitor_name: imsProtection?.online_monitor?.name ?? null,
        minimum_thickness: imsProtection?.minimum_thickness ?? 0,
        post_weld_heat_treatment: imsProtection?.post_weld_heat_treatment ?? 0,
        line_description: imsProtection?.line_description ?? "",
        replacement_line: imsProtection?.replacement_line ?? "",
        detection_system_id: imsProtection?.detection_system_id ?? null,
        mitigation_system_id: imsProtection?.mitigation_system_id ?? null,
        design_fabrication_id: imsProtection?.design_fabrication_id ?? null,
        insulation_type_id: imsProtection?.insulation_type_id ?? null,
        interface_id: imsProtection?.interface_id ?? null,
        insulation_complexity_id: imsProtection?.insulation_complexity_id ?? null,
        insulation_condition: imsProtection?.insulation_condition ?? "",
        lining_type: imsProtection?.lining_type ?? "",
        lining_condition: imsProtection?.lining_condition ?? "",
        lining_monitoring: imsProtection?.lining_monitoring ?? ""

      }));
    }
  }, [formData?.asset_detail_id, allLoaded, imsGeneral, imsDesign, imsProtection]);

  // for average mts_mpa, mys_mpa and composition
  useEffect(() => {
    if (formData && allLoaded) {
      setFormData((prev: any) => ({
        ...prev,
        avg_mts_mpa: avgs?.avg_mts_mpa ?? 0,
        avg_mys_mpa: avgs?.avg_mys_mpa ?? 0,
        composition: avgs?.composition ?? "",
      }));
    }
  }, [formData?.spec_code, avgs, !isAvgsLoading]);

  // Formula DfThin Start

  //ageTk_thin✅
  useEffect(() => {
    if (formData) {
      const ageTk = calculateAgeTk(
        formData.last_inspection_date_thin,
        formData.year_in_service
      );
      setFormData((prev: any) => ({ ...prev, agetk_thin: ageTk }));
    }
  }, [formData?.last_inspection_date_thin, formData?.year_in_service]);

  // crexp_thin✅
  useEffect(() => {
    if (formData) {
      const crExp = calculateCrExp(
        formData.corrosion_allowance
      );
      setFormData((prev: any) => ({ ...prev, crexp_thin: crExp }));
    }
  }, [formData?.corrosion_allowance]);

  // cract_thin✅
  useEffect(() => {
    if (formData) {
      const crAct = calculateCrAct(
        formData.normal_wall_thickness,
        formData.current_thickness_thin,
        formData.last_inspection_date_thin,
        formData.year_in_service,
        formData.ims_asset_type_id
      );
      setFormData((prev: any) => ({ ...prev, cract_thin: crAct }));
    }
  }, [formData?.normal_wall_thickness, formData?.current_thickness_thin, formData?.last_inspection_date_thin, formData?.year_in_service, formData?.ims_asset_type_id]);

  // crcm_thin✅
  useEffect(() => {
    if (formData) {
      const crcm = calculateCrCm(formData.cladding);
      setFormData((prev: any) => ({ ...prev, crcm_thin: crcm }));
    }
  }, [formData?.cladding]);

  // ca_thin✅
  useEffect(() => {
    if (formData) {
      const cathin = formData.corrosion_allowance;
      setFormData((prev: any) => ({ ...prev, ca_thin: cathin }));
    }
  }, [formData?.corrosion_allowance]);

  // art_thin✅
  useEffect(() => {
    if (formData) {
      const artThin = calculateArt(
        formData.cract_thin,
        formData.crexp_thin,
        formData.agethk_thin,
        formData.current_thickness_thin,
        formData.normal_wall_thickness,
        formData.ims_asset_type_id,
        formData.cladding,
        formData.crcm_thin,
        formData.agerc_thin,
        formData.year_in_service
      );
      setFormData((prev: any) => ({ ...prev, art_thin: artThin }));
    }
  }, [formData?.cract_thin, formData?.crexp_thin, formData?.agethk_thin, formData?.current_thickness_thin, formData?.normal_wall_thickness]);

  // fsthin_thin☑️not check for ims_asset_type_id = 2
  useEffect(() => {
    if (formData) {
      const fsThin = calculateFsThin(
        formData.ims_asset_type_id,
        1,
        formData.avg_mts_mpa,
        formData.avg_mys_mpa
      );
      setFormData((prev: any) => ({ ...prev, fsthin_thin: fsThin }));
    }
  }, [formData?.avg_mts_mpa, formData?.avg_mys_mpa, formData?.ims_asset_type_id, formData?.welding_efficiency]);

  // srthin_thin☑️not check for ims_asset_type_id = 2 AND 1
  useEffect(() => {
    if (formData) {
      const srThin = calculateSrThin(
        formData.ims_asset_type_id,
        formData.allowable_stress_mpa,
        formData.welding_efficiency,
        formData.fsthin_thin,
        formData.tmin,
        formData.normal_wall_thickness,
        formData.current_thickness_thin,
        formData.design_pressure,
        formData.outer_diameter,
        formData.internal_diameter
      );
      setFormData((prev: any) => ({ ...prev, srthin_thin: srThin }));
    }
  }, [formData?.allowable_stress_mpa, formData?.welding_efficiency, formData?.fsthin_thin, formData?.tmin, formData?.normal_wall_thickness, formData?.current_thickness_thin, formData?.design_pressure, formData?.outer_diameter, formData?.internal_diameter, formData?.ims_asset_type_id]);

  // ithins and pothins☑️not check for ims_asset_type_id = 2 AND 1
  useEffect(() => {
    if (formData) {
      const scores = calcIThinAndProportions(
        formData.data_confidence_id_thin,   // Medium confidence
        formData.nthin_a_thin,
        formData.nthin_b_thin,
        formData.nthin_c_thin,
        formData.nthin_d_thin
      );
      setFormData((prev: any) => ({
        ...prev,
        ithin1_thin: scores.iThin1,
        ithin2_thin: scores.iThin2,
        ithin3_thin: scores.iThin3,
        pothin1_thin: scores.p1,
        pothin2_thin: scores.p2,
        pothin3_thin: scores.p3
      }));
    }
  }, [formData?.data_confidence_id_thin, formData?.nthin_a_thin, formData?.nthin_b_thin, formData?.nthin_c_thin, formData?.nthin_d_thin]);

  // bthins☑️not check for ims_asset_type_id = 2 AND 1
  useEffect(() => {
    if (formData) {
      const bThins = calculateBThins(
        formData.art_thin,
        formData.srthin_thin
      );
      setFormData((prev: any) => ({
        ...prev,
        bthin1_thin: bThins.bThin1,
        bthin2_thin: bThins.bThin2,
        bthin3_thin: bThins.bThin3
      }));
    }
  }, [formData?.art_thin, formData?.srthin_thin]);

  // dfthinfb_thin☑️not check for ims_asset_type_id = 2 AND 1
  useEffect(() => {
    if (formData) {
      const dfThins = calculateDFThinFDFThinFB(
        formData.pothin1_thin,
        formData.pothin2_thin,
        formData.pothin3_thin,
        formData.bthin1_thin,
        formData.bthin2_thin,
        formData.bthin3_thin,
        formData.mix_point,
        formData.dead_legs,
        formData.online_monitor_name
      );
      setFormData((prev: any) => ({
        ...prev,
        dfthinfb_thin: dfThins.dfThinFb,
        dfthinf_thin: dfThins.dfThinF
      }));
    }
  }, [formData?.pothin1_thin, formData?.pothin2_thin, formData?.pothin3_thin, formData?.bthin1_thin, formData?.bthin2_thin, formData?.bthin3_thin, formData?.mix_point, formData?.dead_legs, formData?.online_monitor_name]);

  // Formula DfThin End


  // Formula DfExt Start

  // AgeTk_ext✅
  useEffect(() => {
    if (formData) {
      const ageExt = calculateAgeTk(
        formData.last_inspection_date_ext,
        formData.year_in_service
      );
      setFormData((prev: any) => ({ ...prev, agetk_ext: ageExt }));
    }
  }, [formData?.last_inspection_date_ext, formData?.year_in_service]);

  // Agecoat_ext✅
  useEffect(() => {
    if (formData) {
      const ageCoat = calculateAgeCoat(
        formData.new_coating_date_ext
      );
      setFormData((prev: any) => ({ ...prev, agecoat_ext: ageCoat }));
    }
  }, [formData?.new_coating_date_ext]);

  // CoatAdj_ext✅
  useEffect(() => {
    if (formData) {
      const coatAdj = calculateCoatAdj(
        formData.coating_quality_id_ext,
        formData.agetk_ext,
        formData.agecoat_ext
      );
      setFormData((prev: any) => ({ ...prev, coatadj_ext: coatAdj }));
    }
  }, [formData?.coating_quality_id_ext, formData?.agetk_ext, formData?.agecoat_ext]);

  // Age_ext✅
  useEffect(() => {
    if (formData) {
      const ageExt = calculateAge(
        formData.agetk_ext,
        formData.coatadj_ext
      );
      setFormData((prev: any) => ({ ...prev, age_ext: ageExt }));
    }
  }, [formData?.agetk_ext, formData?.coatadj_ext]);

  // CrExp_ext❌tak test lansung
  useEffect(() => {
    if (formData) {
      const crExpExt = calculateCrExpExt(
        formData.ims_asset_type_id,
        formData.composition,
        formData.ext_env_id,
        formData.pipe_support,
        formData.soil_water_interface,
        formData.operating_temperature,
        formData.design_pressure

      );
      setFormData((prev: any) => ({ ...prev, crexp_ext: crExpExt }));
    }
  }, [formData?.ims_asset_type_id, formData?.composition, formData?.ext_env_id, formData?.pipe_support, formData?.soil_water_interface, formData?.operating_temperature, formData?.design_pressure]);

  // CrAct_ext✅
  useEffect(() => {
    if (formData) {
      const crAct = calculateCrActExt(
        formData.last_inspection_date_ext,
        formData.new_coating_date_ext
      );
      setFormData((prev: any) => ({ ...prev, cract_ext: crAct }));
    }
  }, [formData?.last_inspection_date_ext, formData?.new_coating_date_ext]);

  // Art_ext❌tak test lansung
  useEffect(() => {
    if (formData) {
      const artExt = calculateArtExt(
        formData.cract_ext,
        formData.crexp_ext,
        formData.age_ext,
        formData.current_thickness_ext,
        formData.normal_wall_thickness,
        formData.ims_asset_type_id
      );
      setFormData((prev: any) => ({ ...prev, art_ext: artExt }));
    }
  }, [formData?.cract_ext, formData?.crexp_ext, formData?.age_ext, formData?.current_thickness_ext, formData?.normal_wall_thickness, formData?.ims_asset_type_id]);

  // FSExtCorr_ext❌tak test lansung
  useEffect(() => {
    if (formData) {
      const fsExtCorr = calculateFSextcorr(
        formData.avg_mts_mpa,
        formData.avg_mys_mpa,
        formData.welding_efficiency,
        formData.ims_asset_type_id
      );
      setFormData((prev: any) => ({ ...prev, fsextcorr_ext: fsExtCorr }));
    }
  }, [formData?.avg_mts_mpa, formData?.avg_mys_mpa, formData?.welding_efficiency, formData?.ims_asset_type_id]);

  // SRExtCorr_ext❌tak test lansung
  useEffect(() => {
    if (formData) {
      const srExtCorr = calculateSRextcorr(
        formData.allowable_stress_mpa,
        formData.welding_efficiency,
        formData.fsextcorr_ext,
        formData.tmin,
        formData.current_thickness_ext,
        formData.normal_wall_thickness,
        formData.design_pressure,
        formData.internal_diameter,
        formData.outer_diameter,
        formData.ims_asset_type_id
      );
      setFormData((prev: any) => ({ ...prev, srextcorr_ext: srExtCorr }));
    }
  }, [formData?.allowable_stress_mpa, formData?.welding_efficiency, formData?.fsextcorr_ext, formData?.tmin, formData?.current_thickness_ext, formData?.normal_wall_thickness, formData?.design_pressure, formData?.internal_diameter, formData?.outer_diameter, formData?.ims_asset_type_id]);

  // IExtCorrs and PoExtCorrs❌tak test lansung
  useEffect(() => {
    if (formData) {
      const scores = calculateIextCorrsAndPoExtcorrs(
        formData.data_confidence_id_ext,   // Medium confidence
        formData.nextcorra_ext,
        formData.nextcorrb_ext,
        formData.nextcorrc_ext,
        formData.nextcorrd_ext
      );
      setFormData((prev: any) => ({
        ...prev,
        iextcorr1_ext: scores.lextcorr1,
        iextcorr2_ext: scores.lextcorr2,
        iextcorr3_ext: scores.lextcorr3,
        poextcorrp1_ext: scores.poextcorrP1,
        poextcorrp2_ext: scores.poextcorrP2,
        poextcorrp3_ext: scores.poextcorrP3
      }));
    }
  }, [formData?.data_confidence_id_ext, formData?.nextcorra_ext, formData?.nextcorrb_ext, formData?.nextcorrc_ext, formData?.nextcorrd_ext]);

  // BExtCorrs❌tak test lansung
  useEffect(() => {
    if (formData) {
      const bExtCorrs = calculateBetaExtcorrs(
        formData.art_ext,
        formData.srextcorr_ext
      );
      setFormData((prev: any) => ({
        ...prev,
        bextcorr1_ext: bExtCorrs.betaExtcorr1,
        bextcorr2_ext: bExtCorrs.betaExtcorr2,
        bextcorr3_ext: bExtCorrs.betaExtcorr3
      }));
    }
  }, [formData?.art_ext, formData?.srextcorr_ext]);

  // DFExtCorrF and DfExtCorrFB❌tak test lansung
  useEffect(() => {
    if (formData) {
      const dfExtCorrs = calculateDFextcorrF(
        formData.poextcorrp1_ext,
        formData.poextcorrp2_ext,
        formData.poextcorrp3_ext,
        formData.bextcorr1_ext,
        formData.bextcorr2_ext,
        formData.bextcorr3_ext
      );
      setFormData((prev: any) => ({
        ...prev,
        dfextcorrf_ext: dfExtCorrs,
      }));
    }
  }, []);


  // Formula DfExt End


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("RBI Assessment created successfully");
    // navigate("/monitor/rbi-assessment");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="RBI Assessment Detail"
          icon={<ShieldAlert className="h-6 w-6" />}
        />
        <Button
          variant="outline"
          onClick={() => navigate("/monitor/rbi-assessment")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to RBI Assessment
        </Button>
      </div>
      {/* <h1>last {formData.last_inspection_date_ext ?? "NA"}</h1>
      <h1>coat {formData.new_coating_date_ext ?? "NA"}</h1> */}
      {/* <pre>{JSON.stringify(imsGeneral, null, 2)}</pre>
      <pre>{JSON.stringify(imsDesign, null, 2)}</pre> */}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="pof" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="pof">POF Assessment</TabsTrigger>
                <TabsTrigger value="cof">COF Assessment</TabsTrigger>
                <TabsTrigger value="risk">Risk & IRP</TabsTrigger>
              </TabsList>
              <TabsContent value="pof">
                <PofTab formData={formData} setFormData={setFormData} />
              </TabsContent>
              <TabsContent value="cof">
                <CofTab formData={formData} setFormData={setFormData} />
              </TabsContent>
              <TabsContent value="risk">
                <RiskIrpTab formData={formData} setFormData={setFormData} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/monitor/rbi-assessment")}
          >
            Cancel
          </Button>
          <Button type="submit">Create RBI</Button>
        </div>
      </form>
    </div>
  );
};

export default RBIAssessmentCreatePage;