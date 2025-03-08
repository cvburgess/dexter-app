import { useQuery } from "@tanstack/react-query";
import { Board, TColumn } from "../components/Board.tsx";
import { View } from "../components/View.tsx";

import { useAuth } from "../hooks/useAuth.tsx";

import { TList } from "../api/lists.ts";
import { getTasks, TTask } from "../api/tasks.ts";
import { useLists } from "../hooks/useLists.tsx";

export const Lists = () => {
  const { supabase } = useAuth();
  const [lists] = useLists();

  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks(supabase),
  });

  const columns = makeColumns(lists, tasks);

  return (
    <View>
      <Board
        canCreateTasks
        columns={columns}
        groupBy="listId"
      />
    </View>
  );
};

const makeColumns = (
  lists: TList[] | undefined = [],
  tasks: TTask[] | undefined = [],
): TColumn[] =>
  lists.map((list: TList) => ({
    id: list.id,
    title: list.title,
    emoji: list.emoji,
    tasks: tasks?.filter((task: TTask) => task.listId === list.id),
  }));
