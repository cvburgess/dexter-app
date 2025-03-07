import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Temporal } from "@js-temporal/polyfill";

import { Board, TColumn } from "../components/Board.tsx";
import { View } from "../components/View.tsx";

import { useAuth } from "../hooks/useAuth.tsx";
import {
  // createTask,
  getTasks,
  TTask,
  TUpdateTask,
  updateTask,
} from "../api/tasks.ts";

export const Week = () => {
  const { supabase } = useAuth();
  const queryClient = useQueryClient();
  const [weeksOffset, _setWeeksOffset] = useState<number>(0);

  const { isPending, data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks(supabase),
  });

  const { mutate: update } = useMutation<TTask[], Error, TUpdateTask>({
    mutationFn: (diff) => updateTask(supabase, diff),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  if (isPending) return <p>Loading...</p>;

  const today = Temporal.Now.plainDateISO();
  const daysOfWeek = daysForWeekOfDate(today.add({ weeks: weeksOffset }));

  return (
    <View className="flex">
      <Board
        columns={daysOfWeek}
        groupBy="scheduledFor"
        onTaskChange={update}
        tasks={tasks}
      />
    </View>
  );
};

const daysForWeekOfDate = (date: Temporal.PlainDate): TColumn[] => {
  const mostRecentMonday = date.subtract({ days: date.dayOfWeek - 1 });

  const dayNames = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return dayNames.map((dayName, index) => ({
    id: mostRecentMonday.add({ days: index }).toString(),
    title: dayName,
  }));
};
