import { useState } from "react";
import { Temporal } from "@js-temporal/polyfill";

import { Board, TColumn } from "../components/Board.tsx";
import { QuickPlanner } from "../components/QuickPlanner.tsx";
import { View } from "../components/View.tsx";

import { useTasks } from "../hooks/useTasks.tsx";
import { TTask } from "../api/tasks.ts";
import { TQueryFilter } from "../api/applyFilters.ts";
import { weekStartEnd } from "../utils/weekStartEnd.ts";

export const Week = () => {
  const [weeksOffset, _setWeeksOffset] = useState<number>(0);

  const { mostRecentMonday, sunday } = weekStartEnd(weeksOffset);

  const filters: Record<string, TQueryFilter[]> = {
    thisWeek: [
      ["scheduledFor", "gte", mostRecentMonday.toString()],
      ["scheduledFor", "lte", sunday.toString()],
    ],
    notThisWeek: [
      ["scheduledFor", "lt", mostRecentMonday.toString()],
      ["scheduledFor", "gt", sunday.toString()],
    ],
  };

  const [tasks] = useTasks(filters.thisWeek);

  const columns = makeColumnsForWeekOf(mostRecentMonday, tasks);

  return (
    <View>
      <Board
        canCreateTasks
        cardSize="compact-w"
        columns={columns}
        groupBy="scheduledFor"
      />
      <QuickPlanner baseFilters={filters.notThisWeek} />
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
