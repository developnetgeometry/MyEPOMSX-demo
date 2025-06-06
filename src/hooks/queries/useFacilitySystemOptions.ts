import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export interface FacilityOption {
  value: string;
  label: string;
  id: number;
}

export const useFacilityOptions = () => {
  return useQuery<FacilityOption[]>({
    queryKey: ["facility-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_facility")
        .select("id, location_name");
      if (error) throw new Error(error.message);
      return (
        data?.map((row) => ({
          value: row.id,
          label: row.location_name,
          id: row.id,
        })) || []
      );
    },
  });
};

export interface SystemOption {
  value: string;
  label: string;
  id: number;
  facility_id: number;
}

export const useSystemOptionsByFacility = (facilityId?: string | number) => {
  return useQuery<SystemOption[]>({
    queryKey: ["system-options", facilityId],
    queryFn: async () => {
      if (!facilityId) return [];
      const { data, error } = await supabase
        .from("e_system")
        .select("id, system_name, facility_id")
        .eq("facility_id", facilityId);
      if (error) throw new Error(error.message);
      return (
        data?.map((row) => ({
          value: row.id,
          label: row.system_name,
          id: row.id,
          facility_id: row.facility_id,
        })) || []
      );
    },
    enabled: !!facilityId,
  });
};

export interface PackageOption {
  value: string;
  label: string;
  id: number;
  system_id: number;
  package_no: string;
  package_name: string;
}

export const usePackageOptionsBySystem = (systemId?: string | number) => {
  return useQuery<PackageOption[]>({
    queryKey: ["package-options", systemId],
    queryFn: async () => {
      if (!systemId) return [];
      const { data, error } = await supabase
        .from("e_package")
        .select("id, package_no, package_name, system_id")
        .eq("system_id", systemId);
      if (error) throw new Error(error.message);
      return (
        data?.map((row) => ({
          value: row.id,
          label: `${row.package_no} - ${row.package_name}`,
          id: row.id,
          system_id: row.system_id,
          package_no: row.package_no,
          package_name: row.package_name,
        })) || []
      );
    },
    enabled: !!systemId,
  });
};
