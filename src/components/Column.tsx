import { CollisionPriority } from "@dnd-kit/abstract";
import { useDroppable } from "@dnd-kit/react";
import classNames from "classnames";

type TColumnProps = {
  children: React.ReactNode;
  id: string;
  title: string;
  icon?: string;
  compact?: boolean;
};

export const Column = (
  { children, id, title, icon, compact = false }: TColumnProps,
) => {
  const { ref } = useDroppable({
    id,
    type: "column",
    collisionPriority: CollisionPriority.Low,
    accept: "item",
  });

  return (
    <div className="h-vh flex flex-col">
      <div
        className={classNames(
          "badge badge-lg badge-ghost p-5 mx-auto mb-4",
          compact ? "w-[10rem]" : "w-xs",
        )}
      >
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
