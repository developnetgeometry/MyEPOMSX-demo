import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export const usePmWoGenerateHistory = () => {
  return useQuery({
    queryKey: ["e-pm-wo-generate-history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_pm_wo_generate")
        .select(
          `id, created_at, created_by (id, email, full_name), start_date, end_date, is_individual,
          pm_schedule_id(pm_no)`
        )
        .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching e_pm_wo_generate data:", error);
        throw error;
      }

      // Fetch count for each record
      const dataWithCounts = await Promise.all(
        data.map(async (item) => {
          const { count, error: countError } = await supabase
            .from("e_wo_pm_schedule")
            .select("pm_wo_generate", { count: "exact" })
            .eq("pm_wo_generate", item.id);

          if (countError) {
            console.error(`Error fetching count for pm_wo_generate ${item.id}:`, countError);
            throw countError;
          }

          return {
            ...item,
            wo_count: count, // Add the count to the record
          };
        })
      );

      return dataWithCounts;
    },
  });
};

export const useWoPmScheduleByGenerateId = (pmWoGenerateId: number) => {
  return useQuery({
    queryKey: ["e-wo-pm-schedule-by-generate-id", pmWoGenerateId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("e_wo_pm_schedule")
        .select(
          `id, created_at, wo_id (id, work_order_no, description), 
          due_date, pm_schedule_id(pm_no)`
        )
        .eq("pm_wo_generate", pmWoGenerateId)
        .order("id", { ascending: true });

      if (error) {
        console.error(`Error fetching e_wo_pm_schedule data for pm_wo_generate ${pmWoGenerateId}:`, error);
        throw error;
      }

      return data;
    },
    enabled: !!pmWoGenerateId, // Only run the query if pmWoGenerateId is provided
  });
};


export const useWoHistoryCounts = () => {
  return useQuery({
    queryKey: ["e-wo-history-counts"],
    queryFn: async () => {
      // 1. PM Schedule count (where is_deleted = false and is_active = true)
      const { count: pmScheduleCount, error: pmScheduleError } = await supabase
        .from("e_pm_schedule")
        .select("*", { count: "exact", head: true }) // head: true = don't return rows
        .eq("is_deleted", false)
        .eq("is_active", true);

      if (pmScheduleError) {
        console.error("Error counting e_pm_schedule:", pmScheduleError);
        throw pmScheduleError;
      }

      // 2. All work orders
      const { count: workOrderTotal, error: workOrderTotalError } = await supabase
        .from("e_work_order")
        .select("*", { count: "exact", head: true });

      if (workOrderTotalError) {
        console.error("Error counting all work orders:", workOrderTotalError);
        throw workOrderTotalError;
      }

      // 3. Work orders - CM (type = 1)
      const { count: workOrderCm, error: workOrderCmError } = await supabase
        .from("e_work_order")
        .select("*", { count: "exact", head: true })
        .eq("work_order_type", 1);

      if (workOrderCmError) {
        console.error("Error counting CM work orders:", workOrderCmError);
        throw workOrderCmError;
      }

      // 4. Work orders - PM (type = 2)
      const { count: workOrderPm, error: workOrderPmError } = await supabase
        .from("e_work_order")
        .select("*", { count: "exact", head: true })
        .eq("work_order_type", 2);

      if (workOrderPmError) {
        console.error("Error counting PM work orders:", workOrderPmError);
        throw workOrderPmError;
      }

      // Return all counts
      return {
        pmScheduleCount,
        workOrderTotal,
        workOrderCm,
        workOrderPm,
      };
    },
  });
};
