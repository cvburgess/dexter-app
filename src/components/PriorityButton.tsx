import {
  Alarm,
  Fire,
  SquaresFour,
  Star,
  Umbrella,
} from "@phosphor-icons/react";

import { ButtonWithPopover, TOption } from "./ButtonWithPopover.tsx";

import { ETaskPriority, TTask, TUpdateTask } from "../api/tasks.ts";
import { TTemplate, TUpdateTemplate } from "../api/templates.ts";

type TPriorityButtonProps =
  | {
      onUpdate: (diff: Omit<TUpdateTask, "id">) => void;
      task: TTask;
    }
  | {
      onUpdate: (diff: Omit<TUpdateTemplate, "id">) => void;
      template: TTemplate;
    };

export const PriorityButton = ({
  onUpdate,
  ...props
}: TPriorityButtonProps) => {
  const isTask = "task" in props;
  const taskOrTemplate = isTask ? props.task : props.template;

  const options = optionsForPriority(taskOrTemplate.priority);

  let icon: JSX.Element;

  switch (taskOrTemplate.priority) {
    case ETaskPriority.IMPORTANT_AND_URGENT:
      icon = <Fire />;
      break;
    case ETaskPriority.IMPORTANT:
      icon = <Star />;
      break;
    case ETaskPriority.URGENT:
      icon = <Alarm />;
      break;
    case ETaskPriority.NEITHER:
      icon = <Umbrella />;
      break;
    default:
      icon = <SquaresFour />;
      break;
  }

  return (
    <ButtonWithPopover
      buttonVariant="round"
      onChange={(priority: ETaskPriority) => onUpdate({ priority })}
      options={options}
      popoverId={`${taskOrTemplate.id}-more`}
      title="Priority"
      variant="menu"
    >
      {icon}
    </ButtonWithPopover>
  );
};

const optionsForPriority = (priority: ETaskPriority): TOption[] => [
  {
    id: ETaskPriority.IMPORTANT_AND_URGENT,
    isSelected: priority === ETaskPriority.IMPORTANT_AND_URGENT,
    title: "Important & Urgent",
    icon: <Fire className="text-warning" />,
  },
  {
    id: ETaskPriority.IMPORTANT,
    isSelected: priority === ETaskPriority.IMPORTANT,
    title: "Important",
    icon: <Star className="text-info" />,
  },
  {
    id: ETaskPriority.URGENT,
    isSelected: priority === ETaskPriority.URGENT,
    title: "Urgent",
    icon: <Alarm className="text-error" />,
  },
  {
    id: ETaskPriority.NEITHER,
    isSelected: priority === ETaskPriority.NEITHER,
    title: "Neither",
    icon: <Umbrella />,
  },
];
