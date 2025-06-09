import { itemMasterService } from "@/services/itemMasterService";
import { CreateItemMasterDTO } from "@/types/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const itemMasterKeys = {
    all: ["itemMasters"] as const,
    list: () => [...itemMasterKeys.all, "list"] as const,
    detail: (id: number) => [...itemMasterKeys.all, "detail", id] as const
}

export const useItemMaster = () => {
    return useQuery({
        queryKey: itemMasterKeys.list(),
        queryFn: () => itemMasterService.getItemMaster(),
    });
}

export const useItemMasterOptions = () => {
    return useQuery({
        queryKey: ["itemMasterOptions"],
        queryFn: () => itemMasterService.getItemMasterOptions(),
    });
}

export const useItemMasterDetail = (id: number) => {
    return useQuery({
        queryKey: itemMasterKeys.detail(id),
        queryFn: () => itemMasterService.getItemMasterById(id),
        enabled: !!id
    })
}

export const useAddItemMaster = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newItemMaster: CreateItemMasterDTO) =>
            await itemMasterService.createItemMaster(newItemMaster),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: itemMasterKeys.list() });
        },
    });
}