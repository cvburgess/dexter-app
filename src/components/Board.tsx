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
  emoji?: string;
  id: string | null;
  isActive?: boolean;
  isEditable?: boolean;
  title?: string;
  tasks: TTask[];
};

export type EGroupBy = "scheduledFor" | "listId" | "priority";

export const Board = ({
  appendAfter = null,
  canCreateTasks = false,
  cardSize = "normal",
  columns,
  groupBy,
}: TBoardProps) => (
  <div className="flex flex-1 gap-4 px-4 pb-4 overflow-auto bg-base-100 transition-all duration-300 ease-in-out">
    {columns.map((column) => {
      if (!column.tasks.length && column.autoCollapse) return null;

      return (
        <Column
          canCreateTasks={canCreateTasks}
          cardSize={cardSize}
          emoji={column.emoji}
          id={`${groupBy}:${column.id}`}
          isActive={column.isActive}
          isEditable={column.isEditable}
          key={column.id}
          tasks={column.tasks}
          title={column.title}
        />
      );
    })}

    {appendAfter}
  </div>
);
