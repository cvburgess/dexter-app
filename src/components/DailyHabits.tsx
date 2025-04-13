import { useEffect } from "react";
import { Temporal } from "@js-temporal/polyfill";
import { Link, useLocation } from "react-router";
import classNames from "classnames";

import { Tooltip } from "./Tooltip";

import { habitFilters, useDailyHabits, useHabits } from "../hooks/useHabits";

import { TDailyHabit } from "../api/habits";
import { TQueryFilter } from "../api/applyFilters";

type TDailyHabitsProps = {
  className?: string;
  date: Temporal.PlainDate;
};

export const DailyHabits = ({ className, date }: TDailyHabitsProps) => {
  const { pathname } = useLocation();
  const isDayView = pathname.includes("day");

  const today = Temporal.Now.plainDateISO();
  const isFutureDate = Temporal.PlainDate.compare(date, today) > 0;

  // Use habits for future dates, because DailyHabits are not created yet
  const [habits, { isLoading: habitsLoading }] = useHabits({
    filters: [
      ...(habitFilters.notPaused as TQueryFilter[]),
      ...habitFilters.activeForDay(date.dayOfWeek),
    ],
  });

  const [
    dailyHabits,
    { createDailyHabits, incrementDailyHabit, isLoading: dailyHabitsLoading },
  ] = useDailyHabits(date.toString());

  useEffect(() => {
    createDailyHabits();
  }, [date]);

  const isLoading = habitsLoading || dailyHabitsLoading;
  if (isLoading) return <div className="h-[32px]" />;

  if (isDayView && dailyHabits.length === 0 && habits.length === 0) {
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
    (className.includes("standard") && dailyHabits.length > 7) ||
    (className.includes("compact") && dailyHabits.length > 4);

  return (
    <div
      className={classNames(
        "flex gap-2 justify-center-safe",
        habitsWillScroll
          ? "overflow-x-auto overflow-y-hidden no-scrollbar"
          : "overflow-x-hidden",
        className,
      )}
    >
      {isFutureDate
        ? habits.map((habit) => (
            <FutureHabitButton emoji={habit.emoji} key={habit.id} />
          ))
        : dailyHabits.map((dailyHabit) => (
            <HabitButton
              dailyHabit={dailyHabit}
              incrementDailyHabit={incrementDailyHabit}
              key={dailyHabit.habitId}
            />
          ))}
    </div>
  );
};

type THabitButtonProps = {
  dailyHabit?: TDailyHabit;
  incrementDailyHabit: (dailyHabit: TDailyHabit) => void;
};

const ringClasses =
  "border-4 border-base-300 box-border rounded-full size-[32px]";

const iconClasses = "font-[NotoEmoji] font-bold text-[12px] text-primary";

const HabitButton = ({
  dailyHabit,
  incrementDailyHabit,
}: THabitButtonProps) => (
  <Tooltip
    text={`${dailyHabit.habits.title} (${dailyHabit.stepsComplete}/${dailyHabit.steps})`}
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
      {dailyHabit.habits.emoji}
    </div>
  </Tooltip>
);

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
