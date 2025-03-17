import { useState } from "react";
import { Temporal } from "@js-temporal/polyfill";

import { Board, TColumn } from "../components/Board.tsx";
import { WeekNav } from "../components/Toolbar.tsx";
import { QuickDrawer } from "../components/QuickPlanner.tsx";
import { View } from "../components/View.tsx";

import { taskFilters, useTasks } from "../hooks/useTasks.tsx";
import { TTask } from "../api/tasks.ts";
import { makeOrFilter, TQueryFilter } from "../api/applyFilters.ts";
import { weekStartEnd } from "../utils/weekStartEnd.ts";

export const Week = () => {
  const [weeksOffset, setWeeksOffset] = useState<number>(0);

  const { mostRecentMonday, sunday } = weekStartEnd(weeksOffset);

  const filters: Record<string, TQueryFilter[]> = {
    thisWeek: [
      ["scheduledFor", "gte", mostRecentMonday.toString()],
      ["scheduledFor", "lte", sunday.toString()],
    ],
    notThisWeek: [
      makeOrFilter([
        ["scheduledFor", "lt", mostRecentMonday.toString()],
        ["scheduledFor", "gt", sunday.toString()],
        ["scheduledFor", "is", null],
      ]),
      ...taskFilters.incomplete,
    ],
  };

  const [tasks] = useTasks(filters.thisWeek);

  const columns = makeColumnsForWeekOf(mostRecentMonday, tasks);

  return (
    <View className="flex-col">
      <WeekNav weeksOffset={weeksOffset} setWeeksOffset={setWeeksOffset} />
      <Board
        canCreateTasks
        cardSize="compact-w"
        columns={columns}
        groupBy="scheduledFor"
        topSpacing="top-14"
      />
      <QuickDrawer baseFilters={filters.notThisWeek} />
    </View>
  );
};

const makeColumnsForWeekOf = (
  mostRecentMonday: Temporal.PlainDate,
  tasks: TTask[]
): TColumn[] => {
  const dayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return dayNames.map((dayName, index) => {
    const isoDate = mostRecentMonday.add({ days: index }).toString();

    return {
      id: isoDate,
      isActive: isoDate === Temporal.Now.plainDateISO().toString(),
      title: dayName,
      tasks: tasks?.filter((task: TTask) => task.scheduledFor === isoDate),
    };
  });
};
