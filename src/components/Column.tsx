import { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Plus } from "@phosphor-icons/react";
import classNames from "classnames";

import { DraggableCard, ECardSize } from "./Card.tsx";
import { InputWithIcon } from "./InputWithIcon.tsx";

import { useTasks } from "../hooks/useTasks.tsx";

import { TTask } from "../api/tasks.ts";

export type TColumnProps = {
  canCreateTasks?: boolean;
  cardSize?: ECardSize;
  id: string;
  isActive?: boolean;
  subtitle?: string;
  tasks: TTask[];
  title?: string;
  titleComponent?: React.ReactNode | null;
};

export const Column = ({
  canCreateTasks = false,
  cardSize = "normal",
  id,
  isActive = false,
  subtitle,
  tasks = [],
  title,
  titleComponent = null,
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
        className={classNames(
          "top-0 pt-4 pb-2 mb-2 bg-base-100 flex flex-col gap-4",
          {
            "sticky z-10": title || canCreateTasks || titleComponent,
          },
        )}
      >
        {titleComponent || (
          <ColumnTitle isActive={isActive} subtitle={subtitle} title={title} />
        )}

        <CreateTask
          columnId={id}
          enabled={canCreateTasks}
          onTaskCreate={onTaskCreate}
        />
      </div>

      <Droppable droppableId={id} key={id}>
        {(provided) => {
          return (
            <div
              {...provided.droppableProps}
              className="flex flex-col flex-grow gap-2"
              data-list-id={id}
              ref={provided.innerRef}
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
  subtitle?: string;
  title?: string;
};

const ColumnTitle = ({ isActive, title, subtitle }: TColumnTitleProps) => {
  if (!title) return null;

  return (
    <div
      className={classNames(
        "badge badge-lg p-0 mx-auto w-full h-standard rounded-field flex flex-col justify-center gap-0",
        {
          "bg-base-content/80 text-base-100": isActive,
        },
      )}
    >
      {title}
      {subtitle && (
        <span className="text-[0.5rem] opacity-80 mt-[-1px] mb-[2px]">
          {subtitle}
        </span>
      )}
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
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.currentTarget.value.trim()) {
          onTaskCreate?.(e.currentTarget.value.trim());
          e.currentTarget.value = "";
        }
      }}
      type="text"
      wrapperClassName="rounded-field"
    >
      <Plus />
    </InputWithIcon>
  ) : null;
