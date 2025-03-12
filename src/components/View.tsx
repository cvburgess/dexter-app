import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import classNames from "classnames";

import { useTasks } from "../hooks/useTasks.tsx";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const groupBy = "scheduledFor";

export const View = ({ children, className }: Props) => {
  const [_, { updateTask }] = useTasks();

  const onTaskMove = (id: string, _index: number, column: string) => {
    // groupBy is undefined when there is only one column
    // TODO: Should we support boards with one column?
    updateTask(groupBy ? { id, [groupBy]: column } : { id });
  };

  const onDragEnd = (result: DropResult<string>) => {
    if (!result.destination) return;
    const { source, destination } = result;

    const taskId = result.draggableId;
    const sourceColumn = result.source.droppableId;
    const destColumn = result.destination.droppableId;
    const destIndex = result.destination.index;

    if (source.droppableId !== destination.droppableId) {
      console.dir({ taskId, sourceColumn, destColumn });
      onTaskMove(taskId, destIndex, destColumn);
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
      <div className={classNames("flex-1 overflow-auto w-full p-4", className)}>
        {children}
      </div>
    </DragDropContext>
  );
};
