import { useQuery } from "@tanstack/react-query";
import { Board, TColumn } from "../components/Board.tsx";
import { View } from "../components/View.tsx";

import { useAuth } from "../hooks/useAuth.tsx";

import { ETaskPriority, getTasks, TTask } from "../api/tasks.ts";

export const Prioritize = () => {
  const { supabase } = useAuth();

  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks(supabase),
  });

  const columns = makeColumns(tasks);

  return (
    <View>
      <Board
        canCreateTasks
        columns={columns}
        groupBy="priority"
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
