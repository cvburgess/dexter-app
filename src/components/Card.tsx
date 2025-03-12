import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import classNames from "classnames";

import { DueDateButton } from "./DueDateButton.tsx";
import { ListButton } from "./ListButton.tsx";
import { MoreButton } from "./MoreButton.tsx";
import { StatusButton } from "./StatusButton.tsx";

import { useTasks } from "../hooks/useTasks.tsx";

import {
  ETaskPriority,
  ETaskStatus,
  TTask,
  TUpdateTask,
} from "../api/tasks.ts";

export type ECardSize = "normal" | "compact-h" | "compact-w";

type CardProps = {
  cardSize?: ECardSize;
  index: number;
  task: TTask;
};

export const Card = (
  { cardSize = "normal", task, index }: CardProps,
) => {
  const [isEditing, setIsEditing] = useState(false);
  const [_, { updateTask }] = useTasks();

  const onTaskUpdate = (diff: Omit<TUpdateTask, "id">) =>
    updateTask({ id: task.id, ...diff });

  const updateTitle = (title: string) => {
    if (title !== task.title) onTaskUpdate({ title });
    setIsEditing(false);
  };

  const colors = cardColors[task.priority];

  const isComplete = task.status === ETaskStatus.DONE ||
    task.status === ETaskStatus.WONT_DO;

  const shouldShowButtons = cardSize !== "compact-h" && !isComplete;

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
              cardSize === "compact-w" ? "w-40" : "w-70",
            )}
          >
            <div
              className={classNames("flex items-center justify-start gap-2", {
                "flex-wrap": cardSize === "compact-w",
              })}
            >
              {cardSize === "compact-w" ? null : (
                <StatusButton
                  onTaskUpdate={onTaskUpdate}
                  status={task.status}
                />
              )}
              <p
                className={classNames(
                  "text-xs font-medium focus:outline-none",
                  isEditing ? "cursor-text" : "cursor-default",
                  {
                    "flex-grow": cardSize !== "compact-w",
                    "w-full mb-2 text-center": cardSize === "compact-w",
                  },
                )}
                contentEditable={isEditing}
                onClick={() => setIsEditing(true)}
                onBlur={(e) => updateTitle(e.currentTarget.innerText)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateTitle(e.currentTarget.innerText);
                    (e.target as HTMLParagraphElement).blur(); // Unfocus the input
                  }
                }}
                suppressContentEditableWarning
              >
                {task.title}
              </p>
              {cardSize === "compact-w"
                ? (
                  <StatusButton
                    onTaskUpdate={onTaskUpdate}
                    status={task.status}
                    className={isComplete ? "mx-auto" : "mr-auto"}
                  />
                )
                : null}
              {shouldShowButtons
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
    incomplete: "bg-neutral/80 hover:bg-neutral/90 text-neutral-content",
    overdue: "bg-neutral-content text-neutral",
  },
};
