import { Droppable } from "@hello-pangea/dnd";
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
  return (
    <div className="h-vh w-fit flex flex-col">
      <div
        className={classNames(
          "badge badge-lg p-5 mx-auto mb-4",
          compact ? "w-[10rem]" : "w-xs",
        )}
      >
        {icon}
        {title}
      </div>
      <Droppable droppableId={id} key={id}>
        {(provided, snapshot) => {
          return (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={classNames("flex flex-col flex-grow gap-2", {
                "bg-primary": snapshot.isDraggingOver,
              })}
              data-list-id={id}
            >
              {children}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
};
