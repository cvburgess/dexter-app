import { Temporal } from "@js-temporal/polyfill";
import { Link, useLocation } from "react-router";
import classNames from "classnames";

import { Tooltip } from "./Tooltip";

import { habitFilters, useDailyHabits, useHabits } from "../hooks/useHabits";

import { TDailyHabit, THabit } from "../api/habits";
import { TQueryFilter } from "../api/applyFilters";
import { useEffect } from "react";

type TDailyHabitsProps = {
  className?: string;
  date: Temporal.PlainDate;
};

export const DailyHabits = ({ className, date }: TDailyHabitsProps) => {
  const { pathname } = useLocation();
  const isDayView = pathname.includes("day");

  const [habits] = useHabits({
    filters: [
      ...(habitFilters.notPaused as TQueryFilter[]),
      ...habitFilters.activeForDay(date.dayOfWeek),
    ],
  });

  const [dailyHabits, { createDailyHabits, incrementDailyHabit }] =
    useDailyHabits(date.toString());

  const getDailyHabit = (habit: THabit) => {
    return dailyHabits.find((dailyHabit) => dailyHabit.habitId === habit.id);
  };

  useEffect(() => {
    createDailyHabits();
  }, [date]);

  if (isDayView && habits.length === 0) {
    return (
      <Link
        className="h-[32px] flex justify-center items-center text-xs text-primary hover:bg-primary/5 rounded-box"
        to="/settings/habits"
      >
        Create a habit
      </Link>
    );
  }

  const habitsWillScroll =
    (className.includes("standard") && habits.length > 7) ||
    (className.includes("compact") && habits.length > 4);

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
