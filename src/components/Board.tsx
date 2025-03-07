import { useRef } from "react";
import { DragDropProvider } from "@dnd-kit/react";

import { Card } from "../components/Card.tsx";
import { Column } from "../components/Column.tsx";

import { TTask, TUpdateTask } from "../api/tasks.ts";

type TBoardProps = {
  columns: TColumn[];
  groupBy?: EGroupBy;
  onTaskChange: (diff: TUpdateTask) => void;
  tasks?: TTask[];
};

export type EGroupBy = "scheduledFor" | "listId" | "priority";

export type TColumn = {
  id: string;
  title: string;
};

type TDragEvent = {
  preventDefault(): unknown;
  operation: {
    source: {
      id: string;
      sortable: {
        index: string;
        group: string;
      };
    };
    target?: {
      id: string;
      type: "column" | "task";
    };
  };
};

const defaultDragData = { index: undefined, group: undefined };

export const Board = (
  { columns, groupBy, onTaskChange, tasks }: TBoardProps,
) => {
  const dragSourceRef = useRef<{ index?: string; group?: string }>(
    defaultDragData,
  );
  const dragTargetRef = useRef<{ index?: string; group?: string }>(
    defaultDragData,
  );

  const resetDragRefs = () => {
    dragSourceRef.current = defaultDragData;
    dragTargetRef.current = defaultDragData;
  };

  const diffDragEvents = (event: TDragEvent) => {
    const start = dragSourceRef.current;
    const target = dragTargetRef.current;
    const end = event.operation.source.sortable;

    const changedProps: [string, number | string][] = [];

    // TODO: Support for ordering items
    // if (start.index !== end.index) changedProps.push(["index", end.index]);

    if (groupBy && start.group !== end.group) {
      changedProps.push([groupBy, end.group]);
    } else if (groupBy && start.group !== target.group) {
      changedProps.push([groupBy, target.group!]);
    }

    return changedProps.length ? Object.fromEntries(changedProps) : null;
  };

  return (
    <DragDropProvider
      // @ts-ignore types in library are incorrect
      onDragStart={(event: TDragEvent) => {
        dragSourceRef.current = {
          index: event.operation.source.sortable.index,
          group: event.operation.source.sortable.group,
        };
      }}
      // @ts-ignore types in library are incorrect
      onDragEnd={(event: TDragEvent) => {
        const diff = diffDragEvents(event);
        console.dir(diff);
        if (diff) {
          console.dir(diff);
          onTaskChange({
            id: event.operation.source.id,
            ...diff,
          });
        }
        resetDragRefs();
      }}
      // @ts-ignore types in library are incorrect
      onDragOver={(event: TDragEvent) => {
        if (event.operation.target?.type === "column") {
          dragTargetRef.current = {
            group: event.operation.target.id,
          };
        }
        event.preventDefault();
      }}
    >
      <div className="flex gap-4">
        {columns.map((column) => {
          const tasksForColumn = groupBy
            ? tasks?.filter((task: TTask) => task[groupBy] === column.id)
            : tasks;

          return (
            <Column compact key={column.id} id={column.id} title={column.title}>
              {tasksForColumn?.map((task, index) => (
                <Card
                  index={index}
                  key={task.id}
                  task={task}
                  groupBy={groupBy}
                  compact
                />
              ))}
            </Column>
          );
        })}
      </div>
    </DragDropProvider>
  );
};
