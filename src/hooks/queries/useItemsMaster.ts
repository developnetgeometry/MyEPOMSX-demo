import { itemMasterService } from "@/services/itemMasterService";
import { useQuery } from "@tanstack/react-query";


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

export const useItemMasterDetail = (id: number) => {
    return useQuery({
        queryKey: itemMasterKeys.detail(id),
        queryFn: () => itemMasterService.getItemMasterById(id),
        enabled: !!id
    })
}