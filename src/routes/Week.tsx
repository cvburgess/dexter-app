import { useState } from "react";
import { Temporal } from "@js-temporal/polyfill";

import { Board, TColumn } from "../components/Board.tsx";
import { WeekNav } from "../components/Toolbar.tsx";
import { QuickDrawer } from "../components/QuickPlanner.tsx";
import { DraggableView, DrawerContainer } from "../components/View.tsx";

import { taskFilters, useTasks } from "../hooks/useTasks.tsx";
import { TTask } from "../api/tasks.ts";
import { makeOrFilter, TQueryFilter } from "../api/applyFilters.ts";
import { weekStartEnd } from "../utils/weekStartEnd.ts";

export const Week = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [weeksOffset, setWeeksOffset] = useState<number>(0);

  const { monday, sunday } = weekStartEnd(weeksOffset);

  const filters: Record<string, TQueryFilter[]> = {
    thisWeek: [
      ["scheduledFor", "gte", monday.toString()],
      ["scheduledFor", "lte", sunday.toString()],
    ],
    notThisWeek: [
      makeOrFilter([
        ["scheduledFor", "lt", monday.toString()],
        ["scheduledFor", "gt", sunday.toString()],
        ["scheduledFor", "is", null],
      ]),
      ...taskFilters.incomplete,
    ],
  };

  const [tasks] = useTasks(filters.thisWeek);

  const columns = makeColumnsForWeekOf(monday, tasks);

  return (
    <DraggableView>
      <WeekNav
        setWeeksOffset={setWeeksOffset}
        toggleQuickPlan={() => setIsOpen(!isOpen)}
        weeksOffset={weeksOffset}
      />
      <DrawerContainer>
        <Board
          canCreateTasks
          cardSize="compact-w"
          columns={columns}
          groupBy="scheduledFor"
        />
        <QuickDrawer baseFilters={filters.notThisWeek} isOpen={isOpen} />
      </DrawerContainer>
    </DraggableView>
  );
};

const makeColumnsForWeekOf = (
  mostRecentMonday: Temporal.PlainDate,
  tasks: TTask[],
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
    const date = mostRecentMonday.add({ days: index });
    const isoDate = date.toString();

    return {
      id: isoDate,
      isActive: isoDate === Temporal.Now.plainDateISO().toString(),
      subtitle: date.toLocaleString(["en-us"], {
        month: "numeric",
        day: "numeric",
      }),
      title: dayName,
      tasks: tasks?.filter((task: TTask) => task.scheduledFor === isoDate),
    };
  });
};
