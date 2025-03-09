import { Draggable } from "@hello-pangea/dnd";
import { Temporal } from "@js-temporal/polyfill";
import {
  BellRinging,
  CheckFat,
  DotsThreeOutlineVertical,
  Smiley,
  SpinnerGap,
  X,
} from "@phosphor-icons/react";
import classNames from "classnames";

import { useLists } from "../hooks/useLists.tsx";

import {
  ETaskPriority,
  ETaskStatus,
  TTask,
  TUpdateTask,
} from "../api/tasks.ts";
import { TList } from "../api/lists.ts";

type CardProps = {
  task: TTask;
  index: number;
  compact?: boolean;
  onTaskUpdate?: (diff: Omit<TUpdateTask, "id">) => void;
};

type TOption = {
  id: string | null;
  title: string;
  emoji: string;
  isSelected: boolean;
};

export const Card = (
  { task, index, compact = false, onTaskUpdate }: CardProps,
) => {
  const [lists, { getListById }] = useLists();
  const colors = cardColors[task.priority];

  const isComplete = task.status === ETaskStatus.DONE ||
    task.status === ETaskStatus.WONT_DO;

  const listOptions: TOption[] = [
    { id: null, title: "None", emoji: "🚫" },
    ...lists,
  ].map((list) => ({
    id: list.id,
    title: list.title,
    emoji: list.emoji,
    isSelected: list.id === task.listId,
  }));

  const statusOptions: TOption[] = [
    {
      id: ETaskStatus.TODO.toString(),
      title: "To Do",
      emoji: "⚪",
      isSelected: task.status === ETaskStatus.TODO,
    },
    {
      id: ETaskStatus.IN_PROGRESS.toString(),
      title: "In Progress",
      emoji: "🟡",
      isSelected: task.status === ETaskStatus.IN_PROGRESS,
    },
    {
      id: ETaskStatus.DONE.toString(),
      title: "Done",
      emoji: "🟢",
      isSelected: task.status === ETaskStatus.DONE,
    },
    {
      id: ETaskStatus.WONT_DO.toString(),
      title: "Won't Do",
      emoji: "🔴",
      isSelected: task.status === ETaskStatus.WONT_DO,
    },
  ];

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
              "shadow-md rounded-box p-4 border border-current/10",
              isComplete ? colors.complete : colors.incomplete,
              compact ? "w-40" : "w-80",
            )}
          >
            <div className="flex flex-wrap items-center justify-start gap-2">
              {compact ? null : (
                <StatusButton
                  onTaskUpdate={onTaskUpdate}
                  options={statusOptions}
                  status={task.status}
                />
              )}
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
              {compact
                ? (
                  <StatusButton
                    onTaskUpdate={onTaskUpdate}
                    options={statusOptions}
                    status={task.status}
                    push
                  />
                )
                : null}
              <ListButton
                list={getListById(task.listId)}
                onTaskUpdate={onTaskUpdate}
                options={listOptions}
                status={task.status}
              />
              <DueDateButton
                dueOn={task.dueOn}
                colors={colors}
                status={task.status}
              />
              <MoreButton />
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};

type TStatusButtonProps = Omit<TTaskButtonProps, "children"> & {
  push?: boolean;
  status: ETaskStatus;
};

const StatusButton = (
  { onTaskUpdate, options, push = false, status }: TStatusButtonProps,
) => (
  <TaskButton
    onTaskUpdate={onTaskUpdate}
    diffKey="status"
    options={options}
    push={push}
  >
    {status === ETaskStatus.IN_PROGRESS ? <SpinnerGap /> : null}
    {status === ETaskStatus.DONE ? <CheckFat /> : null}
    {status === ETaskStatus.WONT_DO ? <X /> : null}
  </TaskButton>
);

const buttonStyles =
  "w-5 h-5 rounded-box outline focus:ring-2 focus:ring-offset-2 flex items-center justify-center text-xs outline-current/40 hover:bg-current/10";

type TTaskButtonProps = {
  children: React.ReactNode;
  className?: string;
  diffKey?: string;
  onTaskUpdate?: (diff: Omit<TUpdateTask, "id">) => void;
  options?: TOption[];
  push?: boolean;
};

