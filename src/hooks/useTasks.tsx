import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Temporal } from "@js-temporal/polyfill";

import {
  createTask,
  deleteTask,
  ETaskPriority,
  ETaskStatus,
  getTasks,
  TCreateTask,
  TTask,
  TUpdateTask,
  updateTask,
  updateTasks,
} from "../api/tasks.ts";

import { supabase } from "./useAuth.tsx";
import { makeOrFilter, TQueryFilter } from "../api/applyFilters.ts";

type TUseTasks = [
  TTask[],
  {
    createTask: (task: TCreateTask) => void;
    deleteTask: (id: string) => void;
    updateTask: (task: TUpdateTask) => void;
    updateTasks: (tasks: TUpdateTask[]) => void;
  },
];

export const useTasks = (where: TQueryFilter[] = []): TUseTasks => {
  const queryClient = useQueryClient();

  const { data: tasks } = useQuery({
    placeholderData: [],
    queryKey: ["tasks", where],
    queryFn: () => getTasks(supabase, where),
    staleTime: 1000 * 60,
  });

  const { mutate: create } = useMutation<TTask[], Error, TCreateTask>({
    mutationFn: (task) => createTask(supabase, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const { mutate: update } = useMutation<TTask[], Error, TUpdateTask>({
    mutationFn: (diff) => updateTask(supabase, diff),
    // onMutate: async (diff: TUpdateTask) => {
    //   const taskQueries = queryClient.getQueryCache().findAll({
    //     queryKey: ["tasks"],
    //   });

    //   for (const query of taskQueries) {
    //     const currentData = query.state.data as TTask[];
    //     if (currentData) {
    //       queryClient.setQueryData(
    //         query.queryKey,
    //         currentData.map((task: TTask) => {
    //           return task.id === diff.id ? { ...task, ...diff } : task;
    //         }),
    //       );
    //     }
    //   }
    // },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const { mutate: bulkUpdate } = useMutation<TTask[], Error, TUpdateTask[]>({
    mutationFn: (diffs) => updateTasks(supabase, diffs),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const { mutate: remove } = useMutation<void, Error, string>({
    mutationFn: (id) => deleteTask(supabase, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return [
    tasks,
    {
      createTask: create,
      deleteTask: remove,
      updateTask: update,
      updateTasks: bulkUpdate,
    },
  ];
};

const today = Temporal.Now.plainDateISO();

export const taskFilters: Record<string, TQueryFilter[]> = {
  today: [["scheduledFor", "eq", today.toString()]],
  incomplete: [["status", "in", [ETaskStatus.TODO, ETaskStatus.IN_PROGRESS]]],
  get unprioritized(): TQueryFilter[] {
    return [
      ["priority", "eq", ETaskPriority.UNPRIORITIZED],
      ...this.incomplete,
    ];
  },
  get overdue(): TQueryFilter[] {
    return [["dueOn", "lt", today.toString()], ...this.incomplete];
  },
  get dueSoon(): TQueryFilter[] {
    return [
      ["dueOn", "gte", today.toString()],
      ["dueOn", "lte", today.add({ days: 6 }).toString()],
      ...this.incomplete,
    ];
  },
  get unscheduled(): TQueryFilter[] {
    return [["scheduledFor", "is", null], ...this.incomplete];
  },
  get leftBehind(): TQueryFilter[] {
    return [["scheduledFor", "lt", today.toString()], ...this.incomplete];
  },
  get notToday(): TQueryFilter[] {
    return [
      makeOrFilter([
        ["scheduledFor", "neq", today.toString()],
        ["scheduledFor", "is", null],
      ]),
      ...this.incomplete,
    ];
  },
  get noGoal(): TQueryFilter[] {
    return [["goalId", "is", null], ...this.incomplete];
  },
};
