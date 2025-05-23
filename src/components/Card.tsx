import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Draggable, DraggableProvided } from "@hello-pangea/dnd";
import classNames from "classnames";

import { DueDateButton } from "./DueDateButton.tsx";
import { ListButton } from "./ListButton.tsx";
import { MoreButton } from "./MoreButton.tsx";
import { StatusButton } from "./StatusButton.tsx";

import { useTasks } from "../hooks/useTasks.tsx";
import { useTemplates } from "../hooks/useTemplates.tsx";

import {
  ETaskPriority,
  ETaskStatus,
  TTask,
  TUpdateTask,
} from "../api/tasks.ts";

export enum ECardSize {
  STANDARD = "standard",
  COMPACT = "compact",
}

type TCardProps = {
  cardSize?: ECardSize;
  className?: string;
  provided?: DraggableProvided;
  task: TTask;
};

export const Card = React.memo(
  ({
    cardSize = ECardSize.STANDARD,
    className,
    task,
    provided,
  }: TCardProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [, { deleteTask, updateTask }] = useTasks({ skipQuery: true });
    const [, { createTemplateFromTask }] = useTemplates({ skipQuery: true });

    const navigate = useNavigate();

    const onTaskDelete = () => deleteTask(task.id);

    const onTaskUpdate = (diff: Omit<TUpdateTask, "id">) =>
      updateTask({ id: task.id, ...diff });

    const onTaskRepeat = () => {
      const goToSettings = () => navigate("/settings/tasks");
      if (!task.templateId) {
        createTemplateFromTask(task, { onSuccess: goToSettings });
      } else {
        goToSettings();
      }
    };

    const updateTitle = (title: string) => {
      if (title !== task.title) onTaskUpdate({ title });
      setIsEditing(false);
    };

    const colors = cardColors[task.priority];

    const isComplete =
      task.status === ETaskStatus.DONE || task.status === ETaskStatus.WONT_DO;

    const shouldShowButtons = !isComplete;
    const dragProps = provided
      ? {
          ref: provided.innerRef,
          ...provided.draggableProps,
          ...provided.dragHandleProps,
          style: { ...provided.draggableProps.style },
        }
      : {};

    return (
      <div
        {...dragProps}
        className={classNames(
          "shadow-xs rounded-field p-4 border border-current/10 flex",
          isComplete ? colors.complete : colors.incomplete,
          cardSize === ECardSize.COMPACT
            ? "w-compact"
            : "w-standard min-h-standard",
          className,
        )}
      >
        <div
          className={classNames(
            "flex items-center justify-start gap-2 w-full",
            {
              "flex-wrap": cardSize === ECardSize.COMPACT,
            },
          )}
        >
          {cardSize === ECardSize.STANDARD && (
            <StatusButton
              onTaskUpdate={onTaskUpdate}
              status={task.status}
              task={task}
            />
          )}
          <p
            className={classNames(
              "text-sm font-medium focus:outline-none mx-0.5 cursor-text",
              {
                "flex-grow": cardSize !== ECardSize.COMPACT,
                "w-full mb-2 text-center": cardSize === ECardSize.COMPACT,
              },
            )}
            contentEditable={isEditing}
            onBlur={(e) => updateTitle(e.currentTarget.innerText)}
            onClick={() => setIsEditing(true)}
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
          {cardSize === ECardSize.COMPACT && (
            <StatusButton
              className={isComplete ? "mx-auto" : "mr-auto"}
              onTaskUpdate={onTaskUpdate}
              status={task.status}
              task={task}
            />
          )}
          {shouldShowButtons && (
            <>
              <DueDateButton
                dueOn={task.dueOn}
                isComplete={isComplete}
                onTaskUpdate={onTaskUpdate}
                overdueClasses={colors.overdue}
                task={task}
              />
              <ListButton
                listId={task.listId}
                onUpdate={onTaskUpdate}
                task={task}
              />
              <MoreButton
                onTaskDelete={onTaskDelete}
                onTaskRepeat={onTaskRepeat}
                onTaskUpdate={onTaskUpdate}
                task={task}
              />
            </>
          )}
        </div>
      </div>
    );
  },
);

Card.displayName = "Card";

export const DraggableCard = React.memo(
  ({ cardSize, className, index, task }: TCardProps & { index: number }) => (
    <Draggable draggableId={task.id} index={index} key={task.id}>
      {(provided) => (
        <Card
          cardSize={cardSize}
          className={className}
          provided={provided}
          task={task}
        />
      )}
    </Draggable>
  ),
);

DraggableCard.displayName = "DraggableCard";

export const cardColors = {
  [ETaskPriority.IMPORTANT_AND_URGENT]: {
    complete: "bg-warning/3 hover:bg-warning/10 text-base-content/25",
    incomplete: "bg-warning/80 hover:bg-warning/90 text-warning-content",
    overdue: "bg-warning-content text-warning",
  },

  [ETaskPriority.IMPORTANT]: {
    complete: "bg-info/3 hover:bg-info/10 text-base-content/25",
    incomplete: "bg-info/80 hover:bg-info/90 text-info-content",
    overdue: "bg-info-content text-info",
  },

  [ETaskPriority.URGENT]: {
    complete: "bg-error/3 hover:bg-error/10 text-base-content/25",
    incomplete: "bg-error/80 hover:bg-error/90 text-error-content",
    overdue: "bg-error-content text-error",
  },

  [ETaskPriority.NEITHER]: {
    complete: "bg-base-100/50 hover:bg-base-100/3 text-base-content/25",
    incomplete: "bg-base-100/80 hover:bg-base-100/90 text-base-content",
    overdue: "bg-base-content text-base-100",
  },

  [ETaskPriority.UNPRIORITIZED]: {
    complete: "bg-neutral/3 hover:bg-neutral/10 text-base-content/25",
    incomplete: "bg-neutral/80 hover:bg-neutral/90 text-neutral-content",
    overdue: "bg-neutral-content text-neutral",
  },
};
