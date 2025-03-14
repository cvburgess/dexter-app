import { Temporal } from "@js-temporal/polyfill";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

import { ButtonWithPopover } from "./ButtonWithPopover.tsx";

type TDayNavProps = {
  date: Temporal.PlainDate;
  setDate: (date: Temporal.PlainDate) => void;
};

export const DayNav = ({ date, setDate }: TDayNavProps) => {
  return (
    <Toolbar
      onClickNext={() => setDate(date.add({ days: 1 }))}
      onClickPrevious={() => setDate(date.subtract({ days: 1 }))}
    >
      {date.toString() === Temporal.Now.plainDateISO().toString()
        ? (
          <ButtonWithPopover
            buttonClassName="btn btn-ghost"
            buttonVariant="none"
            onChange={(value) =>
              value && setDate(Temporal.PlainDate.from(value))}
            selectedDate={date.toString()}
            variant="calendar"
            wrapperClassName="mr-auto"
          >
            {formatDate(date)}
          </ButtonWithPopover>
        )
        : (
          <div
            className="btn btn-ghost mr-auto"
            onClick={() => setDate(Temporal.Now.plainDateISO())}
          >
            {formatDate(date)}
          </div>
        )}
    </Toolbar>
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
    <Toolbar
      onClickNext={() => setWeeksOffset(weeksOffset + 1)}
      onClickPrevious={() => setWeeksOffset(weeksOffset - 1)}
    >
      <div
        className="btn btn-ghost mr-auto"
        onClick={() => setWeeksOffset(0)}
      >
        Week {offsetDate.weekOfYear}, {offsetDate.year}
      </div>
    </Toolbar>
  );
};

type TToolbarProps = {
  children: React.ReactNode;
  onClickNext: () => void;
  onClickPrevious: () => void;
};

const Toolbar = ({ children, onClickNext, onClickPrevious }: TToolbarProps) => {
  return (
    <div className="flex items-center p-4 pb-0 sticky top-0 left-0 z-20 bg-base-100">
      {children}
      <ArrowButton
        onClick={onClickNext}
        variant="previous"
      />
      <ArrowButton
        onClick={onClickPrevious}
        variant="next"
      />
    </div>
  );
};

type TArrowButtonProps = {
  onClick: () => void;
  variant: "previous" | "next";
};

const ArrowButton = ({ onClick, variant }: TArrowButtonProps) => (
  <div
    className="btn btn-ghost"
    onClick={onClick}
  >
    {variant === "previous" ? <CaretLeft /> : <CaretRight />}
  </div>
);

const formatDate = (date: Temporal.PlainDate) =>
  date.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
