import { useState } from "react";
import { Temporal } from "@js-temporal/polyfill";

import { Board } from "../components/Board.tsx";
import { View } from "../components/View.tsx";

import { taskFilters, useTasks } from "../hooks/useTasks.tsx";
import { QuickPlanner } from "../components/QuickPlanner.tsx";
import { DateNav } from "../components/DateNav.tsx";

export const Today = () => {
  const [date, setDate] = useState<Temporal.PlainDate>(
    Temporal.Now.plainDateISO(),
  );
  const [tasks] = useTasks([["scheduledFor", "eq", date.toString()]]);

  return (
    <View className="flex-col">
      <DateNav date={date} setDate={setDate} mode="days" />
      <Board
        canCreateTasks
        columns={[{
          id: date.toString(),
          tasks: tasks,
        }]}
        groupBy="scheduledFor"
      />

      <QuickPlanner baseFilters={taskFilters.notToday} />
    </View>
  );
};
