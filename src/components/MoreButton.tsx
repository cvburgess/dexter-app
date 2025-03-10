import { Temporal } from "@js-temporal/polyfill";
import { DotsThreeOutlineVertical } from "@phosphor-icons/react";

import { ButtonWithPopover, TOption } from "./ButtonWithPopover.tsx";

import { TUpdateTask } from "../api/tasks.ts";

type TMoreButtonProps = {
  onTaskUpdate: (diff: Omit<TUpdateTask, "id">) => void;
  scheduledFor: string | null;
};

export const MoreButton = (
  { onTaskUpdate, scheduledFor }: TMoreButtonProps,
) => {
  const options = optionsForScheduling(scheduledFor);

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

const optionsForScheduling = (scheduledFor: string | null): TOption[] => {
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

    options.push({
      id: null,
      title: "Unschedule",
      emoji: "🚫",
      isSelected: false,
    });
  }

  return options;
};
