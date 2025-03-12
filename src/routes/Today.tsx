import { Temporal } from "@js-temporal/polyfill";

import { Board } from "../components/Board.tsx";
import { View } from "../components/View.tsx";

import { taskFilters, useTasks } from "../hooks/useTasks.tsx";
import { Column } from "../components/Column.tsx";

export const Today = () => {
  const [todaysTasks] = useTasks(taskFilters.today);
  const [unscheduledTasks] = useTasks(taskFilters.unscheduled);

  const today = Temporal.Now.plainDateISO();

  return (
    <View>
      <Board
        canCreateTasks
        columns={[{
          id: today.toString(),
          tasks: todaysTasks,
          title: today.toLocaleString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          }),
        }]}
        groupBy="scheduledFor"
      />
      <div className="fixed w-[200px] overflow-x-hidden overflow-y-scroll top-0 bottom-0 right-0 z-100 bg-amber-700 shadow-[4px_0px_8px_rgba(0,0,0,0.2)]">
        <Column
          id="scheduledFor:null"
          tasks={unscheduledTasks}
        />
      </div>
    </View>
  );
};
