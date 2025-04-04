import { Check, Circle, SpinnerGap, X } from "@phosphor-icons/react";
import classNames from "classnames";

import { ButtonWithPopover, TOption } from "./ButtonWithPopover.tsx";

import { ETaskStatus, TTask, TUpdateTask } from "../api/tasks.ts";

type TStatusButtonProps = {
  className?: string;
  onTaskUpdate: (diff: Omit<TUpdateTask, "id">) => void;
  status: ETaskStatus;
  task: TTask;
};

export const StatusButton = ({
  className,
  onTaskUpdate,
  status,
  task,
}: TStatusButtonProps) => {
  const options = optionsForStatus(status);
  const icon = iconForStatus(status);

  return (
    <ButtonWithPopover
      buttonVariant="round"
      onChange={(value) =>
        onTaskUpdate({ status: Number(value) as ETaskStatus })
      }
      options={options}
      popoverId={`${task.id}`}
      variant="menu"
      wrapperClassName={classNames(className)}
    >
      {icon}
    </ButtonWithPopover>
  );
};

const optionsForStatus = (status: ETaskStatus): TOption[] => [
  {
    id: ETaskStatus.TODO.toString(),
    title: "To Do",
    icon: <Circle />,
    isSelected: status === ETaskStatus.TODO,
  },
  {
    id: ETaskStatus.IN_PROGRESS.toString(),
    title: "In Progress",
    icon: <SpinnerGap />,
    isSelected: status === ETaskStatus.IN_PROGRESS,
  },
  {
    id: ETaskStatus.DONE.toString(),
    title: "Done",
    icon: <Check />,
    isSelected: status === ETaskStatus.DONE,
  },
  {
    id: ETaskStatus.WONT_DO.toString(),
    title: "Won't Do",
    icon: <X />,
    isSelected: status === ETaskStatus.WONT_DO,
  },
];

const iconForStatus = (status: ETaskStatus) => {
  switch (status) {
    case ETaskStatus.IN_PROGRESS:
      return <SpinnerGap />;

    case ETaskStatus.DONE:
      return <Check />;

    case ETaskStatus.WONT_DO:
      return <X />;

    default:
      return null;
  }
};
