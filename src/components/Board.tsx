import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Card } from "../components/Card.tsx";
import { Column } from "../components/Column.tsx";

import { useAuth } from "../hooks/useAuth.tsx";

import {
  createTask,
  TCreateTask,
  TTask,
  TUpdateTask,
  updateTask,
} from "../api/tasks.ts";

type TBoardProps = {
  canCreateTasks?: boolean;
  cardSize?: "compact" | "normal";
  columns: TColumn[];
  groupBy?: EGroupBy;
  tasks?: TTask[];
};

export type TColumn = {
  id: string;
  title: string;
  tasks: TTask[];
};

export type EGroupBy = "scheduledFor" | "listId" | "priority";

export const Board = (
  { canCreateTasks = false, cardSize = "normal", columns, groupBy }:
    TBoardProps,
) => {
  const { supabase } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: update } = useMutation<TTask[], Error, TUpdateTask>({
    mutationFn: (diff) => updateTask(supabase, diff),
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["tasks"] });
    // },
    onSuccess: ([newTaskData]) => {
      queryClient.setQueryData(["tasks"], (oldData: TTask[]) => {
        return oldData.map((task: TTask) => {
          return (task.id === newTaskData.id) ? newTaskData : task;
        });
      });
    },
  });

  const { mutate: create } = useMutation<TTask[], Error, TCreateTask>({
    mutationFn: (task) => createTask(supabase, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    // onSuccess: ([newTaskData]) => {
    //   queryClient.setQueryData(["tasks"], (oldData: TTask[]) => {
    //     // console.log("data", newTaskData);
    //     return oldData.map((task: TTask) => {
    //       return (task.id === newTaskData.id) ? newTaskData : task;
    //     });
    //   });
    // },
  });

  const onTaskMove = (id: string, _index: number, column: string) => {
    // groupBy is undefined when there is only one column
    // TODO: Should we support boards with one column?
    update(groupBy ? { id, [groupBy]: column } : { id });
  };

  const onTaskCreate = (title: string, column: string) => {
    // groupBy is undefined when there is only one column
    // TODO: Should we support boards with one column?
    create(groupBy ? { title, [groupBy]: column } : { title });
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
      <div className="flex gap-4">
        {columns.map((column) => {
          return (
            <Column
              canCreateTasks={canCreateTasks}
              compact={cardSize === "compact"}
              id={column.id}
              key={column.id}
              onTaskCreate={onTaskCreate}
              title={column.title}
            >
              {column.tasks?.map((task, index) => (
                <Card
                  compact={cardSize === "compact"}
                  index={index}
                  key={task.id}
                  onTaskUpdate={(diff: Omit<TUpdateTask, "id">) =>
                    update({ id: task.id, ...diff })}
                  task={task}
                />
              ))}
            </Column>
          );
        })}
      </div>
    </DragDropContext>
  );
};
