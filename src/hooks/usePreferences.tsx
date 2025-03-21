import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getPreferences,
  updatePreferences,
  TPreferences,
  TUpdatePreferences,
} from "../api/preferences.ts";

import { useAuth } from "./useAuth.tsx";

type TUsePreferences = [
  TPreferences,
  {
    updatePreferences: (preferences: TUpdatePreferences) => void;
  },
];

export const usePreferences = (): TUsePreferences => {
  const { supabase } = useAuth();
  const queryClient = useQueryClient();

  const { data: preferences } = useQuery({
    queryKey: ["preferences"],
    queryFn: () => getPreferences(supabase),
  });

  const { mutate: update } = useMutation<
    TPreferences,
    Error,
    TUpdatePreferences
  >({
    mutationFn: (diff) => updatePreferences(supabase, diff),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["preferences"] });
    },
  });

  return [preferences, { updatePreferences: update }];
};
