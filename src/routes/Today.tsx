import { useQuery } from "@tanstack/react-query";
import { Temporal } from "@js-temporal/polyfill";

// import { getTodos, postTodo } from "../my-api";
// import { Card } from "../components/Card.tsx";
// import { Column } from "../components/Column.tsx";
import { View } from "../components/View.tsx";
import { useAuth } from "../hooks/useAuth.tsx";
import { getTasks } from "../api/tasks.ts";
import { Board } from "../components/Board.tsx";

export const Today = () => {
  const { supabase } = useAuth();

  const { isPending, data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks(supabase),
  });

  const today = Temporal.Now.plainDateISO();
  if (isPending) return <p>Loading...</p>;

  return (
    <View>
      <Board
        canCreateTasks
        columns={[{
          id: today.toString(),
          title: today.toLocaleString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          }),
          tasks: tasks?.filter((task) =>
            task.scheduledFor === today.toString()
          ),
        }]}
        groupBy="scheduledFor"
      />
    </View>
  );
};
