import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Temporal } from "@js-temporal/polyfill";

import {
  createTask,
  ETaskPriority,
  ETaskStatus,
  getTasks,
  TCreateTask,
  TTask,
  TUpdateTask,
  updateTask,
} from "../api/tasks.ts";

import { useAuth } from "./useAuth.tsx";
import { TQueryFilter } from "../api/applyFilters.ts";

type TUseTasks = [
  TTask[],
  {
    createTask: (task: TCreateTask) => void;
    updateTask: (task: TUpdateTask) => void;
  },
];

export const useTasks = (where: TQueryFilter[] = []): TUseTasks => {
  const { supabase } = useAuth();
  const queryClient = useQueryClient();

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks", where],
    queryFn: () => getTasks(supabase, where),
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

export const taskFilters: Record<string, TQueryFilter[]> = {
  today: [["scheduledFor", "eq", Temporal.Now.plainDateISO().toString()]],
  incomplete: [["status", "in", [ETaskStatus.TODO, ETaskStatus.IN_PROGRESS]]],
  get unprioritized(): TQueryFilter[] {
    return [
      ["priority", "eq", ETaskPriority.UNPRIORITIZED],
      ...this.incomplete,
    ];
  },
  get overdue(): TQueryFilter[] {
    return [
      ["dueOn", "lt", Temporal.Now.plainDateISO().toString()],
      ...this.incomplete,
    ];
  },
};
