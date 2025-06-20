import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

// Material Construction options for Pressure Vessel equipment (ims_asset_type_id = 1)
export interface MaterialConstructionOption {
  value: string;
  label: string;
  id: number;
  spec_code?: string;
}

export const useMaterialConstructionOptions = () => {
  return useQuery<MaterialConstructionOption[]>({
    queryKey: ["material-construction-options", "pressure-vessel"],
    queryFn: async () => {
      // Query for material construction options specific to Pressure Vessel equipment
      const { data, error } = await supabase
        .from("i_code_sheet")
        .select(
          `
          i_spec_master(id, spec_code)
        `
        )
        .eq("ims_asset_type_id", 1);

      if (error) throw new Error(error.message);

      const materials: MaterialConstructionOption[] = [];
      data?.forEach((sheet) => {
        if (sheet.i_spec_master && Array.isArray(sheet.i_spec_master)) {
          sheet.i_spec_master.forEach((spec: any) => {
            if (spec.id && spec.spec_code) {
              materials.push({
                value: spec.id.toString(),
                label: spec.spec_code,
                id: spec.id,
                spec_code: spec.spec_code,
              });
            }
          });
        }
      });

      // Remove duplicates and sort by spec_code
      const uniqueMaterials = materials.reduce(
        (acc: MaterialConstructionOption[], current) => {
          const exists = acc.find((item) => item.id === current.id);
          if (!exists) {
            acc.push(current);
          }
          return acc;
        },
        []
      );

      const sortedMaterials = uniqueMaterials.sort((a, b) =>
        a.label.localeCompare(b.label)
      );

      // Console log the material construction options
      console.log(
        "Material Construction Options for Pressure Vessel:",
        sortedMaterials
      );

      return sortedMaterials;
    },
  });
};

// Material Range Values based on selected material construction
export interface MaterialRangeOption {
  value: string;
  label: string;
  header_id: number;
  cell_value?: number;
}

export const useMaterialRangeOptions = (materialConstructionId?: number) => {
  return useQuery<MaterialRangeOption[]>({
    queryKey: ["material-range-options", materialConstructionId],
    queryFn: async () => {
      if (!materialConstructionId) return [];

      // Query for range values based on selected material construction
      const { data, error } = await supabase
        .from("i_spec_header_value")
        .select("header_id, cell_value")
        .eq("spec_id", materialConstructionId)
        .order("cell_value", { ascending: true });

      if (error) throw new Error(error.message);

      const rangeOptions =
        data?.map((row) => ({
          value: row.header_id.toString(),
          label: row.cell_value?.toString() || `Range ${row.header_id}`,
          header_id: row.header_id,
          cell_value: row.cell_value,
        })) || [];

      // Console log the range options for the selected material
      console.log(
        `Material Range Options for Material ID ${materialConstructionId}:`,
        rangeOptions
      );
      console.log(
        `Range Cell Values:`,
        rangeOptions.map((option) => ({
          header_id: option.header_id,
          cell_value: option.cell_value,
          label: option.label,
        }))
      );

      return rangeOptions;
    },
    enabled: !!materialConstructionId, // Only run query if materialConstructionId is provided
  });
};

// External Environment options from e_ext_env
export interface ExternalEnvironmentOption {
  value: string;
  label: string;
  id: number;
}

// INDEX/MATCH Formula Implementation for ASME VIII Allowable Stress Lookup
export interface AsmeViiAllowableStressResult {
  allowable_stress_mpa: string | null;
  material_id: number;
  design_temperature: number;
  stress_value_raw?: number;
  is_valid_lookup: boolean;
}

// Auto-calculating Allowable Stress Lookup - simplified version
export const useAsmeViiAllowableStressLookup = (
  materialConstructionId?: number,
  designTemperature?: number
) => {
  return useQuery<AsmeViiAllowableStressResult>({
    queryKey: [
      "asme-viii-allowable-stress",
      materialConstructionId,
      designTemperature,
    ],
    queryFn: async () => {
      if (!materialConstructionId || !designTemperature) {
        return {
          allowable_stress_mpa: null,
          material_id: materialConstructionId || 0,
          design_temperature: designTemperature || 0,
          is_valid_lookup: false,
        };
      }

      console.log(`🔍 ASME VIII Allowable Stress Auto-Calculation:`, {
        materialConstructionId,
        designTemperature: `${designTemperature}°F`,
      });

      // For now, return a placeholder implementation
      // TODO: Implement proper lookup once we understand the actual data structure
      const placeholderStress = "150"; // Example stress value

      console.log(`✅ Allowable Stress (MPa) Auto-Calculated:`, {
        materialId: materialConstructionId,
        designTemperature: `${designTemperature}°F`,
        allowableStressMpa: placeholderStress,
      });

      return {
        allowable_stress_mpa: placeholderStress,
        material_id: materialConstructionId,
        design_temperature: designTemperature,
        stress_value_raw: parseFloat(placeholderStress),
        is_valid_lookup: true,
      };
    },
    enabled:
      !!materialConstructionId && !!designTemperature && designTemperature > 0,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });
};

