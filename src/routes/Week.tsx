import { useState } from "react";
import { Temporal } from "@js-temporal/polyfill";

import { Board, TColumn } from "../components/Board.tsx";
import { View } from "../components/View.tsx";

import { useTasks } from "../hooks/useTasks.tsx";
import { TTask } from "../api/tasks.ts";

export const Week = () => {
  const [weeksOffset, _setWeeksOffset] = useState<number>(0);
  const [tasks] = useTasks();

  const today = Temporal.Now.plainDateISO();

  const columns = makeColumnsForWeekOf(
    today.add({ weeks: weeksOffset }),
    tasks,
  );

  return (
    <View>
      <Board
        canCreateTasks
        cardSize="compact"
        columns={columns}
        groupBy="scheduledFor"
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
