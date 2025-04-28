import { SupabaseClient } from "@supabase/supabase-js";

import { camelCase, snakeCase } from "../utils/changeCase.ts";

import { Database, TablesInsert, TablesUpdate } from "./database.types.ts";

export type TTemplate = {
  id: string;
  createdAt: string;
  goalId: string | null;
  listId: string | null;
  priority: number;
  schedule: string;
  title: string;
  userId: string;
};

export const getTemplates = async (supabase: SupabaseClient<Database>) => {
  const { data, error } = await supabase
    .from("repeat_task_templates")
    .select("*")
    .order("created_at");

  if (error) throw error;
  return camelCase(data) as TTemplate[];
};

export type TCreateTemplate = {
  goalId?: string | null;
  listId?: string | null;
  priority: number;
  schedule?: string;
  title: string;
};

export const createTemplate = async (
  supabase: SupabaseClient<Database>,
  template: TCreateTemplate,
) => {
  const { data, error } = await supabase
    .from("repeat_task_templates")
    .insert(snakeCase(template) as TablesInsert<"repeat_task_templates">)
    .select()
    .single();

  if (error) throw error;
  return camelCase(data) as TTemplate;
};

export type TUpdateTemplate = {
  id: string;
  goalId?: string | null;
  listId?: string | null;
  priority?: number;
  schedule?: string;
  title?: string;
};

export const updateTemplate = async (
  supabase: SupabaseClient<Database>,
  { id, ...diff }: TUpdateTemplate,
) => {
  const { data, error } = await supabase
    .from("repeat_task_templates")
    .update(snakeCase(diff) as TablesUpdate<"repeat_task_templates">)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return camelCase(data) as TTemplate;
};

export const deleteTemplate = async (
  supabase: SupabaseClient<Database>,
  id: string,
) => {
  const { error } = await supabase
    .from("repeat_task_templates")
    .delete()
    .eq("id", id);

  if (error) throw error;
};
