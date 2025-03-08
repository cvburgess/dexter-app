import { useQuery } from "@tanstack/react-query";

// import { getTodos, postTodo } from "../my-api";
// import { Card } from "../components/Card.tsx";
// import { Column } from "../components/Column.tsx";
import { View } from "../components/View.tsx";
import { useAuth } from "../hooks/useAuth.tsx";
import { getTasks } from "../api/tasks.ts";

export const Today = () => {
  const { supabase } = useAuth();

  const { isPending, data: _tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks(supabase),
  });

  if (isPending) return <p>Loading...</p>;

  return (
    <View>
      Today
      {
        /* <Column id="today" title="Today">
        {tasks?.map((task, index) => (
          <Card index={index} key={task.id} task={task} />
        ))}
      </Column> */
      }
    </View>
  );
};
