import { supabase } from "@/lib/supabaseClient";

export const corrosionStudyService = {
  async getCorrosionStudies() {
    const { data, error } = await supabase
      .from("i_corrosion_study")
      .select(
        "*, system:e_system(id, system_name), asset:e_asset(id, asset_name)"
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Error fetching corrosion studies: ${error.message}`);
    }

    return data.map((study) => ({
      id: study.id,
      system: study.system?.system_name || "Unknown",
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
        "*, system:e_system(id, system_name), asset:e_asset(id, asset_name), corrosion_factor: i_corrosion_factor(*)"
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

  async addCorrosionStudy(study: {
    system: string;
    asset_id: number;
    studyName: string;
    dateConducted: string;
    corrosionRate: number;
    notes?: string;
  }) {
    // Map the input to match the DB schema
    const dbStudy = {
      asset_id: study.asset_id,
      study_name: study.studyName,
      date_conducted: study.dateConducted,
      corrosion_rate: study.corrosionRate,
      notes: study.notes,
      system: study.system,
    };

    const { data, error } = await supabase
      .from("i_corrosion_study")
      .insert([dbStudy])
      .single();

    if (error) {
      throw new Error(`Error adding corrosion study: ${error.message}`);
    }

    return data;
  },

  async updateCorrosionStudy(id: number) {
    const { data, error } = await supabase
      .from("i_corrosion_study")
      .update({})
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(
        `Error updating corrosion study with ID ${id}: ${error.message}`
      );
    }

    return data;
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
    }));
  },
  async getCorrosionGroupOptions() {
    const { data, error } = await supabase.from("i_corrosion_group").select("*");

    if (error) {
      throw new Error(`Error fetching corrosion studies: ${error.message}`);
    }

    return data.map((corrosionGroup) => ({
      value: corrosionGroup.id,
      label: corrosionGroup.name,
    }))
  },

  async getMaterialConstructionOptions() {
    const { data, error } = await supabase.from("i_material_construction").select("*");

    if (error) {
      throw new Error(`Error fetching corrosion studies: ${error.message}`);
    }

    return data.map((materialConstruction) => ({
      value: materialConstruction.id,
      label: materialConstruction.name,
    }))
  },

  async getCorrosionMonitoringOptions() {
    const { data, error } = await supabase.from("i_corrosion_monitoring").select("*");

    if (error) {
      throw new Error(`Error fetching corrosion studies: ${error.message}`);
    }

    return data.map((corrosionMonitoring) => ({
      value: corrosionMonitoring.id,
      label: corrosionMonitoring.name,
    }))
  },
  async getBaseMaterialOptions() {
    const { data, error } = await supabase.from("i_material_construction").select("*");

    if (error) {
      throw new Error(`Error fetching corrosion studies: ${error.message}`);
    }

    return data.map((baseMaterial) => ({
      value: baseMaterial.id,
      label: baseMaterial.name,
    }))
  }
};
