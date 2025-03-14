import { Droppable } from "@hello-pangea/dnd";
import { Plus } from "@phosphor-icons/react";
import classNames from "classnames";

import { Card, ECardSize } from "./Card.tsx";
import { InputWithIcon } from "./InputWithIcon.tsx";

import { useTasks } from "../hooks/useTasks.tsx";

import { TTask } from "../api/tasks.ts";

type TColumnProps = {
  canCreateTasks?: boolean;
  cardSize?: ECardSize;
  icon?: string;
  id: string;
  tasks: TTask[];
  title?: string;
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

  const onTaskCreate = (taskTitle: string) => {
    // column is prefixed with the property name
    // example: "scheduledFor:2022-01-01"
    const [prop, value] = id.split(":");
    const nullableValue = (value === "null") ? null : value;

    createTask({ title: taskTitle, [prop]: nullableValue });
  };

  return (
    <div
      className={classNames(
        "h-vh flex flex-col",
        cardSize === "compact-w" ? "min-w-40 w-40" : "min-w-70 w-70",
      )}
    >
      <div className="sticky top-0 z-10 bg-base-100">
        <ColumnTitle title={title} icon={icon} />
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
              className="flex flex-col flex-grow gap-2 last:mb-4"
              data-list-id={id}
            >
              {tasks?.map((task, index) => (
                <Card
                  cardSize={cardSize}
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

const ColumnTitle = ({ title, icon }: { title?: string; icon?: string }) => {
  if (!title) return null;

  return (
    <div className="badge badge-lg p-5 mx-auto mb-4 w-full">
      {icon}
      {title}
    </div>
  );
};

type TCreateTaskProps = {
  columnId: string;
  enabled: boolean;
  onTaskCreate?: (title: string) => void;
};

const CreateTask = ({ enabled, onTaskCreate }: TCreateTaskProps) =>
  enabled
    ? (
      <InputWithIcon
        type="text"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.currentTarget.value.trim()) {
            onTaskCreate?.(e.currentTarget.value.trim());
            e.currentTarget.value = "";
          }
        }}
        wrapperClassName="mb-4"
      >
        <Plus />
      </InputWithIcon>
    )
    : null;
