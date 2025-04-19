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

type THookOptions = {
  skipQuery?: boolean;
};

export const usePreferences = (options?: THookOptions): TUsePreferences => {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  const { data: preferences } = useQuery({
    enabled: !options?.skipQuery,
    placeholderData: defaultPreferences,
    queryKey: ["preferences"],
    queryFn: () => getPreferences(supabase),
    staleTime: 1000 * 60 * 10,
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
  calendarEndTime: "20:00:00",
  calendarStartTime: "06:00:00",
  calendarUrls: [],
  darkTheme: "dark",
  enableCalendar: false,
  enableHabits: true,
  enableJournal: true,
  enableNotes: true,
  lightTheme: "dexter",
  templateNote: "",
  templatePrompts: [],
  themeMode: EThemeMode.SYSTEM,
};
