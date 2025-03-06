import { useRef } from "react";
import { DragDropProvider } from "@dnd-kit/react";

import { Card } from "../components/Card.tsx";
import { Column } from "../components/Column.tsx";

import { TTask } from "../api/tasks.ts";

type TBoardProps = {
  columns: TColumn[];
  groupBy?: EGroupBy;
  tasks?: TTask[];
};

export type EGroupBy = "scheduledFor" | "listId" | "priority";

export type TColumn = {
  id: string;
  title: string;
};

type TDragEvent = {
  operation: {
    source: {
      sortable: {
        index: string;
        group: string;
      };
    };
  };
};

const defaultDragData = { index: undefined, group: undefined };

export const Board = ({ columns, groupBy, tasks }: TBoardProps) => {
  const dragRef = useRef<{ index?: string; group?: string }>(defaultDragData);

  const resetDragRef = () => {
    dragRef.current = defaultDragData;
  };

  const diffDragEvents = (event: TDragEvent) => {
    const start = dragRef.current;
    const end = event.operation.source.sortable;

    const changedProps: [string, number | string][] = [];

    if (start.index !== end.index) changedProps.push(["index", end.index]);
    if (start.group !== end.group) changedProps.push(["group", end.group]);

    return changedProps.length ? Object.fromEntries(changedProps) : null;
  };

  return (
    <DragDropProvider
      // @ts-ignore types in library are incorrect
      onDragStart={(event: TDragEvent) => {
        dragRef.current = {
          index: event.operation.source.sortable.index,
          group: event.operation.source.sortable.group,
        };
      }}
      // @ts-ignore types in library are incorrect
      onDragEnd={(event: TDragEvent) => {
        const diff = diffDragEvents(event);
        console.dir(diff);
        resetDragRef();
      }}
    >
      {columns.map((column) => {
        const tasksForColumn = groupBy
          ? tasks?.filter((task: TTask) => task[groupBy] === column.id)
          : tasks;

        return (
          <Column key={column.id} id={column.id} title={column.title}>
            {tasksForColumn?.map((task, index) => (
              <Card
                index={index}
                key={task.id}
                task={task}
                groupBy={groupBy}
              />
            ))}
          </Column>
        );
      })}
    </DragDropProvider>
  );
};
