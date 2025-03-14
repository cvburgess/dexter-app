import { SupabaseClient } from "@supabase/supabase-js";

import { Database, Json } from "./database.types.ts";

export type TDay = {
  date: string;
  notes: string;
  prompts: Json;
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
  return data[0] as TDay;
};

export const upsertDay = async (
  supabase: SupabaseClient<Database>,
  day: TDay,
) => {
  const { data, error } = await supabase
    .from("days")
    .upsert(day)
    .select();

  if (error) throw error;
  return data[0] as TDay;
};
