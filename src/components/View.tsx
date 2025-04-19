import { useCallback, useState, createContext } from "react";
import { DragStart, DragDropContext, DropResult } from "@hello-pangea/dnd";

import { useTasks } from "../hooks/useTasks.tsx";

type TProps = { children: React.ReactNode };

export const View = ({ children }: TProps) => (
  <div className="flex flex-1 flex-col relative overflow-hidden">
    {children}
  </div>
);

export const DraggableView = ({ children }: TProps) => {
  const [startingColumn, setStartingColumn] = useState<string | null>(null);
  const [_, { updateTask }] = useTasks({ skipQuery: true });

  const onTaskMove = (id: string, fromColumn: string, toColumn: string) => {
    // column is prefixed with the property name
    // example: "scheduledFor:2022-01-01"
    const parseColumn = (column: string) => {
      const [prop, value] = column.split(":");
      const nullableValue = value === "null" ? null : value;
      return { [prop]: nullableValue };
    };

    const _from = parseColumn(fromColumn);
    const to = parseColumn(toColumn);

    // TODO: Support multiple columns

    updateTask({ id, ...to });
  };

  const onDragStart = (result: DragStart<string>) => {
    setStartingColumn(result.source.droppableId);
  };

  const onDragEnd = (result: DropResult<string>) => {
    if (!result.destination) return;
    const { source, destination } = result;

    const taskId = result.draggableId;
    const sourceColumn = result.source.droppableId;
    const destColumn = result.destination.droppableId;
    const _destIndex = result.destination.index;

    if (source.droppableId !== destination.droppableId) {
      onTaskMove(taskId, sourceColumn, destColumn);
    }
  };

  const isReordering = useCallback(
    (currentColumn: string) => startingColumn === currentColumn,
    [startingColumn],
  );

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      <ReorderingContext.Provider value={{ isReordering }}>
        <View>{children}</View>
      </ReorderingContext.Provider>
    </DragDropContext>
  );
};

export const DrawerContainer = ({ children }: TProps) => (
  <div className="flex flex-1 overflow-hidden">{children}</div>
);

export const ScrollableContainer = ({ children }: TProps) => (
  <div className="flex flex-1 gap-4 px-4 overflow-auto bg-base-100 no-scrollbar">
    {children}
  </div>
);

type TReorderingContext = {
  isReordering: (columnId: string) => boolean;
};

export const ReorderingContext = createContext<TReorderingContext>({
  isReordering: () => false,
});
