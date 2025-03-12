import { Column } from "../components/Column.tsx";

import { TTask } from "../api/tasks.ts";

type TBoardProps = {
  canCreateTasks?: boolean;
  cardSize?: "compact" | "normal";
  columns: TColumn[];
  groupBy: EGroupBy;
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
) => (
  <div className="flex gap-4">
    {columns.map((column) => {
      if (!column.tasks.length && column.autoCollapse) return null;

      return (
        <Column
          cardSize={cardSize}
          canCreateTasks={canCreateTasks}
          id={`${groupBy}:${column.id}`}
          key={column.id}
          tasks={column.tasks}
          title={column.title}
        />
      );
    })}
  </div>
);
