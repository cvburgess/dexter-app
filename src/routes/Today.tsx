import React from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// import { getTodos, postTodo } from "../my-api";
import { Card } from "../components/Card.tsx";
import { View } from "../components/View.tsx";
import { useAuth } from "../hooks/useAuth.tsx";
import { createTask, getTasks, Task } from "../api/tasks.ts";

const List = ({ children }: { children: React.ReactNode }) => (
  <DragDropProvider>
    {children}
  </DragDropProvider>
);

export const Today = () => {
  const { supabase } = useAuth();

  const queryClient = useQueryClient();

  const { isPending, error, data: tasks, isFetching } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks(supabase),
  });

  const _mutation = useMutation({
    mutationFn: (task: Task) => createTask(supabase, task),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  console.log({ error, tasks, isPending, isFetching });

  if (isPending) return <p>Loading...</p>;

  return (
    <View>
      <List>
        {tasks?.map((task, index) => (
          <Card index={index} key={task.id} task={task} />
        ))}
      </List>
    </View>
  );
};
