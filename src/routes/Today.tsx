import { Temporal } from "@js-temporal/polyfill";

import { Board } from "../components/Board.tsx";
import { View } from "../components/View.tsx";

import { taskFilters, useTasks } from "../hooks/useTasks.tsx";
import { QuickPlanner } from "../components/QuickPlanner.tsx";

export const Today = () => {
  const [todaysTasks] = useTasks(taskFilters.today);

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
      <QuickPlanner />
    </View>
  );
};
