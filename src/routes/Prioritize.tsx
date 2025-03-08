import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Board, TColumn } from "../components/Board.tsx";
import { View } from "../components/View.tsx";

import { useAuth } from "../hooks/useAuth.tsx";

import {
  createTask,
  ETaskPriority,
  // createTask,
  getTasks,
  TCreateTask,
  TTask,
  TUpdateTask,
  updateTask,
} from "../api/tasks.ts";

export const Prioritize = () => {
  const { supabase } = useAuth();
  const queryClient = useQueryClient();

  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks(supabase),
  });

  const { mutate: update } = useMutation<TTask[], Error, TUpdateTask>({
    mutationFn: (diff) => updateTask(supabase, diff),
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["tasks"] });
    // },
    onSuccess: ([newTaskData]) => {
      queryClient.setQueryData(["tasks"], (oldData: TTask[]) => {
        // console.log("data", newTaskData);
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

  const columns = makeColumns(tasks);

  return (
    <View>
      <Board
        canCreateTasks
        columns={columns}
        onTaskChange={(id, _index, column) =>
          update({ id, priority: Number(column) as ETaskPriority })}
        onTaskCreate={create}
      />
    </View>
  );
};

const makeColumns = (tasks: TTask[] | undefined = []): TColumn[] => [
  {
    id: ETaskPriority.IMPORTANT_AND_URGENT.toString(),
    title: "Important and Urgent",
    tasks: tasks?.filter((task: TTask) =>
      task.priority === ETaskPriority.IMPORTANT_AND_URGENT
    ),
  },
  {
    id: ETaskPriority.IMPORTANT.toString(),
    title: "Important",
    tasks: tasks?.filter((task: TTask) =>
      task.priority === ETaskPriority.IMPORTANT
    ),
  },
  {
    id: ETaskPriority.URGENT.toString(),
    title: "Urgent",
    tasks: tasks?.filter((task: TTask) =>
      task.priority === ETaskPriority.URGENT
    ),
  },
  {
    id: ETaskPriority.NEITHER.toString(),
    title: "Rainy Day",
    tasks: tasks?.filter((task: TTask) =>
      task.priority === ETaskPriority.NEITHER
    ),
  },
];
