import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createTask,
  getTasks,
  TCreateTask,
  TTask,
  TUpdateTask,
  updateTask,
} from "../api/tasks.ts";

import { useAuth } from "./useAuth.tsx";

type TUseTasks = [
  TTask[],
  {
    createTask: (task: TCreateTask) => void;
    updateTask: (task: TUpdateTask) => void;
  },
];
export const useTasks = (): TUseTasks => {
  const { supabase } = useAuth();
  const queryClient = useQueryClient();

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks(supabase),
  });

  const { mutate: create } = useMutation<TTask[], Error, TCreateTask>({
    mutationFn: (task) => createTask(supabase, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const { mutate: update } = useMutation<TTask[], Error, TUpdateTask>({
    mutationFn: (diff) => updateTask(supabase, diff),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    // onSuccess: ([newTaskData]) => {
    //   queryClient.setQueryData(["tasks"], (oldData: TTask[]) => {
    //     return oldData.map((task: TTask) => {
    //       return (task.id === newTaskData.id) ? newTaskData : task;
    //     });
    //   });
    // },
  });

  return [tasks, { createTask: create, updateTask: update }];
};
