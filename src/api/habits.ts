import { SupabaseClient } from "@supabase/supabase-js";

import { camelCase, snakeCase } from "../utils/changeCase.ts";

import { Database, TablesInsert, TablesUpdate } from "./database.types.ts";
import { applyFilters, TQueryFilter } from "./applyFilters.ts";

export type THabit = {
  daysActive: number[];
  emoji: string;
  id: string;
  isArchived: boolean;
  isPaused: boolean;
  steps: number;
  title: string;
};

export const getHabits = async (
  supabase: SupabaseClient<Database>,
  filters: TQueryFilter[],
) => {
  const query = supabase.from("habits").select("*").eq("is_archived", false);

  applyFilters(query, filters);
  query.order("title"); // TODO: Replace with sorting?

  const { data, error } = await query;
  if (error) throw error;
  return camelCase(data) as THabit[];
};

export type TCreateHabit = {
  daysActive: number[];
  emoji: string;
  steps: number;
  title: string;
};

export const createHabit = async (
  supabase: SupabaseClient<Database>,
  habit: TCreateHabit,
) => {
  const { data, error } = await supabase
    .from("habits")
    .insert(snakeCase(habit) as TablesInsert<"habits">)
    .select()
    .single();

  if (error) throw error;
  return camelCase(data) as THabit;
};

export type TUpdateHabit = {
  daysActive?: number[];
  emoji?: string;
  id: string;
  isArchived?: boolean;
  isPaused?: boolean;
  steps?: number;
  title?: string;
};

export const updateHabit = async (
  supabase: SupabaseClient<Database>,
  { id, ...diff }: TUpdateHabit,
) => {
  const { data, error } = await supabase
    .from("habits")
    .update(snakeCase(diff) as TablesUpdate<"habits">)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return camelCase(data) as THabit;
};

export const deleteHabit = async (
  supabase: SupabaseClient<Database>,
  id: string,
) => {
  const { error } = await supabase.from("habits").delete().eq("id", id);

  if (error) throw error;
};

// ---------- DAILY HABITS ----------

export type TDailyHabit = {
  date: string;
  habitId: string;
  habits: THabit;
  percentComplete: number;
  steps: number;
  stepsComplete: number;
};

export const getDailyHabits = async (
  supabase: SupabaseClient<Database>,
  date: string,
) => {
  const { data, error } = await supabase
    .from("daily_habits")
    .select("*, habits(*)")
    .eq("date", date);

  if (error) throw error;
  return camelCase(data) as TDailyHabit[];
};

export type TCreateDailyHabit = {
  date: string;
  habitId: string;
  steps: number;
  stepsComplete: number;
};

export const createDailyHabit = async (
  supabase: SupabaseClient<Database>,
  dailyHabit: TCreateDailyHabit,
) => {
  const { data, error } = await supabase
    .from("daily_habits")
    .insert(snakeCase(dailyHabit) as TablesInsert<"daily_habits">)
    .select()
    .single();

  if (error) throw error;
  return camelCase(data) as TDailyHabit;
};

export type TUpdateDailyHabit = {
  date: string;
  habitId: string;
  stepsComplete?: number;
};

export const updateDailyHabit = async (
  supabase: SupabaseClient<Database>,
  { date, habitId, ...diff }: TUpdateDailyHabit,
) => {
  const { data, error } = await supabase
    .from("daily_habits")
    .update(snakeCase(diff) as TablesUpdate<"daily_habits">)
    .eq("date", date)
    .eq("habit_id", habitId)
    .select()
    .single();

  if (error) throw error;
  return camelCase(data) as TDailyHabit;
};
