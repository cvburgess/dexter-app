import { SupabaseClient } from "@supabase/supabase-js";

import { Database } from "./database.types.ts";

export type TJournalPrompt = {
  prompt: string;
  response: string;
};

export type TDay = {
  date: string;
  notes: string;
  prompts: TJournalPrompt[];
};

export const getDay = async (
  supabase: SupabaseClient<Database>,
  date: string,
) => {
  const { data, error } = await supabase
    .from("days")
    .select("*")
    .eq("date", date)
    .limit(1);

  if (error) throw error;
  return data[0] as unknown as TDay;
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
    .upsert(diff)
    .select();

  if (error) throw error;
  return data[0] as unknown as TDay;
};
