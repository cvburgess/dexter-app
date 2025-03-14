import { ECardSize } from "./Card.tsx";
import { Column } from "../components/Column.tsx";

import { TTask } from "../api/tasks.ts";

type TBoardProps = {
  canCreateTasks?: boolean;
  cardSize?: ECardSize;
  columns: TColumn[];
  groupBy: EGroupBy;
  tasks?: TTask[];
};

export type TColumn = {
  autoCollapse?: boolean;
  id: string | null;
  title: string;
  tasks: TTask[];
};

export type EGroupBy = "scheduledFor" | "listId" | "priority";

export const Board = (
  { canCreateTasks = false, cardSize = "normal", columns, groupBy }:
    TBoardProps,
) => (
  <div className="flex gap-4 px-4 overflow-y-scroll overscroll-none no-scrollbar scroll-momentum">
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
