import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import {
  getJournal,
  TJournal,
  TUpsertJournal,
  upsertJournal,
} from "../api/journals.ts";

import { isLastPendingMutation } from "../utils/isLastPendingMutation.ts";

import { supabase } from "./useAuth.tsx";
import { usePreferences } from "./usePreferences";

type TUseJournals = [
  TJournal,
  {
    isLoading: boolean;
    upsertJournal: (diff: Omit<TUpsertJournal, "date">) => void;
  },
];

export const useJournals = (date: string): TUseJournals => {
  const queryClient = useQueryClient();
  const [preferences] = usePreferences();

  const queryKey = ["journals", date];

  const defaultJournal: TJournal = useMemo(
    () => ({
      date,
      // Unlike notes, prompts always seed from the template so a blank day is
      // immediately answerable. Nothing persists until a response is typed.
      prompts: preferences.templatePrompts.map((prompt) => ({
        prompt,
        response: "",
      })),
    }),
    [date, preferences.templatePrompts],
  );

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => getJournal(supabase, date),
    retry: false,
    staleTime: 1000 * 60 * 10,
  });

  // An *empty* prompts array falls back to the template too, not just a missing
  // row. Post-DEX-51 a day can hold a note with no journal, and a day written
  // from Dexter would otherwise render here as a journal with nothing to answer.
  const journal = data?.prompts.length ? data : defaultJournal;

  // Saves for one day must not overlap. Every response writes the whole prompts
  // array, the inputs debounce at 500ms, and a round-trip slower than that (or
  // any retry) leaves two writes in flight for the same row with no ordering
  // guarantee — the older one can land last and overwrite a newer answer in
  // Postgres. A shared scope makes React Query run them one at a time, in the
  // order they were queued.
  const mutationKey = ["journals", date, "upsert"];

  const { mutate } = useMutation<
    TJournal | null,
    Error,
    Omit<TUpsertJournal, "date">,
    { previous: TJournal | null | undefined }
  >({
    mutationKey,
    scope: { id: `journals:${date}` },
    mutationFn: (diff) => upsertJournal(supabase, { ...diff, date }),
    // The upsert is idempotent, and retrying at this level survives the
    // component unmounting — a save flushed on a date change would otherwise
    // have no mounted component left to reschedule it.
    retry: 3,
    // Fold the diff into the cache immediately so switching tabs doesn't flash
    // the previous responses while the round-trip settles; roll back on error.
    onMutate: async (diff) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<TJournal | null>(queryKey);
      queryClient.setQueryData<TJournal>(queryKey, {
        ...(previous ?? defaultJournal),
        ...diff,
      });
      return { previous };
    },
    onError: (_error, _diff, context) => {
      // Only the last save may touch the cache — see `onSuccess`. Rolling back
      // while a newer save is queued would throw away an answer the user has
      // already typed (and, if that newer save succeeds, one the server holds).
      if (!isLastPendingMutation(queryClient, mutationKey)) return;

      if (context && context.previous !== undefined) {
        queryClient.setQueryData(queryKey, context.previous);
      } else {
        // The day was never fetched, so there is no prior value to restore —
        // drop the optimistic entry so a never-persisted response doesn't linger.
        queryClient.removeQueries({ queryKey });
      }
    },
    // Write the saved row straight into the cache instead of invalidating: a
    // refetch races the debounced inputs and can stamp a stale server value
    // over newer text. `null` means the scaffolding branch wrote nothing, so
    // the optimistic value stands.
    //
    // `onMutate` runs as soon as `mutate` is called, but the scope above delays
    // the request itself, so a newer save can already have folded its prompts
    // into the cache while this older one is still settling. Writing this
    // response then would push the stale answer back down into `ResponseInput`,
    // whose `response` effect overwrites whatever the user has typed since.
    onSuccess: (saved) => {
      if (!isLastPendingMutation(queryClient, mutationKey)) return;
      if (saved) queryClient.setQueryData(queryKey, saved);
    },
  });

  return [journal, { isLoading, upsertJournal: mutate }];
};
