import { supabase } from "@/lib/supabaseClient";
import { createTaskDTO, Task, TaskDetail, TaskDetailCreate, TaskWithDetails, UpdateTaskDetail, updateTaskDTO } from "@/types/maintain";

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const { data, error } = await supabase
      .from("e_task")
      .select(
        `
            *,
            discipline: discipline_id(code, name)
          `
      )
      .order("task_code");

    if (error) {
      throw new Error(`Error fetching tasks: ${error.message}`);
    }

    return data || [];
  },

  async getTask(id: number): Promise<Task> {
    const { data, error } = await supabase
      .from("e_task")
      .select(
        `
            *,
            discipline: discipline_id(code, name)
          `
      )
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error fetching task: ${error.message}`);
    }

    if (!data) {
      throw new Error(`Task with id ${id} not found`);
    }

    return data;
  },

  async getTaskWithDetails(id: number): Promise<TaskWithDetails> {
    const { data, error } = await supabase
      .from('e_task')
      .select(`
        *,
        discipline:discipline_id (id, code, name),
        details:e_task_detail (id, seq, task_list)
      `)
      .eq('id', id)
      .single();
  
    if (error) {
      throw new Error(`Error fetching task: ${error.message}`);
    }
  
    if (!data) {
      throw new Error(`Task with id ${id} not found`);
    }
    // @ts-ignore
    return data;
  },

  async createTask(payload: createTaskDTO): Promise<Task> {
    const { data, error } = await supabase
      .from("e_task")
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating task: ${error.message}`);
    }

    return data;
  },

  async updateTask(task: updateTaskDTO): Promise<Task> {
    if (!task.id) {
      throw new Error("Task ID is required for update");
    }

    const { data, error } = await supabase
      .from("e_task")
      .update(task)
      .eq("id", task.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating task: ${error.message}`);
    }

    return data;
  },
  async deleteTask(id: number): Promise<void> {
    const { error } = await supabase
      .from("e_task")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Error deleting task: ${error.message}`);
    }
  },

  async getDisciplineOptions(): Promise<{ value: number; label: string }[]> {
    const { data, error } = await supabase
      .from("e_discipline") // Adjust table name as needed
      .select("id, code, name")
      .order("name");

    if (error) {
      throw new Error(`Error fetching discipline options: ${error.message}`);
    }

    return (
      data?.map((discipline) => ({
        value: discipline.id,
        label: discipline.name,
      })) || []
    );
  },

  async addDetailsToTask(payload: TaskDetailCreate): Promise<TaskDetailCreate> {
    const { data, error } = await supabase
      .from("e_task_detail")
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating task: ${error.message}`);
    }

    return data;
  },

  async updateTaskDetail(payload: UpdateTaskDetail): Promise<TaskDetail> {
    const { data, error } = await supabase
      .from("e_task_detail")
      .update(payload)
      .eq("id", payload.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating task: ${error.message}`);
    }

    return data;
  },

  async deleteTaskDetail(id: number): Promise<void> {
    const { error } = await supabase
      .from("e_task_detail")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Error deleting task: ${error.message}`);
    }
  },
};
