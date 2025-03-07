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
  const { isDropTarget, ref } = useDroppable({
    id,
    type: "column",
    collisionPriority: CollisionPriority.Low,
    accept: "task",
  });

  return (
    <div className="h-vh w-fit flex flex-col">
      <div
        className={classNames(
          "badge badge-lg p-5 mx-auto mb-4",
          compact ? "w-[10rem]" : "w-xs",
          isDropTarget ? "badge-info" : "badge-ghost",
        )}
      >
        {icon}
        {title}
      </div>
      <div
        className="flex flex-col gap-2"
        ref={ref}
        data-list-id={id}
      >
        {children}
      </div>
    </div>
  );
};
