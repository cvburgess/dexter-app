import { Temporal } from "@js-temporal/polyfill";
import classNames from "classnames";

import { Tooltip } from "./Tooltip";

import { habitFilters, useDailyHabits, useHabits } from "../hooks/useHabits";

import { TDailyHabit, THabit } from "../api/habits";
import { useEffect } from "react";

type TDailyHabitsProps = {
  date: Temporal.PlainDate;
};

const today = Temporal.Now.plainDateISO();

export const DailyHabits = ({ date }: TDailyHabitsProps) => {
  const [habits] = useHabits({
    filters: habitFilters.active,
  });
  const [dailyHabits, { createDailyHabit, incrementDailyHabit }] =
    useDailyHabits(date.toString());

  console.log("dailyHabits", dailyHabits);

  const getDailyHabit = (habit: THabit) => {
    return dailyHabits.find((dailyHabit) => dailyHabit.habitId === habit.id);
  };

  useEffect(() => {
    habits.forEach((habit) => {
      const dailyHabit = getDailyHabit(habit);
      const isFutureDate = Temporal.PlainDate.compare(date, today) > 0;

      if (!dailyHabit && !isFutureDate) {
        createDailyHabit({
          date: date.toString(),
          habitId: habit.id,
          steps: habit.steps,
          stepsComplete: 0,
        });
      }
    });
  }, [date]);

  return (
    <div className="flex gap-2 justify-center">
      {habits.map((habit) => (
        <HabitButton
          dailyHabit={getDailyHabit(habit)}
          habit={habit}
          incrementDailyHabit={incrementDailyHabit}
          key={habit.id}
        />
      ))}
    </div>
  );
};

type THabitButtonProps = {
  dailyHabit?: TDailyHabit;
  habit: THabit;
  incrementDailyHabit: (dailyHabit: TDailyHabit) => void;
};

const HabitButton = ({
  dailyHabit,
  habit,
  incrementDailyHabit,
}: THabitButtonProps) => {
  if (!dailyHabit) {
    return (
      <div className="flex size-[48px] justify-center items-center bg-primary/10 rounded-full">
        {habit.emoji}
      </div>
    );
  }

  return (
    <Tooltip
      text={`${habit.title} (${dailyHabit.stepsComplete}/${dailyHabit.steps})`}
    >
      <div
        className={classNames(
          "absolute border-4 border-base-300 rounded-full size-[48px] box-border transition duration-1000",
          {
            // "bg-primary": dailyHabit.percentComplete === 100,
          },
        )}
      />
      <div
        aria-valuenow={dailyHabit.percentComplete}
        className={classNames("radial-progress font-[NotoEmoji] text-primary")}
        onClick={() => incrementDailyHabit(dailyHabit)}
        role="progressbar"
        style={
          {
            "--size": "48px",
            "--thickness": "4px",
            "--value": dailyHabit.percentComplete,
          } as React.CSSProperties
        }
      >
        <span
          className={classNames("font-bold", {
            // "text-primary": dailyHabit.percentComplete < 100,
            // "text-primary-content": dailyHabit.percentComplete === 100,
          })}
        >
          {habit.emoji}
        </span>
      </div>
    </Tooltip>
  );
};
