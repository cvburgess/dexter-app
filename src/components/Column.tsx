import { Droppable } from "@hello-pangea/dnd";
import classNames from "classnames";

type TColumnProps = {
  canCreateTasks?: boolean;
  children: React.ReactNode;
  id: string;
  title: string;
  icon?: string;
  onTaskCreate?: (title: string, column: string) => void;
  // compact?: boolean;
};

export const Column = (
  { canCreateTasks = false, children, id, title, icon, onTaskCreate }:
    TColumnProps,
) => {
  return (
    <div className="h-vh w-fit flex flex-col">
      <div className="badge badge-lg p-5 mx-auto mb-4 w-full">
        {icon}
        {title}
      </div>
      {canCreateTasks
        ? (
          <input
            type="text"
            placeholder="+"
            className="input"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.currentTarget.value.trim()) {
                onTaskCreate?.(e.currentTarget.value.trim(), id);
                e.currentTarget.value = "";
              }
            }}
          />
        )
        : null}
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
