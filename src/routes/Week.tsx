import { useState } from "react";
import { Temporal } from "@js-temporal/polyfill";

import { Board, TColumn } from "../components/Board.tsx";
import { QuickPlanner } from "../components/QuickPlanner.tsx";
import { View } from "../components/View.tsx";

import { useTasks } from "../hooks/useTasks.tsx";
import { TTask } from "../api/tasks.ts";
import { TQueryFilter } from "../api/applyFilters.ts";

export const Week = () => {
  const [weeksOffset, _setWeeksOffset] = useState<number>(0);

  const today = Temporal.Now.plainDateISO();
  const mostRecentMonday = today
    .add({ weeks: weeksOffset })
    .subtract({ days: today.dayOfWeek - 1 });
  const sunday = mostRecentMonday.add({ days: 6 });

  const filters: TQueryFilter[] = [
    ["scheduledFor", "gte", mostRecentMonday.toString()],
    ["scheduledFor", "lte", sunday.toString()],
  ];

  const [tasks] = useTasks(filters);

  const columns = makeColumnsForWeekOf(mostRecentMonday, tasks);

  return (
    <View>
      <Board
        canCreateTasks
        cardSize="compact-w"
        columns={columns}
        groupBy="scheduledFor"
      />
      <QuickPlanner />
    </View>
  );
};

const makeColumnsForWeekOf = (
  mostRecentMonday: Temporal.PlainDate,
  tasks: TTask[],
): TColumn[] => {
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
