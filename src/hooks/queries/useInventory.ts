import { inventoryService } from "@/services/inventoryService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const inventoryKeys = {
  list: () => ["inventories"],
  detail: (id: string) => [...inventoryKeys.list(), id],
  sparePartsOptions: () => [...inventoryKeys.list(), "sparePartsOptions"],
  storeOptions: () => [...inventoryKeys.list(), "storeOptions"],
  rackNoOptions: () => [...inventoryKeys.list(), "rackNoOptions"],
  workOrderOptions: () => [...inventoryKeys.list(), "workOrderOptions"],
  adjustmentCategoryOptions: () => [...inventoryKeys.list(), "adjustmentCategoryOptions"],
  adjustmentTypeOptions: () => [...inventoryKeys.list(), "adjustmentTypeOptions"],
  employeeOptions: () => [...inventoryKeys.list(), "employeeOptions"],
  receiveInventory: () => [...inventoryKeys.list(), "receiveInventory"],
  issueInventory: () => [...inventoryKeys.list(), "issueInventory"],
  returnInventory: () => [...inventoryKeys.list(), "returnInventory"],
  adjustmentInventory: () => [...inventoryKeys.list(), "adjustmentInventory"],
  transferInventory: () => [...inventoryKeys.list(), "transferInventory"],
  transactionInventory: () => [...inventoryKeys.list(), "transactionInventory"],
};


export const useInventoryList = (params?: {
  storeId?: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}) => {
  return useQuery({
    queryKey: [inventoryKeys.list(), params],
    queryFn: () => inventoryService.getInventoryList(params),
  });
}

export const useInventoryDetail = (id: string) => {
  return useQuery({
    queryKey: inventoryKeys.detail(id),
    queryFn: () => inventoryService.getInventoryById(Number(id)),
  });
}

export const useReceiveInventory = () => {
  return useQuery({
    queryKey: inventoryKeys.receiveInventory(),
    queryFn: () => inventoryService.getReceiveInventory(),
  })
}

export const useAddReceiveInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryService.createReceiveInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.receiveInventory() });
    },
  });
}

export const useIssueInventory = () => {
  return useQuery({
    queryKey: inventoryKeys.issueInventory(),
    queryFn: () => inventoryService.getIssueInventory(),
  })
}

export const useAddIssueInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryService.createIssueInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.issueInventory() });
    },
  });
}

export const useReturnInventory = () => {
  return useQuery({
    queryKey: inventoryKeys.returnInventory(),
    queryFn: () => inventoryService.getReturnInventory(),
  })
}

export const useAddReturnInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryService.createReturnInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.returnInventory() });
    },
  });
}

export const useTransferInventory = () => {
  return useQuery({
    queryKey: inventoryKeys.transferInventory(),
    queryFn: () => inventoryService.getTransferInventory(),
  })
}

export const useAddTransferInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryService.createTransferInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.transferInventory() });
    },
  });
}

export const useTransactionInventory = () => {
  return useQuery({
    queryKey: inventoryKeys.transactionInventory(),
    queryFn: () => inventoryService.getTransactionInventory(),
  })
}

export const useAdjustmentInventory = () => {
  return useQuery({
    queryKey: inventoryKeys.adjustmentInventory(),
    queryFn: () => inventoryService.getAdjustmentInventory(),
  })
}

export const useAddAdjustmentInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryService.createAdjustmentInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.adjustmentInventory() });
    },
  });
}

export const useAddInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryService.createInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.list() });
    },
  });
}

export const useSparePartsOptions = () => {
  return useQuery({
    queryKey: inventoryKeys.sparePartsOptions(),
    queryFn: () => inventoryService.getSparePartsOptions(),
  });
};

export const useStoreOptions = () => {
  return useQuery({
    queryKey: inventoryKeys.storeOptions(),
    queryFn: () => inventoryService.getStoreOptions(),
  });
}

export const useRackNoOptions = () => {
  return useQuery({
    queryKey: inventoryKeys.rackNoOptions(),
    queryFn: () => inventoryService.getRackNoOptions(),
  });
}

export const useWorkOrderOptions = () => {
  return useQuery({
    queryKey: inventoryKeys.workOrderOptions(),
    queryFn: () => inventoryService.getWorkOrderOptions(),
  });
}

export const useAdjustmentCategoryOptions = () => {
  return useQuery({
    queryKey: inventoryKeys.adjustmentCategoryOptions(),
    queryFn: () => inventoryService.getAdjustmentCategoryOptions(),
  });
}

export const useAdjustmentTypeOptions = () => {
  return useQuery({
    queryKey: inventoryKeys.adjustmentTypeOptions(),
    queryFn: () => inventoryService.getAdjustmentTypeOptions(),
  });
}

export const useEmployeeOptions = () => {
  return useQuery({
    queryKey: inventoryKeys.employeeOptions(),
    queryFn: () => inventoryService.getEmployeeOptions(),
  });
}
