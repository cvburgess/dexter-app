import { SupabaseClient } from "@supabase/supabase-js";
import camelCase from "camelcase-keys";
import snakeCase from "decamelize-keys";

export type Task = {
  id: string;
  // description?: string;
  dueOn?: string;
  priority: TaskPriority | null;
  scheduledFor?: string;
  status: TaskStatus;
  // subtasks: Task[];
  title: string;
};

export enum TaskPriority {
  IMPORTANT_AND_URGENT,
  URGENT,
  IMPORTANT,
  NEITHER,
}

export enum TaskStatus {
  TODO,
  IN_PROGRESS,
  DONE,
  WONT_DO,
}

export const getTasks = async (supabase: SupabaseClient) => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at");

  if (error) throw error;
  return camelCase(data);
};

export const createTask = async (supabase: SupabaseClient, task: Task) => {
  const { data, error } = await supabase
    .from("tasks")
    .insert(snakeCase(task))
    .select();

  if (error) throw error;
  return data;
};
