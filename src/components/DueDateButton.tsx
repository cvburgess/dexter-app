import { BellRinging } from "@phosphor-icons/react";
import { Temporal } from "@js-temporal/polyfill";
import classNames from "classnames";

import { ButtonWithPopover } from "./ButtonWithPopover.tsx";

import { TUpdateTask } from "../api/tasks.ts";

type TDueDateButtonProps = {
  dueOn: string | null;
  isComplete: boolean;
  onTaskUpdate: (diff: Omit<TUpdateTask, "id">) => void;
  overdueClasses: string;
};

export const DueDateButton = ({
  dueOn,
  isComplete,
  onTaskUpdate,
  overdueClasses,
}: TDueDateButtonProps) => {
  const shouldShowCountdown = Boolean(dueOn) && !isComplete;

  const now = Temporal.Now.plainDateISO();

  const daysUntilDue = dueOn
    ? now.until(Temporal.PlainDate.from(dueOn)).days
    : null;

  const shouldWarnUser =
    shouldShowCountdown && daysUntilDue !== null && daysUntilDue <= 1;

  return (
    <ButtonWithPopover
      buttonClassName={classNames({ [overdueClasses]: shouldWarnUser })}
      buttonVariant="round"
      onChange={(value) => onTaskUpdate({ dueOn: value })}
      selectedDate={dueOn}
      variant="calendar"
      wrapperClassName="dropdown-center dropdown-hover"
    >
      {shouldShowCountdown ? daysUntilDue : <BellRinging />}
    </ButtonWithPopover>
  );
};
