import { Temporal } from "@js-temporal/polyfill";
import { CaretLeft, CaretRight, Rows } from "@phosphor-icons/react";

import { ButtonWithPopover } from "./ButtonWithPopover.tsx";

type TDayNavProps = {
  date: Temporal.PlainDate;
  setDate: (date: Temporal.PlainDate) => void;
  toggleQuickPlan?: () => void;
};

export const DayNav = ({ date, setDate, toggleQuickPlan }: TDayNavProps) => {
  return (
    <Toolbar
      onClickNext={() => setDate(date.add({ days: 1 }))}
      onClickPrevious={() => setDate(date.subtract({ days: 1 }))}
      toggleQuickPlan={toggleQuickPlan}
    >
      {date.toString() === Temporal.Now.plainDateISO().toString() ? (
        <ButtonWithPopover
          buttonClassName="btn btn-ghost"
          buttonVariant="none"
          onChange={(value) => value && setDate(Temporal.PlainDate.from(value))}
          selectedDate={date.toString()}
          variant="calendar"
          wrapperClassName="mr-auto"
        >
          {formatDate(date)}
        </ButtonWithPopover>
      ) : (
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
  toggleQuickPlan?: () => void;
};

export const WeekNav = ({
  weeksOffset,
  setWeeksOffset,
  toggleQuickPlan,
}: TWeekNavProps) => {
  const today = Temporal.Now.plainDateISO();
  const offsetDate = today.add({ weeks: weeksOffset });

  return (
    <Toolbar
      onClickNext={() => setWeeksOffset(weeksOffset + 1)}
      onClickPrevious={() => setWeeksOffset(weeksOffset - 1)}
      toggleQuickPlan={toggleQuickPlan}
    >
      <div className="btn btn-ghost mr-auto" onClick={() => setWeeksOffset(0)}>
        Week {offsetDate.weekOfYear}, {offsetDate.year}
      </div>
    </Toolbar>
  );
};

type TToolbarProps = {
  children: React.ReactNode;
  onClickNext?: () => void;
  onClickPrevious?: () => void;
  toggleQuickPlan?: () => void;
};

export const Toolbar = ({
  children,
  onClickNext,
  onClickPrevious,
  toggleQuickPlan,
}: TToolbarProps) => {
  return (
    <div className="flex items-center p-2 w-full bg-base-100 border-b-2 border-base-200">
      {children}
      {onClickPrevious && (
        <ArrowButton onClick={onClickPrevious} variant="previous" />
      )}
      {onClickNext && <ArrowButton onClick={onClickNext} variant="next" />}
      {toggleQuickPlan && (
        <button className="btn btn-ghost" onClick={toggleQuickPlan}>
          <Rows />
        </button>
      )}
    </div>
  );
};

type TArrowButtonProps = { onClick: () => void; variant: "previous" | "next" };

const ArrowButton = ({ onClick, variant }: TArrowButtonProps) => (
  <div className="btn btn-ghost" onClick={onClick}>
    {variant === "previous" ? <CaretLeft /> : <CaretRight />}
  </div>
);

const formatDate = (date: Temporal.PlainDate) =>
  date.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
