import { Card } from "./Card.tsx";

import { TTask } from "../api/tasks.ts";

type TCardListProps = { tasks: TTask[] };

export const CardList = ({ tasks = [] }: TCardListProps) => (
  <div className="flex flex-col gap-2">
    {tasks?.map((task) => <Card key={task.id} task={task} />)}
  </div>
);
