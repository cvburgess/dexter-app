import { ECardSize } from "./Card.tsx";
import { Column } from "../components/Column.tsx";

import { TTask } from "../api/tasks.ts";

type TBoardProps = {
  appendAfter?: React.ReactNode;
  canCreateTasks?: boolean;
  cardSize?: ECardSize;
  columns: TColumn[];
  groupBy: EGroupBy;
  tasks?: TTask[];
};

export type TColumn = {
  autoCollapse?: boolean;
  id: string | null;
  isActive?: boolean;
  tasks: TTask[];
  title?: string;
  titleComponent?: React.ReactNode | null;
};

export type EGroupBy = "scheduledFor" | "listId" | "priority";

export const Board = ({
  appendAfter = null,
  canCreateTasks = false,
  cardSize = "normal",
  columns,
  groupBy,
}: TBoardProps) => (
  <div className="flex flex-1 gap-4 mx-4 overflow-auto bg-base-100 transition-all duration-300 ease-in-out">
    {columns.map((column) => {
      if (!column.tasks.length && column.autoCollapse) return null;

      return (
        <Column
          canCreateTasks={canCreateTasks}
          cardSize={cardSize}
          id={`${groupBy}:${column.id}`}
          isActive={column.isActive}
          key={column.id}
          tasks={column.tasks}
          title={column.title}
          titleComponent={column.titleComponent}
        />
      );
    })}

    {appendAfter}
  </div>
);
