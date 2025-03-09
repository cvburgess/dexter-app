import { Board, TColumn } from "../components/Board.tsx";
import { View } from "../components/View.tsx";

import { useTasks } from "../hooks/useTasks.tsx";

import { ETaskPriority, TTask } from "../api/tasks.ts";

export const Prioritize = () => {
  const [tasks] = useTasks();

  const columns = makeColumns(tasks);

  return (
    <View>
      <Board
        canCreateTasks
        columns={columns}
        groupBy="priority"
      />
    </View>
  );
};

const makeColumns = (tasks: TTask[] | undefined = []): TColumn[] => [
  {
    autoCollapse: true,
    id: ETaskPriority.UNPRIORITIZED.toString(),
    title: "Unprioritized",
    tasks: tasks?.filter((task: TTask) =>
      task.priority === ETaskPriority.UNPRIORITIZED
    ),
  },
  {
    id: ETaskPriority.IMPORTANT_AND_URGENT.toString(),
    title: "Important and Urgent",
    tasks: tasks?.filter((task: TTask) =>
      task.priority === ETaskPriority.IMPORTANT_AND_URGENT
    ),
  },
  {
    id: ETaskPriority.IMPORTANT.toString(),
    title: "Important",
    tasks: tasks?.filter((task: TTask) =>
      task.priority === ETaskPriority.IMPORTANT
    ),
  },
  {
    id: ETaskPriority.URGENT.toString(),
    title: "Urgent",
    tasks: tasks?.filter((task: TTask) =>
      task.priority === ETaskPriority.URGENT
    ),
  },
  {
    id: ETaskPriority.NEITHER.toString(),
    title: "Rainy Day",
    tasks: tasks?.filter((task: TTask) =>
      task.priority === ETaskPriority.NEITHER
    ),
  },
];
