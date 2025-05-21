import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useAssetData = () => {
    return useQuery({
        queryKey: ["e-asset-data"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("e_asset")
                .select(`
                    id,
                    asset_name,
                    asset_no,
                    asset_sce_id (id, sce_code),
                    package_id (
                        id,
                        package_name,
                        package_no,
                        package_tag,
                        system_id (
                            id,
                            system_code,
                            system_no,
                            system_name,
                            facility_id (
                                id,
                                location_code,
                                location_name,
                                project_id (
                                    id,
                                    project_code,
                                    project_name
                                )
                            )
                        )
                    )
                `)
                .order("id", { ascending: false });

            if (error) {
                console.error("Error fetching nd_asset data:", error);
                throw error;
            }

            // Transform the data to match the requested structure
            const transformedData = data?.reduce((projects, asset) => {
                const project = asset.package_id?.system_id?.facility_id?.project_id;
                const facility = asset.package_id?.system_id?.facility_id;
                const system = asset.package_id?.system_id;
                const packageData = asset.package_id;

                if (!project) return projects;

                // Find or create the project
                let projectEntry = projects.find((p) => p.id === project.id);
                if (!projectEntry) {
                    projectEntry = {
                        id: project.id,
                        project_code: project.project_code,
                        project_name: project.project_name,
                        facilities: [],
                    };
                    projects.push(projectEntry);
                }

                // Find or create the facility
                let facilityEntry = projectEntry.facilities.find((f) => f.id === facility.id);
                if (!facilityEntry) {
                    facilityEntry = {
                        id: facility.id,
                        location_code: facility.location_code,
                        location_name: facility.location_name,
                        systems: [],
                    };
                    projectEntry.facilities.push(facilityEntry);
                }

                // Find or create the system
                let systemEntry = facilityEntry.systems.find((s) => s.id === system.id);
                if (!systemEntry) {
                    systemEntry = {
                        id: system.id,
                        system_code: system.system_code,
                        system_no: system.system_no,
                        system_name: system.system_name,
                        packages: [],
                    };
                    facilityEntry.systems.push(systemEntry);
                }

                // Find or create the package
                let packageEntry = systemEntry.packages.find((p) => p.id === packageData.id);
                if (!packageEntry) {
                    packageEntry = {
                        id: packageData.id,
                        package_name: packageData.package_name,
                        package_no: packageData.package_no,
                        package_tag: packageData.package_tag,
                        assets: [],
                    };
                    systemEntry.packages.push(packageEntry);
                }

                // Add the asset to the package
                packageEntry.assets.push({
                    id: asset.id,
                    asset_name: asset.asset_name,
                    asset_no: asset.asset_no,
                    asset_sce_id: asset.asset_sce_id,
                });

                return projects;
            }, []);

            return transformedData;
        },
    });
};