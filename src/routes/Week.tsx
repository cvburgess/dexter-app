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

  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks(supabase),
  });

  const { mutate: update } = useMutation<TTask[], Error, TUpdateTask>({
    mutationFn: (diff) => updateTask(supabase, diff),
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["tasks"] });
    // },
    onSuccess: ([newTaskData]) => {
      queryClient.setQueryData(["tasks"], (oldData: TTask[]) => {
        // console.log("data", newTaskData);
        return oldData.map((task: TTask) => {
          return (task.id === newTaskData.id) ? newTaskData : task;
        });
      });
    },
  });

  const today = Temporal.Now.plainDateISO();
  const columns = makeColumnsForWeekOf(
    today.add({ weeks: weeksOffset }),
    tasks,
  );

  return (
    <View className="flex">
      <Board
        columns={columns}
        onTaskChange={(id, _index, column) =>
          update({ id, scheduledFor: column })}
      />
    </View>
  );
};

const makeColumnsForWeekOf = (
  date: Temporal.PlainDate,
  tasks: TTask[] | undefined = [],
): TColumn[] => {
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

  return dayNames.map((dayName, index) => {
    const isoDate = mostRecentMonday.add({ days: index }).toString();

    return {
      id: isoDate,
      title: dayName,
      tasks: tasks?.filter((task: TTask) => task.scheduledFor === isoDate),
    };
  });
};