const TaskButton = (
  { children, className, diffKey, onTaskUpdate, options, push = false }:
    TTaskButtonProps,
) => (
  <div
    className={classNames({
      "dropdown dropdown-start dropdown-hover": options,
      "dropdown-open": false,
      "mr-auto": push,
    })}
  >
    <div
      tabIndex={0}
      role="button"
      className={classNames(buttonStyles, className)}
    >
      {children}
    </div>

    {options
      ? (
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow-sm text-base-content"
        >
          {options.map((option) => (
            <li key={option.id}>
              <a
                onClick={() => onTaskUpdate!({ [diffKey!]: option.id })}
                className={classNames("flex items-center gap-2", {
                  "bg-base-300": option.isSelected,
                })}
              >
                <span>{option.emoji}</span>
                <span>{option.title}</span>
              </a>
            </li>
          ))}
        </ul>
      )
      : null}
  </div>
);

type TListButtonProps = Omit<TTaskButtonProps, "children"> & {
  list?: TList;
  status: ETaskStatus;
};

const ListButton = (
  { list, onTaskUpdate, options, status }: TListButtonProps,
) => (
  <TaskButton
    className={classNames({
      "opacity-50": status === ETaskStatus.DONE ||
        status === ETaskStatus.WONT_DO,
    })}
    diffKey="listId"
    options={options}
    onTaskUpdate={onTaskUpdate}
  >
    {list ? list.emoji : <Smiley weight="thin" size={24} />}
  </TaskButton>
);

const DueDateButton = (
  { dueOn, colors, status }: {
    dueOn?: string;
    colors: { overdue: string };
    status: ETaskStatus;
  },
) => {
  const shouldShowCountdown = Boolean(dueOn) && status !== ETaskStatus.DONE &&
    status !== ETaskStatus.WONT_DO;

  const now = Temporal.Now.plainDateISO();

  const daysUntilDue = Boolean(dueOn) &&
    now.until(Temporal.PlainDate.from(dueOn!)).days;

  const shouldWarnUser = shouldShowCountdown &&
    daysUntilDue && daysUntilDue <= 1;

  return (
    <button
      type="button"
      className={classNames(buttonStyles, "text-[.65rem]", {
        [colors.overdue]: shouldWarnUser,
      })}
    >
      {shouldShowCountdown ? daysUntilDue : <BellRinging />}
    </button>
  );
};

const MoreButton = () => (
  <TaskButton>
    <DotsThreeOutlineVertical />
  </TaskButton>
);

const cardColors = {
  [ETaskPriority.IMPORTANT_AND_URGENT]: {
    complete: "bg-warning/3 hover:bg-warning/10 text-base-content/25",
    incomplete: "bg-warning/80 hover:bg-warning/90 text-warning-content",
    overdue: "bg-warning-content hover:bg-warning-content/90 text-warning",
  },

  [ETaskPriority.URGENT]: {
    complete: "bg-error/3 hover:bg-error/10 text-base-content/25",
    incomplete: "bg-error/80 hover:bg-error/90 text-error-content",
    overdue: "bg-error-content hover:bg-error-content/90 text-error",
  },

  [ETaskPriority.IMPORTANT]: {
    complete: "bg-info/3 hover:bg-info/10 text-base-content/25",
    incomplete: "bg-info/80 hover:bg-info/90 text-info-content",
    overdue: "bg-info-content hover:bg-info-content/90 text-info",
  },

  [ETaskPriority.NEITHER]: {
    complete: "bg-base-3 hover:bg-base-10 text-base-content/25",
    incomplete: "bg-base-100/80 hover:bg-base-100/90 text-base-content",
    overdue: "bg-base-content hover:bg-base-content text-base-100",
  },

  [ETaskPriority.UNPRIORITIZED]: {
    complete: "bg-base-3 hover:bg-base-10 text-base-content/25",
    incomplete: "bg-base-100/80 hover:bg-base-100/90 text-base-content",
    overdue: "bg-base-content hover:bg-base-content text-base-100",
  },
};
