// deno-lint-ignore-file no-unused-vars
import { useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Temporal } from "@js-temporal/polyfill";

import { Card } from "../components/Card.tsx";
import { List } from "../components/List.tsx";
import { View } from "../components/View.tsx";
import { useAuth } from "../hooks/useAuth.tsx";
import { createTask, getTasks, Task, updateTask } from "../api/tasks.ts";

type Day = {
  date: string;
  dayName: string;
};

export const Week = () => {
  const { supabase } = useAuth();
  const [weeksOffset, _setWeeksOffset] = useState<number>(0);
  const queryClient = useQueryClient();

  const { isPending, error, data: tasks, isFetching } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks(supabase),
  });

  if (isPending) return <p>Loading...</p>;

  const today = Temporal.Now.plainDateISO();
  const daysOfWeek = daysForWeekOfDate(today.add({ weeks: weeksOffset }));

  return (
    <View className="flex">
      {daysOfWeek.map((day) => {
        const tasksForDay = tasks?.filter((task: Task) =>
          task.scheduledFor === day.date
        );

        return (
          <List key={day.date} id={day.date}>
            {tasksForDay?.map((task, index) => (
              <Card
                index={index}
                key={task.id}
                task={task}
                groupBy="scheduledFor"
              />
            ))}
          </List>
        );
      })}
    </View>
  );
};

const daysForWeekOfDate = (date: Temporal.PlainDate): Day[] => {
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
    date: mostRecentMonday.add({ days: index }).toString(),
    dayName: dayName,
  }));
};
