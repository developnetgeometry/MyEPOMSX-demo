import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { packageService } from "@/services/packageService";
import { Package, PackageType, System } from "@/types/manage";
import { supabase } from "@/lib/supabaseClient";

export const packageKeys = {
  all: ["packages"] as const,
  lists: () => [...packageKeys.all, "list"] as const,
  details: () => [...packageKeys.all, "detail"] as const,
  detail: (id: number) => [...packageKeys.details(), id] as const,
};

// System keys
export const systemKeys = {
  all: ["systems"] as const,
  lists: () => [...systemKeys.all, "list"] as const,
  details: () => [...systemKeys.all, "detail"] as const,
  detail: (id: number) => [...systemKeys.details(), id] as const,
};

// Package type keys
export const packageTypeKeys = {
  all: ["packageTypes"] as const,
  lists: () => [...packageTypeKeys.all, "list"] as const,
};

// Simple query to get all packages
export const usePackages = () => {
  return useQuery({
    queryKey: packageKeys.lists(),
    queryFn: () => packageService.getPackages(),
  });
};

// Get single package by ID
export const usePackage = (id: number) => {
  return useQuery({
    queryKey: packageKeys.detail(id),
    queryFn: () => packageService.getPackageById(id),
    enabled: !!id,
  });
};

// Create new package
export const useAddPackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newPackage: Omit<Package, "id">) =>
      packageService.createPackage(newPackage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: packageKeys.lists() });
    },
  });
};

// Update existing package
export const useUpdatePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (pkg: Package) => {
      const { data, error } = await supabase
        .from("e_package")
        .update({
          package_no: pkg.package_no,
          package_name: pkg.package_name,
          package_tag: pkg.package_tag,
          system_id: pkg.system_id,
          package_type_id: pkg.package_type_id,
        })
        .eq("id", pkg.id)
        .select()
        .single();
      if (error) throw error;
      return data as Package;
    },
    onSuccess: (updatedPackage) => {
      queryClient.invalidateQueries({
        queryKey: packageKeys.detail(updatedPackage.id)
      });
      queryClient.invalidateQueries({ queryKey: packageKeys.lists() });
    },
  });
};

// Delete package
export const useDeletePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => packageService.deletePackage(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: packageKeys.lists() });
      queryClient.invalidateQueries({ queryKey: packageKeys.detail(id) });
    },
  });
};

// ========== SYSTEM HOOKS ==========

// Get all systems
export const useSystems = () => {
  return useQuery({
    queryKey: systemKeys.lists(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_system")
        .select("id, system_code, system_no, system_name, facility_id, is_active")
        .order("system_name");
      
      if (error) throw error;
      return data as System[];
    }
  });
};

// Get system by ID
export const useSystem = (id: number) => {
  return useQuery({
    queryKey: systemKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_system")
        .select("id, system_code, system_no, system_name, facility_id, is_active")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data as System;
    },
    enabled: !!id
  });
};

// ========== PACKAGE TYPE HOOKS ==========

// Get all package types
export const usePackageTypes = () => {
  return useQuery({
    queryKey: packageTypeKeys.lists(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_package_type")
        .select("id, name")
        .order("name");
      
      if (error) throw error;
      return data as PackageType[];
    }
  });
};