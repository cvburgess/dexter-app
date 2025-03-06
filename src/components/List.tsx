import { CollisionPriority } from "@dnd-kit/abstract";
import { useDroppable } from "@dnd-kit/react";

type ListProps = {
  children: React.ReactNode;
  id: string;
};

export const List = ({ children, id }: ListProps) => {
  const { ref } = useDroppable({
    id,
    type: "column",
    collisionPriority: CollisionPriority.Low,
    accept: "item",
  });

  return (
    <div className="h-full" ref={ref} data-log={`List ${id}`}>
      {children}
    </div>
  );
};
