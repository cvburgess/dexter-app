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
    <div className="h-vh flex flex-col m-4">
      <div className="badge badge-lg badge-neutral badge-soft p-5 w-sm m-auto">
        {icon}
        {title}
      </div>
      <div
        className="flex-grow w-full"
        ref={ref}
        data-list-id={id}
      >
        {children}
      </div>
    </div>
  );
};
