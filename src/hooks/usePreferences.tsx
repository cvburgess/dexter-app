import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getPreferences,
  updatePreferences,
  TPreferences,
  TUpdatePreferences,
  EThemeMode,
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

  const { data: preferences = defaultPreferences } = useQuery({
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

const defaultPreferences: TPreferences = {
  themeMode: EThemeMode.SYSTEM,
  lightTheme: "dexter",
  darkTheme: "dark",
};
