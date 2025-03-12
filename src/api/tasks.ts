import { SupabaseClient } from "@supabase/supabase-js";

import { applyFilters, TQueryFilter } from "./applyFilters.ts";
import { camelCase, snakeCase } from "../utils/changeCase.ts";
import { Database, TablesInsert, TablesUpdate } from "./database.types.ts";

export type TTask = {
  id: string;
  dueOn: string | null;
  listId: string | null;
  priority: ETaskPriority;
  scheduledFor: string | null;
  status: ETaskStatus;
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
  IN_PROGRESS,
  TODO,
  DONE,
  WONT_DO,
}

export const getTasks = async (
  supabase: SupabaseClient<Database>,
  filters: TQueryFilter[],
) => {
  const query = supabase.from("tasks").select("*");

  applyFilters(query, filters);
  query.order("status, priority");

  const { data, error } = await query;

  if (error) throw error;
  return camelCase(data) as TTask[];
};

export type TCreateTask = {
  dueOn?: string | null;
  listId?: string | null;
  priority?: ETaskPriority;
  scheduledFor?: string | null;
  status?: ETaskStatus;
  title: string;
};

export const createTask = async (
  supabase: SupabaseClient<Database>,
  task: TCreateTask,
) => {
  const { data, error } = await supabase
    .from("tasks")
    .insert(snakeCase(task) as TablesInsert<"tasks">)
    .select();

  if (error) throw error;
  return camelCase(data) as TTask[];
};

export type TUpdateTask = {
  id: string;
  dueOn?: string | null;
  listId?: string | null;
  priority?: ETaskPriority;
  scheduledFor?: string | null;
  status?: ETaskStatus;
  title?: string;
};

export const updateTask = async (
  supabase: SupabaseClient<Database>,
  { id, ...diff }: TUpdateTask,
) => {
  const { data, error } = await supabase
    .from("tasks")
    .update(snakeCase(diff) as TablesUpdate<"tasks">)
    .eq("id", id)
    .select();

  if (error) throw error;
  return camelCase(data) as TTask[];
};

export const updateTasks = async (
  supabase: SupabaseClient<Database>,
  tasks: TUpdateTask[],
) => {
  const { data, error } = await supabase
    .from("tasks")
    .upsert(tasks.map((task) => snakeCase(task) as TablesUpdate<"tasks">))
    .select();

  if (error) throw error;
  return camelCase(data) as TTask[];
};

export const deleteTask = async (
  supabase: SupabaseClient<Database>,
  id: string,
) => {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id);

  if (error) throw error;
};
