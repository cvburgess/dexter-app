import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import { getNote, TNote, TUpsertNote, upsertNote } from "../api/notes.ts";

import { isLastPendingMutation } from "../utils/isLastPendingMutation.ts";

import { supabase } from "./useAuth.tsx";
import { usePreferences } from "./usePreferences";

type TUseNotes = [
  TNote,
  {
    isLoading: boolean;
    upsertNote: (diff: Omit<TUpsertNote, "date">) => void;
  },
];

export const useNotes = (date: string): TUseNotes => {
  const queryClient = useQueryClient();
  const [preferences] = usePreferences();

  const queryKey = ["notes", date];

  const defaultNote: TNote = useMemo(
    () => ({ date, content: preferences.templateNote }),
    [date, preferences.templateNote],
  );

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => getNote(supabase, date),
    retry: false,
    staleTime: 1000 * 60 * 10,
  });

  // `data` is a row, `null` for a day with no row, or `undefined` while
  // loading. Only the last two get the daily-note template: a row holding an
  // empty note means the user cleared it, and re-seeding the template there
  // would undo that on every remount.
  const note = data ?? defaultNote;

  // Saves for one day must not overlap. The editor debounces at 500ms, so a
  // round-trip slower than that (or any retry) leaves two writes in flight for
  // the same row with no ordering guarantee — the older one can land last and
  // overwrite newer text in Postgres. A shared scope makes React Query run them
  // one at a time, in the order they were queued.
  const mutationKey = ["notes", date, "upsert"];

  const { mutate } = useMutation<
    TNote | null,
    Error,
    Omit<TUpsertNote, "date">,
    { previous: TNote | null | undefined }
  >({
    mutationKey,
    scope: { id: `notes:${date}` },
    mutationFn: (diff) => upsertNote(supabase, { ...diff, date }),
    // The upsert is idempotent, and retrying at this level survives the
    // component unmounting — a save flushed on a date change would otherwise
    // have no mounted component left to reschedule it.
    retry: 3,
    // Fold the diff into the cache immediately so switching tabs doesn't flash
    // the previous content while the round-trip settles; roll back on error.
    onMutate: async (diff) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<TNote | null>(queryKey);
      queryClient.setQueryData<TNote>(queryKey, {
        ...(previous ?? defaultNote),
        ...diff,
      });
      return { previous };
    },
    onError: (_error, _diff, context) => {
      // Only the last save may touch the cache — see `onSuccess`. Rolling back
      // while a newer save is queued would throw away text the user has already
      // typed (and, if that newer save succeeds, text the server now holds).
      if (!isLastPendingMutation(queryClient, mutationKey)) return;

      if (context && context.previous !== undefined) {
        queryClient.setQueryData(queryKey, context.previous);
      } else {
        // The day was never fetched, so there is no prior value to restore —
        // drop the optimistic entry so a never-persisted note doesn't linger.
        queryClient.removeQueries({ queryKey });
      }
    },
    // Write the saved row straight into the cache instead of invalidating: a
    // refetch races the debounced editor and can stamp a stale server value
    // over newer text. `null` means the empty-content branch wrote nothing, so
    // the optimistic value stands.
    //
    // `onMutate` runs as soon as `mutate` is called, but the scope above delays
    // the request itself, so a newer save can already have folded its text into
    // the cache while this older one is still settling. Writing this response
    // then would stamp that newer text back to what the server had a save ago.
    onSuccess: (saved) => {
      if (!isLastPendingMutation(queryClient, mutationKey)) return;
      if (saved) queryClient.setQueryData(queryKey, saved);
    },
  });

  return [note, { isLoading, upsertNote: mutate }];
};
