import { Droppable } from "@hello-pangea/dnd";
import { Plus } from "@phosphor-icons/react";

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

const CreateTask = ({ columnId, enabled, onTaskCreate }: TCreateTaskProps) =>
  enabled
    ? (
      <label className="group input input-ghost mb-4 w-full rounded-lg p-4 h-auto bg-base-200 focus-within:bg-base-100 focus-within:outline-1 focus-within:outline-base-300">
        <Plus className="group-focus-within:hidden" />
        <input
          type="text"
          className="peer"
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
