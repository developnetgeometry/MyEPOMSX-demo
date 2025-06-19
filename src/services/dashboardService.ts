import { supabase } from "@/lib/supabaseClient";

const getMonthRange = (date: Date) => {
  const y = date.getFullYear();
  const m = date.getMonth();
  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0);

  return {
    start: firstDay.toISOString(),
    end: lastDay.toISOString(),
  };
};

export const dashboardService = {
  async getAssetCount() {
    // @ts-ignore
    const { count, error } = await supabase
      .from("e_asset")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true);

    if (error) {
      throw new Error(`Error fetching asset count: ${error.message}`);
    }

    return count ?? 0;
  },

  async getAssetCountForMonth(monthDate: Date) {
    const { start, end } = getMonthRange(monthDate);
    const { count, error } = await supabase
      .from("e_asset")
      .select("id", { count: "exact", head: true })
      .gte("created_at", start)
      .lte("created_at", end)
      .eq("is_active", true);

    if (error) {
      throw new Error(`Error fetching asset count: ${error.message}`);
    }
    return count ?? 0;
  },

  async getWorkOrdersCount() {
    const { count, error } = await supabase
      .from("e_work_order")
      .select("id", { count: "exact", head: true })
      .eq("work_order_status_id", 1);

    if (error) {
      throw new Error(`Error fetching work order count: ${error.message}`);
    }

    return count ?? 0;
  },

  async getOpenWorkOrdersCount() {
    const { count, error } = await supabase
      .from("e_work_order")
      .select("id", { count: "exact", head: true })
      .eq("work_order_status_id", 1);

    if (error) {
      throw new Error(
        `Error fetching open work orders count: ${error.message}`
      );
    }

    return count ?? 0;
  },

  async getWorkOrdersCountForMonth(monthDate: Date) {
    const { start, end } = getMonthRange(monthDate);
    const { count, error } = await supabase
      .from("e_work_order")
      .select("id", { count: "exact", head: true })
      .gte("created_at", start)
      .lte("created_at", end)
      .eq("work_order_status_id", 1);

    if (error) {
      throw new Error(`Error fetching work order count: ${error.message}`);
    }
    return count ?? 0;
  },

  async getScheduledMaintenanceCount() {
    const { count, error } = await supabase
      .from("e_pm_schedule")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true)
      .eq("is_deleted", false);

    if (error) {
      throw new Error(
        `Error fetching scheduled maintenance count: ${error.message}`
      );
    }

    return count ?? 0;
  },

  async getUpcomingMaintenance(days = 30) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + days);
    nextWeek.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from("e_pm_schedule")
      .select(
        `
      id,
      pm_no,
      is_active,
      due_date,
      pm_description,
      e_asset!asset_id (asset_name),
      e_priority (name)
    `
      )
      .eq("is_deleted", false)
      .gte("due_date", today.toISOString())
      .lte("due_date", nextWeek.toISOString())
      .order("due_date", { ascending: true })
      .limit(5); // Limit to top 5 results

    if (error) {
      throw new Error(`Error fetching upcoming maintenance: ${error.message}`);
    }

    // Map to match component structure
    return data.map((item) => ({
      id: item.id,
      pmNumber: item.pm_no || `PM-${item.id}`,
      date: item.due_date,
      description: item.pm_description || "Maintenance",
      priority: item.e_priority?.name || "Medium",
      status: item.is_active ? "Scheduled" : "Not Scheduled",
    }));
  },

  async getMaintenanceTrend() {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);
    lastMonth.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("e_pm_schedule")
      .select("due_date, pm_description")
      .eq("is_active", true)
      .eq("is_deleted", false)
      .gte("due_date", lastMonth.toISOString())
      .lte("due_date", today.toISOString());

    if (error) {
      throw new Error(`Error fetching maintenance trend: ${error.message}`);
    }

    // Group by week
    const weeklyData: Record<string, number> = {};

    data.forEach((item) => {
      const date = new Date(item.due_date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)

      const weekKey = `${weekStart.getFullYear()}-${(weekStart.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${weekStart.getDate().toString().padStart(2, "0")}`;

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = 0;
      }

      weeklyData[weekKey]++;
    });

    // Convert to array format for chart
    return Object.entries(weeklyData).map(([week, count]) => ({
      name: week,
      maintenance: count,
    }));
  },

  async getWorkOrderStatusDistribution(dateRange?: {
    startDate: Date;
    endDate: Date;
  }) {
    let startDate = new Date();
    let endDate = new Date();

    startDate.setMonth(endDate.getMonth() - 5);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    // Override with custom date range if provided
    if (dateRange) {
      startDate = dateRange.startDate;
      endDate = dateRange.endDate;
    }

    const { data, error } = await supabase
      .from("e_work_order")
      .select(
        `
      id,
      work_order_status_id,
      e_work_order_status!work_order_status_id (name)
    `
      )
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    if (error) {
      throw new Error(`Error fetching work order statuses: ${error.message}`);
    }

    // Define all possible statuses
    const statusTypes = [
      "Open",
      "Open - Waiting for parts",
      "On Hold",
      "Cancelled",
      "Closed",
    ];

    // Initialize count object
    const statusCounts: Record<string, number> = {};
    statusTypes.forEach((status) => {
      statusCounts[status] = 0;
    });

    // Count status occurrences
    data.forEach((wo) => {
      const statusName = wo.e_work_order_status?.name || "unknown";
      if (statusTypes.includes(statusName)) {
        statusCounts[statusName] = (statusCounts[statusName] || 0) + 1;
      }
    });

    // Map to chart format with colors
    const statusColors: Record<string, string> = {
      Open: "#2196f3", // Blue
      "Open - Waiting for parts": "#ff9800", // Orange
      "On Hold": "#9e9e9e", // Grey
      Cancelled: "#f44336", // Red
      Closed: "#4caf50", // Green
    };

    return statusTypes.map((status) => ({
      name: status,
      value: statusCounts[status],
      color: statusColors[status] || "#8884d8",
    }));
  },

  // Maintenance Activity By Type
  async getMaintenanceActivityByType(dateRange?: {
    startDate: Date;
    endDate: Date;
  }) {
    // Get data for last 6 months
    let startDate = new Date();
    let endDate = new Date();

    startDate.setMonth(endDate.getMonth() - 5);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    // Override with custom date range if provided
    if (dateRange) {
      startDate = dateRange.startDate;
      endDate = dateRange.endDate;
    }

    const { data, error } = await supabase
      .from("e_work_order")
      .select(
        `
      created_at,
      work_order_type,
      e_work_order_type!work_order_type (name)
    `
      )
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    if (error) {
      throw new Error(`Error fetching maintenance activity: ${error.message}`);
    }

    // Group by month and type
    const monthlyData: Record<
      string,
      { preventive: number; corrective: number }
    > = {};

    data.forEach((item) => {
      const date = new Date(item.created_at);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { preventive: 0, corrective: 0 };
      }

      const typeName = item.e_work_order_type?.name?.toLowerCase() || "";
      if (typeName.includes("preventive")) {
        monthlyData[monthKey].preventive++;
      } else if (typeName.includes("corrective")) {
        monthlyData[monthKey].corrective++;
      }
    });

    // Convert to array format for chart
    return Object.entries(monthlyData).map(([month, counts]) => ({
      name: month,
      preventive: counts.preventive,
      corrective: counts.corrective,
    }));
  },

  async getCriticalAlerts(days = 3) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nearDue = new Date();
    nearDue.setDate(today.getDate() + days);
    nearDue.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from("e_work_order")
      .select(
        `
      id,
      work_order_no,
      due_date,
      description,
      e_asset(asset_name),
      e_pm_work_order(priority:e_priority(name)),
      e_cm_general(priority:e_priority(name))
    `
      )
      .gte("due_date", today.toISOString())
      .lte("due_date", nearDue.toISOString());

    if (error) throw error;

    // Add risk calculation and sorting
    const alerts = (data || []).map((alert) => {
      const pmPriority = alert.e_pm_work_order?.priority?.name;
      const cmPriority = alert.e_cm_general?.priority?.name;
      const priority = pmPriority || cmPriority || "Medium";

      // Calculate risk score: Critical=3, High=2, Medium=1, Low=0
      const riskScore =
        priority === "Critical"
          ? 3
          : priority === "High"
          ? 2
          : priority === "Medium"
          ? 1
          : 0;

      return {
        ...alert,
        priority,
        riskScore,
        daysUntilDue: Math.floor(
          (new Date(alert.due_date).getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24)
        ),
      };
    });

    // Sort by: riskScore (descending) -> daysUntilDue (ascending)
    alerts.sort((a, b) => {
      if (b.riskScore !== a.riskScore) {
        return b.riskScore - a.riskScore; // Higher risk first
      }
      return a.daysUntilDue - b.daysUntilDue; // Sooner due date first
    });

    return alerts.map((alert) => ({
      id: alert.id,
      workOrderNo: alert.work_order_no,
      dueDate: alert.due_date,
      description: alert.description || "No description",
      asset: alert.e_asset?.asset_name || "Unknown Asset",
      priority: alert.priority,
      riskLevel: alert.riskScore >= 2 ? "HighRisk" : "NearDue", // 2=High, 3=Critical
    }));
  },

  async getActiveItemsCount() {
    const { count, error } = await supabase
      .from("e_item_master")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true);

    if (error) {
      throw new Error(`Error fetching active items count: ${error.message}`);
    }

    return count ?? 0;
  },

  async getItemsCreatedByMonth() {
    // Current month range
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);

    const currentMonthEnd = new Date();
    currentMonthEnd.setMonth(currentMonthEnd.getMonth() + 1);
    currentMonthEnd.setDate(0);
    currentMonthEnd.setHours(23, 59, 59, 999);

    // Previous month range
    const prevMonthStart = new Date();
    prevMonthStart.setMonth(prevMonthStart.getMonth() - 1);
    prevMonthStart.setDate(1);
    prevMonthStart.setHours(0, 0, 0, 0);

    const prevMonthEnd = new Date();
    prevMonthEnd.setDate(0); // Last day of previous month
    prevMonthEnd.setHours(23, 59, 59, 999);

    // Fetch counts for both months
    const { count: currentMonthCount } = await supabase
      .from("e_item_master")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true)
      .gte("created_at", currentMonthStart.toISOString())
      .lte("created_at", currentMonthEnd.toISOString());

    const { count: prevMonthCount } = await supabase
      .from("e_item_master")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true)
      .gte("created_at", prevMonthStart.toISOString())
      .lte("created_at", prevMonthEnd.toISOString());

    return {
      currentMonth: currentMonthCount || 0,
      previousMonth: prevMonthCount || 0,
    };
  },
};
