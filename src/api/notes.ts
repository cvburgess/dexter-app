import { SupabaseClient } from "@supabase/supabase-js";

import { Database } from "./database.types.ts";
import {
  isMissingTable,
  markLegacyDays,
  usingLegacyDays,
} from "./legacySchema.ts";

export type TNote = { date: string; content: string };

export const getNote = async (
  supabase: SupabaseClient<Database>,
  date: string,
): Promise<TNote | null> => {
  if (usingLegacyDays()) return getLegacyNote(supabase, date);

  const { data, error, status } = await supabase
    .from("notes")
    .select("date, content")
    .eq("date", date)
    .limit(1)
    .maybeSingle();

  if (isMissingTable(status, error)) {
    markLegacyDays();
    return getLegacyNote(supabase, date);
  }

  if (error) throw error;

  // `null` when the day has no row at all, which is distinct from a row holding
  // an empty note: the first means "never written" (show the daily template),
  // the second means "written, then cleared" (leave it blank).
  return data;
};

export type TUpsertNote = { date: string; content: string };

export const upsertNote = async (
  supabase: SupabaseClient<Database>,
  { date, content }: TUpsertNote,
): Promise<TNote | null> => {
  if (usingLegacyDays()) return upsertLegacyNote(supabase, { date, content });

  // An empty note must never create a row. Row presence in the new tables is a
  // signal — "the user actually used this surface" — which the DEX-51 backfill
  // went out of its way to preserve (it copied only days with real content) and
  // which the current app reads to decide whether to offer its note-template
  // chooser. `update` is a silent no-op when there is no row, so this client
  // cannot manufacture blank rows, but it still clears a note the user had.
  const query = content.trim()
    ? // The table is keyed (user_id, date) and `user_id` is never sent (column
      // default + RLS), so name the conflict target explicitly — PostgREST
      // would otherwise infer it from the payload's columns alone.
      supabase.from("notes").upsert(
        { date, content },
        {
          onConflict: "user_id,date",
        },
      )
    : supabase.from("notes").update({ content }).eq("date", date);

  const { data, error, status } = await query
    .select("date, content")
    .maybeSingle();

  if (isMissingTable(status, error)) {
    markLegacyDays();
    return upsertLegacyNote(supabase, { date, content });
  }

  if (error) throw error;

  // `null` only from the empty-content branch above when no row existed, i.e.
  // nothing was written and there is nothing to fold back into the cache.
  return data;
};

const getLegacyNote = async (
  supabase: SupabaseClient<Database>,
  date: string,
): Promise<TNote | null> => {
  const { data, error } = await supabase
    .from("days")
    .select("date, notes")
    .eq("date", date)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return { date: data.date, content: data.notes ?? "" };
};

const upsertLegacyNote = async (
  supabase: SupabaseClient<Database>,
  { date, content }: TUpsertNote,
): Promise<TNote> => {
  // A partial upsert is safe here even though `days` is one shared row: ON
  // CONFLICT DO UPDATE only assigns the columns present in the payload, so
  // `prompts` is left alone. The empty-content guard above deliberately does
  // not apply — row presence carries no meaning in the old schema, and skipping
  // the write would strand a note the user just cleared.
  const { data, error } = await supabase
    .from("days")
    .upsert({ date, notes: content })
    .select("date, notes")
    .single();

  if (error) throw error;

  return { date: data.date, content: data.notes ?? "" };
};
