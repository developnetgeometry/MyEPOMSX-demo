import { Asset } from "./manage";
import { Database } from "./supabase";

export interface Task {
  id: number;
  task_code: string;
  task_name: string;
  discipline_id: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  discipline?: Discipline;
}

export interface DisciplineOption{
  value: number | string;
  label: string;
}

export interface TaskWithDetails extends Task {
  details: TaskDetail[];
}

export interface MinAcceptanceCriteria {
  id: number;
  field_name: string;
  criteria: string;
  work_order_id: number;
  work_order_no: string;
  created_at: string;
}

export interface TaskDetail {
  id: number;
  seq?: number;
  task_list: string;
  isEditing?: boolean;
}

export interface UpdateTaskDetail {
  id: number;
  task_list: string;
  updated_at: Date;
}

export interface TaskDetailCreate {
  id?: number;
  task_id: number;
  seq: number;
  task_list: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface createTaskDTO {
  task_code: string;
  task_name: string;
  discipline_id: number;
  is_active: boolean;
  created_at?: Date;
}

export interface updateTaskDTO {
  id: number;
  task_code: string;
  task_name: string;
  discipline_id: number;
  is_active: boolean;
  updated_at: Date;
}

export interface Discipline {
  id?: number;
  code?: string;
  name?: string;
}

export interface Frequency {
  id?: number;
  code?: string;
  name?: string;
}

export interface PMSchedule {
  asset_id: number | null;
  //   asset: Asset | null;
  discipline_id: number | null;
  due_date: string | null;
  facility_id: number | null;
  frequency_id: number | null;
  // frequency: Frequency | null;
  id: number;
  is_active: boolean | null;
  maintenance_id: number | null;
  package_id: number | null;
  pm_description: string | null;
  pm_group_id: number | null;
  pm_no: string;
  pm_sce_group_id: number | null;
  priority_id: number | null;
  system_id: number | null;
  task_id: number | null;
  work_center_id: number | null;
}

export type createPMWorkOrder = Database["public"]["Tables"]["e_pm_work_order"]["Insert"];


export interface PMScheduleDetail extends PMSchedule {
  facility: {
    location_name: string;
  }
  package: {
    package_no: string;
  };
  asset: {
    asset_name: string;
  };
  frequency: {
    name: string;
  }
  task: {
    task_name: string;
  }
  work_center: {
    name: string;
  }
  service_notes?: string | null;
  checksheet_notes?: string | null;
  checksheet_attachment?: string | null;
  additional_info?: string | null;
  created_at?: string | null;
}

export type createPMSchedule =
  Database["public"]["Tables"]["e_pm_schedule"]["Insert"];
export type updatePMSchedule =
  Database["public"]["Tables"]["e_pm_schedule"]["Update"];



export interface GeneratePMSchedule {
  id: string;
  pm_no: string;
  pm_description: string;
  asset_id?: number;
  frequency: string | null;
  nextDueDate: string | null;
  status: string | null;
}
