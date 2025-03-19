import { Board, TColumn } from "../components/Board.tsx";
import { TextToolbar } from "../components/Toolbar.tsx";
import { DraggableView } from "../components/View.tsx";

import { taskFilters, useTasks } from "../hooks/useTasks.tsx";

import { ETaskPriority, TTask } from "../api/tasks.ts";

export const Prioritize = () => {
  const [tasks] = useTasks(taskFilters.incomplete);

  const columns = makeColumns(tasks);

  return (
    <DraggableView>
      <TextToolbar title="Prioritize" />
      <Board canCreateTasks columns={columns} groupBy="priority" />
    </DraggableView>
  );
};

const makeColumns = (tasks: TTask[] | undefined = []): TColumn[] => [
  {
    autoCollapse: true,
    id: ETaskPriority.UNPRIORITIZED.toString(),
    title: "Unprioritized",
    tasks: tasks?.filter(
      (task: TTask) => task.priority === ETaskPriority.UNPRIORITIZED,
    ),
  },
  {
    id: ETaskPriority.IMPORTANT_AND_URGENT.toString(),
    title: "Important & Urgent",
    tasks: tasks?.filter(
      (task: TTask) => task.priority === ETaskPriority.IMPORTANT_AND_URGENT,
    ),
  },
  {
    id: ETaskPriority.IMPORTANT.toString(),
    title: "Important",
    tasks: tasks?.filter(
      (task: TTask) => task.priority === ETaskPriority.IMPORTANT,
    ),
  },
  {
    id: ETaskPriority.URGENT.toString(),
    title: "Urgent",
    tasks: tasks?.filter(
      (task: TTask) => task.priority === ETaskPriority.URGENT,
    ),
  },
  {
    id: ETaskPriority.NEITHER.toString(),
    title: "Rainy Day",
    tasks: tasks?.filter(
      (task: TTask) => task.priority === ETaskPriority.NEITHER,
    ),
  },
];
