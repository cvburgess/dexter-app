import { Temporal } from "@js-temporal/polyfill";

import { Board } from "../components/Board.tsx";
import { View } from "../components/View.tsx";

import { useTasks } from "../hooks/useTasks.tsx";

export const Today = () => {
  const [tasks] = useTasks();

  const today = Temporal.Now.plainDateISO();

  return (
    <View>
      <Board
        canCreateTasks
        columns={[{
          id: today.toString(),
          title: today.toLocaleString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          }),
          tasks: tasks?.filter((task) =>
            task.scheduledFor === today.toString()
          ),
        }]}
        groupBy="scheduledFor"
      />
    </View>
  );
};
