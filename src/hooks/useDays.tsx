import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getDay,
  TDay,
  TJournalPrompt,
  TUpsertDay,
  upsertDay,
} from "../api/days.ts";

import { supabase } from "./useAuth.tsx";
import { usePreferences } from "./usePreferences";

type TUseDays = [
  TDay & { prompts: TJournalPrompt[] },
  { upsertDay: (diff: Omit<TUpsertDay, "date">) => void },
];

export const useDays = (date: string): TUseDays => {
  const queryClient = useQueryClient();
  const [preferences] = usePreferences();

  const defaultDay: TDay = {
    date,
    notes: preferences.templateNote,
    prompts: preferences.templatePrompts.map((prompt) => ({
      prompt,
      response: "",
    })),
  };

  const { data: day = defaultDay } = useQuery({
    queryKey: ["days", `day-${date}`],
    queryFn: () => getDay(supabase, date),
    staleTime: 1000 * 60 * 10,
  });

  const { mutate: upsert } = useMutation<TDay, Error, Omit<TUpsertDay, "date">>(
    {
      mutationFn: (diff) => upsertDay(supabase, { ...diff, date }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`day-${date}`] });
      },
    },
  );

  return [day, { upsertDay: upsert }];
};
