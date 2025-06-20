import { dashboardService } from "@/services/dashboardService";
import { useQuery } from "@tanstack/react-query";

export const useAssetsCount = () => {
  return useQuery({
    queryKey: ["assetsCount"],
    queryFn: async () => dashboardService.getAssetCount(),
  });
};

export const useWorkOrdersCount = () => {
  return useQuery({
    queryKey: ["workOrdersCount"],
    queryFn: async () => dashboardService.getWorkOrdersCount(),
  });
};

export const useCurrentMonthAssets = () => {
  return useQuery({
    queryKey: ["currentMonthAssets"],
    queryFn: async () => {
      const now = new Date();
      return dashboardService.getAssetCountForMonth(now);
    },
  });
};

export const usePreviousMonthAssets = () => {
  return useQuery({
    queryKey: ["previousMonthAssets"],
    queryFn: async () => {
      const now = new Date();
      const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return dashboardService.getAssetCountForMonth(prevMonth);
    },
  });
};

export const useCurrentMonthWorkOrders = () => {
  return useQuery({
    queryKey: ["currentMonthWorkOrders"],
    queryFn: async () => {
      const now = new Date();
      return dashboardService.getWorkOrdersCountForMonth(now);
    },
  });
};

export const useOpenWorkOrdersCount = () => {
  return useQuery({
    queryKey: ["openWorkOrdersCount"],
    queryFn: dashboardService.getOpenWorkOrdersCount,
  });
};

export const usePreviousMonthWorkOrders = () => {
  return useQuery({
    queryKey: ["previousMonthWorkOrders"],
    queryFn: async () => {
      const now = new Date();
      const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return dashboardService.getWorkOrdersCountForMonth(prevMonth);
    },
  });
};

export const useScheduledMaintenanceCount = () => {
  return useQuery({
    queryKey: ["scheduledMaintenanceCount"],
    queryFn: dashboardService.getScheduledMaintenanceCount,
  });
};

export const useUpcomingMaintenance = (days: number = 30) => {
  return useQuery({
    queryKey: ["upcomingMaintenance", days],
    queryFn: () => dashboardService.getUpcomingMaintenance(days),
  });
};

export const useMaintenanceTrend = () => {
  return useQuery({
    queryKey: ["maintenanceTrend"],
    queryFn: dashboardService.getMaintenanceTrend,
  });
};

export const useMaintenanceActivityByType = (dateRange?: { startDate: Date; endDate: Date }) => {
  return useQuery({
    queryKey: ["maintenanceActivityByType", dateRange],
    queryFn: () => dashboardService.getMaintenanceActivityByType(dateRange),
  });
};

export const useWorkOrderStatusDistribution = (dateRange?: { startDate: Date; endDate: Date }) => {
  return useQuery({
    queryKey: ["workOrderStatusDistribution", dateRange],
    queryFn: () => dashboardService.getWorkOrderStatusDistribution(dateRange),
  });
};

export const useCriticalAlerts = (days: number = 3) => {
  return useQuery({
    queryKey: ["criticalAlerts", days],
    queryFn: () => dashboardService.getCriticalAlerts(days),
  });
};

export const useActiveItemsCount = () => {
  return useQuery({
    queryKey: ["activeItemsCount"],
    queryFn: dashboardService.getActiveItemsCount,
  });
};

export const useItemsCreatedByMonth = () => {
  return useQuery({
    queryKey: ["itemsCreatedByMonth"],
    queryFn: dashboardService.getItemsCreatedByMonth,
  });
};
