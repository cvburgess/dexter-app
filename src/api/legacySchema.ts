import { PostgrestError } from "@supabase/supabase-js";

// DEX-51 split `public.days` (`notes`, `prompts`) into `public.notes`
// (`content`) and `public.journals` (`prompts`), both keyed (user_id, date).
// This release reads and writes the new tables, but has to keep working if they
// are not reachable: the migration's documented rollback drops both, and this
// client auto-updates into the hands of users we cannot coordinate with. Older
// dexter-app builds are explicitly unsupported — only this one straddles both
// schemas.

// PostgREST reports an unknown table as 404 + PGRST205 ("Could not find the
// table 'public.notes' in the schema cache"); older versions surface the raw
// Postgres 42P01. Gating on the status as well makes it impossible to confuse
// with an RLS denial (42501, 403), an expired JWT (PGRST301, 401), or a network
// failure (status 0). PGRST204 ("Could not find the 'x' column…", 400) is
// deliberately excluded: that means the tables shipped with a different shape,
// and quietly writing to `days` instead would hide a real bug.
const MISSING_TABLE_CODES = ["PGRST205", "42P01"];

export const isMissingTable = (status: number, error: PostgrestError | null) =>
  status === 404 && !!error && MISSING_TABLE_CODES.includes(error.code);

// Fall back for a bounded window rather than for the rest of the session. This
// is a desktop app whose process can live for days, so a client that latched
// onto `days` permanently would keep writing there long after the new tables
// came back — and those writes are invisible to every other Dexter client.
const FALLBACK_DURATION_MS = 5 * 60 * 1000;

let fallbackUntil = 0;

export const usingLegacyDays = () => Date.now() < fallbackUntil;

export const markLegacyDays = () => {
  fallbackUntil = Date.now() + FALLBACK_DURATION_MS;
};
