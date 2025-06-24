export interface CorrosionStudyDTO {
  asset_id: string;
  corrosion_group_name: string;
  material_construction: string;
  environment: string;
  ph: number | null;
  corrosion_monitoring: string[];
  internal_damage_mechanism: string;
  external_damage_mechanism: string;
  expected_internal_corrosion_rate: number | null;
  expected_external_corrosion_rate: number | null;
  has_h2s: boolean;
  has_co2: boolean;
  description: string;
  corrosion_factors: {
    temperature: number | null;
    pressure: number | null;
    h2s_concentration: string;
    co2_concentration: string;
    base_material: string;
    fluid_velocity: string;
  };
}

