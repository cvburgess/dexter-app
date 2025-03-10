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
import { ButtonWithPopover } from "./ButtonWithPopover.tsx";

type CardProps = {
  compact?: boolean;
  index: number;
  onTaskUpdate: (diff: Omit<TUpdateTask, "id">) => void;
  task: TTask;
};

type TOption = {
  emoji: string;
  id: string | null;
  isSelected: boolean;
  title: string;
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
                onTaskUpdate={onTaskUpdate}
                status={task.status}
              />
              <MoreButton
                onTaskUpdate={onTaskUpdate}
                scheduledFor={task.scheduledFor}
              />
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};

type TStatusButtonProps = {
  onTaskUpdate: (diff: Omit<TUpdateTask, "id">) => void;
  options: TOption[];
  push?: boolean;
  status: ETaskStatus;
};

const StatusButton = (
  { onTaskUpdate, options, push = false, status }: TStatusButtonProps,
) => (
  <ButtonWithPopover
    options={options}
    onChange={(value) => onTaskUpdate({ status: Number(value) as ETaskStatus })}
    variant="menu"
    wrapperClassName={push ? "mr-auto" : undefined}
  >
    {status === ETaskStatus.IN_PROGRESS ? <SpinnerGap /> : null}
    {status === ETaskStatus.DONE ? <CheckFat /> : null}
    {status === ETaskStatus.WONT_DO ? <X /> : null}
  </ButtonWithPopover>
);

type TListButtonProps = {
  list?: TList;
  onTaskUpdate: (diff: Omit<TUpdateTask, "id">) => void;
  options: TOption[];
  status: ETaskStatus;
};

const ListButton = (
  { list, onTaskUpdate, options, status }: TListButtonProps,
) => (
  <ButtonWithPopover
    buttonClassName={classNames({
      "opacity-50": status === ETaskStatus.DONE ||
        status === ETaskStatus.WONT_DO,
    })}
    onChange={(value) => onTaskUpdate({ listId: value })}
    options={options}
    variant="menu"
  >
    {list ? list.emoji : <Smiley weight="thin" size={24} />}
  </ButtonWithPopover>
);

type TDueDateButtonProps = {
  colors: Record<string, string>;
  dueOn: string | null;
  onTaskUpdate: (diff: Omit<TUpdateTask, "id">) => void;
  status: ETaskStatus;
};

const DueDateButton = (
  { dueOn, colors, onTaskUpdate, status }: TDueDateButtonProps,
) => {
  const shouldShowCountdown = Boolean(dueOn) && status !== ETaskStatus.DONE &&
    status !== ETaskStatus.WONT_DO;

  const now = Temporal.Now.plainDateISO();

  const daysUntilDue = dueOn
    ? now.until(Temporal.PlainDate.from(dueOn!)).days
    : null;

  const shouldWarnUser = shouldShowCountdown &&
    daysUntilDue !== null &&
    daysUntilDue <= 1;

  return (
    <ButtonWithPopover
      buttonClassName={classNames({
        [colors.overdue]: shouldWarnUser,
        "opacity-50": status === ETaskStatus.DONE ||
          status === ETaskStatus.WONT_DO,
      })}
      onChange={(value) => onTaskUpdate({ dueOn: value })}
      selectedDate={dueOn}
      variant="calendar"
    >
      {shouldShowCountdown ? daysUntilDue : <BellRinging />}
    </ButtonWithPopover>
  );
};

type TMoreButtonProps = {
  onTaskUpdate: (diff: Omit<TUpdateTask, "id">) => void;
  scheduledFor: string | null;
};

const MoreButton = ({ onTaskUpdate, scheduledFor }: TMoreButtonProps) => {
  const today = Temporal.Now.plainDateISO().toString();
  const tomorrow = Temporal.Now.plainDateISO().add({ days: 1 }).toString();

  const options: TOption[] = [
    {
      id: today,
      title: "Today",
      emoji: "☀️",
      isSelected: scheduledFor === today,
    },
    {
      id: tomorrow,
      title: "Tomorrow",
      emoji: "🔜",
      isSelected: scheduledFor === tomorrow,
    },
  ];

  if (scheduledFor) {
    options.push({
      id: null,
      title: "Unschedule",
      emoji: "🚫",
      isSelected: false,
    });

    if (scheduledFor !== today && scheduledFor !== tomorrow) {
      options.push({
        id: scheduledFor,
        title: Temporal.PlainDate.from(scheduledFor).toLocaleString(["en-us"], {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        emoji: "📅",
        isSelected: true,
      });
    }
  }

  return (
    <ButtonWithPopover
      onChange={(value) => onTaskUpdate({ scheduledFor: value })}
      options={options}
      variant="menu"
    >
      <DotsThreeOutlineVertical />
    </ButtonWithPopover>
  );
};

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
