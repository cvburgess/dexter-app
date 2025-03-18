import { useState } from "react";
import { Temporal } from "@js-temporal/polyfill";

import { Board } from "../components/Board.tsx";
import { View } from "../components/View.tsx";

import { taskFilters, useTasks } from "../hooks/useTasks.tsx";
import { QuickDrawer } from "../components/QuickPlanner.tsx";
import { DayNav } from "../components/Toolbar.tsx";

export const Today = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [date, setDate] = useState<Temporal.PlainDate>(
    Temporal.Now.plainDateISO(),
  );

  const [tasks] = useTasks([["scheduledFor", "eq", date.toString()]]);

  return (
    <View>
      <DayNav date={date} setDate={setDate} toggleQuickPlan={() => setIsOpen(!isOpen)} />

      <div className="flex flex-1 relative overflow-hidden">
        <Board
          canCreateTasks
          columns={[{
            id: date.toString(),
            tasks: tasks,
          }]}
          groupBy="scheduledFor"
        />
        <QuickDrawer isOpen={isOpen} baseFilters={taskFilters.notToday} />
      </div>
    </View>
  );
};
