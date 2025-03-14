import { Temporal } from "@js-temporal/polyfill";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

import { ButtonWithPopover } from "../components/ButtonWithPopover.tsx";

const wrapperStyles =
  "flex items-center justify-center p-4 pb-0 sticky top-0 left-0 z-20 bg-base-100";

type TDayNavProps = {
  date: Temporal.PlainDate;
  setDate: (date: Temporal.PlainDate) => void;
};

export const DayNav = ({ date, setDate }: TDayNavProps) => {
  return (
    <div className={wrapperStyles}>
      <div
        className="btn btn-ghost"
        onClick={() => setDate(date.subtract({ days: 1 }))}
      >
        <CaretLeft />
      </div>

      {date.toString() === Temporal.Now.plainDateISO().toString()
        ? (
          <ButtonWithPopover
            buttonClassName="btn btn-ghost min-w-50"
            buttonVariant="none"
            onChange={(value) =>
              value && setDate(Temporal.PlainDate.from(value))}
            selectedDate={date.toString()}
            variant="calendar"
            wrapperClassName="dropdown-center"
          >
            {getRelativeDay(date)}
          </ButtonWithPopover>
        )
        : (
          <div
            className="btn btn-ghost min-w-50"
            onClick={() => setDate(Temporal.Now.plainDateISO())}
          >
            {getRelativeDay(date)}
          </div>
        )}

      <div
        className="btn btn-ghost"
        onClick={() => setDate(date.add({ days: 1 }))}
      >
        <CaretRight />
      </div>
    </div>
  );
};

type TWeekNavProps = {
  weeksOffset: number;
  setWeeksOffset: (value: number) => void;
};

export const WeekNav = ({ weeksOffset, setWeeksOffset }: TWeekNavProps) => {
  const today = Temporal.Now.plainDateISO();
  const offsetDate = today.add({ weeks: weeksOffset });

  return (
    <div className={wrapperStyles}>
      <div
        className="btn btn-ghost"
        onClick={() => setWeeksOffset(weeksOffset - 1)}
      >
        <CaretLeft />
      </div>

      <div
        className="btn btn-ghost min-w-50"
        onClick={() => setWeeksOffset(0)}
      >
        Week {offsetDate.weekOfYear}, {offsetDate.year}
      </div>

      <div
        className="btn btn-ghost"
        onClick={() => setWeeksOffset(weeksOffset + 1)}
      >
        <CaretRight />
      </div>
    </div>
  );
};

const getRelativeDay = (date: Temporal.PlainDate) => {
  const today = Temporal.Now.plainDateISO();
  const diffDays = today.until(date).days;

  switch (diffDays) {
    case 0:
      return "Today";
    case 1:
      return "Tomorrow";
    case -1:
      return "Yesterday";
    default:
      return date.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
  }
};
