import { ECardSize } from "./Card.tsx";
import { Column, TColumnProps } from "../components/Column.tsx";
import { ScrollableContainer } from "./View.tsx";

import { TTask } from "../api/tasks.ts";

type TBoardProps = {
  appendAfter?: React.ReactNode;
  canCreateTasks?: boolean;
  cardSize?: ECardSize;
  columns: TColumn[];
  groupBy: EGroupBy;
  tasks?: TTask[];
};

export type TColumn = Omit<
  TColumnProps,
  "canCreateTasks" | "cardSize" | "id"
> & {
  autoCollapse?: boolean;
  id: string | null;
};

export type EGroupBy = "scheduledFor" | "listId" | "priority" | "goalId";

export const Board = ({
  appendAfter = null,
  canCreateTasks = false,
  cardSize = "normal",
  columns,
  groupBy,
}: TBoardProps) => (
  <ScrollableContainer>
    {columns.map((column) => {
      if (!column.tasks.length && column.autoCollapse) return null;

      return (
        <Column
          canCreateTasks={canCreateTasks}
          cardSize={cardSize}
          id={`${groupBy}:${column.id}`}
          isActive={column.isActive}
          key={column.id}
          subtitle={column.subtitle}
          tasks={column.tasks}
          title={column.title}
          titleComponent={column.titleComponent}
        />
      );
    })}

    {appendAfter}
  </ScrollableContainer>
);
