import { Draggable } from "@hello-pangea/dnd";
import { Temporal } from "@js-temporal/polyfill";
import { BellRinging, DotsThreeOutlineVertical } from "@phosphor-icons/react";
import classNames from "classnames";

import { ETaskPriority, ETaskStatus, TTask } from "../api/tasks.ts";

type CardProps = {
  task: TTask;
  index: number;
  compact?: boolean;
};

export const Card = (
  { task, index, compact = false }: CardProps,
) => {
  const colors = getColors(task.priority);

  return (
    <Draggable
      key={task.id}
      draggableId={task.id}
      index={index}
    >
      {(provided) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            data-task-id={task.id}
            style={{ ...provided.draggableProps.style }}
            className={classNames(
              "shadow-md rounded-lg p-4 border border-current/10",
              colors.main,
              compact ? "w-[10rem]" : "w-xs",
            )}
          >
            <div className="flex flex-wrap items-center justify-start gap-2">
              {compact ? null : <StatusButton status={task.status} />}
              <p
                className={classNames("text-xs font-medium", {
                  "flex-grow": !compact,
                  "w-full": compact,
                  "mb-2": compact,
                  "text-center": compact,
                  "text-pretty": compact,
                })}
              >
                {task.title}
              </p>
              {compact ? <StatusButton status={task.status} push /> : null}
              <ListButton list="🐶" />
              <DueDateButton
                dueOn={task.dueOn}
                inverseColors={colors.inverse}
              />
              <MoreButton />
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};

const StatusButton = (
  // deno-lint-ignore no-unused-vars
  { push = false, status }: { push?: boolean; status: ETaskStatus },
) => (
  <button
    type="button"
    className={classNames(
      "w-5 h-5 rounded-full border focus:ring-2 focus:ring-offset-2 border-current/40 hover:bg-current/10",
      { "mr-auto": push },
    )}
  />
);

const TaskButton = (
  { children, className }: { children: React.ReactNode; className?: string },
) => (
  <button
    type="button"
    className={classNames(
      "w-5 h-5 rounded-full outline focus:ring-2 focus:ring-offset-2 flex items-center justify-center text-xs outline-current/40 hover:bg-current/10",
      className,
    )}
  >
    {children}
  </button>
);

const ListButton = ({ list }: { list: string }) => (
  <TaskButton>{list}</TaskButton>
);

const DueDateButton = (
  { dueOn, inverseColors }: { dueOn?: string; inverseColors: string },
) => {
  if (!dueOn) {
    return (
      <TaskButton>
        <BellRinging />
      </TaskButton>
    );
  }

  const now = Temporal.Now.plainDateISO();
  const dueDate = Temporal.PlainDate.from(dueOn);
  const daysUntilDue = now.until(dueDate).days;

  return (
    <TaskButton
      className={classNames("text-[.65rem]", {
        [inverseColors]: daysUntilDue <= 1,
      })}
    >
      {daysUntilDue}
    </TaskButton>
  );
};

const MoreButton = () => (
  <TaskButton>
    <DotsThreeOutlineVertical />
  </TaskButton>
);

const getColors = (priority: ETaskPriority | null) => {
  switch (priority) {
    case ETaskPriority.IMPORTANT_AND_URGENT:
      return {
        main:
          "bg-warning/80 hover:bg-warning/90 text-warning-content outline-warning-content/40",
        inverse:
          "bg-warning-content hover:bg-warning-content/90 text-warning outline-warning-content/40",
      };

    case ETaskPriority.IMPORTANT:
      return {
        main:
          "bg-info/80 hover:bg-info/90 text-info-content outline-info-content/40",
        inverse:
          "bg-info-content hover:bg-info-content/90 text-info outline-info-content/40",
      };

    case ETaskPriority.URGENT:
      return {
        main:
          "bg-error/80 hover:bg-error/90 text-error-content outline-error-content/40",
        inverse:
          "bg-error-content hover:bg-error-content/90 text-error outline-error-content/40",
      };

    case ETaskPriority.NEITHER:
    default:
      return {
        main:
          "bg-base-100/80 hover:bg-base-100/90 text-base-content outline-base-content/40",
        inverse:
          "bg-base-content hover:bg-base-content/90 text-base-100 outline-base-content/40",
      };
  }
};
