import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getPreferences,
  updatePreferences,
  TPreferences,
  TUpdatePreferences,
  EThemeMode,
} from "../api/preferences.ts";

import { supabase, useAuth } from "./useAuth.tsx";

type TUsePreferences = [
  TPreferences,
  {
    updatePreferences: (
      preferences: Omit<TUpdatePreferences, "userId">,
    ) => void;
  },
];

export const usePreferences = (): TUsePreferences => {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  const { data: preferences = defaultPreferences } = useQuery({
    queryKey: ["preferences"],
    queryFn: () => getPreferences(supabase),
  });

  const { mutate: update } = useMutation<
    TPreferences,
    Error,
    Omit<TUpdatePreferences, "userId">
  >({
    mutationFn: (diff) => updatePreferences(supabase, { userId, ...diff }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["preferences"] });
    },
  });

  return [preferences, { updatePreferences: update }];
};

const defaultPreferences: TPreferences = {
  darkTheme: "dark",
  enableJournal: true,
  enableNotes: true,
  lightTheme: "dexter",
  templateNote: "",
  templatePrompts: [],
  themeMode: EThemeMode.SYSTEM,
};
