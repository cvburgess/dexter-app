import { SupabaseClient } from "@supabase/supabase-js";

import { camelCase, snakeCase } from "../utils/changeCase.ts";

import { Database, TablesUpdate } from "./database.types.ts";

export enum EThemeMode {
  SYSTEM,
  LIGHT,
  DARK,
}

export type TPreferences = {
  calendarEndTime: string;
  calendarStartTime: string;
  calendarUrls: string[];
  darkTheme: string;
  enableCalendar: boolean;
  enableHabits: boolean;
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
    .limit(1)
    .single();

  if (error) throw error;
  return camelCase(data) as TPreferences;
};

export type TUpdatePreferences = {
  calendarEndTime?: string;
  calendarStartTime?: string;
  calendarUrls?: string[];
  enableCalendar?: boolean;
  enableHabits?: boolean;
  enableJournal?: boolean;
  enableNotes?: boolean;
  lightTheme?: string;
  templateNote?: string;
  templatePrompts?: string[];
  themeMode?: EThemeMode;
  userId: string;
};

export const updatePreferences = async (
  supabase: SupabaseClient<Database>,
  { userId, ...diff }: TUpdatePreferences,
) => {
  const { data, error } = await supabase
    .from("preferences")
    .update(snakeCase(diff) as TablesUpdate<"preferences">)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return camelCase(data) as TPreferences;
};
