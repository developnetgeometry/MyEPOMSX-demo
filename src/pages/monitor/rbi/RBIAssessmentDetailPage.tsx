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
        // i_ims_pof_assessment_general
        asset_detail_id: pofData?.asset_detail_id || null,
        coating_quality_id: pofData?.coating_quality_id || null,
        data_confidence_id: pofData?.data_confidence_id || null,
        cladding: pofData?.cladding || false,
        nominal_thickness: pofData?.nominal_thickness || 0,
        current_thickness: pofData?.current_thickness || 0,
        description: pofData?.description || "",

        tmin: 0,

        // i_df_thin
        last_inspection_date_thin: dfThinData?.last_inspection_date || "",
        data_confidence_id_thin: dfThinData?.data_confidence_id || null,
        nthin_a_thin: dfThinData?.nthin_a || 0,
        nthin_b_thin: dfThinData?.nthin_b || 0,
        nthin_c_thin: dfThinData?.nthin_c || 0,
        nthin_d_thin: dfThinData?.nthin_d || 0,
        new_coating_date_thin: dfThinData?.new_coating_date || "",
        agerc_thin: dfThinData?.agerc || "",
        dfthinfb_thin: dfThinData?.dfthinfb || 0,
        manual_cr_act_thin: dfThinData?.manual_cr_act || 0,

        cr_act_thin: 0,
        fc_thin_thin: 0,
        sr_thin_thin: 0,
        dthinf_thin: 0,
        agetk_thin: 0,
        ithin1_thin: 0,
        crexp_thin: 0,
        ithin2_thin: 0,
        crcm_thin: 0,
        ithin3_thin: 0,
        art_thin: 0,
        pothin1_thin: 0,
        pothin2_thin: 0,
        pothin3_thin: 0,
        bthin1_thin: 0,
        bthin2_thin: 0,
        bthin3_thin: 0,

        // i_df_ext
        last_inspection_date_ext: dfExtData?.last_inspection_date || "",
        new_coating_date_ext: dfExtData?.new_coating_date || "",
        data_confidence_id_ext: dfExtData?.data_confidence_id || null,
        dfextcorrf_ext: dfExtData?.dfextcorrf || 0,
        i_ims_protection_id_ext: dfExtData?.i_ims_protection_id || null,
        i_ims_design_id_ext: dfExtData?.i_ims_design_id || null,
        nextcorra_ext: dfExtData?.nextcorra || 0,
        nextcorrb_ext: dfExtData?.nextcorrb || 0,
        nextcorrc_ext: dfExtData?.nextcorrc || 0,
        nextcorrd_ext: dfExtData?.nextcorrd || 0,

        agetk_ext: 0,
        agecoat_year_ext: 0,
        cract_year_ext: 0,
        art_ext: 0,
        fsextcorr_ext: 0,
        srextcorr_ext: 0,
        lextcorr1_ext: 0,
        lextcorr2_ext: 0,
        lextcorr3_ext: 0,
        poextcorrp1_ext: 0,
        poextcorrp2_ext: 0,
        poextcorrp3_ext: 0,
        bextcorpp1_ext: 0,
        bextcorpp2_ext: 0,
        bextcorpp3_ext: 0,
        crexp_ext: 0,
        

        // i_df_ext_clscc
        last_inspection_date_ext_clscc: dfExtClsccData?.last_inspection_date || "",
        new_coating_date_ext_clscc: dfExtClsccData?.new_coating_date || "",
        inspection_efficiency_id_ext_clscc: dfExtClsccData?.inspection_efficiency_id || null,
        data_confidence_id_ext_clscc: dfExtClsccData?.data_confidence_id || null,
        df_ext_cl_scc_ext_clscc: dfExtClsccData?.df_ext_cl_scc || 0,
        i_ims_design_id_ext_clscc: dfExtClsccData?.i_ims_design_id || null,
        ims_general_id_ext_clscc: dfExtClsccData?.ims_general_id || null

        // i_df_mfat
        , previous_failure_id_mfat: dfMfatData?.previous_failure_id || null,
        visible_audible_shaking_id_mfat: dfMfatData?.visible_audible_shaking_id || null,
        shaking_frequency_id_mfat: dfMfatData?.shaking_frequency_id || null,
        cyclic_load_type_id_mfat: dfMfatData?.cyclic_load_type_id || null,
        corrective_action_id_mfat: dfMfatData?.corrective_action_id || null,
        pipe_complexity_id_mfat: dfMfatData?.pipe_complexity_id || null,
        pipe_condition_id_mfat: dfMfatData?.pipe_condition_id || null,
        joint_branch_design_id_mfat: dfMfatData?.joint_branch_design_id || null,
        brach_diameter_id_mfat: dfMfatData?.brach_diameter_id || null,
        dmfatfb_mfat: dfMfatData?.dmfatfb || 0,
        data_confidence_id_mfat: dfMfatData?.data_confidence_id || null,

        // i_df_cui
        last_inspection_date_cui: dfCuiData?.last_inspection_date || "",
        new_coating_date_cui: dfCuiData?.new_coating_date || "",
        dfcuiff_cui: dfCuiData?.dfcuiff || 0,
        data_confidence_id_cui: dfCuiData?.data_confidence_id || null,
        i_ims_design_id_cui: dfCuiData?.i_ims_design_id || null,
        ncuifa_cui: dfCuiData?.ncuifa || 0,
        ncuifb_cui: dfCuiData?.ncuifb || 0,
        ncuifc_cui: dfCuiData?.ncuifc || 0,
        ncuifd_cui: dfCuiData?.ncuifd || 0,

        // i_df_scc_scc
        inspection_efficiency_id_scc_scc: dfSccSccData?.inspection_efficiency_id || null,
        hardness_brinnel_scc_scc: dfSccSccData?.hardness_brinnel || 0,
        dfsccfb_scc_scc: dfSccSccData?.dfsccfb || 0,
        df_scc_scc_scc_scc: dfSccSccData?.df_scc_scc || 0,
        h2s_in_water_scc_scc: dfSccSccData?.h2s_in_water || 0,
        ph_scc_scc: dfSccSccData?.ph || 0,
        last_inspection_date_scc_scc: dfSccSccData?.last_inspection_date || "",

        // i_df_scc_sohic
        inspection_efficiency_id_scc_sohic: dfccSohicData?.inspection_efficiency_id || null,
        steelscontent_id_scc_sohic: dfccSohicData?.steelscontent_id || null,
        harness_brinnel_scc_sohic: dfccSohicData?.harness_brinnel || 0,
        dfscc_sohic: dfccSohicData?.dfscc_sohic || 0,
        h2s_in_water_scc_sohic: dfccSohicData?.h2s_in_water || 0,
        ph_scc_sohic: dfccSohicData?.ph || 0,
        last_inspection_date_scc_sohic: dfccSohicData?.last_inspection_date || "",
        i_ims_protection_id_scc_sohic: dfccSohicData?.i_ims_protection_id || null,

        // i_ims_cof_assessment_cof_prod
        outagemult: cofProdData?.outagemult || 0,
        injcost: cofProdData?.injcost || 0,
        envcost: cofProdData?.envcost || 0,
        fracevap: cofProdData?.fracevap || 0,
        volenv: cofProdData?.volenv || 0,
        fcenviron: cofProdData?.fcenviron || 0,
        fc: cofProdData?.fc || 0,

        // i_ims_cof_asssessment_cof_area
        iso_sys_id: cofAreaData?.iso_sys_id || null,
        det_sys_id: cofAreaData?.det_sys_id || null,
        mitigation_system_id: cofAreaData?.mitigation_system_id || null,
        ideal_gas_specific_heat_eq: cofAreaData?.ideal_gas_specific_heat_eq || 0,
        ca_cmdflam: cofAreaData?.ca_cmdflam || 0,
        ca_injflam: cofAreaData?.ca_injflam || 0,
        ims_service_id: cofAreaData?.ims_service_id || null,

        // i_ims_rbi_risk_irp
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