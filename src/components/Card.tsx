// deno-lint-ignore-file no-unused-vars
import { useSortable } from "@dnd-kit/react/sortable";
import { Temporal } from "@js-temporal/polyfill";
import {
  BellRinging,
  CalendarBlank,
  CalendarCheck,
  Play,
} from "@phosphor-icons/react";

type Task = {
  id: string;
  description?: string;
  dueOn?: string;
  priority: TaskPriority | null;
  scheduledFor?: string;
  status: TaskStatus;
  subtasks: Task[];
  title: string;
};

enum TaskPriority {
  IMPORTANT_AND_URGENT,
  URGENT,
  IMPORTANT,
  NEITHER,
}

enum TaskStatus {
  TODO,
  IN_PROGRESS,
  DONE,
  WONT_DO,
}

export const Card = (
  { task, index }: { task: Task; index: number },
) => {
  const colors = getColors(task.priority);

  const { ref } = useSortable({ id: task.id, index });

  return (
    <div
      className={`shadow-md rounded-lg p-4 m-4 w-sm ${colors.main} border border-current/10`}
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
    className={`w-5 h-5 rounded-full outline mr-2 focus:ring-2 focus:ring-offset-2 flex items-center justify-center text-xs outline-current/40 hover:bg-current/10 ${className}`}
  >
    {children}
  </button>
);

const ListButton = ({ list }: { list: string }) => (
  <TaskButton>{list}</TaskButton>
);

const DueDateButton = (
  { dueOn, inverseColors }: { dueOn?: string; inverseColors?: string },
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
  const styles = daysUntilDue <= 1 ? inverseColors : "";

  return (
    <TaskButton className={`text-[.65rem] ${styles}`}>
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
