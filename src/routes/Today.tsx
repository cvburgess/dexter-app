import React from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { useQuery } from "@tanstack/react-query";

// import { getTodos, postTodo } from "../my-api";
import { Card } from "../components/Card.tsx";
import { View } from "../components/View.tsx";
import { useAuth } from "../hooks/useAuth.tsx";
import { getTasks } from "../api/tasks.ts";

const List = ({ children }: { children: React.ReactNode }) => (
  <DragDropProvider>
    {children}
  </DragDropProvider>
);

export const Today = () => {
  const { supabase } = useAuth();
  const { isPending, error, data: tasks, isFetching } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks(supabase),
  });

  // Mutations
  // const mutation = useMutation({
  //   mutationFn: createTask,
  //   onSuccess: () => {
  //     // Invalidate and refetch
  //     queryClient.invalidateQueries({ queryKey: ["todos"] });
  //   },
  // });

  console.log({ error, tasks, isPending, isFetching });

  if (isPending) return <p>Loading...</p>;

  return (
    <View>
      <List>
        {tasks.map((task, index) => (
          <Card index={index} key={task.id} task={task} />
        ))}
      </List>
    </View>
  );
};
