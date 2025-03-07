import { CollisionPriority } from "@dnd-kit/abstract";
import { useDroppable } from "@dnd-kit/react";

type TColumnProps = {
  children: React.ReactNode;
  id: string;
  title: string;
  icon?: string;
};

export const Column = ({ children, id, title, icon }: TColumnProps) => {
  const { ref } = useDroppable({
    id,
    type: "column",
    collisionPriority: CollisionPriority.Low,
    accept: "item",
  });

  return (
    <div className="h-vh flex flex-col">
      <div className="badge badge-lg badge-ghost p-5 w-xs mx-auto mb-4">
        {icon}
        {title}
      </div>
      <div
        className="flex-grow w-full flex flex-col gap-2"
        ref={ref}
        data-list-id={id}
      >
        {children}
      </div>
    </div>
  );
};