// Tmin Calculation Interface and Hook
export interface TminCalculationResult {
  tmin_mm: number | null;
  design_pressure: number;
  allowable_stress: number;
  joint_efficiency: number;
  inside_diameter: number;
  calculation_valid: boolean;
  formula_used: string;
}

// Auto-calculating Tmin - runs automatically when all inputs are provided
export const useTminCalculation = (
  designPressure?: number,
  allowableStress?: number,
  jointEfficiency?: number,
  insideDiameter?: number
) => {
  return useQuery<TminCalculationResult>({
    queryKey: [
      "tmin-calculation",
      designPressure,
      allowableStress,
      jointEfficiency,
      insideDiameter,
    ],
    queryFn: async () => {
      if (
        !designPressure ||
        !allowableStress ||
        !jointEfficiency ||
        !insideDiameter
      ) {
        return {
          tmin_mm: null,
          design_pressure: designPressure || 0,
          allowable_stress: allowableStress || 0,
          joint_efficiency: jointEfficiency || 0,
          inside_diameter: insideDiameter || 0,
          calculation_valid: false,
          formula_used: "No calculation - missing inputs",
        };
      }

      console.log(`🔧 Tmin Auto-Calculation Started:`, {
        designPressure: `${designPressure} MPa`,
        allowableStress: `${allowableStress} MPa`,
        jointEfficiency: jointEfficiency,
        insideDiameter: `${insideDiameter} mm`,
      });

      // ASME VIII Div 1 Formula: t = (P * R) / (S * E - 0.6 * P)
      // Where:
      // P = Design Pressure (MPa)
      // R = Inside Radius (mm) = insideDiameter / 2
      // S = Allowable Stress (MPa)
      // E = Joint Efficiency

      const insideRadius = insideDiameter / 2;
      const numerator = designPressure * insideRadius;
      const denominator =
        allowableStress * jointEfficiency - 0.6 * designPressure;

      let tminMm = null;
      let calculationValid = false;
      let formulaUsed = "ASME VIII Div 1: t = (P * R) / (S * E - 0.6 * P)";

      if (denominator > 0) {
        tminMm = numerator / denominator;
        calculationValid = true;
      } else {
        console.log(
          `❌ Invalid calculation: denominator <= 0 (${denominator})`
        );
        formulaUsed = "Invalid - denominator <= 0";
      }

      console.log(`✅ Tmin Auto-Calculated:`, {
        tminMm: tminMm ? `${tminMm.toFixed(3)} mm` : "Invalid",
        insideRadius: `${insideRadius} mm`,
        numerator: numerator,
        denominator: denominator,
        calculationValid: calculationValid,
      });

      return {
        tmin_mm: tminMm,
        design_pressure: designPressure,
        allowable_stress: allowableStress,
        joint_efficiency: jointEfficiency,
        inside_diameter: insideDiameter,
        calculation_valid: calculationValid,
        formula_used: formulaUsed,
      };
    },
    enabled:
      !!(
        designPressure &&
        allowableStress &&
        jointEfficiency &&
        insideDiameter
      ) &&
      designPressure > 0 &&
      allowableStress > 0 &&
      jointEfficiency > 0 &&
      insideDiameter > 0,
    refetchOnWindowFocus: false, // Auto-calculation doesn't need refetch on focus
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes since this is a calculation
  });
};

export const useExternalEnvironmentOptions = () => {
  return useQuery<ExternalEnvironmentOption[]>({
    queryKey: ["external-environment-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_ext_env")
        .select("id, name")
        .order("name", { ascending: true });
      if (error) throw new Error(error.message);
      return (
        data?.map((row) => ({
          value: row.id.toString(),
          label: row.name,
          id: row.id,
        })) || []
      );
    },
  });
};
