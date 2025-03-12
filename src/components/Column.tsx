import { Droppable } from "@hello-pangea/dnd";
import { Plus } from "@phosphor-icons/react";
import classNames from "classnames";

import { Card } from "./Card.tsx";

import { useTasks } from "../hooks/useTasks.tsx";

import { TTask } from "../api/tasks.ts";

type TColumnProps = {
  canCreateTasks?: boolean;
  cardSize?: "compact" | "normal";
  icon?: string;
  id: string;
  tasks: TTask[];
  title: string;
};

export const Column = ({
  cardSize = "normal",
  canCreateTasks = false,
  id,
  title,
  icon,
  tasks = [],
}: TColumnProps) => {
  const [_, { createTask }] = useTasks();

  const onTaskCreate = (title: string, column: string) => {
    // column is prefixed with the property name
    // example: "scheduledFor:2022-01-01"
    const [prop, value] = column.split(":");
    const nullableValue = (value === "null") ? null : value;

    createTask({ title, [prop]: nullableValue });
  };

  return (
    <div
      className={classNames(
        "h-vh flex flex-col",
        cardSize === "compact" ? "min-w-40 w-40" : "min-w-70 w-70",
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
              {tasks?.map((task, index) => (
                <Card
                  compact={cardSize === "compact"}
                  index={index}
                  key={task.id}
                  task={task}
                />
              ))}
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
