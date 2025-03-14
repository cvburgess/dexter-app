import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getDay, TDay, TUpsertDay, upsertDay } from "../api/days.ts";

import { useAuth } from "./useAuth.tsx";

type TUseDays = [TDay, {
  upsertDay: (diff: Omit<TUpsertDay, "date">) => void;
}];

export const useDays = (date: string): TUseDays => {
  const { supabase } = useAuth();
  const queryClient = useQueryClient();

  const defaultDay: TDay = {
    date,
    notes: "",
    prompts: [
      { prompt: "Yesterday's highlight", response: "" },
      { prompt: "Today I am grateful for", response: "" },
      { prompt: "Today I am excited for", response: "" },
      { prompt: "What matters most today", response: "" },
    ],
  };

  const { data: day } = useQuery({
    queryKey: ["days", `day-${date}`],
    queryFn: () => getDay(supabase, date),
  });

  console.dir(day?.prompts);

  const { mutate: upsert } = useMutation<TDay, Error, Omit<TUpsertDay, "date">>(
    {
      mutationFn: (diff) => upsertDay(supabase, { ...diff, date }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`day-${date}`] });
      },
    },
  );

  return [day || defaultDay, { upsertDay: upsert }];
};
