import { DragDropContext, DropResult } from "@hello-pangea/dnd";

import { Card } from "../components/Card.tsx";
import { Column } from "../components/Column.tsx";

import { TTask } from "../api/tasks.ts";

type TBoardProps = {
  columns: TColumn[];
  groupBy?: EGroupBy;
  onTaskChange: (id: string, index: number, column: string) => void;
  tasks?: TTask[];
};

export type TColumn = {
  id: string;
  title: string;
  tasks: TTask[];
};

export type EGroupBy = "scheduledFor" | "listId" | "priority";

export const Board = (
  { columns, onTaskChange }: TBoardProps,
) => {
  const onDragEnd = (result: DropResult<string>) => {
    if (!result.destination) return;
    const { source, destination } = result;

    const taskId = result.draggableId;
    const sourceColumn = result.source.droppableId;
    const destColumn = result.destination.droppableId;
    const destIndex = result.destination.index;

    if (source.droppableId !== destination.droppableId) {
      console.dir({ taskId, sourceColumn, destColumn });
      onTaskChange(taskId, destIndex, destColumn);
    } else {
      // const column = columns[source.droppableId];
      // const copiedItems = [...column.items];
      // const [removed] = copiedItems.splice(source.index, 1);
      // copiedItems.splice(destination.index, 0, removed);
      // setColumns({
      //   ...columns,
      //   [source.droppableId]: {
      //     ...column,
      //     items: copiedItems,
      //   },
      // });
    }
  };

  return (
    <DragDropContext
      onDragEnd={(result) => onDragEnd(result)}
    >
      <div className="flex gap-4">
        {columns.map((column) => {
          return (
            <Column compact key={column.id} id={column.id} title={column.title}>
              {column.tasks?.map((task, index) => (
                <Card
                  index={index}
                  key={task.id}
                  task={task}
                  compact
                />
              ))}
            </Column>
          );
        })}
      </div>
    </DragDropContext>
  );
};
