import { SupabaseClient } from "@supabase/supabase-js";

import { camelCase, snakeCase } from "../utils/changeCase.ts";

import { Database, TablesUpdate } from "./database.types.ts";

export type TJournalPrompt = { prompt: string; response: string };

export type TDay = { date: string; notes: string; prompts: TJournalPrompt[] };

export const getDay = async (
  supabase: SupabaseClient<Database>,
  date: string,
) => {
  const { data, error } = await supabase
    .from("days")
    .select("*")
    .eq("date", date)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("No day found");

  return camelCase(data) as TDay;
};

export type TUpsertDay = {
  date: string;
  notes?: string;
  prompts?: TJournalPrompt[];
};

export const upsertDay = async (
  supabase: SupabaseClient<Database>,
  diff: TUpsertDay,
) => {
  const { data, error } = await supabase
    .from("days")
    .upsert(snakeCase(diff) as TablesUpdate<"days">)
    .select()
    .single();

  if (error) throw error;
  return camelCase(data) as TDay;
};
