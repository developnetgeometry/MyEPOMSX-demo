import { supabase } from "@/lib/supabaseClient";

export type CorrosionFactorData = {
  temperature?: number | null;
  pressure?: number | null;
  h2s_concentration?: number | null;
  co2_concentration?: number | null;
  base_material_id?: number | null;
  fluid_velocity?: number | null;
};

export type CorrosionStudyData = {
  asset_id: number;
  asset_no?: string;
  asset_name?: string;
  corrosion_group_id: number;
  material_construction_id: number;
  external_environment_id: number;
  ph?: number | null;
  monitoring_method_id?: number | null;
  internal_damage_mechanism?: string | null;
  external_damage_mechanism?: string | null;
  expected_internal_corrosion_rate?: number | null;
  expected_external_corrosion_rate?: number | null;
  h2s_presence: boolean;
  co2_presence: boolean;
  description?: string | null;
  created_by: string;
  study_name: string;
  study_code: string;
  corrosion_factor_id?: number | null;
};

export type CorrosionFactorUpdateData = {
  temperature?: number | null;
  pressure?: number | null;
  h2s_concentration?: number | null;
  co2_concentration?: number | null;
  base_material_id?: number | null;
  fluid_velocity?: number | null;
};

export type CorrosionStudyUpdateData = {
  asset_id?: number;
  corrosion_group_id?: number;
  material_construction_id?: number;
  environment?: string;
  ph?: number | null;
  monitoring_method_id?: number | null;
  internal_damage_mechanism?: string | null;
  external_damage_mechanism?: string | null;
  expected_internal_corrosion_rate?: number | null;
  expected_external_corrosion_rate?: number | null;
  h2s_presence?: boolean;
  co2_presence?: boolean;
  description?: string | null;
  updated_by: string;
  study_name?: string;
  study_code?: string;
  corrosion_factor_id?: number | null;
};

export const corrosionStudyService = {
  async getCorrosionStudies() {
    const { data, error } = await supabase
      .from("i_corrosion_study")
      .select("*, asset:e_asset(id, asset_name)")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Error fetching corrosion studies: ${error.message}`);
    }

    return data.map((study) => ({
      id: study.id,
      asset_id: study.asset?.id || 0,
      assetName: study.asset?.asset_name || "Unknown",
      studyName: study.study_name || "Unknown",
      studyCode: study.study_code || "Unknown",
      corrosionRate:
        study.expected_external_corrosion_rate ||
        study.expected_internal_corrosion_rate ||
        0,
      notes: study.description || "",
      dateConducted: study.created_at,
    }));
  },

  async getCorrosionStudyById(id: number) {
    const { data, error } = await supabase
      .from("i_corrosion_study")
      .select(
        "*, asset:e_asset(id, asset_name), corrosion_factor: i_corrosion_factor(*)"
      )
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(
        `Error fetching corrosion study with ID ${id}: ${error.message}`
      );
    }

    return data;
  },

  async createCorrosionStudyWithFactor(
    studyData: CorrosionStudyData,
    factorData: CorrosionFactorData
  ) {
    let factorId: number | null = null;

    // Create corrosion factor first
    if (Object.values(factorData).some((val) => val !== null)) {
      const { data: factor, error: factorError } = await supabase
        .from("i_corrosion_factor")
        .insert([factorData])
        .select("id")
        .single();

      if (factorError)
        throw new Error(`Error creating factor: ${factorError.message}`);
      factorId = factor.id;
    }

    // Create corrosion study
    const studyRecord = {
      ...studyData,
      corrosion_factor_id: factorId,
    };

    const { data, error } = await supabase
      .from("i_corrosion_study")
      .insert([studyRecord])
      .select()
      .single();

    if (error) {
      // Clean up factor if study creation fails
      if (factorId) {
        await supabase.from("i_corrosion_factor").delete().eq("id", factorId);
      }
      throw new Error(`Error creating study: ${error.message}`);
    }

    return data;
  },

  async updateCorrosionStudy(
    id: number,
    studyData: CorrosionStudyUpdateData,
    factorData: CorrosionFactorUpdateData
  ) {
    const client = supabase;
    let factorId: number | null = studyData.corrosion_factor_id || null;

    try {
      // Start transaction
      await client.rpc("begin");

      // Update or create corrosion factor
      if (Object.values(factorData).some((val) => val !== null)) {
        if (factorId) {
          // Update existing factor
          const { error: factorError } = await client
            .from("i_corrosion_factor")
            .update(factorData)
            .eq("id", factorId);

          if (factorError) throw factorError;
        } else {
          // Create new factor
          const { data: newFactor, error: factorError } = await client
            .from("i_corrosion_factor")
            .insert([factorData])
            .select("id")
            .single();

          if (factorError) throw factorError;
          factorId = newFactor.id;
          studyData.corrosion_factor_id = factorId;
        }
      }

      // Update corrosion study
      const { data: updatedStudy, error: studyError } = await client
        .from("i_corrosion_study")
        .update({
          ...studyData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select("*")
        .single();

      if (studyError) throw studyError;

      // Commit transaction
      await client.rpc("commit");

      return updatedStudy;
    } catch (error) {
      // Rollback on error
      await client.rpc("rollback");
      throw new Error(`Error updating corrosion study: ${error.message}`);
    }
  },

  async deleteCorrosionStudy(id: number) {
    const { data, error } = await supabase
      .from("i_corrosion_study")
      .delete()
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(
        `Error deleting corrosion study with ID ${id}: ${error.message}`
      );
    }

    return data;
  },

  async getAssetOptions() {
    const { data, error } = await supabase.from("e_asset").select("*");

    if (error) {
      throw new Error(`Error fetching corrosion studies: ${error.message}`);
    }

    return data.map((asset) => ({
      value: asset.id,
      label: asset.asset_name,
      asset_name: asset.asset_name,
      asset_no: asset.asset_no,
    }));
  },
  async getCorrosionGroupOptions() {
    const { data, error } = await supabase
      .from("i_corrosion_group")
      .select("*");

    if (error) {
      throw new Error(`Error fetching corrosion studies: ${error.message}`);
    }

    return data.map((corrosionGroup) => ({
      value: corrosionGroup.id,
      label: corrosionGroup.name,
    }));
  },

  async getMaterialConstructionOptions() {
    const { data, error } = await supabase
      .from("i_material_construction")
      .select("*");

    if (error) {
      throw new Error(`Error fetching corrosion studies: ${error.message}`);
    }

    return data.map((materialConstruction) => ({
      value: materialConstruction.id,
      label: materialConstruction.name,
    }));
  },

  async getCorrosionMonitoringOptions() {
    const { data, error } = await supabase
      .from("i_corrosion_monitoring")
      .select("*");

    if (error) {
      throw new Error(`Error fetching corrosion studies: ${error.message}`);
    }

    return data.map((corrosionMonitoring) => ({
      value: corrosionMonitoring.id,
      label: corrosionMonitoring.name,
    }));
  },
  async getBaseMaterialOptions() {
    const { data, error } = await supabase
      .from("i_material_construction")
      .select("*");

    if (error) {
      throw new Error(`Error fetching corrosion studies: ${error.message}`);
    }

    return data.map((baseMaterial) => ({
      value: baseMaterial.id,
      label: baseMaterial.name,
    }));
  },
};
