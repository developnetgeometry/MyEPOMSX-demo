import { supabase } from "@/lib/supabaseClient";
import {
  createPMScheduleDTO,
  PMSchedule,
  PMScheduleDetail,
} from "@/types/maintain";

export const PMScheduleService = {
  async getPMSchedules(): Promise<PMSchedule[]> {
    const { data, error } = await supabase
      .from("e_pm_schedule")
      .select(
        `*,
                package: package_id(package_no),
                asset: asset_id(asset_name),
                task: task_id(task_name),
                frequency: frequency_id(name),
                work_center: work_center_id(name)
            `
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Error fetching PM schedules: ${error.message}`);
    }

    return data || [];
  },

  async getPMScheduleById(id: number): Promise<PMScheduleDetail | null> {
    const { data, error } = await supabase
      .from("e_pm_schedule")
      .select(
        `*,
                package: package_id(package_no),
                asset: asset_id(asset_name),
                task: task_id(task_name),
                frequency: frequency_id(name),
                work_center: work_center_id(name)
            `
      )
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error fetching PM schedule: ${error.message}`);
    }

    return data || null;
  },

  async createPMSchedule(
    payload: createPMScheduleDTO
  ): Promise<createPMScheduleDTO> {
    const { data, error } = await supabase
      .from("e_pm_schedule")
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create PM Schedule: ${error.message}`);
    }

    return data;
  },

  async updatePMSchedule(payload: PMSchedule): Promise<PMSchedule> {
    const { data, error } = await supabase
      .from("e_pm_schedule")
      .update(payload)
      .eq("id", payload.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update PM Schedule: ${error.message}`);
    }

    return data;
  },

  async deletePMSchedule(id: number): Promise<void> {
    const { error } = await supabase
      .from("e_pm_schedule")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete PM Schedule: ${error.message}`);
    }
  },

  async getMaintenanceOptions(): Promise<any> {
    const { data, error } = await supabase.from("e_maintenance").select("*");

    if (error) {
      throw new Error(`Error fetching PM schedules: ${error.message}`);
    }

    return data || [];
  },

  async getPriorityOptions(): Promise<any> {
    const { data, error } = await supabase.from("e_priority").select("*");

    if (error) {
      throw new Error(`Error fetching PM schedules: ${error.message}`);
    }

    return data || [];
  },

  async getWorkCenterOptions(): Promise<any> {
    const { data, error } = await supabase.from("e_work_center").select("*");

    if (error) {
      throw new Error(`Error fetching PM schedules: ${error.message}`);
    }

    return data || [];
  },

  async getFrequencyOptions(): Promise<any> {
    const { data, error } = await supabase.from("e_frequency").select("*");

    if (error) {
      throw new Error(`Error fetching PM schedules: ${error.message}`);
    }

    return data || [];
  },

  async getPackageOptions(): Promise<any> {
    const { data, error } = await supabase.from("e_package").select("*");

    if (error) {
      throw new Error(`Error fetching PM schedules: ${error.message}`);
    }

    return data || [];
  },

  async getTaskOptions(): Promise<any> {
    const { data, error } = await supabase.from("e_task").select("*");

    if (error) {
      throw new Error(`Error fetching PM schedules: ${error.message}`);
    }

    return data || [];
  },

  async getDisciplineOptions(): Promise<any> {
    const { data, error } = await supabase.from("e_discipline").select("*");

    if (error) {
      throw new Error(`Error fetching PM schedules: ${error.message}`);
    }

    return data || [];
  },
  async getPMScheduleCustomTasks(pmScheduleId: number): Promise<any[]> {
    // @ts-ignore
    const { data, error } = await supabase
      .from("e_pm_task_detail")
      .select("*")
      .eq("pm_schedule_id", pmScheduleId);

    if (error) {
      throw new Error(
        `Error fetching PM schedule custom tasks: ${error.message}`
      );
    }

    return data || [];
  },

  async createPMScheduleCustomTask(payload: {
    pm_schedule_id: number;
    task_list: string;
    seq: number;
    original_task_detail_id?: number | null;
  }): Promise<any> {
    const { data, error } = await supabase
      .from("e_pm_task_detail")
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw new Error(
        `Failed to create PM Schedule custom task: ${error.message}`
      );
    }

    return data;
  },

  async updatePMScheduleCustomTask(payload: {
    id: number;
    task_list: string;
    seq: number;
  }): Promise<any> {
    const { data, error } = await supabase
      .from("e_pm_task_detail")
      .update({
        task_list: payload.task_list,
        seq: payload.seq,
      })
      .eq("id", payload.id)
      .select()
      .single();

    if (error) {
      throw new Error(
        `Failed to update PM Schedule custom task: ${error.message}`
      );
    }

    return data;
  },

  async deletePMScheduleCustomTask(id: number): Promise<void> {
    const { error } = await supabase
      .from("e_pm_task_detail")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(
        `Failed to delete PM Schedule custom task: ${error.message}`
      );
    }
  },
};
