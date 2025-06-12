import { inventoryService } from "@/services/inventoryService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const inventoryKeys = {
  list: () => ["inventories"],
  detail: (id: string) => [...inventoryKeys.list(), id],
  sparePartsOptions: () => [...inventoryKeys.list(), "sparePartsOptions"],
  storeOptions: () => [...inventoryKeys.list(), "storeOptions"],
  rackNoOptions: () => [...inventoryKeys.list(), "rackNoOptions"],
  workOrderOptions: () => [...inventoryKeys.list(), "workOrderOptions"],
  adjustmentCategoryOptions: () => [
    ...inventoryKeys.list(),
    "adjustmentCategoryOptions",
  ],
  adjustmentTypeOptions: () => [
    ...inventoryKeys.list(),
    "adjustmentTypeOptions",
  ],
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
};

export const useInventoryDetail = (id: string) => {
  return useQuery({
    queryKey: inventoryKeys.detail(id),
    queryFn: () => inventoryService.getInventoryById(Number(id)),
  });
};

export const useReceiveInventory = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: inventoryKeys.receiveInventory(),
    queryFn: () => inventoryService.getReceiveInventory(),
    ...options,
  });
};

export const useAddReceiveInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryService.createReceiveInventory,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.receiveInventory(),
      });
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.list(),
      });
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.detail(String(variables.p_inventory_id)),
      });
    },
  });
};

export const useAddIssueInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryService.createIssueInventory,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.issueInventory(),
      });
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.list(),
      });
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.detail(String(variables.inventory_id)),
      });
      toast.success("Inventory issued successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to issue inventory: ${error.message}`);
    },
  });
};

export const useAddReturnInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryService.createReturnInventory,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.returnInventory(),
      });
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.list(),
      });
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.detail(String(variables.inventory_id)),
      });
      toast.success("Inventory returned successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to return inventory: ${error.message}`);
    },
  });
};

export const useAddAdjustmentInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryService.createAdjustmentInventory,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.adjustmentInventory(),
      });
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.list(),
      });
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.detail(String(variables.inventory_id)),
      });
      toast.success("Inventory adjusted successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to adjust inventory: ${error.message}`);
    },
  });
};

export const useAddTransferInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryService.createTransferInventory,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.transferInventory(),
      });
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.list(),
      });
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.detail(String(variables.source_inventory_id)),
      });
      toast.success("Inventory transferred successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to transfer inventory: ${error.message}`);
    },
  });
};

export const useIssueInventory = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: inventoryKeys.issueInventory(),
    queryFn: () => inventoryService.getIssueInventory(),
    ...options,
  });
};

export const useReturnInventory = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: inventoryKeys.returnInventory(),
    queryFn: () => inventoryService.getReturnInventory(),
    ...options,
  });
};

export const useTransferInventory = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: inventoryKeys.transferInventory(),
    queryFn: () => inventoryService.getTransferInventory(),
    ...options,
  });
};

export const useTransactionInventory = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: inventoryKeys.transactionInventory(),
    queryFn: () => inventoryService.getTransactionInventory(),
    ...options,
  });
};

export const useAdjustmentInventory = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: inventoryKeys.adjustmentInventory(),
    queryFn: () => inventoryService.getAdjustmentInventory(),
    ...options,
  });
};

export const useAddInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryService.createInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.list() });
    },
  });
};

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
};

export const useRackNoOptions = () => {
  return useQuery({
    queryKey: inventoryKeys.rackNoOptions(),
    queryFn: () => inventoryService.getRackNoOptions(),
  });
};

export const useWorkOrderOptions = () => {
  return useQuery({
    queryKey: inventoryKeys.workOrderOptions(),
    queryFn: () => inventoryService.getWorkOrderOptions(),
  });
};

export const useAdjustmentCategoryOptions = () => {
  return useQuery({
    queryKey: inventoryKeys.adjustmentCategoryOptions(),
    queryFn: () => inventoryService.getAdjustmentCategoryOptions(),
  });
};

export const useAdjustmentTypeOptions = () => {
  return useQuery({
    queryKey: inventoryKeys.adjustmentTypeOptions(),
    queryFn: () => inventoryService.getAdjustmentTypeOptions(),
  });
};

export const useEmployeeOptions = () => {
  return useQuery({
    queryKey: inventoryKeys.employeeOptions(),
    queryFn: () => inventoryService.getEmployeeOptions(),
  });
};
