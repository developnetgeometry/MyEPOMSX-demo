import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

// export const useImsGeneralData = () => {
//   return useQuery({
//     queryKey: ["i-ims-general-data"],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("i_ims_general")
//         .select(`
//           id,
//           line_no,
//           pipe_schedule_id,
//           pressure_rating,
//           year_in_service,
//           normal_wall_thickness,
//           tmin,
//           material_construction_id,
//           description,
//           circuit_id,
//           nominal_bore_diameter,
//           insulation,
//           line_h2s,
//           internal_lining,
//           pwht,
//           cladding,
//           asset_detail_id (asset_id (id, asset_no, asset_name), type_id (id, name)),
//           ims_asset_type_id,
//           inner_diameter,
//           clad_thickness,
//           pipe_class_id
//         `)
//         .order("id", { ascending: false });

//       if (error) {
//         console.error("Error fetching i_ims_general data:", error);
//         throw error;
//       }

//       return data;
//     },
//   });
// };

export const useImsGeneralData = () => {
  return useQuery({
    queryKey: ["i-ims-general-data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("i_ims_general")
        .select(`
    id,
    line_no,
    pipe_schedule_id,
    pressure_rating,
    year_in_service,
    normal_wall_thickness,
    tmin,
    material_construction_id,
    description,
    circuit_id,
    nominal_bore_diameter,
    insulation,
    line_h2s,
    internal_lining,
    pwht,
    cladding,

    asset_detail:e_asset_detail!i_ims_general_e_asset_detail_fk (
      id,
      type:type_id (id, name),

      asset:e_asset!e_asset_detail_asset_id_key (
        id,
        asset_no,
        asset_name
      )
    ),

    ims_asset_type_id,
    inner_diameter,
    clad_thickness,
    pipe_class_id
  `)
        .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching i_ims_general data:", error);
        throw error;
      }

      // Map the data to include PoF, CoF, and Risk with default values
      const mappedData = data?.map((item) => ({
        ...item,
        PoF: "D", // Default value for PoF
        CoF: 0, // Default value for CoF
        Risk: "Medium", // Default value for Risk
      }));

      return mappedData;
    },
  });
};

export const insertImsGeneralData = async (generalData: {
  line_no?: string;
  pipe_schedule_id?: number;
  pressure_rating?: number;
  year_in_service?: string; // Use ISO string format for dates
  normal_wall_thickness?: number;
  tmin?: string;
  material_construction_id?: number;
  description?: string;
  circuit_id?: number;
  nominal_bore_diameter?: number;
  insulation?: boolean;
  line_h2s?: boolean;
  internal_lining?: boolean;
  pwht?: boolean;
  cladding?: boolean;
  asset_detail_id?: number;
  ims_asset_type_id?: number;
  inner_diameter?: number;
  clad_thickness?: number;
  pipe_class_id?: number;
}) => {
  try {
    const { data, error } = await supabase
      .from("i_ims_general")
      .insert([generalData]);

    if (error) {
      console.error("Error inserting i_ims_general data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error inserting i_ims_general data:", err);
    throw err;
  }
};

export const updateImsGeneralData = async (
  id: number,
  updatedData: Partial<{
    line_no?: string;
    pipe_schedule_id?: number;
    pressure_rating?: number;
    year_in_service?: string; // Use ISO string format for dates
    normal_wall_thickness?: number;
    tmin?: string;
    material_construction_id?: number;
    description?: string;
    circuit_id?: number;
    nominal_bore_diameter?: number;
    insulation?: boolean;
    line_h2s?: boolean;
    internal_lining?: boolean;
    pwht?: boolean;
    cladding?: boolean;
    asset_detail_id?: number;
    ims_asset_type_id?: number;
    inner_diameter?: number;
    clad_thickness?: number;
    pipe_class_id?: number;
  }>
) => {
  try {
    const { data, error } = await supabase
      .from("i_ims_general")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      console.error("Error updating i_ims_general data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error updating i_ims_general data:", err);
    throw err;
  }
};

export const deleteImsGeneralData = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("i_ims_general")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting i_ims_general data:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error deleting i_ims_general data:", err);
    throw err;
  }
};