import { Droppable } from "@hello-pangea/dnd";
import { Plus } from "@phosphor-icons/react";
import classNames from "classnames";

type TColumnProps = {
  canCreateTasks?: boolean;
  children: React.ReactNode;
  compact?: boolean;
  icon?: string;
  id: string;
  onTaskCreate?: (title: string, column: string) => void;
  title: string;
};

export const Column = (
  { canCreateTasks = false, children, compact, id, title, icon, onTaskCreate }:
    TColumnProps,
) => {
  return (
    <div
      className={classNames(
        "h-vh flex flex-col",
        compact ? "min-w-40 w-40" : "min-w-70 w-70",
      )}
    >
      <div className="badge badge-lg p-5 mx-auto mb-4 w-full">
        {icon}
        {title}
      </div>

      <CreateTask
        enabled={canCreateTasks}
        columnId={id}
        onTaskCreate={onTaskCreate}
      />

      <Droppable droppableId={id} key={id}>
        {(provided) => {
          return (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-col flex-grow gap-2"
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

type TCreateTaskProps = {
  columnId: string;
  enabled: boolean;
  onTaskCreate?: (title: string, column: string) => void;
};

const CreateTask = (
  { columnId, enabled, onTaskCreate }: TCreateTaskProps,
) =>
  enabled
    ? (
      <label
        className={classNames(
          "group input input-ghost mb-4 w-full p-4 h-auto bg-base-200",
          "focus-within:bg-base-100 focus-within:outline-1 focus-within:outline-base-300",
        )}
      >
        <Plus className="group-focus-within:hidden" />
        <input
          type="text"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value.trim()) {
              onTaskCreate?.(e.currentTarget.value.trim(), columnId);
              e.currentTarget.value = "";
            }
          }}
        />
      </label>
    )
    : null;
