import { Temporal } from "@js-temporal/polyfill";

import { Board } from "../components/Board.tsx";
import { View } from "../components/View.tsx";

import { taskFilters, useTasks } from "../hooks/useTasks.tsx";

export const Today = () => {
  const [tasks] = useTasks(taskFilters.today);

  const today = Temporal.Now.plainDateISO();

  return (
    <View className="flex">
      <Board
        canCreateTasks
        columns={[{
          id: today.toString(),
          tasks,
          title: today.toLocaleString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          }),
        }]}
        groupBy="scheduledFor"
      />
      <div className="w-[200px] bg-amber-700 ml-auto shadow-[-4px_0px_8px_rgba(0,0,0,0.2)]">
      </div>
    </View>
  );
};
