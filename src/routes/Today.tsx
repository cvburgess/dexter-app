import { useState } from "react";
import { Temporal } from "@js-temporal/polyfill";

import { Board } from "../components/Board.tsx";
import { View } from "../components/View.tsx";

import { taskFilters, useTasks } from "../hooks/useTasks.tsx";
import { QuickPlanner } from "../components/QuickPlanner.tsx";
import { DayNav } from "../components/Toolbar.tsx";

export const Today = () => {
  const [date, setDate] = useState<Temporal.PlainDate>(
    Temporal.Now.plainDateISO(),
  );

  const [tasks] = useTasks([["scheduledFor", "eq", date.toString()]]);

  return (
    <View className="flex-col">
      <DayNav date={date} setDate={setDate} />

      <Board
        canCreateTasks
        columns={[{
          id: date.toString(),
          tasks: tasks,
        }]}
        groupBy="scheduledFor"
        topSpacing="top-14"
      />

      <QuickPlanner baseFilters={taskFilters.notToday} />
    </View>
  );
};
