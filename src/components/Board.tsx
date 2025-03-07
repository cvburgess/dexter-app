import { DragDropContext, DropResult } from "@hello-pangea/dnd";

import { Card } from "../components/Card.tsx";
import { Column } from "../components/Column.tsx";

import { TTask, TUpdateTask } from "../api/tasks.ts";

type TBoardProps = {
  columns: TColumn[];
  groupBy?: EGroupBy;
  onTaskChange: (diff: TUpdateTask) => void;
  tasks?: TTask[];
};

export type TColumn = {
  id: string;
  title: string;
};

export type EGroupBy = "scheduledFor" | "listId" | "priority";

export const Board = (
  { columns, groupBy, tasks }: TBoardProps,
) => {
  const onDragEnd = (result: DropResult<string>) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = source.droppableId;
      const destColumn = destination.droppableId;
      console.dir({ sourceColumn, destColumn });
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
