import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createGoal,
  deleteGoal,
  getGoals,
  TCreateGoal,
  TGoal,
  TUpdateGoal,
  updateGoal,
} from "../api/goals.ts";

import { supabase } from "./useAuth.tsx";

type TUseGoals = [
  TGoal[],
  {
    createGoal: (goal: TCreateGoal) => void;
    deleteGoal: (id: string) => void;
    getGoalById: (id: string | null) => TGoal | undefined;
    updateGoal: (goal: TUpdateGoal) => void;
  },
];

export const useGoals = (): TUseGoals => {
  const queryClient = useQueryClient();

  const { data: goals = [] } = useQuery({
    queryKey: ["goals"],
    queryFn: () => getGoals(supabase),
  });

  const { mutate: create } = useMutation<TGoal[], Error, TCreateGoal>({
    mutationFn: ({ title, emoji }) => createGoal(supabase, { title, emoji }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });

  const { mutate: update } = useMutation<TGoal[], Error, TUpdateGoal>({
    mutationFn: (diff) => updateGoal(supabase, diff),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });

  const { mutate: remove } = useMutation<void, Error, string>({
    mutationFn: (id) => deleteGoal(supabase, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });

  const getGoalById = (id: string | null) => {
    if (!id) return undefined;
    return goals?.find((goal) => goal.id === id);
  };

  return [
    goals,
    { createGoal: create, deleteGoal: remove, getGoalById, updateGoal: update },
  ];
};
