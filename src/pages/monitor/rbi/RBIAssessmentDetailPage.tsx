import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BathIcon, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import PofTab from "@/components/monitor/rbi/pof/PofTab";
import CofTab from "@/components/monitor/rbi/cof/CofTab";
import RiskIrpTab from "@/components/monitor/rbi/risk/RiskIrpTab";
import { useImsPofAssessmentData } from "./hooks/use-ims-pof-assessment-data";
import { useImsCofAssessmentCofProdData } from "./hooks/use-ims-cof-assessment-prod-data";
import { useImsCofAssessmentCofAreaData } from "./hooks/use-ims-cof-assessment-area-data";
import { useImsRbiRiskIrpData } from "./hooks/use-ims-rib-risk-irp-data";
import Loading from "@/components/shared/Loading";
import { useImsDfThinData } from "./hooks/use-df-thin-data";
import { useImsDfExtData } from "./hooks/use-df-ext-data";
import { useImsDfExtClsccData } from "./hooks/use-df-ext-clscc-data";
import { useImsDfMfatData } from "./hooks/use-df-mfat-data";
import { useImsDfCuiData } from "./hooks/use-df-cui-data";
import { useImsDfSccSccData } from "./hooks/use-df-scc-scc";
import { useImsDfSccSohicData } from "./hooks/use-df-scc-sohic";
import { PanelWithForwardedRef } from "node_modules/react-resizable-panels/dist/declarations/src/Panel";


const RBIAssessmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: pofData, isLoading: isPofLoading, error: pofError, refetch: pofRefetch } = useImsPofAssessmentData(Number(id));
  const { data: cofProdData, isLoading: isCofProdLoading, error: cofProdError, refetch: codProdRefetch } = useImsCofAssessmentCofProdData(Number(id));
  const { data: cofAreaData, isLoading: isCofAreaLoading, error: cofAreaError, refetch: codAreaRefetch } = useImsCofAssessmentCofAreaData(Number(id));
  const { data: rbiData, isLoading: isRbiLoading, error: rbiError, refetch: rbiRefetch } = useImsRbiRiskIrpData(Number(id));
  const { data: dfThinData, isLoading: isDfThinLoading, error: dfThinError, refetch: dfThinRefetch } = useImsDfThinData(Number(id));
  const { data: dfExtData, isLoading: isDfExtLoading, error: dfExtError, refetch: dfExtRefetch } = useImsDfExtData(Number(id));
  const { data: dfExtClsccData, isLoading: isDfExtClsccLoading, error: dfExtClsccError, refetch: dfExtClsccRefetch } = useImsDfExtClsccData(Number(id));
  const { data: dfMfatData, isLoading: isDfMfatLoading, error: dfMfatError, refetch: dfMfatRefetch } = useImsDfMfatData(Number(id));
  const { data: dfCuiData, isLoading: isDfCuiLoading, error: dfCuiError, refetch: dfCuiRefetch } = useImsDfCuiData(Number(id));
  const { data: dfSccSccData, isLoading: isDfSccSccLoading, error: dfSccSccError, refetch: dfSccSccRefetch } = useImsDfSccSccData(Number(id));
  const { data: dfccSohicData, isLoading: isDfccSohicLoading, error: dfccSohicError, refetch: dfccSohicRefetch } = useImsDfSccSohicData(Number(id));


  const [formData, setFormData] = useState<any | null>(null);

  /** Sync `formData` once **all** primary datasets are loaded */
  useEffect(() => {
    const primaryLoaded =
      !isPofLoading && !isCofProdLoading && !isCofAreaLoading && !isRbiLoading;

    if (primaryLoaded) {
      setFormData({
        // *** i_ims_pof_assessment_general
        asset_detail_id: pofData?.asset_detail_id || null,
        coating_quality_id: pofData?.coating_quality_id || null, //coating_quality_id(2), coating_quality_id(3), coating_quality_id(5)
        data_confidence_id: pofData?.data_confidence_id || null,
        cladding: pofData?.cladding || false, //clad(1)
        nominal_thickness: pofData?.nominal_thickness || 0, //Tnom(1)
        current_thickness: pofData?.current_thickness || 0, //Trd(1), Trd(2), Trd(3)
        description: pofData?.description || "",
        tmin: 0,// Tmin(1)

        // i_df_thin (1)
        //clad(1)
        last_inspection_date_thin: dfThinData?.last_inspection_date || "",
        agetk_thin: 0,
        agerc_thin: dfThinData?.agerc || "",
        crexp_thin: 0,
        cract_thin: dfThinData?.cr_act || 0,
        crcm_thin: 0,
        //Tnom(1)
        //Tmin(1)
        //Trd(1)
        ca_thin: 0,
        art_thin: 0,
        fsthin_thin: 0,
        srthin_thin: 0,
        nthin_a_thin: dfThinData?.nthin_a || 0,
        nthin_b_thin: dfThinData?.nthin_b || 0,
        nthin_c_thin: dfThinData?.nthin_c || 0,
        nthin_d_thin: dfThinData?.nthin_d || 0,
        data_confidence_id_thin: dfThinData?.data_confidence_id || null,
        ithin1_thin: 0,
        ithin2_thin: 0,
        ithin3_thin: 0,
        pothin1_thin: 0,
        pothin2_thin: 0,
        pothin3_thin: 0,
        bthin1_thin: 0,
        bthin2_thin: 0,
        bthin3_thin: 0,
        dfthinfb_thin: dfThinData?.dfthinfb || 0,
        //onlinemoitor(1)
        //mixpoint(1)
        //deadlegs(1)
        dthinf_thin: 0,
        remaininglife_thin: 0,

        // *** i_df_ext (2)
        coating_quality_id_ext: dfExtData?.i_ims_protection_id?.coating_quality_id || null, //?? coating_quality_id(2)
        new_coating_date_ext: dfExtData?.new_coating_date || "",
        last_inspection_date_ext: dfExtData?.last_inspection_date || "",
        //Trd(2)
        agetk_ext: 0,
        agecoat_ext: 0,
        coatadj_ext: 0,
        age_ext: 0,
        external_environment_id_ext: dfExtData?.i_ims_design_id?.ext_env_id || null,
        pipesupprt_ext: dfExtData?.i_ims_design_id?.pipe_support || false,
        soilwaterinterface_ext: dfExtData?.i_ims_design_id?.soil_water_interface || false,
        crexp_ext: 0,
        cract_ext: 0,
        art_ext: 0,
        fsextcorr_ext: 0,
        srextcorr_ext: 0,
        nextcorra_ext: dfExtData?.nextcorra || 0,
        nextcorrb_ext: dfExtData?.nextcorrb || 0,
        nextcorrc_ext: dfExtData?.nextcorrc || 0,
        nextcorrd_ext: dfExtData?.nextcorrd || 0,
        data_confidence_id_ext: dfExtData?.data_confidence_id || null,
        iextcorr1_ext: 0,
        iextcorr2_ext: 0,
        iextcorr3_ext: 0,
        poextcorrp1_ext: 0,
        poextcorrp2_ext: 0,
        poextcorrp3_ext: 0,
        bextcorr1_ext: 0,
        bextcorr2_ext: 0,
        bextcorr3_ext: 0,
        dfextcorrf_ext: dfExtData?.dfextcorrf || 0,
        //rl

        // *** i_df_ext_clscc (3)
        coating_quality_id_ext_clscc: dfExtClsccData?.i_ims_protection_id?.coating_quality_id || null, //?? coating_quality_id(3)
        new_coating_date_ext_clscc: dfExtClsccData?.new_coating_date || "",
        last_inspection_date_ext_clscc: dfExtClsccData?.last_inspection_date || "",
        //Trd(3)
        agecrack_ext_clscc: 0,
        agecoat_ext_clscc: 0,
        coatadj_ext_clscc: 0,
        age_ext_clscc: 0,
        external_environment_id_ext_clscc: dfExtClsccData?.i_ims_design_id?.ext_env_id || null,
        ext_cl_scc_susc_ext_clscc: 0,
        svi_ext_clscc: 0,
        inspection_efficiency_id_ext_clscc: dfExtClsccData?.inspection_efficiency_id || null,
        df_ext_cl_scc_ext_clscc: dfExtClsccData?.df_ext_cl_scc || 0,
        df_ext_cl_scc_fb_ext_clscc: 0,

        // *** i_df_mfat(4)
        previous_failure_id_mfat: dfMfatData?.previous_failure_id || null,
        visible_audible_shaking_id_mfat: dfMfatData?.visible_audible_shaking_id || null,
        shaking_frequency_id_mfat: dfMfatData?.shaking_frequency_id || null,
        cyclic_load_type_id_mfat: dfMfatData?.cyclic_load_type_id || null,
        dmfatfb_mfat: dfMfatData?.dmfatfb || 0,
        corrective_action_id_mfat: dfMfatData?.corrective_action_id || null,
        pipe_complexity_id_mfat: dfMfatData?.pipe_complexity_id || null,
        pipe_condition_id_mfat: dfMfatData?.pipe_condition_id || null,
        joint_branch_design_id_mfat: dfMfatData?.joint_branch_design_id || null,
        brach_diameter_id_mfat: dfMfatData?.brach_diameter_id || null,
        dmfat_mfat: 0,

        // *** i_df_cui (5)
        coating_quality_id_cui: dfCuiData?.i_ims_protection_id?.coating_quality_id || null, //?? coating_quality_id(5)
        last_inspection_date_cui: dfCuiData?.last_inspection_date || "",
        new_coating_date_cui: dfCuiData?.new_coating_date || "",
        agetk_cui: 0,
        agecoat_cui: 0,
        coatadj_cui: 0,
        age_cui: 0,
        external_environment_id_cui: dfCuiData?.i_ims_design_id?.ext_env_id || null,
        insulation_type_id_cui: dfCuiData?.i_ims_protection_id?.insulation_type_id || null,
        insulation_complexity_id_cui: dfCuiData?.i_ims_protection_id?.insulation_complexity_id || null,
        insulation_condition_cui: dfCuiData?.i_ims_protection_id?.insulation_condition || "",
        design_fabrication_id_cui: dfCuiData?.i_ims_protection_id?.design_fabrication_id || null,
        interface_id_cui: dfCuiData?.i_ims_protection_id?.interface_id || null,
        crexp_cui: 0,
        cract_cui: dfCuiData?.cr_act || 0,
        art_cui: 0,
        fscuif_cui: 0,
        ncuifa_cui: dfCuiData?.ncuifa || 0,
        ncuifb_cui: dfCuiData?.ncuifb || 0,
        ncuifc_cui: dfCuiData?.ncuifc || 0,
        ncuifd_cui: dfCuiData?.ncuifd || 0,
        data_confidence_id_cui: dfCuiData?.data_confidence_id || null,
        icuif1_cui: 0,
        icuif2_cui: 0,
        icuif3_cui: 0,
        pociufp1_cui: 0,
        pociufp2_cui: 0,
        pociufp3_cui: 0,
        bcuif1_cui: 0,
        bcuif2_cui: 0,
        bcuif3_cui: 0,
        dfcuiff_cui: dfCuiData?.dfcuiff || 0,

        // *** i_df_scc_scc (6)
        susceptibility_scc_scc: false, // Yes?
        h2s_in_water_scc_scc: dfSccSccData?.h2s_in_water || 0,
        ph_scc_scc: dfSccSccData?.ph || 0,
        envseverity_scc_scc: "", //low?
        pwht_scc_scc: dfSccSccData?.ims_general_id?.pwht || false,
        hardness_brinnel_scc_scc: dfSccSccData?.hardness_brinnel || 0,
        ssc_sucs_f_to_ht_scc_scc: "", //low?
        svi_scc_scc: 0,
        inspection_efficiency_id_scc_scc: dfSccSccData?.inspection_efficiency_id || null,
        dfsccfb_scc_scc: dfSccSccData?.dfsccfb || 0,
        last_inspection_date_scc_scc: dfSccSccData?.last_inspection_date || "",
        df_scc_scc_scc_scc: dfSccSccData?.df_scc_scc || 0,

        // *** i_df_scc_sohic (7)
        susceptibility_scc_sohic: false, // Yes?
        h2s_in_water_scc_sohic: dfccSohicData?.h2s_in_water || 0,
        ph_scc_sohic: dfccSohicData?.ph || 0,
        envseverity_scc_sohic: "", //low?
        pwht_scc_sohic: dfccSohicData?.ims_general_id?.pwht || false,
        steelscontent_id_scc_sohic: dfccSohicData?.steelscontent_id || null,
        sucs_to_crack_scc_sohic: "", //low?
        svi_scc_sohic: 0,
        inspection_efficiency_id_scc_sohic: dfccSohicData?.inspection_efficiency_id || null,
        dfsohicfb_scc_sohic: 0,
        last_inspection_date_scc_sohic: dfccSohicData?.last_inspection_date || "",
        //onlinemoitor(7)
        dfscc_sohic_scc_sohic: dfccSohicData?.dfscc_sohic || 0,

        // *** i_ims_cof_assessment_cof_prod
        outagemult: cofProdData?.outagemult || 0,
        injcost: cofProdData?.injcost || 0,
        envcost: cofProdData?.envcost || 0,
        fracevap: cofProdData?.fracevap || 0,
        volenv: cofProdData?.volenv || 0,
        fcenviron: cofProdData?.fcenviron || 0,
        fc: cofProdData?.fc || 0,

        // *** i_ims_cof_asssessment_cof_area
        iso_sys_id: cofAreaData?.iso_sys_id || null,
        det_sys_id: cofAreaData?.det_sys_id || null,
        mitigation_system_id: cofAreaData?.mitigation_system_id || null,
        ideal_gas_specific_heat_eq: cofAreaData?.ideal_gas_specific_heat_eq || 0,
        ca_cmdflam: cofAreaData?.ca_cmdflam || 0,
        ca_injflam: cofAreaData?.ca_injflam || 0,
        ims_service_id: cofAreaData?.ims_service_id || null,

        // *** i_ims_rbi_risk_irp
        dhtha: rbiData?.dhtha || 0,
        dbrit: rbiData?.dbrit || 0,
        dthin: rbiData?.dthin || 0,
        dextd: rbiData?.dextd || 0,
        dscc: rbiData?.dscc || 0,
        dmfat: rbiData?.dmfat || 0,
        pof: rbiData?.pof || 0,
        cof_financial: rbiData?.cof_financial || 0,
        cof_area: rbiData?.cof_area || 0,
        pof_value: rbiData?.pof_value || 0,
        risk_level: rbiData?.risk_level || "",
        risk_ranking: rbiData?.risk_ranking || "",
      });
    }
  }, [
    isPofLoading,
    isCofProdLoading,
    isCofAreaLoading,
    isRbiLoading,
    pofData,
  ]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("RBI Assessment updated successfully");
    navigate("/monitor/rbi-assessment");
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
      {(formData && isPofLoading && isCofProdLoading && isCofAreaLoading && isRbiLoading) ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="pt-6">
              <h1>TEST: {formData?.coating_quality_id ?? "na"}</h1>
              {/* <pre>{JSON.stringify(formData, null, 2)}</pre> */}

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
                  {/* <CofTab formData={formData} setFormData={setFormData} /> */}
                </TabsContent>
                <TabsContent value="risk">
                  {/* <RiskIrpTab formData={formData} setFormData={setFormData} /> */}
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
            <Button type="submit">Save Changes
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RBIAssessmentDetailPage;