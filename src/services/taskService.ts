import { supabase } from "@/lib/supabaseClient";
import { Task } from "@/types/maintain";

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

  async createTask(payload: Task): Promise<Task> {
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
  async updateTask(task: Task): Promise<Task> {
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
};
