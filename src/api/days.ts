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

  const defaultDay: TDay = {
    date,
    notes: "",
    prompts: [
      { prompt: "Yesterday's highlight", response: "" },
      { prompt: "Today I am grateful for", response: "" },
      { prompt: "Today I am excited for", response: "" },
      { prompt: "What matters most today", response: "" },
    ],
  };

  if (error) throw error;
  return (data[0] || defaultDay) as unknown as TDay;
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
