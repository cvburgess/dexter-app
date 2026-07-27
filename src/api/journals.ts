import { SupabaseClient } from "@supabase/supabase-js";

import { Database, Json } from "./database.types.ts";
import {
  isMissingTable,
  markLegacyDays,
  usingLegacyDays,
} from "./legacySchema.ts";

export type TJournalPrompt = { prompt: string; response: string };

export type TJournal = { date: string; prompts: TJournalPrompt[] };

// `prompts` is `jsonb` on the way out, and nullable on the legacy `days` row.
// Callers `.map()` it and read `.length`, so no null may reach them.
const toPrompts = (prompts: Json | null): TJournalPrompt[] =>
  (prompts ?? []) as TJournalPrompt[];

export const getJournal = async (
  supabase: SupabaseClient<Database>,
  date: string,
): Promise<TJournal | null> => {
  if (usingLegacyDays()) return getLegacyJournal(supabase, date);

  const { data, error, status } = await supabase
    .from("journals")
    .select("date, prompts")
    .eq("date", date)
    .limit(1)
    .maybeSingle();

  if (isMissingTable(status, error)) {
    markLegacyDays();
    return getLegacyJournal(supabase, date);
  }

  if (error) throw error;
  if (!data) return null;

  return { date: data.date, prompts: toPrompts(data.prompts) };
};

export type TUpsertJournal = { date: string; prompts: TJournalPrompt[] };

export const upsertJournal = async (
  supabase: SupabaseClient<Database>,
  { date, prompts }: TUpsertJournal,
): Promise<TJournal | null> => {
  if (usingLegacyDays())
    return upsertLegacyJournal(supabase, { date, prompts });

  // Prompts with no responses must never create a row — they are template
  // scaffolding, not something the user wrote. This is the same test the DEX-51
  // backfill used (at least one non-empty response, not merely a non-empty
  // array), and for the same reason: a row here means "the user journaled on
  // this day", and the current app reads that. `update` is a silent no-op when
  // there is no row, so this client cannot manufacture scaffolding rows, but it
  // still saves a response the user cleared.
  const hasResponse = prompts.some(({ response }) => response.trim() !== "");

  const query = hasResponse
    ? // The table is keyed (user_id, date) and `user_id` is never sent (column
      // default + RLS), so name the conflict target explicitly — PostgREST
      // would otherwise infer it from the payload's columns alone.
      supabase.from("journals").upsert(
        { date, prompts },
        {
          onConflict: "user_id,date",
        },
      )
    : supabase.from("journals").update({ prompts }).eq("date", date);

  const { data, error, status } = await query
    .select("date, prompts")
    .maybeSingle();

  if (isMissingTable(status, error)) {
    markLegacyDays();
    return upsertLegacyJournal(supabase, { date, prompts });
  }

  if (error) throw error;
  if (!data) return null;

  return { date: data.date, prompts: toPrompts(data.prompts) };
};

const getLegacyJournal = async (
  supabase: SupabaseClient<Database>,
  date: string,
): Promise<TJournal | null> => {
  const { data, error } = await supabase
    .from("days")
    .select("date, prompts")
    .eq("date", date)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return { date: data.date, prompts: toPrompts(data.prompts) };
};

const upsertLegacyJournal = async (
  supabase: SupabaseClient<Database>,
  { date, prompts }: TUpsertJournal,
): Promise<TJournal> => {
  // A partial upsert is safe here even though `days` is one shared row: ON
  // CONFLICT DO UPDATE only assigns the columns present in the payload, so
  // `notes` is left alone. The scaffolding guard above deliberately does not
  // apply — row presence carries no meaning in the old schema, and skipping the
  // write would strand a response the user just cleared.
  const { data, error } = await supabase
    .from("days")
    .upsert({ date, prompts })
    .select("date, prompts")
    .single();

  if (error) throw error;

  return { date: data.date, prompts: toPrompts(data.prompts) };
};
