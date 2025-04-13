import { SupabaseClient } from "@supabase/supabase-js";

import { camelCase, snakeCase } from "../utils/changeCase.ts";

import { Database, TablesInsert, TablesUpdate } from "./database.types.ts";

export type TGoal = {
  createdAt: string;
  id: string;
  isArchived: boolean;
  title: string;
};

export const getGoals = async (supabase: SupabaseClient<Database>) => {
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("is_archived", false)
    .order("created_at");

  if (error) throw error;
  return camelCase(data) as TGoal[];
};

export type TCreateGoal = { emoji: string; title: string };

export const createGoal = async (
  supabase: SupabaseClient<Database>,
  goal: TCreateGoal,
) => {
  const { data, error } = await supabase
    .from("goals")
    .insert(snakeCase(goal) as TablesInsert<"goals">)
    .select();

  if (error) throw error;
  return camelCase(data) as TGoal[];
};

export type TUpdateGoal = {
  emoji?: string;
  id: string;
  isArchived?: boolean;
  title?: string;
};

export const updateGoal = async (
  supabase: SupabaseClient<Database>,
  { id, ...diff }: TUpdateGoal,
) => {
  const { data, error } = await supabase
    .from("goals")
    .update(snakeCase(diff) as TablesUpdate<"goals">)
    .eq("id", id)
    .select();

  if (error) throw error;
  return camelCase(data) as TGoal[];
};

export const deleteGoal = async (
  supabase: SupabaseClient<Database>,
  id: string,
) => {
  const { error } = await supabase.from("goals").delete().eq("id", id);

  if (error) throw error;
};
