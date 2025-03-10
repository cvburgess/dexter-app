import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import classNames from "classnames";

import { DueDateButton } from "./DueDateButton.tsx";
import { ListButton } from "./ListButton.tsx";
import { MoreButton } from "./MoreButton.tsx";
import { StatusButton } from "./StatusButton.tsx";

import {
  ETaskPriority,
  ETaskStatus,
  TTask,
  TUpdateTask,
} from "../api/tasks.ts";

type CardProps = {
  compact?: boolean;
  index: number;
  onTaskUpdate: (diff: Omit<TUpdateTask, "id">) => void;
  task: TTask;
};

export const Card = (
  { task, index, compact = false, onTaskUpdate }: CardProps,
) => {
  const [title, setTitle] = useState(task.title);
  const updateTitle = () => {
    if (title !== task.title) onTaskUpdate({ title });
  };

  const colors = cardColors[task.priority];

  const isComplete = task.status === ETaskStatus.DONE ||
    task.status === ETaskStatus.WONT_DO;

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
                <input
                  className="bg-transparent border-none p-0 focus:outline-none w-full"
                  onBlur={() => updateTitle()}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateTitle();
                      (e.target as HTMLInputElement).blur(); // Unfocus the input
                    }
                  }}
                  type="text"
                  value={title}
                />
              </p>
              {compact
                ? (
                  <StatusButton
                    onTaskUpdate={onTaskUpdate}
                    status={task.status}
                    className={isComplete ? "mx-auto" : "mr-auto"}
                  />
                )
                : null}
              {!isComplete
                ? (
                  <>
                    <ListButton
                      listId={task.listId}
                      onTaskUpdate={onTaskUpdate}
                    />
                    <DueDateButton
                      dueOn={task.dueOn}
                      isComplete={isComplete}
                      onTaskUpdate={onTaskUpdate}
                      overdueClasses={colors.overdue}
                    />
                    <MoreButton
                      onTaskUpdate={onTaskUpdate}
                      scheduledFor={task.scheduledFor}
                    />
                  </>
                )
                : null}
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};

const cardColors = {
  [ETaskPriority.IMPORTANT_AND_URGENT]: {
    complete: "bg-warning/3 hover:bg-warning/10 text-base-content/25",
    incomplete: "bg-warning/80 hover:bg-warning/90 text-warning-content",
    overdue: "bg-warning-content text-warning",
  },

  [ETaskPriority.URGENT]: {
    complete: "bg-error/3 hover:bg-error/10 text-base-content/25",
    incomplete: "bg-error/80 hover:bg-error/90 text-error-content",
    overdue: "bg-error-content text-error",
  },

  [ETaskPriority.IMPORTANT]: {
    complete: "bg-info/3 hover:bg-info/10 text-base-content/25",
    incomplete: "bg-info/80 hover:bg-info/90 text-info-content",
    overdue: "bg-info-content text-info",
  },

  [ETaskPriority.NEITHER]: {
    complete: "bg-base-100/3 hover:bg-base-100/10 text-base-content/25",
    incomplete: "bg-base-100/80 hover:bg-base-100/90 text-base-content",
    overdue: "bg-base-content text-base-100",
  },

  [ETaskPriority.UNPRIORITIZED]: {
    complete: "bg-base-100/3 hover:bg-base-100/10 text-base-content/25",
    incomplete: "bg-base-100/80 hover:bg-base-100/90 text-base-content",
    overdue: "bg-base-content text-base-100",
  },
};
