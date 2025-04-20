import React, { Fragment, useContext, useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Plus } from "@phosphor-icons/react";
import { Temporal } from "@js-temporal/polyfill";
import classNames from "classnames";

import { DraggableCard, ECardSize } from "./Card.tsx";
import { InputWithIcon } from "./InputWithIcon.tsx";
import { ReorderingContext } from "./View.tsx";

import { useTasks } from "../hooks/useTasks.tsx";

import { TTask } from "../api/tasks.ts";
import { DailyHabits } from "./DailyHabits.tsx";

export type TGrouping = {
  prop: "listId" | "goalId" | "priority";
  options: Array<{ id: string | number | null; title: string }>;
};

export type TColumnProps = {
  canCreateTasks?: boolean;
  cardSize: ECardSize;
  grouping?: TGrouping;
  id: string;
  isActive?: boolean;
  showHabits?: boolean;
  subtitle?: string;
  tasks: TTask[];
  title?: string;
  titleComponent?: React.ReactNode | null;
};

export const Column = React.memo(
  ({
    canCreateTasks = false,
    cardSize,
    grouping,
    id,
    isActive = false,
    showHabits = false,
    subtitle,
    tasks = [],
    title,
    titleComponent = null,
  }: TColumnProps) => {
    const { isReordering } = useContext(ReorderingContext);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [_, { createTask }] = useTasks({ skipQuery: true });
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
          "min-h-[50vh] flex flex-col flex-1 overscroll-x-none overflow-y-auto no-scrollbar",
          cardSize === ECardSize.COMPACT
            ? "min-w-compact w-compact max-w-compact"
            : "min-w-standard w-standard max-w-standard",
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
            <ColumnTitle
              isActive={isActive}
              subtitle={subtitle}
              title={title}
            />
          )}

          {showHabits && (
            <DailyHabits
              className={classNames(
                cardSize === ECardSize.COMPACT
                  ? "max-w-compact"
                  : "max-w-standard",
              )}
              date={Temporal.PlainDate.from(id.split(":")[1])}
            />
          )}

          <CreateTask
            columnId={id}
            enabled={canCreateTasks}
            onTaskCreate={onTaskCreate}
          />
        </div>

        <Droppable droppableId={id} isDropDisabled={isReordering(id)}>
          {(provided) => {
            return (
              <div
                {...provided.droppableProps}
                className="flex flex-col flex-grow gap-2"
                data-list-id={id}
                ref={provided.innerRef}
              >
                {grouping
                  ? grouping.options.map((option) => {
                      const groupedTasks =
                        tasks?.filter(
                          (task) => task[grouping.prop] === option.id,
                        ) || [];

                      return (
                        <Fragment key={option.id}>
                          <div
                            className={classNames(
                              "divider w-full font-semibold text-xs my-4",
                              {
                                "text-base-content/25":
                                  groupedTasks?.length === 0,
                              },
                            )}
                          >
                            {option.title}
                          </div>

                          {groupedTasks.map((task, index) => (
                            <DraggableCard
                              cardSize={cardSize}
                              index={index}
                              key={task.id}
                              task={task}
                            />
                          ))}
                        </Fragment>
                      );
                    })
                  : tasks?.map((task, index) => (
                      <DraggableCard
                        cardSize={cardSize}
                        className={classNames({
                          "mb-4": index === tasks.length - 1,
                        })}
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
  },
);

Column.displayName = "Column";

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
  enabled && (
    <InputWithIcon
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.currentTarget.value.trim()) {
          onTaskCreate?.(e.currentTarget.value.trim());
          e.currentTarget.value = "";
        }
      }}
      type="text"
    >
      <Plus />
    </InputWithIcon>
  );
