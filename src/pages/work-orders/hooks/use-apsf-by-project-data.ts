// import { supabase } from "@/lib/supabaseClient";
// import { useQuery } from "@tanstack/react-query";

// export const useAssetData = () => {
//   return useQuery({
//     queryKey: ["e-asset-data", 34], // Include project ID in the query key for caching
//     queryFn: async () => {
//       // Fetch project data
//       const { data: projects, error: projectError } = await supabase
//         .from("e_project")
//         .select("id, project_code, project_name")
//         .eq("id", 34); // Filter by project ID

//       if (projectError) {
//         console.error("Error fetching e_project data:", projectError);
//         throw projectError;
//       }

//       if (!projects || projects.length === 0) {
//         return [];
//       }

//       const project = projects[0]; // There should only be one project with ID 21

//       // Fetch facility data
//       const { data: facilities, error: facilityError } = await supabase
//         .from("e_facility")
//         .select("id, location_code, location_name, project_id")
//         .eq("project_id", project.id); // Filter by project ID

//       if (facilityError) {
//         console.error("Error fetching e_facility data:", facilityError);
//         throw facilityError;
//       }

//       // Fetch system data
//       const { data: systems, error: systemError } = await supabase
//         .from("e_system")
//         .select("id, system_code, system_no, system_name, facility_id")
//         .in(
//           "facility_id",
//           facilities.map((facility) => facility.id)
//         ); // Filter by facility IDs

//       if (systemError) {
//         console.error("Error fetching e_system data:", systemError);
//         throw systemError;
//       }

//       // Fetch package data
//       const { data: packages, error: packageError } = await supabase
//         .from("e_package")
//         .select("id, package_name, package_no, package_tag, system_id")
//         .in(
//           "system_id",
//           systems.map((system) => system.id)
//         ); // Filter by system Codes

//       if (packageError) {
//         console.error("Error fetching e_package data:", packageError);
//         throw packageError;
//       }

//       // Fetch asset data
//       const { data: assets, error: assetError } = await supabase
//         .from("e_asset")
//         .select("id, asset_name, asset_no, asset_sce_id (id, sce_code), package_id")
//         .in(
//           "package_id",
//           packages.map((pkg) => pkg.id)
//         ); // Filter by package IDs

//       if (assetError) {
//         console.error("Error fetching e_asset data:", assetError);
//         throw assetError;
//       }

//       // Map the data into the desired structure
//       const transformedData = {
//         id: project.id,
//         project_code: project.project_code,
//         project_name: project.project_name,
//         facilities: facilities.map((facility) => ({
//           id: facility.id,
//           location_code: facility.location_code,
//           location_name: facility.location_name,
//           systems: systems
//             .filter((system) => system.facility_id === facility.id)
//             .map((system) => ({
//               id: system.id,
//               system_code: system.system_code,
//               system_no: system.system_no,
//               system_name: system.system_name,
//               packages: packages
//                 .filter((pkg) => pkg.system_id === system.id)
//                 .map((pkg) => ({
//                   id: pkg.id,
//                   package_name: pkg.package_name,
//                   package_no: pkg.package_no,
//                   package_tag: pkg.package_tag,
//                   assets: assets
//                     .filter((asset) => asset.package_id === pkg.id)
//                     .map((asset) => ({
//                       id: asset.id,
//                       asset_name: asset.asset_name,
//                       asset_no: asset.asset_no,
//                       asset_sce_id: asset.asset_sce_id,
//                     })),
//                 })),
//             })),
//         })),
//       };

//       return [transformedData];
//     },
//   });
// };

import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useAssetData = () => {
  return useQuery({
    queryKey: ["e-asset-data"], // Removed project ID from query key
    queryFn: async () => {
      // Fetch facility data
      const { data: facilities, error: facilityError } = await supabase
        .from("e_facility")
        .select("id, location_code, location_name");

      if (facilityError) {
        console.error("Error fetching e_facility data:", facilityError);
        throw facilityError;
      }

      // Fetch system data
      const { data: systems, error: systemError } = await supabase
        .from("e_system")
        .select("id, system_code, system_no, system_name, facility_id")
        .in(
          "facility_id",
          facilities.map((facility) => facility.id)
        ); // Filter by facility IDs

      if (systemError) {
        console.error("Error fetching e_system data:", systemError);
        throw systemError;
      }

      // Fetch package data
      const { data: packages, error: packageError } = await supabase
        .from("e_package")
        .select("id, package_name, package_no, package_tag, system_id")
        .in(
          "system_id",
          systems.map((system) => system.id)
        ); // Filter by system Codes

      if (packageError) {
        console.error("Error fetching e_package data:", packageError);
        throw packageError;
      }

      // Fetch asset data
      const { data: assets, error: assetError } = await supabase
        .from("e_asset")
        .select(
          "id, asset_name, asset_no, asset_sce_id (id, sce_code), package_id"
        )
        .in(
          "package_id",
          packages.map((pkg) => pkg.id)
        ); // Filter by package IDs

      if (assetError) {
        console.error("Error fetching e_asset data:", assetError);
        throw assetError;
      }

      // Return raw data without transformation
      return {
        facilities,
        systems,
        packages,
        assets,
      };
    },
  });
};
