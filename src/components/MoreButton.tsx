import { Temporal } from "@js-temporal/polyfill";
import {
  Alarm,
  DotsThreeOutlineVertical,
  Fire,
  Star,
  Umbrella,
} from "@phosphor-icons/react";

import {
  ButtonWithPopover,
  TOnChange,
  TOption,
  TSegmentedOption,
} from "./ButtonWithPopover.tsx";

import { ETaskPriority, TTask, TUpdateTask } from "../api/tasks.ts";
import { weekStartEnd } from "../utils/weekStartEnd.ts";

type TMoreButtonProps = {
  onTaskDelete: () => void;
  onTaskRepeat: () => void;
  onTaskUpdate: (diff: Omit<TUpdateTask, "id">) => void;
  task: TTask;
};

export const MoreButton = ({
  onTaskDelete,
  onTaskRepeat,
  onTaskUpdate,
  task,
}: TMoreButtonProps) => {
  const schedulingOptions = optionsForScheduling(
    task.scheduledFor,
    (scheduledFor: string | null) => onTaskUpdate({ scheduledFor }),
  );
  const priorityOptions = optionsForPriority(task.priority, (priority) =>
    onTaskUpdate({ priority }),
  );

  const otherOptions: TSegmentedOption = {
    title: "Other",
    options: [
      {
        id: "repeat",
        title: task.templateId ? "Edit Repeat Schedule" : "Repeat",
        onChange: onTaskRepeat,
        isSelected: false,
      },
      {
        id: "delete",
        title: "Delete",
        onChange: onTaskDelete,
        isDangerous: true,
        isSelected: false,
      },
    ],
  };

  return (
    <ButtonWithPopover
      buttonVariant="round"
      options={[priorityOptions, schedulingOptions, otherOptions]}
      popoverId={`${task.id}-more`}
      title="More"
      variant="segmentedMenu"
    >
      <DotsThreeOutlineVertical />
    </ButtonWithPopover>
  );
};

const optionsForPriority = (
  priority: ETaskPriority,
  onChange: TOnChange<ETaskPriority>,
): TSegmentedOption => {
  const options: Array<TOption & { onChange: () => void }> = [
    {
      id: ETaskPriority.IMPORTANT_AND_URGENT,
      isSelected: priority === ETaskPriority.IMPORTANT_AND_URGENT,
      onChange: () => onChange(ETaskPriority.IMPORTANT_AND_URGENT),
      title: "Important & Urgent",
      icon: <Fire className="text-warning" />,
    },
    {
      id: ETaskPriority.IMPORTANT,
      isSelected: priority === ETaskPriority.IMPORTANT,
      onChange: () => onChange(ETaskPriority.IMPORTANT),
      title: "Important",
      icon: <Star className="text-info" />,
    },
    {
      id: ETaskPriority.URGENT,
      isSelected: priority === ETaskPriority.URGENT,
      onChange: () => onChange(ETaskPriority.URGENT),
      title: "Urgent",
      icon: <Alarm className="text-error" />,
    },
    {
      id: ETaskPriority.NEITHER,
      isSelected: priority === ETaskPriority.NEITHER,
      onChange: () => onChange(ETaskPriority.NEITHER),
      title: "Neither",
      icon: <Umbrella />,
    },
  ];

  return { title: "Priority", display: "row", options };
};

const optionsForScheduling = (
  scheduledFor: string | null,
  onChange: TOnChange<string | null>,
): TSegmentedOption => {
  const today = Temporal.Now.plainDateISO().toString();
  const tomorrow = Temporal.Now.plainDateISO().add({ days: 1 }).toString();

  const { monday } = weekStartEnd(1);

  const isScheduledForNextWeek =
    Boolean(scheduledFor) &&
    Temporal.PlainDate.from(scheduledFor).until(monday).days <= 0 &&
    Temporal.PlainDate.from(scheduledFor).until(monday).days >= -6;

  const nextMonday = monday.toString();

  const options: Array<TOption & { onChange: () => void }> = [
    {
      id: today,
      isSelected: scheduledFor === today,
      onChange: () => onChange(today),
      title: "Today",
    },
    {
      id: tomorrow,
      isSelected: scheduledFor === tomorrow,
      onChange: () => onChange(tomorrow),
      title: "Tomorrow",
    },
  ];

  if (!isScheduledForNextWeek && tomorrow !== nextMonday) {
    options.push({
      id: nextMonday,
      isSelected: false,
      onChange: () => onChange(nextMonday),
      title: "Next Week",
    });
  }

  if (scheduledFor) {
    if (scheduledFor !== today && scheduledFor !== tomorrow) {
      options.push({
        id: scheduledFor,
        isSelected: true,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onChange: () => {},
        title: Temporal.PlainDate.from(scheduledFor).toLocaleString(["en-us"], {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      });
    }

    options.push({
      id: null,
      isSelected: false,
      onChange: () => onChange(null),
      title: "Unschedule",
    });
  }

  return { title: "Schedule", options };
};
