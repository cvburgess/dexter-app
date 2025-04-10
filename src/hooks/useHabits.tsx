import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createHabit,
  deleteHabit,
  getHabits,
  TCreateHabit,
  THabit,
  TUpdateHabit,
  updateHabit,
} from "../api/habits.ts";

import { supabase } from "./useAuth.tsx";

type TUseHabits = [
  THabit[],
  {
    createHabit: (habit: TCreateHabit) => void;
    deleteHabit: (id: string) => void;
    getHabitById: (id: string | null) => THabit | undefined;
    updateHabit: (habit: TUpdateHabit) => void;
  },
];

type THookOptions = {
  skipQuery?: boolean;
};

export const useHabits = (options?: THookOptions): TUseHabits => {
  const queryClient = useQueryClient();

  const { data: habits = [] } = useQuery({
    enabled: !options?.skipQuery,
    queryKey: ["habits"],
    queryFn: () => getHabits(supabase),
    staleTime: 1000 * 60 * 10,
  });

  const { mutate: create } = useMutation<THabit[], Error, TCreateHabit>({
    mutationFn: (habit) => createHabit(supabase, habit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  const { mutate: update } = useMutation<THabit[], Error, TUpdateHabit>({
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
