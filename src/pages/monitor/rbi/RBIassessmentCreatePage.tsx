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
import { calcIThinAndProportions, calculateAge, calculateAgeCoat, calculateAgeTk, calculateArt, calculateBThins, calculateCoatAdj, calculateCrAct, calculateCrCm, calculateCrExp, calculateCrExpExt, calculateDFThinFb, calculateFsThin, calculateSrThin } from "./hooks/formula";
import { useAverageMtsMpaMysMpaByName } from "./hooks/use-average-mts_mpa-mys_mpa-by-name";

const RBIAssessmentCreatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // const asset


  // const { data: avgs } = useAverageMtsMpaMysMpaByName(); // Example calculation


  const [formData, setFormData] = useState<any | null>(null);

  /** Sync `formData` once **all** primary datasets are loaded */
  useEffect(() => {
    // TODO: Replace the following with actual loading checks for your primary datasets
    const primaryLoaded = true; // Example: set to true for now, or use your actual loading logic

    if (primaryLoaded) {
      setFormData({
        // *** i_ims_pof_assessment_general
        asset_detail_id: null,
        ims_asset_type: null,
        coating_quality_id: null,
        data_confidence_id: null,
        cladding: false,
        nominal_thickness: 0,
        current_thickness: 0,
        description:"",
        year_in_service:"",
        // tmin: 0,// Tmin(1)
        tmin: 0,// Tmin(1)
        outer_diameter:  0,
        inner_diameter: 0,
        corrosion_allowance_thin: 0,
        spec_code:  "",
        avg_mts_mpa: 0, // Average MTS/MPA
        avg_mys_mpa: 0, // Average MYS/MPA
        composition:  "", // Composition

        // i_df_thin (1)
        //clad(1)
        last_inspection_date_thin:  "",
        agetk_thin: 0,
        agerc_thin:  "",
        crexp_thin: 0,
        cract_thin:  0,
        crcm_thin: 0,
        //Tnom(1)
        //Tmin(1)
        //Trd(1)
        ca_thin: 0,
        art_thin: 0,
        fsthin_thin: 0,
        srthin_thin: 0,
        nthin_a_thin:  0,
        nthin_b_thin:  0,
        nthin_c_thin:  0,
        nthin_d_thin:  0,
        data_confidence_id_thin:  null,
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
        //onlinemoitor(1)
        mixpoint_thin: 0, //mixpoint(1)
        dead_legs_tin: 0,//deadlegs(1)
        dthinf_thin: 0,
        remaininglife_thin: 0,
        welding_efficiency_thin: 0,
        allowable_stress_mpa_thin:  0,
        design_pressure_thin: 0,

        // *** i_df_ext (2)
        coating_quality_id_ext:  null, //?? coating_quality_id(2)
        new_coating_date_ext:"",
        last_inspection_date_ext: "",
        //Trd(2)
        agetk_ext: 0,
        agecoat_ext: 0,
        coatadj_ext: 0,
        age_ext: 0,
        external_environment_id_ext: null,
        pipesupprt_ext:false,
        soilwaterinterface_ext: false,
        crexp_ext: 0,
        cract_ext: 0,
        art_ext: 0,
        fsextcorr_ext: 0,
        srextcorr_ext: 0,
        nextcorra_ext:  0,
        nextcorrb_ext: 0,
        nextcorrc_ext: 0,
        nextcorrd_ext:  0,
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
        //rl

      });
    }

  }, [

  ]);

  /** Calculate agetk_thin when last_inspection_date_thin or year_in_service changes */
  useEffect(() => {
    if (formData && formData.last_inspection_date_thin) {
      const ageTk = calculateAgeTk(
        formData.last_inspection_date_thin,
        formData.year_in_service
      );
      setFormData((prev: any) => ({ ...prev, agetk_thin: ageTk }));
    }
  }, [formData?.last_inspection_date_thin, formData?.year_in_service]);

  // /** Calculate crexp_thin when corrosion_allowance_thin changes */
  useEffect(() => {
    if (formData && formData.last_inspection_date_thin) {
      const crExp = calculateCrExp(
        formData.corrosion_allowance_thin
      );
      setFormData((prev: any) => ({ ...prev, crexp_thin: crExp }));
    }
  }, [formData?.corrosion_allowance_thin]);

  // /** Calculate cract_thin when Tnom and Trd and LastInspectiondate changes */
  useEffect(() => {
    if (formData && formData.nominal_thickness && formData.current_thickness && formData.last_inspection_date_thin && formData.year_in_service) {
      const crAct = calculateCrAct(
        formData.nominal_thickness,
        formData.current_thickness,
        formData.last_inspection_date_thin,
        formData.year_in_service
      );
      setFormData((prev: any) => ({ ...prev, cract_thin: crAct }));
    }
  }, [formData?.nominal_thickness, formData?.current_thickness, formData?.last_inspection_date_thin, formData?.year_in_service]);
  // cladding

  // /** Calculate crcm when cladding changes */
  useEffect(() => {
    if (formData) {
      const crcm = calculateCrCm(formData.cladding);
      setFormData((prev: any) => ({ ...prev, crcm_thin: crcm }));
    }
  }, [formData?.cladding]);

  // Ca = allowed corrosion
  useEffect(() => {
    if (formData) {
      const cathin = formData.corrosion_allowance_thin;
      setFormData((prev: any) => ({ ...prev, ca_thin: cathin }));
    }
  }, [formData?.corrosion_allowance_thin]);

  // /** Calculate art_thin when crAct, crExp, ageTk, trd, tNom changes */
  useEffect(() => {
    if (formData) {
      const artThin = calculateArt(
        formData.cract_thin,
        formData.crexp_thin,
        formData.agethk_thin,
        formData.current_thickness,
        formData.nominal_thickness
      );
      setFormData((prev: any) => ({ ...prev, art_thin: artThin }));
    }
  }, [formData?.cract_thin, formData?.crexp_thin, formData?.agethk_thin, formData?.current_thickness, formData?.nominal_thickness]);

  // Fsthin
  useEffect(() => {
    if (formData) {
      const fsThin = calculateFsThin(
        formData.ims_asset_type,
        formData.welding_efficiency_thin,
        formData.avg_mts_mpa,
        formData.avg_mys_mpa
      );
      setFormData((prev: any) => ({ ...prev, fsthin_thin: fsThin }));
    }
  }, [formData?.avg_mts_mpa, formData?.avg_mys_mpa, formData?.ims_asset_type, formData?.welding_efficiency_thin]);

  // Srthin
  useEffect(() => {
    if (formData) {
      const srThin = calculateSrThin(
        formData.ims_asset_type,
        formData.allowable_stress_mpa_thin,
        formData.welding_efficiency_thin,
        formData.fsthin_thin,
        formData.tmin,
        formData.nominal_thickness,
        formData.current_thickness,
        formData.design_pressure_thin,
        formData.outer_diameter,
        formData.inner_diameter
      );
      setFormData((prev: any) => ({ ...prev, srthin_thin: srThin }));
    }
  }, [formData?.allowable_stress_mpa_thin, formData?.welding_efficiency_thin, formData?.fsthin_thin, formData?.tmin, formData?.nominal_thickness, formData?.current_thickness, formData?.design_pressure_thin, formData?.outer_diameter, formData?.inner_diameter, formData?.ims_asset_type]);

  // IThin123
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
  // calculateBThins(art: number, srThin: number)
  //  // BThin123
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

  // DFThinFB
    useEffect(() => {
    if (formData) {
      const dfThinFb = calculateDFThinFb(
        formData.pothin1_thin,
        formData.pothin2_thin,
        formData.pothin3_thin,
        formData.bthin1_thin,
        formData.bthin2_thin,
        formData.bthin3_thin
      );
      setFormData((prev: any) => ({
        ...prev,
        dfthinfb_thin: dfThinFb,
        dfthinf_thin: dfThinFb //NNATI AKU GUNA COLUMN leg, monitor etc
      }));
    }
  }, [formData?.pothin1_thin, formData?.pothin2_thin, formData?.pothin3_thin, formData?.bthin1_thin, formData?.bthin2_thin, formData?.bthin3_thin]);

  // AgeTk
  useEffect(() => {
    if (formData && formData.last_inspection_date_ext) {
      const ageExt = calculateAgeTk(
        formData.last_inspection_date_ext,
        formData.year_in_service
      );
      setFormData((prev: any) => ({ ...prev, agetk_ext: ageExt }));
    }
  }, [formData?.last_inspection_date_ext, formData?.year_in_service]);

  // AgeCoat
  useEffect(() => {
    if (formData && formData.new_coating_date_ext) {
      const ageCoat = calculateAgeCoat(
        formData.new_coating_date_ext
      );
      setFormData((prev: any) => ({ ...prev, agecoat_ext: ageCoat }));
    }
  }, [formData?.new_coating_date_ext, formData?.year_in_service]);

  // CoatAdj
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

  // AgeExt
  useEffect(() => {
    if (formData) {
      const ageExt = calculateAge(
        formData.agetk_ext,
        formData.coatadj_ext
      );
      setFormData((prev: any) => ({ ...prev, age_ext: ageExt }));
    }
  }, [formData?.agetk_ext, formData?.coatadj_ext]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("RBI Assessment created successfully");
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
      {(formData) ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="pt-6">
              <h1>TEST: {formData?.art_thin ?? "na"}</h1>
              {/* <pre>{JSON.stringify(avgs, null, 2)}</pre> */}

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
            <Button type="submit">Create RBI
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RBIAssessmentCreatePage;