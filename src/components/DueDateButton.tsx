import { BellRinging } from "@phosphor-icons/react";
import { Temporal } from "@js-temporal/polyfill";
import classNames from "classnames";

import { ButtonWithPopover } from "./ButtonWithPopover.tsx";
import { Tooltip } from "./Tooltip.tsx";

import { TTask, TUpdateTask } from "../api/tasks.ts";

type TDueDateButtonProps = {
  dueOn: string | null;
  isComplete: boolean;
  onTaskUpdate: (diff: Omit<TUpdateTask, "id">) => void;
  overdueClasses: string;
  task: TTask;
};

export const DueDateButton = ({
  dueOn,
  isComplete,
  onTaskUpdate,
  overdueClasses,
  task,
}: TDueDateButtonProps) => {
  const shouldShowCountdown = Boolean(dueOn) && !isComplete;

  const now = Temporal.Now.plainDateISO();

  const daysUntilDue = dueOn
    ? now.until(Temporal.PlainDate.from(dueOn)).days
    : null;

  const shouldWarnUser =
    shouldShowCountdown && daysUntilDue !== null && daysUntilDue <= 1;

  return (
    <Tooltip position="top" text="Due Date">
      <ButtonWithPopover
        buttonClassName={classNames({ [overdueClasses]: shouldWarnUser })}
        buttonVariant="round"
        onChange={(value) => onTaskUpdate({ dueOn: value })}
        popoverId={`${task.id}-due-date`}
        selectedDate={dueOn}
        variant="calendar"
      >
        {shouldShowCountdown ? daysUntilDue : <BellRinging />}
      </ButtonWithPopover>
    </Tooltip>
  );
};
