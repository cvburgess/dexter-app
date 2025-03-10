import { CheckFat, SpinnerGap, X } from "@phosphor-icons/react";

import { ButtonWithPopover, TOption } from "./ButtonWithPopover.tsx";

import { ETaskStatus, TUpdateTask } from "../api/tasks.ts";

type TStatusButtonProps = {
  className?: string;
  onTaskUpdate: (diff: Omit<TUpdateTask, "id">) => void;
  status: ETaskStatus;
};

export const StatusButton = (
  { className, onTaskUpdate, status }: TStatusButtonProps,
) => {
  const options = optionsForStatus(status);
  const icon = iconForStatus(status);

  return (
    <ButtonWithPopover
      options={options}
      onChange={(value) =>
        onTaskUpdate({ status: Number(value) as ETaskStatus })}
      variant="menu"
      wrapperClassName={className}
    >
      {icon}
    </ButtonWithPopover>
  );
};

const optionsForStatus = (status: ETaskStatus): TOption[] => [
  {
    id: ETaskStatus.TODO.toString(),
    title: "To Do",
    emoji: "⚪",
    isSelected: status === ETaskStatus.TODO,
  },
  {
    id: ETaskStatus.IN_PROGRESS.toString(),
    title: "In Progress",
    emoji: "🟡",
    isSelected: status === ETaskStatus.IN_PROGRESS,
  },
  {
    id: ETaskStatus.DONE.toString(),
    title: "Done",
    emoji: "🟢",
    isSelected: status === ETaskStatus.DONE,
  },
  {
    id: ETaskStatus.WONT_DO.toString(),
    title: "Won't Do",
    emoji: "🔴",
    isSelected: status === ETaskStatus.WONT_DO,
  },
];

const iconForStatus = (status: ETaskStatus) => {
  switch (status) {
    case ETaskStatus.IN_PROGRESS:
      return <SpinnerGap />;

    case ETaskStatus.DONE:
      return <CheckFat />;

    case ETaskStatus.WONT_DO:
      return <X />;

    default:
      return null;
  }
};
