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
import { calculateAgeCrackExtClscc, calculateAgeCoatExtClscc, calculateCoatAdjExtClscc, calculateAgeExtClscc, calculateClSccSuscAndSviExtClscc, calculateExtClsccFb, calculateDfExtClsccFinal } from "./hooks/formula-df-ext-clscc";
import { calculateDfMfat, calculateDmFatFb } from "./hooks/formula-df-mfat";
import { calculateAgeCoatCui, calculateAgeCui, calculateArtCui, calculateBCuiFsCui, calculateCoatAdjCui, calculateCrExpCui, calculateDFCuiFFCui, calculateFSCUIFCui, calculateICuiFsAndPoCuiFsCui, calculateSRCUIFCui } from "./hooks/formula-df-cui";
import { calculateDfSccFbSccScc, calculateDfSccScc, calculateEnvSeveritySccScc, calculateSscSucsFToHtSccScc, calculateSusceptibilitySccScc, calculateSviSccScc } from "./hooks/formula-df-scc-scc";
import { calculateDfSccSohic, calculateDfSohicFbSccSohic, calculateEnvSeveritySccSohic, calculateSuscToCrackSccSohic, calculateSviSccSohic } from "./hooks/formula-df-scc-sohic";


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
    design_fabrication_name: "",
    design_fabrication_value: 0,
    insulation_type_id: null,
    insulation_type_name: "",
    insulation_type_value: 0,
    interface_id: null,
    interface_name: "",
    interface_value: 0,
    insulation_complexity_id: null,
    insulation_complexity_name: "",
    insulation_complexity_value: 0,
    insulation_condition_id: null,
    insulation_condition_name: "",
    insulation_condition_value: 0,
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

    // *** i_df_ext_clscc (3)
    coating_quality_id_ext_clscc: null,
    new_coating_date_ext_clscc: "",
    last_inspection_date_ext_clscc: "",
    agecrack_ext_clscc: 0,
    agecoat_ext_clscc: 0,
    coatadj_ext_clscc: 0,
    age_ext_clscc: 0,
    external_environment_id_ext_clscc: null,
    ext_cl_scc_susc_ext_clscc: 0,
    svi_ext_clscc: 0,
    inspection_efficiency_id_ext_clscc: null,
    inspection_efficiency_name_ext_clscc: "",
    df_ext_cl_scc_ext_clscc: 0,
    df_ext_cl_scc_fb_ext_clscc: 0,

    // *** i_df_mfat(4)
    previous_failure_id_mfat: null,
    visible_audible_shaking_id_mfat: null,
    shaking_frequency_id_mfat: null,
    cyclic_load_type_id_mfat: null,
    previous_failure_value_mfat: 0,
    visible_audible_shaking_value_mfat: 0,
    shaking_frequency_value_mfat: 0,
    cyclic_load_type_value_mfat: 0,
    dmfatfb_mfat: 0,
    corrective_action_id_mfat: null,
    pipe_complexity_id_mfat: null,
    pipe_condition_id_mfat: null,
    joint_branch_design_id_mfat: null,
    brach_diameter_id_mfat: null,
    corrective_action_value_mfat: 0,
    pipe_complexity_value_mfat: 0,
    pipe_condition_value_mfat: 0,
    joint_branch_design_value_mfat: 0,
    branch_diameter_value_mfat: 0,
    dmfat_mfat: 0,

    // *** i_df_cui (5)
    current_thickness_cui: 0, //Trd
    coating_quality_id_cui: null, //?? coating_quality_id(5)
    last_inspection_date_cui: "",
    new_coating_date_cui: "",
    agetk_cui: 0,
    agecoat_cui: 0,
    coatadj_cui: 0,
    age_cui: 0,
    external_environment_id_cui: null,
    crexp_cui: 0,
    cract_cui: 0,
    art_cui: 0,
    fscuif_cui: 0,
    srcuif_cui: 0,
    ncuifa_cui: 0,
    ncuifb_cui: 0,
    ncuifc_cui: 0,
    ncuifd_cui: 0,
    data_confidence_id_cui: null,
    icuif1_cui: 0,
    icuif2_cui: 0,
    icuif3_cui: 0,
    pociufp1_cui: 0,
    pociufp2_cui: 0,
    pociufp3_cui: 0,
    bcuif1_cui: 0,
    bcuif2_cui: 0,
    bcuif3_cui: 0,
    dfcuiff_cui: 0,

    // *** i_df_scc_scc (6)
    last_inspection_date_scc_scc: "",
    inspection_efficiency_id_scc_scc: null,
    inspection_efficiency_name_scc_scc: "",
    susceptibility_scc_scc: "", // Yes?
    h2s_in_water_scc_scc: 0,
    ph_scc_scc: 0,
    envseverity_scc_scc: "", //low?
    hardness_brinnel_scc_scc: 0,
    ssc_sucs_f_to_ht_scc_scc: "", //low?
    svi_scc_scc: 0,
    dfsccfb_scc_scc: 0,
    df_scc_scc_scc_scc: 0,

    // *** i_df_scc_sohic (7)
    last_inspection_date_scc_sohic: "",
    inspection_efficiency_id_scc_sohic: null,
    inspection_efficiency_name_scc_sohic: "",
    susceptibility_scc_sohic: "", // Yes?
    h2s_in_water_scc_sohic: 0,
    ph_scc_sohic: 0,
    envseverity_scc_sohic: "", //low?
    steelscontent_id_scc_sohic: null,
    online_monitor_id_scc_sohic: null,
    online_monitor_value_scc_sohic: 0,
    sucs_to_crack_scc_sohic: "", //low?
    svi_scc_sohic: 0,
    dfsohicfb_scc_sohic: 0,
    dfscc_sohic_scc_sohic: 0,





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
        design_fabrication_id: imsProtection?.design_fabrication_id?.id ?? null,
        design_fabrication_name: imsProtection?.design_fabrication_id?.name ?? "",
        design_fabrication_value: imsProtection?.design_fabrication_id?.value ?? 0,
        insulation_type_id: imsProtection?.insulation_type_id?.id ?? null,
        insulation_type_name: imsProtection?.insulation_type_id?.name ?? null,
        insulation_type_value: imsProtection?.insulation_type_id?.value ?? null,
        interface_id: imsProtection?.interface_id?.id ?? null,
        interface_name: imsProtection?.interface_id?.name ?? "",
        interface_value: imsProtection?.interface_id?.value ?? 0,
        insulation_complexity_id: imsProtection?.insulation_complexity_id?.id ?? null,
        insulation_complexity_name: imsProtection?.insulation_complexity_id?.name ?? "",
        insulation_complexity_value: imsProtection?.insulation_complexity_id?.value ?? 0,
        insulation_condition_id: imsProtection?.insulation_condition_id?.id ?? null,
        insulation_condition_name: imsProtection?.insulation_condition_id?.name ?? "",
        insulation_condition_value: imsProtection?.insulation_condition_id?.value ?? 0,
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

  //*****************  Formula DfThin Start

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

  //*****************  Formula DfThin End

  //*****************  Formula DfExt Start

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

  //*****************  Formula DfExt End

  //*****************  Formula DFExtClscc Start

  // AgeCrack_ext_clscc✅
  useEffect(() => {
    if (formData) {
      const ageCrack = calculateAgeCrackExtClscc(
        formData.last_inspection_date_ext_clscc
      );
      setFormData((prev: any) => ({ ...prev, agecrack_ext_clscc: ageCrack }));
    }
  }, [formData?.last_inspection_date_ext_clscc]);

  // AgeCoat_ext_clscc✅
  useEffect(() => {
    if (formData) {
      const ageCoat = calculateAgeCoatExtClscc(
        formData.new_coating_date_ext_clscc,
        formData.year_in_service,
        formData.ims_asset_type_id // 1 = Pressure Vessel (use newCoatDate), 2 = Piping (use serviceDate)
      );
      setFormData((prev: any) => ({ ...prev, agecoat_ext_clscc: ageCoat }));
    }
  }, [formData?.new_coating_date_ext_clscc, formData?.year_in_service, formData?.ims_asset_type_id]);

  // CoatAdj_ext_clscc✅
  useEffect(() => {
    if (formData) {
      const coatAdj = calculateCoatAdjExtClscc(
        formData.agecrack_ext_clscc,
        formData.agecoat_ext_clscc,
        formData.coating_quality_id_ext_clscc
      );
      setFormData((prev: any) => ({ ...prev, coatadj_ext_clscc: coatAdj }));
    }
  }, [formData?.coating_quality_id_ext_clscc, formData?.agecrack_ext_clscc, formData?.agecoat_ext_clscc]);

  // Age_ext_clscc✅
  useEffect(() => {
    if (formData) {
      const ageExtClscc = calculateAgeExtClscc(
        formData.agecrack_ext_clscc,
        formData.coatadj_ext_clscc
      );
      setFormData((prev: any) => ({ ...prev, age_ext_clscc: ageExtClscc }));
    }
  }, [formData?.agecrack_ext_clscc, formData?.coatadj_ext_clscc]);

  // ExtClSccSusceptibility_ext_clscc And RVI_ext_clscc✅
  useEffect(() => {
    if (formData) {
      const datas = calculateClSccSuscAndSviExtClscc(
        formData.operating_temperature,
        formData.external_environment_id_ext_clscc
      );
      setFormData((prev: any) => ({
        ...prev,
        ext_cl_scc_susc_ext_clscc: datas.susceptibility,
        svi_ext_clscc: datas.svi
      }));
    }
  }, [formData?.operating_temperature, formData?.external_environment_id_ext_clscc]);

  // DfExtClsccFb✅
  useEffect(() => {
    if (formData) {
      const dfExtClsccFb = calculateExtClsccFb(
        50,
        formData.inspection_efficiency_name_ext_clscc
      );
      setFormData((prev: any) => ({ ...prev, df_ext_cl_scc_fb_ext_clscc: dfExtClsccFb }));
    }
  }, [formData?.svi_ext_clscc, formData?.inspection_efficiency_name_ext_clscc]);

  // DfExtClscc❌tak test lansung
  useEffect(() => {
    if (formData) {
      const dfExtClscc = calculateDfExtClsccFinal(
        formData.df_ext_cl_scc_fb_ext_clscc,
        formData.age_ext_clscc,
        formData.ims_asset_type_id
      );
      setFormData((prev: any) => ({ ...prev, df_ext_cl_scc_ext_clscc: dfExtClscc }));
    }
  }, [formData?.df_ext_cl_scc_fb_ext_clscc, formData?.age_ext_clscc, formData?.ims_asset_type_id]);

  //*****************  Formula DFExtClscc End

  //***************** Formula DFMfat Start

  // DmfatFb_mfat☑️tak check lagi
  useEffect(() => {
    if (formData) {
      const dmfatFb = calculateDmFatFb(
        formData.previous_failure_value_mfat,
        formData.visible_audible_shaking_value_mfat,
        formData.shaking_frequency_value_mfat,
        formData.cyclic_load_type_value_mfat
      );
      setFormData((prev: any) => ({ ...prev, dmfatfb_mfat: dmfatFb }));
    }
  }, [formData?.previous_failure_value_mfat, formData?.visible_audible_shaking_value_mfat, formData?.shaking_frequency_value_mfat, formData?.cyclic_load_type_value_mfat]);

  // Dmfat_mfat☑️tak check lagi
  useEffect(() => {
    if (formData) {
      const dmfat = calculateDfMfat(
        formData.dmfatfb_mfat,
        formData.corrective_action_value_mfat,
        formData.pipe_complexity_value_mfat,
        formData.pipe_condition_value_mfat,
        formData.joint_branch_design_value_mfat,
        formData.branch_diameter_value_mfat
      );
      setFormData((prev: any) => ({ ...prev, dmfat_mfat: dmfat }));
    }
  }, [formData?.dmfatfb_mfat, formData?.corrective_action_value_mfat, formData?.pipe_complexity_value_mfat, formData?.pipe_condition_value_mfat, formData?.joint_branch_design_value_mfat, formData?.branch_diameter_value_mfat]);

  //*****************  Formula DFMfat End

  //*****************  Formula DfCui Start

  // AgeTk_cui✅
  useEffect(() => {
    if (formData) {
      const ageTkCui = calculateAgeTk(
        formData.last_inspection_date_cui,
        formData.year_in_service
      );
      setFormData((prev: any) => ({ ...prev, agetk_cui: ageTkCui }));
    }
  }, [formData?.last_inspection_date_cui, formData?.year_in_service]);

  // Agecoat_cui✅sama macam extclscc
  useEffect(() => {
    if (formData) {
      const ageCoatCui = calculateAgeCoatCui(
        formData.new_coating_date_cui,
        formData.year_in_service,
        formData.ims_asset_type_id // 1 = Pressure Vessel (use newCoatDate), 2 = Piping (use serviceDate)
      );
      setFormData((prev: any) => ({ ...prev, agecoat_cui: ageCoatCui }));
    }
  }, [formData?.new_coating_date_cui, formData?.year_in_service, formData?.ims_asset_type_id]);

  // CoatAdj_cui✅
  useEffect(() => {
    if (formData) {
      const coatAdjCui = calculateCoatAdjCui(
        formData.coating_quality_id_cui,
        formData.agetk_cui,
        formData.agecoat_cui
      );
      setFormData((prev: any) => ({ ...prev, coatadj_cui: coatAdjCui }));
    }
  }, [formData?.coating_quality_id_cui, formData?.agetk_cui, formData?.agecoat_cui]);

  // Age_cui✅
  useEffect(() => {
    if (formData) {
      const ageCui = calculateAgeCui(
        formData.agetk_cui,
        formData.coatadj_cui
      );
      setFormData((prev: any) => ({ ...prev, age_cui: ageCui }));
    }
  }, [formData?.agetk_cui, formData?.coatadj_cui]);

  // CrExp_cui✅
  useEffect(() => {
    if (formData) {
      const crExpCui = calculateCrExpCui(
        formData.composition,
        formData.operating_temperature,
        formData.external_environment_id_cui,
        formData.insulation_type_value,
        formData.insulation_complexity_value,
        formData.insulation_condition_value,
        formData.design_fabrication_value,
        formData.interface_value
      );
      setFormData((prev: any) => ({ ...prev, crexp_cui: crExpCui }));
    }
  }, [formData?.composition, formData?.operating_temperature, formData?.external_environment_id_cui, formData?.insulation_type_value, formData?.insulation_complexity_value, formData?.insulation_condition_value, formData?.design_fabrication_value, formData?.interface_value]);

  //Art_cui☑️tak check lagi
  useEffect(() => {
    if (formData) {
      const artCui = calculateArtCui(
        formData.cract_cui,
        formData.crexp_cui,
        formData.age_cui,
        formData.current_thickness_cui,
        formData.normal_wall_thickness
      );
      setFormData((prev: any) => ({ ...prev, art_cui: artCui }));
    }
  }, [formData?.cract_cui, formData?.crexp_cui, formData?.age_cui, formData?.current_thickness_cui, formData?.normal_wall_thickness]);

  // FsCuiF☑️tak check lagi
  useEffect(() => {
    if (formData) {
      const fsCuiF = calculateFSCUIFCui(
        formData.avg_mts_mpa,
        formData.avg_mys_mpa,
        formData.welding_efficiency
      );
      setFormData((prev: any) => ({ ...prev, fscuif_cui: fsCuiF }));
    }
  }, [formData?.avg_mts_mpa, formData?.avg_mys_mpa, formData?.welding_efficiency]);

  // SrCuiF☑️tak check lagi
  useEffect(() => {
    if (formData) {
      const srCuiF = calculateSRCUIFCui(
        formData.welding_efficiency,
        formData.allowable_stress_mpa,
        formData.fscuif_cui,
        formData.tmin,
        formData.current_thickness_cui,
        formData.normal_wall_thickness,
        formData.design_pressure,
        formData.internal_diameter

      );
      setFormData((prev: any) => ({ ...prev, srcuif_cui: srCuiF }));
    }
  }, [formData?.welding_efficiency, formData?.allowable_stress_mpa, formData?.fscuif_cui, formData?.tmin, formData?.current_thickness_cui, formData?.normal_wall_thickness, formData?.design_pressure, formData?.internal_diameter]);

  // ICuiFs and PoCuiFs✅
  useEffect(() => {
    if (formData) {
      const scores = calculateICuiFsAndPoCuiFsCui(
        formData.data_confidence_id_cui,   // Medium confidence
        formData.ncuifa_cui,
        formData.ncuifb_cui,
        formData.ncuifc_cui,
        formData.ncuifd_cui
      );
      setFormData((prev: any) => ({
        ...prev,
        icuif1_cui: scores.icuif1,
        icuif2_cui: scores.icuif2,
        icuif3_cui: scores.icuif3,
        pociufp1_cui: scores.poCUIFP1,
        pociufp2_cui: scores.poCUIFP2,
        pociufp3_cui: scores.poCUIFP3
      }));
    }
  }, [formData?.data_confidence_id_cui, formData?.ncuifa_cui, formData?.ncuifb_cui, formData?.ncuifc_cui, formData?.ncuifd_cui]);

  // BCuiFs✅
  useEffect(() => {
    if (formData) {
      const bCuiFs = calculateBCuiFsCui(
        formData.art_cui,
        formData.srcuif_cui
      );
      setFormData((prev: any) => ({
        ...prev,
        bcuif1_cui: bCuiFs.bCUIF1,
        bcuif2_cui: bCuiFs.bCUIF2,
        bcuif3_cui: bCuiFs.bCUIF3
      }));
    }
  }, [formData?.art_cui, formData?.srcuif_cui]);

  // DfCuiFF☑️tak check lagi
  useEffect(() => {
    if (formData) {
      const dfCuiFF = calculateDFCuiFFCui(
        formData.insulation,
        formData.composition,
        formData.bcuif1_cui,
        formData.bcuif2_cui,
        formData.bcuif3_cui,
        formData.pociufp1_cui,
        formData.pociufp2_cui,
        formData.pociufp3_cui
      );
      setFormData((prev: any) => ({
        ...prev,
        dfcuiff_cui: dfCuiFF
      }));
    }
  }, [formData?.insulation, formData?.composition, formData?.bcuif1_cui, formData?.bcuif2_cui, formData?.bcuif3_cui, formData?.pociufp1_cui, formData?.pociufp2_cui, formData?.pociufp3_cui]);

  //*****************  Formula DfCui End

  //*****************  Formula DfSccScc Start

  // sussceptibility_scc_scc✅
  useEffect(() => {
    if (formData) {
      const susceptibility = calculateSusceptibilitySccScc(
        formData.ims_asset_type_id,
        formData.composition,
        formData.cladding
      );
      setFormData((prev: any) => ({
        ...prev,
        susceptibility_scc_scc: susceptibility
      }));
    }
  }, [formData?.ims_asset_type_id, formData?.composition, formData?.cladding]);

  // EnvSeverity_scc_scc✅
  useEffect(() => {
    if (formData) {
      const envSeverity = calculateEnvSeveritySccScc(
        formData.susceptibility_scc_scc,
        formData.ph_scc_scc,
        formData.h2s_in_water_scc_scc
      );
      setFormData((prev: any) => ({
        ...prev,
        envseverity_scc_scc: envSeverity
      }));
    }
  }, [formData?.susceptibility_scc_scc, formData?.ph_scc_scc, formData?.h2s_in_water_scc_scc]);

  // SscSucsFToHt_scc_scc✅
  useEffect(() => {
    if (formData) {
      const sscSucsFToHt = calculateSscSucsFToHtSccScc(
        formData.pwht,
        formData.envseverity_scc_scc,
        formData.hardness_brinnel_scc_scc
      );
      setFormData((prev: any) => ({
        ...prev,
        ssc_sucs_f_to_ht_scc_scc: sscSucsFToHt
      }));
    }
  }, [formData?.pwht, formData?.envseverity_scc_scc, formData?.hardness_brinnel_scc_scc]);

  // Svi_scc_scc✅
  useEffect(() => {
    if (formData) {
      const svi = calculateSviSccScc(
        formData.ssc_sucs_f_to_ht_scc_scc
      );
      setFormData((prev: any) => ({
        ...prev,
        svi_scc_scc: svi
      }));
    }
  }, [formData?.ssc_sucs_f_to_ht_scc_scc]);

  // DfSccSccFb_scc_scc✅
  useEffect(() => {
    if (formData) {
      const dfSccSccFb = calculateDfSccFbSccScc(
        formData.svi_scc_scc,
        formData.inspection_efficiency_name_scc_scc
      );
      setFormData((prev: any) => ({
        ...prev,
        dfsccfb_scc_scc: dfSccSccFb
      }));
    }
  }, [formData?.svi_scc_scc, formData?.inspection_efficiency_name_scc_scc]);

  // DfSccScc_scc_scc✅
  useEffect(() => {
    if (formData) {
      const dfSccScc = calculateDfSccScc(
        1,
        formData.last_inspection_date_scc_scc
      );
      setFormData((prev: any) => ({
        ...prev,
        df_scc_scc_scc_scc: dfSccScc
      }));
    }
  }, [formData?.dfsccfb_scc_scc, formData?.last_inspection_date_scc_scc]);

  //*****************  Formula DfSccScc End

  //*****************  Formula DfSccSoHic Start

  // Sussceptibility_scc_sohic☑️tak check lagi
  useEffect(() => {
    if (formData) {
      const susceptibility = calculateSusceptibilitySccScc(
        formData.ims_asset_type_id,
        formData.composition,
        formData.cladding
      );
      setFormData((prev: any) => ({
        ...prev,
        susceptibility_scc_sohic: susceptibility
      }));
    }
  }, [formData?.ims_asset_type_id, formData?.composition, formData?.cladding]);

  // EnvSeverity_scc_sohic☑️tak check lagi
  useEffect(() => {
    if (formData) {
      const envSeverity = calculateEnvSeveritySccSohic(
        formData.susceptibility_scc_sohic,
        formData.ph_scc_sohic,
        formData.h2s_in_water_scc_sohic
      );
      setFormData((prev: any) => ({
        ...prev,
        envseverity_scc_sohic: envSeverity
      }));
    }
  }, [formData?.susceptibility_scc_sohic, formData?.ph_scc_sohic, formData?.h2s_in_water_scc_sohic]);

  // SccSucsToCrack_scc_sohic☑️tak check lagi
  useEffect(() => {
    if (formData) {
      const sccSucsToCrack = calculateSuscToCrackSccSohic(
        formData.steelscontent_id_scc_sohic,
        formData.pwht,
        formData.envseverity_scc_sohic
      );
      setFormData((prev: any) => ({
        ...prev,
        sucs_to_crack_scc_sohic: sccSucsToCrack
      }));
    }
  }, [formData?.steelscontent_id_scc_sohic, formData?.pwht, formData?.envseverity_scc_sohic]);

  // Svi_scc_sohic☑️tak check lagi
  useEffect(() => {
    if (formData) {
      const svi = calculateSviSccSohic(
        formData.sucs_to_crack_scc_sohic
      );
      setFormData((prev: any) => ({
        ...prev,
        svi_scc_sohic: svi
      }));
    }
  }, [formData?.sucs_to_crack_scc_sohic]);

  // dfsohicfb_scc_sohic☑️tak check lagi
  useEffect(() => {
    if (formData) {
      const dfSccSoHicFb = calculateDfSohicFbSccSohic(
        formData.svi_scc_sohic,
        formData.inspection_efficiency_name_scc_sohic
      );
      setFormData((prev: any) => ({
        ...prev,
        dfsohicfb_scc_sohic: dfSccSoHicFb
      }));
    }
  }, [formData?.svi_scc_sohic, formData?.inspection_efficiency_name_scc_sohic]);

  // dfscc_sohic_scc_sohic☑️tak check lagi
  useEffect(() => {
    if (formData) {
      const dfSccSoHic = calculateDfSccSohic(
        formData.dfsohicfb_scc_sohic,
        formData.last_inspection_date_scc_sohic,
        formData.online_monitor_value_scc_sohic
      );
      setFormData((prev: any) => ({
        ...prev,
        dfscc_sohic_scc_sohic: dfSccSoHic
      }));
    }
  }, [formData?.dfsohicfb_scc_sohic, formData?.last_inspection_date_scc_sohic, formData?.online_monitor_value_scc_sohic]);





  //*****************  Formula DfSccSoHic End





  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("RBI Assessment created successfully");
    // navigate("/monitor/rbi-assessment");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Create New RBI Assessment"
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
      {/* <h1>last {formData.online_monitor_id_scc_sohic ?? "NA"}</h1>
      <h1>last {formData.online_monitor_value_scc_sohic ?? "NA"}</h1> */}
      {/* <h1>coat {formData.ncuifb_cui ?? "NA"}</h1> */}
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