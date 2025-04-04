import { SupabaseClient } from "@supabase/supabase-js";
import camelCase from "camelcase-keys";
import snakeCase from "decamelize-keys";

import { Database } from "./database.types.ts";

export enum EThemeMode {
  SYSTEM,
  LIGHT,
  DARK,
}

export type TPreferences = {
  darkTheme: string;
  enableJournal: boolean;
  enableNotes: boolean;
  lightTheme: string;
  templateNote: string;
  templatePrompts: string[];
  themeMode: EThemeMode;
};

export const getPreferences = async (supabase: SupabaseClient<Database>) => {
  const { data, error } = await supabase
    .from("preferences")
    .select("*")
    .limit(1);

  if (error) throw error;
  return camelCase(data)[0] as TPreferences;
};

export type TUpdatePreferences = {
  userId: string;
  lightTheme?: string;
  darkTheme?: string;
  themeMode?: EThemeMode;
  enableNotes?: boolean;
  enableJournal?: boolean;
  templateNote?: string;
  templatePrompts?: string[];
};

export const updatePreferences = async (
  supabase: SupabaseClient<Database>,
  { userId, ...diff }: TUpdatePreferences,
) => {
  const { data, error } = await supabase
    .from("preferences")
    .update(snakeCase(diff))
    .eq("user_id", userId)
    .select();

  if (error) throw error;
  return camelCase(data)[0] as TPreferences;
};
