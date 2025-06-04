import { supabase } from "@/lib/supabaseClient";
import {
  createPMSchedule,
  createPMWorkOrder,
  MinAcceptanceCriteria,
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
                facility: facility_id(location_name),
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
    payload: createPMSchedule
  ): Promise<createPMSchedule> {
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

  // Add to PMScheduleService.ts
  async generateSamplePMSchedules(payload: {
    start_date: string;
    end_date: string;
    asset_id?: number;
  }): Promise<PMSchedule[]> {
    // First delete any existing sample schedules
    await supabase.from("e_pm_schedule").delete().like("pm_no", "SAMPLE-%");

    // Get all assets or filtered asset if specified
    let assetsQuery = supabase.from("e_asset").select("id, asset_name");
    if (payload.asset_id) {
      assetsQuery = assetsQuery.eq("id", payload.asset_id);
    }
    const { data: assets } = await assetsQuery;

    if (!assets || assets.length === 0) {
      throw new Error("No assets found for generating schedules");
    }

    // Get available options for related fields
    const [
      { data: maintenanceTypes },
      { data: priorities },
      { data: workCenters },
      { data: disciplines },
      { data: packages },
      { data: tasks },
      { data: frequencies },
    ] = await Promise.all([
      supabase.from("e_maintenance").select("id"),
      supabase.from("e_priority").select("id"),
      supabase.from("e_work_center").select("id"),
      supabase.from("e_discipline").select("id"),
      supabase.from("e_package").select("id"),
      supabase.from("e_task").select("id, task_name"),
      supabase.from("e_frequency").select("id, name"),
    ]);

    // Generate schedules for each asset
    const schedules = assets.flatMap((asset) => {
      const schedulesForAsset: createPMSchedule[] = [];
      const startDate = new Date(payload.start_date);
      const endDate = new Date(payload.end_date);

      // Generate between 1-2 schedules per asset
      const scheduleCount = Math.floor(Math.random() * 3);

      for (let i = 0; i < scheduleCount; i++) {
        // Random date within range
        const randomDate = new Date(
          startDate.getTime() +
            Math.random() * (endDate.getTime() - startDate.getTime())
        );

        // Random frequency
        const frequency =
          frequencies[Math.floor(Math.random() * frequencies.length)];
        const task = tasks[Math.floor(Math.random() * tasks.length)];

        schedulesForAsset.push({
          pm_no: `SAMPLE-${asset.id}-${i + 1}`,
          pm_description: `Sample PM for ${asset.asset_name} - ${task.task_name}`,
          due_date: randomDate.toISOString().split("T")[0],
          maintenance_id:
            maintenanceTypes[
              Math.floor(Math.random() * maintenanceTypes.length)
            ].id,
          priority_id:
            priorities[Math.floor(Math.random() * priorities.length)].id,
          work_center_id:
            workCenters[Math.floor(Math.random() * workCenters.length)].id,
          discipline_id:
            disciplines[Math.floor(Math.random() * disciplines.length)].id,
          package_id: packages[Math.floor(Math.random() * packages.length)].id,
          task_id: task.id,
          frequency_id: frequency.id,
          asset_id: asset.id,
          is_active: true,
        });
      }

      return schedulesForAsset;
    });

    // Insert all generated schedules
    const { data: insertedSchedules, error } = await supabase
      .from("e_pm_schedule")
      .insert(schedules).select(`
      *,
      package: package_id(package_no),
      asset: asset_id(asset_name),
      task: task_id(task_name),
      frequency: frequency_id(name),
      work_center: work_center_id(name)
    `);

    if (error) {
      throw new Error(`Failed to generate sample schedules: ${error.message}`);
    }

    return insertedSchedules || [];
  },

  async getFacilityOptions(): Promise<any> {
    const { data, error } = await supabase.from("e_facility").select("*");

    if (error) {
      throw new Error(`Error fetching PM schedules: ${error.message}`);
    }

    return data || [];
  },

  async getMaintenanceOptions(): Promise<any> {
    const { data, error } = await supabase
      .from("e_maintenance")
      .select("*")
      .eq("maintenance_type_id", 1);

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

  async getAssetOptions(): Promise<any> {
    const { data, error } = await supabase.from("e_asset").select("*");

    if (error) {
      throw new Error(`Error fetching PM schedules: ${error.message}`);
    }

    return data || [];
  },

  async getSystemOptions(): Promise<any> {
    const { data, error } = await supabase.from("e_system").select("*");

    if (error) {
      throw new Error(`Error fetching PM schedules: ${error.message}`);
    }

    return data || [];
  },

  async getEmployeeOptions(): Promise<any> {
    const { data, error } = await supabase.from("e_employee").select("*");

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

  async getPMGroupOptions(): Promise<any> {
    const { data, error } = await supabase.from("e_pm_group").select("*");

    if (error) {
      throw new Error(`Error fetching PM schedules: ${error.message}`);
    }

    return data || [];
  },

  async getPMSCEGroupOptions(): Promise<any> {
    const { data, error } = await supabase.from("e_asset_sce").select("*");

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

  async editServiceNotesByPMScheduleId(
    id: number,
    notes: string
  ): Promise<void> {
    const { error } = await supabase
      .from("e_pm_schedule")
      // @ts-ignore
      .update({ service_notes: notes })
      .eq("id", id);

    if (error) {
      throw new Error(`Error updating service notes: ${error.message}`);
    }
  },

  async getMinCriteriaFromPMScheduleId(
    pmScheduleId: number
  ): Promise<MinAcceptanceCriteria[]> {
    const { data, error } = await supabase
      .from("e_pm_work_order")
      .select(
        `
        id,
        work_order_no,
        min_acceptance_criteria: e_pm_min_acceptance_criteria!pm_wo_id(
          id,
          field_name,
          criteria,
          created_at
        )
      `
      )
      .eq("pm_schedule_id", pmScheduleId)
      .order("created_at", {
        ascending: false,
        foreignTable: "e_pm_min_acceptance_criteria",
      });

    if (error) {
      throw new Error(
        `Error fetching minimum acceptance criteria: ${error.message}`
      );
    }

    // Flatten the structure for easier consumption
    return (
      data?.flatMap(
        (wo) =>
          wo.min_acceptance_criteria?.map((criteria) => ({
            // @ts-ignore
            ...criteria,
            work_order_id: wo.id,
            work_order_no: wo.work_order_no,
          })) || []
      ) || []
    );
  },

  async getWorkOrderFromPMScheduleId(pmScheduleId: number): Promise<any[]> {
    const { data, error } = await supabase
      .from("e_pm_work_order")
      .select(`*, asset: e_asset!asset_id(asset_name)`)
      .eq("pm_schedule_id", pmScheduleId);

    if (error) {
      throw new Error(`Error fetching work orders: ${error.message}`);
    }

    return data || [];
  },

  async getChecksheetFromPMScheduleId(pmScheduleId: number): Promise<any[]> {
    const { data, error } = await supabase
      .from("e_pm_work_order")
      .select(
        `
        id,
        work_order_no,
        checksheets: e_pm_checksheet!pm_wo_id(
          id,
          description,
          file_path,
          created_at,
          updated_at
        )
      `
      )
      .eq("pm_schedule_id", pmScheduleId)
      .order("created_at", {
        ascending: false,
        foreignTable: "e_pm_checksheet",
      });

    if (error) {
      throw new Error(`Error fetching checksheets: ${error.message}`);
    }

    // Flatten the structure for easier consumption
    return data?.flatMap(
      (wo) =>
        wo.checksheets?.map((checksheet) => ({
          // @ts-ignore
          ...checksheet,
          work_order_id: wo.id,
          work_order_no: wo.work_order_no,
        })) || []
    );
  },
  async createChecksheet(payload: {
    pm_wo_id: number;
    description: string;
    file_path?: string;
  }): Promise<any> {
    const { data, error } = await supabase
      .from("e_pm_checksheet")
      .insert({
        pm_wo_id: payload.pm_wo_id,
        description: payload.description,
        file_path: payload.file_path,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create checksheet: ${error.message}`);
    }

    return data;
  },

  async uploadChecksheetFile(file: File): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from("checksheet-attachments") // Your bucket name
      .upload(filePath, file);

    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    return filePath;
  },

  async updateChecksheet(payload: {
    id: number;
    description: string;
  }): Promise<any> {
    const { data, error } = await supabase
      .from("e_pm_checksheet")
      .update({
        description: payload.description,
        updated_by: (await supabase.auth.getUser()).data.user?.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payload.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update checksheet: ${error.message}`);
    }

    return data;
  },

  async deleteChecksheet(id: number): Promise<void> {
    const { error } = await supabase
      .from("e_pm_checksheet")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete checksheet: ${error.message}`);
    }
  },

  async getMaintainableGroupByScheduleId(pmScheduleId: number): Promise<any[]> {
    const { data, error } = await supabase
      .from("e_pm_maintainable_group")
      .select(
        `
        *,
        asset: asset_id(id, asset_name),
        group: group_id(id, name),
        work_order: pm_wo_id!inner(id, work_order_no, pm_schedule_id)
      `
      )
      .eq("work_order.pm_schedule_id", pmScheduleId);

    if (error) {
      throw new Error(`Error fetching maintainable groups: ${error.message}`);
    }

    return data || [];
  },

  async getPlanLabourByScheduleId(pmScheduleId: number): Promise<any[]> {
    // @ts-ignore
    const { data, error } = await supabase
      .from("e_pm_plan_labour")
      .select(
        `
        *,
        work_order: pm_wo_id!inner(id, work_order_no, pm_schedule_id),
        employee: employee_id(name)
      `
      )
      .eq("work_order.pm_schedule_id", pmScheduleId);

    if (error) {
      throw new Error(`Error fetching plan labor: ${error.message}`);
    }

    return data || [];
  },

  async getPlanMaterialByScheduleId(pmScheduleId: number): Promise<any[]> {
    // @ts-ignore
    const { data, error } = await supabase
      .from("e_pm_plan_material")
      .select(
        `
        *,
        work_order: pm_wo_id!inner(id, work_order_no, pm_schedule_id),
        material: item_id(*)
      `
      )
      .eq("work_order.pm_schedule_id", pmScheduleId);

    if (error) {
      throw new Error(`Error fetching plan material: ${error.message}`);
    }

    return data || [];
  },

  async createWorkOrder(payload: {
    pm_schedule_id: number;
    pm_description: string;
    due_date: string;
    maintenance_id: number;
    asset_id: number;
    facility_id: number;
    system_id: number;
    package_id: number;
    work_center_id: number;
    work_order_no?: string;
    work_order_prefix?: string;
    work_order_date?: string;
    priority_id?: number;
    discipline_id?: number;
    task_id?: number;
    frequency_id?: number;
    pm_group_id?: number;
    asset_sce_code_id?: number;
  }): Promise<createPMWorkOrder> {
    // Generate work_order_no if not provided
    const workOrderNo = payload.work_order_no || 
      `${payload.work_order_prefix || 'WO-'}${new Date().getTime()}`;
  
    // Convert dates to proper format
    const dueDate = payload.due_date ? new Date(payload.due_date).toISOString() : null;
    const workOrderDate = payload.work_order_date ? new Date(payload.work_order_date).toISOString() : new Date().toISOString();
  
    const { data, error } = await supabase
      .from('e_pm_work_order')
      .insert({
        pm_schedule_id: payload.pm_schedule_id,
        pm_description: payload.pm_description,
        due_date: dueDate,
        created_at: workOrderDate,
        updated_at: workOrderDate,
        maintenance_id: payload.maintenance_id,
        asset_id: payload.asset_id,
        facility_id: payload.facility_id,
        system_id: payload.system_id,
        package_id: payload.package_id,
        work_center_id: payload.work_center_id,
        work_order_no: workOrderNo,
        priority_id: payload.priority_id,
        discipline_id: payload.discipline_id,
        task_id: payload.task_id,
        frequency_id: payload.frequency_id,
        pm_group_id: payload.pm_group_id,
        asset_sce_code_id: payload.asset_sce_code_id,
        is_active: true,
      })
      .select(`
        *,
        asset: asset_id(asset_name),
        facility: facility_id(location_name),
        work_center: work_center_id(name),
        maintenance: maintenance_id(name),
        system: system_id(system_name),
        package: package_id(package_name)
      `)
      .single();
  
    if (error) {
      console.error('Error creating work order:', error);
      throw new Error(`Failed to create work order: ${error.message}`);
    }
  
    return data;
  }
};
