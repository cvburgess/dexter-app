import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "./useAuth.tsx";

import {
  createDailyHabit,
  createHabit,
  deleteHabit,
  getDailyHabits,
  getHabits,
  TCreateDailyHabit,
  TCreateHabit,
  TDailyHabit,
  THabit,
  TUpdateDailyHabit,
  TUpdateHabit,
  updateDailyHabit,
  updateHabit,
} from "../api/habits.ts";
import { TQueryFilter } from "../api/applyFilters.ts";

type TUseHabits = [
  THabit[],
  {
    createHabit: (habit: TCreateHabit) => void;
    deleteHabit: (id: string) => void;
    getHabitById: (id: string | null) => THabit | undefined;
    updateHabit: (habit: TUpdateHabit) => void;
  },
];

type TSupabaseHookOptions = {
  skipQuery?: boolean;
  filters?: TQueryFilter[];
};

export const useHabits = (options?: TSupabaseHookOptions): TUseHabits => {
  const queryClient = useQueryClient();

  const { data: habits = [] } = useQuery({
    enabled: !options?.skipQuery,
    queryKey: ["habits", options?.filters],
    queryFn: () => getHabits(supabase, options?.filters),
    staleTime: 1000 * 60 * 10,
  });

  const { mutate: create } = useMutation<THabit, Error, TCreateHabit>({
    mutationFn: (habit) => createHabit(supabase, habit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  const { mutate: update } = useMutation<THabit, Error, TUpdateHabit>({
    mutationFn: (diff) => updateHabit(supabase, diff),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  const { mutate: remove } = useMutation<void, Error, string>({
    mutationFn: (id) => deleteHabit(supabase, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  const getHabitById = (id: string | null) => {
    if (!id) return undefined;
    return habits?.find((habit) => habit.id === id);
  };

  return [
    habits,
    {
      createHabit: create,
      deleteHabit: remove,
      getHabitById,
      updateHabit: update,
    },
  ];
};

type TUseDailyHabits = [
  TDailyHabit[],
  {
    createDailyHabit: (habit: TCreateDailyHabit) => void;
    incrementDailyHabit: (habit: TDailyHabit) => void;
  },
];

export const useDailyHabits = (date: string): TUseDailyHabits => {
  const queryClient = useQueryClient();

  const { data: dailyHabits = [] } = useQuery({
    queryKey: ["dailyHabits", date],
    queryFn: () => getDailyHabits(supabase, date),
    staleTime: 1000 * 60 * 10,
  });

  const { mutate: create } = useMutation<TDailyHabit, Error, TCreateDailyHabit>(
    {
      mutationFn: (habit) => createDailyHabit(supabase, habit),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["dailyHabits", date],
        });
      },
    },
  );

  const { mutate: update } = useMutation<TDailyHabit, Error, TUpdateDailyHabit>(
    {
      mutationFn: (diff) => updateDailyHabit(supabase, diff),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["dailyHabits", date],
        });
      },
    },
  );

  const incrementDailyHabit = (dailyHabit: TDailyHabit) => {
    const { date, habitId, steps, stepsComplete } = dailyHabit;

    // When the steps are complete, reset to 0
    const next = stepsComplete === steps ? 0 : stepsComplete + 1;

    update({ date, habitId, stepsComplete: next });
  };

  return [dailyHabits, { createDailyHabit: create, incrementDailyHabit }];
};

export const habitFilters: Record<string, TQueryFilter[]> = {
  active: [["isPaused", "eq", false]],
};
