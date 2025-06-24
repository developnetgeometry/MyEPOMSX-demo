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
import { useImsDesignByAssetDetailId } from "./hooks/use-ims-design-by-asset-detail-id";
import { calculateAgeTk, calculateCrAct, calculateCrExp } from "./hooks/formula-df-thin";


const RBIAssessmentCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<any | null>({
    // ims_general
    asset_detail_id: null,
    ims_asset_type: null,
    line_no: "",
    pipe_schedule_id: null,
    pressure_rating: 0,
    year_in_service: "",
    normal_wall_thickness: 0,
    tmin: 0,
    material_construction_id: null,
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
    geometry_id: null,
    length: 0,
    operating_temperature: 0,
    allowable_stress_mpa: 0,
    pipe_support: false,
    soil_water_interface: false,
    dead_legs: false,
    mix_point: false,

    // *** i_ims_pof_assessment_general

    nominal_thickness: 0,
    current_thickness: 0,
    inner_diameter: 0,
    spec_code: "",
    avg_mts_mpa: 0,
    avg_mys_mpa: 0,
    composition: "",
    // i_df_thin (1)
    last_inspection_date_thin: "",
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
    mixpoint_thin: 0,
    dead_legs_tin: 0,
    dthinf_thin: 0,
    remaininglife_thin: 0,
    welding_efficiency_thin: 0,
    allowable_stress_mpa_thin: 0,
    design_pressure_thin: 0,

    // *** i_df_ext (2)
    coating_quality_id_ext: null,
    new_coating_date_ext: "",
    last_inspection_date_ext: "",
    agetk_ext: 0,
    agecoat_ext: 0,
    coatadj_ext: 0,
    age_ext: 0,
    external_environment_id_ext: null,
    pipesupprt_ext: false,
    soilwaterinterface_ext: false,
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

  const allLoaded = !isImsDesignLoading && !isImsGeneralLoading;

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
        material_construction_id: imsGeneral?.material_construction_id ?? null,
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
        ext_env_id: imsDesign?.ext_env_id ?? null,
        geometry_id: imsDesign?.geometry_id ?? null,
        length: imsDesign?.length ?? 0,
        operating_temperature: imsDesign?.operating_temperature ?? 0,
        allowable_stress_mpa: imsDesign?.allowable_stress_mpa ?? 0,
        pipe_support: imsDesign?.pipe_support ?? false,
        soil_water_interface: imsDesign?.soil_water_interface ?? false,
        dead_legs: imsDesign?.dead_legs ?? false,
        mix_point: imsDesign?.mix_point ?? false,
      }));
    }
  }, [formData?.asset_detail_id, allLoaded, imsGeneral, imsDesign]);

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

  // cract_thin
  useEffect(() => {
    if (formData) {
      const crAct = calculateCrAct(
        formData.nominal_thickness,
        formData.current_thickness,
        formData.last_inspection_date_thin,
        formData.year_in_service
      );
      setFormData((prev: any) => ({ ...prev, cract_thin: crAct }));
    }
  }, [formData?.nominal_thickness, formData?.current_thickness, formData?.last_inspection_date_thin, formData?.year_in_service,
  ]);


  // Formula DfThin End


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
      <h1>{formData.tmin ?? "NA"}</h1>
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