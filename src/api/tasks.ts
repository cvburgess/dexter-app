import { SupabaseClient } from "@supabase/supabase-js";
import camelCase from "camelcase-keys";
import snakeCase from "decamelize-keys";

import { Database } from "./database.types.ts";

export type TTask = {
  id: string;
  // description?: string;
  dueOn?: string;
  listId?: string;
  priority: ETaskPriority;
  scheduledFor?: string;
  status: ETaskStatus;
  // subtasks: Task[];
  title: string;
};

export enum ETaskPriority {
  IMPORTANT_AND_URGENT,
  URGENT,
  IMPORTANT,
  NEITHER,
  UNPRIORITIZED,
}

export enum ETaskStatus {
  TODO,
  IN_PROGRESS,
  DONE,
  WONT_DO,
}

export const getTasks = async (supabase: SupabaseClient<Database>) => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("status, priority");

  if (error) throw error;
  return camelCase(data) as TTask[];
};

export type TCreateTask = {
  dueOn?: string;
  listId?: string;
  priority?: ETaskPriority;
  scheduledFor?: string;
  status?: ETaskStatus;
  title: string;
};

export const createTask = async (
  supabase: SupabaseClient<Database>,
  task: TCreateTask,
) => {
  const { data, error } = await supabase
    .from("tasks")
    .insert(snakeCase(task))
    .select();

  if (error) throw error;
  return camelCase(data) as TTask[];
};

export type TUpdateTask = {
  id: string;
  dueOn?: string;
  listId?: string | null;
  priority?: ETaskPriority;
  scheduledFor?: string;
  status?: ETaskStatus;
  title?: string;
};

export const updateTask = async (
  supabase: SupabaseClient<Database>,
  { id, ...diff }: TUpdateTask,
) => {
  const { data, error } = await supabase
    .from("tasks")
    .update(snakeCase(diff))
    .eq("id", id)
    .select();

  if (error) throw error;
  return camelCase(data) as TTask[];
};
