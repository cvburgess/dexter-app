import { Card } from "../components/Card.tsx";
import { Column } from "../components/Column.tsx";

import { useTasks } from "../hooks/useTasks.tsx";

import { TTask, TUpdateTask } from "../api/tasks.ts";

type TBoardProps = {
  canCreateTasks?: boolean;
  cardSize?: "compact" | "normal";
  columns: TColumn[];
  groupBy?: EGroupBy;
  tasks?: TTask[];
};

export type TColumn = {
  autoCollapse?: boolean;
  id: string;
  title: string;
  tasks: TTask[];
};

export type EGroupBy = "scheduledFor" | "listId" | "priority";

export const Board = (
  { canCreateTasks = false, cardSize = "normal", columns, groupBy }:
    TBoardProps,
) => {
  const [_, { createTask, updateTask }] = useTasks();

  const onTaskCreate = (title: string, column: string) => {
    // groupBy is undefined when there is only one column
    // TODO: Should we support boards with one column?
    createTask(groupBy ? { title, [groupBy]: column } : { title });
  };

  return (
    <div className="flex gap-4">
      {columns.map((column) => {
        if (!column.tasks.length && column.autoCollapse) return null;

        return (
          <Column
            canCreateTasks={canCreateTasks}
            compact={cardSize === "compact"}
            id={`${groupBy}:${column.id}`}
            key={column.id}
            onTaskCreate={onTaskCreate}
            title={column.title}
          >
            {column.tasks?.map((task, index) => (
              <Card
                compact={cardSize === "compact"}
                index={index}
                key={task.id}
                onTaskUpdate={(diff: Omit<TUpdateTask, "id">) =>
                  updateTask({ id: task.id, ...diff })}
                task={task}
              />
            ))}
          </Column>
        );
      })}
    </div>
  );
};
