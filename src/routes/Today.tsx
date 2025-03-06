import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// import { getTodos, postTodo } from "../my-api";
import { Card } from "../components/Card.tsx";
import { Column } from "../components/Column.tsx";
import { View } from "../components/View.tsx";
import { useAuth } from "../hooks/useAuth.tsx";
import { createTask, getTasks, TTask } from "../api/tasks.ts";

export const Today = () => {
  const { supabase } = useAuth();

  const queryClient = useQueryClient();

  const { isPending, error, data: tasks, isFetching } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks(supabase),
  });

  const _mutation = useMutation({
    mutationFn: (task: TTask) => createTask(supabase, task),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  console.log({ error, tasks, isPending, isFetching });

  if (isPending) return <p>Loading...</p>;

  return (
    <View>
      <Column id="today" title="Today">
        {tasks?.map((task, index) => (
          <Card index={index} key={task.id} task={task} />
        ))}
      </Column>
    </View>
  );
};
