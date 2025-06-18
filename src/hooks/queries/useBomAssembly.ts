import { bomAssemblyService } from "@/services/bomAssemblyService";
import { BomAssemblyUpdate, SparePart } from "@/types/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const BomAssemblyKeys = {
  all: ["bomAssembly"] as const,
  lists: () => [...BomAssemblyKeys.all, "list"] as const,
  list: (filters: any) => [...BomAssemblyKeys.lists(), { filters }] as const,
  details: () => [...BomAssemblyKeys.all, "detail"] as const,
  detail: (id: number) => [...BomAssemblyKeys.details(), id] as const,
};

export const useBomAssembly = () => {
  return useQuery({
    queryKey: BomAssemblyKeys.lists(),
    queryFn: () => bomAssemblyService.getBomAssemblies(),
  });
};

export const useBomAssemblyById = (id: number) => {
  return useQuery({
    queryKey: BomAssemblyKeys.detail(id),
    queryFn: () => bomAssemblyService.getBomAssemblyById(id),
    enabled: !!id,
  });
}

export const useCreateBomAssembly = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bomAssemblyService.createBomAssembly,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BomAssemblyKeys.lists() });
    },
  });
};

export const useUpdateBomAssembly = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: number; updates: BomAssemblyUpdate }) =>
      bomAssemblyService.updateBomAssembly(params.id, params.updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: BomAssemblyKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: BomAssemblyKeys.detail(data.id),
      });
    },
  });
};

export const useDeleteBomAssembly = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => bomAssemblyService.deleteBomAssembly(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: BomAssemblyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: BomAssemblyKeys.detail(id) });
    },
  });
};

export const useSpareParts = (bomId: number) => {
  return useQuery<SparePart[], Error>({
    queryKey: ["spareParts", bomId],
    queryFn: () => bomAssemblyService.getSparePartsByBomId(bomId),
    enabled: !!bomId,
    select: (data) =>
      data.map((item) => ({
        ...item,
        // Flatten the item_master properties if needed
        item_name: item.item_master?.item_name,
        item_no: item.item_master?.item_no,
      })),
  });
};


export const useAddSparePartToBom = () => {
    const queryClient = useQueryClient();
  
    return useMutation<SparePart, Error, Omit<SparePart, "id">>({
      mutationFn: bomAssemblyService.addSparePartToBom,
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ["spareParts", data.bom_id],
        });
      }
    });
  };

export const useCreateSparePart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bomAssemblyService.createSparePart,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["spareParts", data.bom_id],
      });
    },
  });
};

export const useUpdateSparePart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: number; updates: Partial<SparePart> }) =>
      bomAssemblyService.updateSparePart(params.id, params.updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["spareParts", data.bom_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["sparePart", data.id],
      });
    },
  });
};

export const useDeleteSparePart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, bomId }: { id: number; bomId: number }) => 
      bomAssemblyService.deleteSparePart(id),
    onSuccess: (_, { bomId }) => {
      queryClient.invalidateQueries({
        queryKey: ["spareParts", bomId],
      });
    },
  });
};

export const useItemMasterOptions = () => {
  return useQuery({
    queryKey: ["itemMasterOptions"],
    queryFn: () => bomAssemblyService.getItemMasterOptions(),
  });
};
