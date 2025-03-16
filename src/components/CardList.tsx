import { Card, ECardSize } from "./Card.tsx";

import { TTask } from "../api/tasks.ts";

type TCardListProps = {
  cardSize?: ECardSize;
  tasks: TTask[];
};

export const CardList = ({
  cardSize = "normal",
  tasks = [],
}: TCardListProps) => (
  <div className="flex flex-col gap-2">
    {tasks?.map((task) => (
      <Card
        cardSize={cardSize}
        key={task.id}
        task={task}
      />
    ))}
  </div>
);
