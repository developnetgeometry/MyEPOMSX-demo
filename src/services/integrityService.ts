import { supabase } from "@/lib/supabaseClient";

export interface IntegrityAsset {
  id: number;
  asset_no: string;
  asset_name: string | null;
  area: string | null;
  system: string | null;
  status: string | null;
  asset_detail_id: number;
  ims_asset_type_id: number;
}

export const integrityService = {
  /**
   * Fetch assets for integrity management based on ims_asset_type_id
   * @param imsAssetTypeId - 1 for pressure vessels, 2 for piping
   */
  async getIntegrityAssets(imsAssetTypeId: number): Promise<IntegrityAsset[]> {
    const { data, error } = await supabase
      .from("e_asset")
      .select(
        `
        id,
        asset_no,
        asset_name,
        asset_detail_id,
        asset_detail:e_asset_detail!asset_detail_id(
          id,
          area:e_asset_area(name),
          ims_general:i_ims_general!asset_detail_id(
            id,
            ims_asset_type_id
          )
        ),
        system:e_system(system_name),
        asset_status:e_asset_status(name)
      `
      )
      .not("asset_detail_id", "is", null)
      .order("asset_no");

    if (error) {
      throw new Error(`Error fetching integrity assets: ${error.message}`);
    }

    // Filter assets that have integrity records with the specified ims_asset_type_id
    const filteredData = (data || [])
      .filter((asset) => {
        const imsGeneral = asset.asset_detail?.ims_general;
        return (
          imsGeneral &&
          Array.isArray(imsGeneral) &&
          imsGeneral.length > 0 &&
          imsGeneral.some(
            (record: any) => record.ims_asset_type_id === imsAssetTypeId
          )
        );
      })
      .map((asset) => ({
        id: asset.id,
        asset_no: asset.asset_no,
        asset_name: asset.asset_name,
        area: asset.asset_detail?.area?.name || null,
        system: asset.system?.system_name || null,
        status: asset.asset_status?.name || null,
        asset_detail_id: asset.asset_detail_id,
        ims_asset_type_id: imsAssetTypeId,
      }));

    return filteredData;
  },

  /**
   * Get pressure vessel assets (ims_asset_type_id = 1)
   */
  async getPressureVesselAssets(): Promise<IntegrityAsset[]> {
    return this.getIntegrityAssets(1);
  },

  /**
   * Get piping assets (ims_asset_type_id = 2)
   */
  async getPipingAssets(): Promise<IntegrityAsset[]> {
    return this.getIntegrityAssets(2);
  },

  /**
   * Get integrity asset by ID with full details
   */
  async getIntegrityAssetById(id: number): Promise<IntegrityAsset | null> {
    const { data, error } = await supabase
      .from("e_asset")
      .select(
        `
        id,
        asset_no,
        asset_name,
        asset_detail_id,
        asset_detail:e_asset_detail!asset_detail_id(
          id,
          area:e_asset_area(name),
          ims_general:i_ims_general!asset_detail_id(
            id,
            ims_asset_type_id
          )
        ),
        system:e_system(system_name),
        asset_status:e_asset_status(name)
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error fetching integrity asset: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    const imsGeneral = data.asset_detail?.ims_general;
    const imsAssetTypeId =
      Array.isArray(imsGeneral) && imsGeneral.length > 0
        ? imsGeneral[0].ims_asset_type_id
        : null;

    return {
      id: data.id,
      asset_no: data.asset_no,
      asset_name: data.asset_name,
      area: data.asset_detail?.area?.name || null,
      system: data.system?.system_name || null,
      status: data.asset_status?.name || null,
      asset_detail_id: data.asset_detail_id,
      ims_asset_type_id: imsAssetTypeId || 0,
    };
  },

  async getVesselData(id: number): Promise<any | null> {
    const { data, error } = await supabase
      .from("e_asset")
      .select(
        `
        id,
        asset_no,
        asset_name,
        asset_detail_id,
        asset_detail:e_asset_detail!asset_detail_id(
          id,
          area:e_asset_area(name),
          ims_general:i_ims_general!asset_detail_id(
            id,
            ims_asset_type_id,
            year_in_service,
            tmin,
            material_construction_id,
            description,
            normal_wall_thickness,
            insulation,
            line_h2s,
            internal_lining,
            pwht,
            cladding,
            inner_diameter,
            clad_thickness
          ),
          ims_design:i_ims_design!asset_detail_id(
            outer_diameter,
            internal_diameter,
            length,
            welding_efficiency,
            design_temperature,
            operating_temperature,
            design_pressure,
            operating_pressure_mpa,
            allowable_stress_mpa,
            corrosion_allowance,
            ext_env_id,
            geometry_id,
            pipe_support,
            soil_water_interface,
            dead_legs,
            mix_point
          ),
          ims_protection:i_ims_protection!asset_detail_id(
            coating_quality_id,
            insulation_type_id,
            insulation_complexity_id,
            insulation_condition_id,
            design_fabrication_id,
            interface_id,
            lining_type,
            lining_condition,
            lining_monitoring,
            online_monitor
          ),
          ims_service:i_ims_service!asset_detail_id(
            fluid_representive_id,
            toxicity_id,
            fluid_phase_id,
            toxic_mass_fraction
          )
        ),
        system:e_system(system_name),
        asset_status:e_asset_status(name)
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error fetching integrity asset: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    const imsGeneral = Array.isArray(data.asset_detail?.ims_general)
      ? data.asset_detail.ims_general[0]
      : data.asset_detail?.ims_general;

    const imsDesign = Array.isArray(data.asset_detail?.ims_design)
      ? data.asset_detail.ims_design[0]
      : data.asset_detail?.ims_design;

    const imsProtection = Array.isArray(data.asset_detail?.ims_protection)
      ? data.asset_detail.ims_protection[0]
      : data.asset_detail?.ims_protection;

    const imsService = Array.isArray(data.asset_detail?.ims_service)
      ? data.asset_detail.ims_service[0]
      : data.asset_detail?.ims_service;

    return {
      general: {
        id: imsGeneral?.id || 0,
        asset_detail_id: data.asset_detail_id,
        year_in_service: imsGeneral?.year_in_service || null,
        tmin: imsGeneral?.tmin || null,
        material_construction_id: imsGeneral?.material_construction_id || 0,
        description: imsGeneral?.description || null,
        normal_wall_thickness: imsGeneral?.normal_wall_thickness || 0,
        insulation: imsGeneral?.insulation || false,
        line_h2s: imsGeneral?.line_h2s || false,
        internal_lining: imsGeneral?.internal_lining || false,
        pwht: imsGeneral?.pwht || false,
        cladding: imsGeneral?.cladding || false,
        inner_diameter: imsGeneral?.inner_diameter || 0,
        clad_thickness: imsGeneral?.clad_thickness || 0,
      },
      design: {
        outer_diameter: imsDesign?.outer_diameter || 0,
        internal_diameter: imsDesign?.internal_diameter || 0,
        length: imsDesign?.length || 0,
        welding_efficiency: imsDesign?.welding_efficiency || 0,
        design_temperature: imsDesign?.design_temperature || 0,
        operating_temperature: imsDesign?.operating_temperature || 0,
        design_pressure: imsDesign?.design_pressure || 0,
        operating_pressure_mpa: imsDesign?.operating_pressure_mpa || 0,
        allowable_stress_mpa: imsDesign?.allowable_stress_mpa || 0,
        corrosion_allowance: imsDesign?.corrosion_allowance || 0,
        ext_env_id: imsDesign?.ext_env_id || 0,
        geometry_id: imsDesign?.geometry_id || 0,
        pipe_support: imsDesign?.pipe_support || false,
        soil_water_interface: imsDesign?.soil_water_interface || false,
        dead_legs: imsDesign?.dead_legs || false,
        mix_point: imsDesign?.mix_point || false,
      },
      protection: {
        coating_quality_id: imsProtection?.coating_quality_id || 0,
        insulation_type_id: imsProtection?.insulation_type_id || 0,
        insulation_complexity_id: imsProtection?.insulation_complexity_id || 0,
        insulation_condition_id: imsProtection?.insulation_condition_id || 0,
        design_fabrication_id: imsProtection?.design_fabrication_id || 0,
        interface_id: imsProtection?.interface_id || 0,
        lining_type: imsProtection?.lining_type || null,
        lining_condition: imsProtection?.lining_condition || null,
        lining_monitoring: imsProtection?.lining_monitoring || null,
        online_monitor: imsProtection?.online_monitor || 0,
      },
      service: {
        fluid_representive_id: imsService?.fluid_representive_id || 0,
        toxicity_id: imsService?.toxicity_id || 0,
        fluid_phase_id: imsService?.fluid_phase_id || 0,
        toxic_mass_fraction: imsService?.toxic_mass_fraction || 0,
      },
      assetDetail: {
        equipment_tag: data.asset_no,
        component_type: "Pressure Vessel", // You might want to make this dynamic
        area: data.asset_detail?.area?.name || null,
        system: data.system?.system_name || null,
      },
    };
  },

  async updateVesselData(assetId: number, payload: any): Promise<void> {
    // Fetch asset_detail_id for this asset
    const { data: asset, error: assetError } = await supabase
      .from("e_asset")
      .select("asset_detail_id")
      .eq("id", assetId)
      .single();

    if (assetError || !asset?.asset_detail_id) {
      throw new Error("Could not find asset_detail_id for this asset.");
    }
    const assetDetailId = asset.asset_detail_id;

    // Update i_ims_general
    if (payload.general) {
      const { error } = await supabase
        .from("i_ims_general")
        .update({
          year_in_service: payload.general.year_in_service,
          material_construction_id: payload.general.material_construction_id,
          tmin: payload.general.tmin,
          description: payload.general.description,
          normal_wall_thickness: payload.general.normal_wall_thickness,
          insulation: payload.general.insulation,
          line_h2s: payload.general.line_h2s,
          internal_lining: payload.general.internal_lining,
          pwht: payload.general.pwht,
          cladding: payload.general.cladding,
          inner_diameter: payload.general.inner_diameter,
          clad_thickness: payload.general.clad_thickness,
        })
        .eq("asset_detail_id", assetDetailId);
      if (error) throw new Error(`Failed to update general: ${error.message}`);
    }

    // Update i_ims_design
    if (payload.design) {
      const { error } = await supabase
        .from("i_ims_design")
        .update({
          outer_diameter: payload.design.outer_diameter,
          internal_diameter: payload.design.internal_diameter,
          length: payload.design.length,
          welding_efficiency: payload.design.welding_efficiency,
          design_temperature: payload.design.design_temperature,
          operating_temperature: payload.design.operating_temperature,
          design_pressure: payload.design.design_pressure,
          operating_pressure_mpa: payload.design.operating_pressure_mpa,
          allowable_stress_mpa: payload.design.allowable_stress_mpa,
          corrosion_allowance: payload.design.corrosion_allowance,
          ext_env_id: payload.design.ext_env_id,
          geometry_id: payload.design.geometry_id,
          pipe_support: payload.design.pipe_support,
          soil_water_interface: payload.design.soil_water_interface,
          dead_legs: payload.design.dead_legs,
          mix_point: payload.design.mix_point,
        })
        .eq("asset_detail_id", assetDetailId);
      if (error) throw new Error(`Failed to update design: ${error.message}`);
    }

    // Update i_ims_protection
    if (payload.protection) {
      const { error } = await supabase
        .from("i_ims_protection")
        .update({
          coating_quality_id: payload.protection.coating_quality_id,
          insulation_type_id: payload.protection.insulation_type_id,
          insulation_complexity_id: payload.protection.insulation_complexity_id,
          insulation_condition_id: payload.protection.insulation_condition_id,
          design_fabrication_id: payload.protection.design_fabrication_id,
          interface_id: payload.protection.interface_id,
          lining_type: payload.protection.lining_type,
          lining_condition: payload.protection.lining_condition,
          lining_monitoring: payload.protection.lining_monitoring,
          online_monitor: payload.protection.online_monitor,
        })
        .eq("asset_detail_id", assetDetailId);
      if (error)
        throw new Error(`Failed to update protection: ${error.message}`);
    }

    // Update i_ims_service
    if (payload.service) {
      const { error } = await supabase
        .from("i_ims_service")
        .update({
          fluid_representive_id: payload.service.fluid_representive_id,
          toxicity_id: payload.service.toxicity_id,
          fluid_phase_id: payload.service.fluid_phase_id,
          toxic_mass_fraction: payload.service.toxic_mass_fraction,
        })
        .eq("asset_detail_id", assetDetailId);
      if (error) throw new Error(`Failed to update service: ${error.message}`);
    }
  },
};
