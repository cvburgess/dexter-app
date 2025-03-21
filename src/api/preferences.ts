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
  lightTheme: string;
  darkTheme: string;
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
  lightTheme?: string;
  darkTheme?: string;
  themeMode?: EThemeMode;
};

export const updatePreferences = async (
  supabase: SupabaseClient<Database>,
  diff: TUpdatePreferences,
) => {
  const { data, error } = await supabase
    .from("preferences")
    .update(snakeCase(diff))
    .select();

  if (error) throw error;
  return camelCase(data)[0] as TPreferences;
};
