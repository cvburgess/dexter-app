import { SupabaseClient } from "@supabase/supabase-js";
import camelCase from "camelcase-keys";
import snakeCase from "decamelize-keys";

import { Database } from "./database.types.ts";

export type TList = {
  createdAt: string;
  emoji: string;
  id: string;
  isArchived: boolean;
  title: string;
};

export const getLists = async (supabase: SupabaseClient<Database>) => {
  const { data, error } = await supabase
    .from("lists")
    .select("*")
    .eq("is_archived", false)
    .order("created_at");

  if (error) throw error;
  return camelCase(data) as TList[];
};

export type TCreateList = { emoji: string; title: string };

export const createList = async (
  supabase: SupabaseClient<Database>,
  list: TCreateList,
) => {
  const { data, error } = await supabase
    .from("lists")
    .insert(snakeCase(list))
    .select();

  if (error) throw error;
  return camelCase(data) as TList[];
};

export type TUpdateList = {
  emoji?: string;
  id: string;
  isArchived?: boolean;
  title?: string;
};

export const updateList = async (
  supabase: SupabaseClient<Database>,
  { id, ...diff }: TUpdateList,
) => {
  const { data, error } = await supabase
    .from("lists")
    .update(snakeCase(diff))
    .eq("id", id)
    .select();

  if (error) throw error;
  return camelCase(data) as TList[];
};

export const deleteList = async (
  supabase: SupabaseClient<Database>,
  id: string,
) => {
  const { error } = await supabase.from("lists").delete().eq("id", id);

  if (error) throw error;
};
