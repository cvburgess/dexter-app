// deno-lint-ignore-file no-unused-vars
import { UniqueIdentifier } from "@dnd-kit/abstract";
import { useSortable } from "@dnd-kit/react/sortable";
import { Temporal } from "@js-temporal/polyfill";
import {
  BellRinging,
  CalendarBlank,
  CalendarCheck,
  Play,
} from "@phosphor-icons/react";
import classNames from "classnames";

import { Task, TaskPriority, TaskStatus } from "../api/tasks.ts";

type CardProps = {
  task: Task;
  index: number;
  groupBy?: "scheduledFor" | "listId" | "priority";
};

export const Card = (
  { task, index, groupBy }: CardProps,
) => {
  const colors = getColors(task.priority);

  const { ref, isDragging } = useSortable({
    id: task.id,
    index,
    type: "item",
    accept: "item",
    group: groupBy ? task[groupBy] as UniqueIdentifier : undefined,
  });

  return (
    <div
      data-dragging={isDragging}
      className={classNames(
        "shadow-md rounded-lg p-4 m-4 w-sm border border-current/10",
        colors.main,
      )}
      ref={ref}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <StatusButton status={task.status} />
          <p className="text-sm font-semibold">
            {task.title}
          </p>
        </div>
        <div className="flex items-center">
          <ListButton list="🐶" />
          <DueDateButton dueOn={task.dueOn} inverseColors={colors.inverse} />
          <ScheduleButton scheduledFor={task.scheduledFor} />
          <FocusButton focusCycles={3} />
        </div>
      </div>
    </div>
  );
};

const StatusButton = (
  { status }: { status: TaskStatus },
) => (
  <button
    type="button"
    className="w-5 h-5 rounded-full border mr-2 focus:ring-2 focus:ring-offset-2 border-current/40 hover:bg-current/10"
  />
);

const TaskButton = (
  { children, className }: { children: React.ReactNode; className?: string },
) => (
  <button
    type="button"
    className={classNames(
      "w-5 h-5 rounded-full outline mr-2 focus:ring-2 focus:ring-offset-2 flex items-center justify-center text-xs outline-current/40 hover:bg-current/10",
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

const ScheduleButton = ({ scheduledFor }: { scheduledFor?: string }) => (
  <TaskButton>
    {scheduledFor ? <CalendarCheck weight="fill" /> : <CalendarBlank />}
  </TaskButton>
);

const FocusButton = ({ focusCycles }: { focusCycles: number }) => (
  <TaskButton>{<Play />}</TaskButton>
);

const getColors = (priority: TaskPriority | null) => {
  switch (priority) {
    case TaskPriority.IMPORTANT_AND_URGENT:
      return {
        main:
          "bg-warning/80 hover:bg-warning/90 text-warning-content outline-warning-content/40",
        inverse:
          "bg-warning-content hover:bg-warning-content/90 text-warning outline-warning-content/40",
      };

    case TaskPriority.IMPORTANT:
      return {
        main:
          "bg-info/80 hover:bg-info/90 text-info-content outline-info-content/40",
        inverse:
          "bg-info-content hover:bg-info-content/90 text-info outline-info-content/40",
      };

    case TaskPriority.URGENT:
      return {
        main:
          "bg-error/80 hover:bg-error/90 text-error-content outline-error-content/40",
        inverse:
          "bg-error-content hover:bg-error-content/90 text-error outline-error-content/40",
      };

    case TaskPriority.NEITHER:
    default:
      return {
        main:
          "bg-base-100/80 hover:bg-base-100/90 text-base-content outline-base-content/40",
        inverse:
          "bg-base-content hover:bg-base-content/90 text-base-100 outline-base-content/40",
      };
  }
};
