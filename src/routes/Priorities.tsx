import { Board, TColumn } from "../components/Board.tsx";
import { ECardSize } from "../components/Card.tsx";
import { TextToolbar } from "../components/Toolbar.tsx";
import { DraggableView } from "../components/View.tsx";

import { useCardSize } from "../hooks/useCardSize.tsx";
import { taskFilters, useTasks } from "../hooks/useTasks.tsx";

import { ETaskPriority, TTask } from "../api/tasks.ts";

export const Priorities = () => {
  const [cardSize, toggleCardSize] = useCardSize(ECardSize.STANDARD);
  const [tasks] = useTasks({ filters: taskFilters.incomplete });

  const columns = makeColumns(tasks);

  return (
    <DraggableView>
      <TextToolbar
        cardSize={cardSize}
        title="Prioritize"
        toggleCardSize={toggleCardSize}
      />
      <Board
        canCreateTasks
        cardSize={cardSize}
        columns={columns}
        groupBy="priority"
      />
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
    subtitle: "do it now",
    tasks: tasks?.filter(
      (task: TTask) => task.priority === ETaskPriority.IMPORTANT_AND_URGENT,
    ),
  },
  {
    id: ETaskPriority.IMPORTANT.toString(),
    title: "Important",
    subtitle: "do it because it matters",
    tasks: tasks?.filter(
      (task: TTask) => task.priority === ETaskPriority.IMPORTANT,
    ),
  },
  {
    id: ETaskPriority.URGENT.toString(),
    title: "Urgent",
    subtitle: "do it soon or delegate it",
    tasks: tasks?.filter(
      (task: TTask) => task.priority === ETaskPriority.URGENT,
    ),
  },
  {
    id: ETaskPriority.NEITHER.toString(),
    title: "Neither",
    subtitle: "do it just for fun",
    tasks: tasks?.filter(
      (task: TTask) => task.priority === ETaskPriority.NEITHER,
    ),
  },
];
