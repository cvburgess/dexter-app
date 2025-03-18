import { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { DotsThreeOutlineVertical, Plus } from "@phosphor-icons/react";
import classNames from "classnames";

import { DraggableCard, ECardSize } from "./Card.tsx";
import { InputWithIcon } from "./InputWithIcon.tsx";

import { useTasks } from "../hooks/useTasks.tsx";

import { TTask } from "../api/tasks.ts";

type TColumnProps = {
  canCreateTasks?: boolean;
  cardSize?: ECardSize;
  emoji?: string;
  id: string;
  isActive?: boolean;
  isEditable?: boolean;
  tasks: TTask[];
  title?: string;
};

export const Column = ({
  canCreateTasks = false,
  cardSize = "normal",
  emoji,
  id,
  isActive = false,
  isEditable = false,
  tasks = [],
  title,
}: TColumnProps) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [_, { createTask }] = useTasks();

  const onTaskCreate = (taskTitle: string) => {
    // column is prefixed with the property name
    // example: "scheduledFor:2022-01-01"
    const [prop, value] = id.split(":");
    const nullableValue = value === "null" ? null : value;

    createTask({ title: taskTitle, [prop]: nullableValue });
  };

  return (
    <div
      className={classNames(
        "max-h-screen min-h-[50vh] flex flex-col",
        cardSize === "compact-w"
          ? "min-w-compact w-compact"
          : "min-w-standard w-standard",
      )}
      ref={(el) => {
        if (isActive && el && !hasScrolled) {
          el.scrollIntoView({ behavior: "smooth", inline: "center" });
          setHasScrolled(true);
        }
      }}
    >
      <div
        className={classNames("top-0", {
          "sticky z-10 bg-base-100 pt-4": title || canCreateTasks,
        })}
      >
        <ColumnTitle
          emoji={emoji}
          isActive={isActive}
          isEditable={isEditable}
          title={title}
        />

        <CreateTask
          enabled={canCreateTasks}
          columnId={id}
          onTaskCreate={onTaskCreate}
        />
      </div>

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
                <DraggableCard
                  cardSize={cardSize}
                  className={classNames({ "mb-4": index === tasks.length - 1 })}
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

type TColumnTitleProps = {
  emoji?: string;
  isActive?: boolean;
  isEditable?: boolean;
  title?: string;
};

const ColumnTitle = ({
  emoji,
  isActive,
  isEditable,
  title,
}: TColumnTitleProps) => {
  if (!title) return null;

  return (
    <div
      className={classNames(
        "badge badge-lg p-5 mx-auto mb-4 w-full h-standard flex items-center justify-center",
        {
          "bg-base-content/80 text-base-100": isActive,
        },
      )}
    >
      {emoji && <span className="mr-4">{emoji}</span>}
      <span>{title}</span>
      {isEditable && <DotsThreeOutlineVertical className="ml-auto" />}
    </div>
  );
};

type TCreateTaskProps = {
  columnId: string;
  enabled: boolean;
  onTaskCreate?: (title: string) => void;
};

const CreateTask = ({ enabled, onTaskCreate }: TCreateTaskProps) =>
  enabled ? (
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
  ) : null;
