import { Temporal } from "@js-temporal/polyfill";
import { Link, useLocation } from "react-router";
import classNames from "classnames";

import { Tooltip } from "./Tooltip";

import { habitFilters, useDailyHabits, useHabits } from "../hooks/useHabits";

import { TDailyHabit, THabit } from "../api/habits";
import { useEffect } from "react";

type TDailyHabitsProps = {
  className?: string;
  date: Temporal.PlainDate;
};

const today = Temporal.Now.plainDateISO();

export const DailyHabits = ({ className, date }: TDailyHabitsProps) => {
  const { pathname } = useLocation();
  const isDayView = pathname.includes("day");

  const [habits] = useHabits({
    filters: habitFilters.active,
  });
  const [dailyHabits, { createDailyHabit, incrementDailyHabit }] =
    useDailyHabits(date.toString());

  const activeHabits = habits.filter((habit) =>
    habit.daysActive.includes(date.dayOfWeek),
  );

  const getDailyHabit = (habit: THabit) => {
    return dailyHabits.find((dailyHabit) => dailyHabit.habitId === habit.id);
  };

  useEffect(() => {
    activeHabits.forEach((habit) => {
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
  }, []);

  if (isDayView && habits.length === 0) {
    return <Link to="/settings/habits">Create a habit</Link>;
  }

  const habitsWillScroll =
    (className.includes("standard") && activeHabits.length > 7) ||
    (className.includes("compact") && activeHabits.length > 4);

  return (
    <div
      className={classNames(
        "flex gap-2 justify-center-safe",
        habitsWillScroll
          ? "overflow-x-auto overflow-y-hidden no-scrollbar"
          : "",
        className,
      )}
    >
      {activeHabits.map((habit) => (
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

const ringClasses =
  "border-4 border-base-300 box-border rounded-full size-[32px]";

const iconClasses = "font-[NotoEmoji] font-bold text-[12px] text-primary";

const HabitButton = ({
  dailyHabit,
  habit,
  incrementDailyHabit,
}: THabitButtonProps) => {
  if (!dailyHabit) {
    return <FutureHabitButton emoji={habit.emoji} />;
  }

  return (
    <Tooltip
      text={`${habit.title} (${dailyHabit.stepsComplete}/${dailyHabit.steps})`}
    >
      <div
        className={classNames("absolute", ringClasses, {
          "z-10": !dailyHabit.percentComplete,
        })}
        onClick={() => incrementDailyHabit(dailyHabit)}
      />
      <div
        aria-valuenow={dailyHabit.percentComplete}
        className={classNames("radial-progress", iconClasses)}
        onClick={() => incrementDailyHabit(dailyHabit)}
        role="progressbar"
        style={
          {
            "--size": "32px",
            "--thickness": "4px",
            "--value": dailyHabit.percentComplete,
          } as React.CSSProperties
        }
      >
        {habit.emoji}
      </div>
    </Tooltip>
  );
};

const FutureHabitButton = ({ emoji }: { emoji: string }) => (
  <div
    className={classNames(
      "flex justify-center items-center opacity-25",
      ringClasses,
      iconClasses,
    )}
  >
    {emoji}
  </div>
);
