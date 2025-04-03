import { Temporal } from "@js-temporal/polyfill";
import { CaretLeft, CaretRight, SquareHalf } from "@phosphor-icons/react";

import { ButtonWithPopover } from "./ButtonWithPopover.tsx";

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
    <div className="flex items-center p-2 w-full h-14 bg-base-100 border-b-2 border-base-200">
      {children}
      <div className="flex-grow w-full h-full app-draggable"></div>
      {onClickPrevious && (
        <ArrowButton onClick={onClickPrevious} variant="previous" />
      )}
      {onClickNext && <ArrowButton onClick={onClickNext} variant="next" />}
      {toggleQuickPlan && (
        <button className={buttonClasses} onClick={toggleQuickPlan}>
          <SquareHalf />
        </button>
      )}
    </div>
  );
};

type TDayNavProps = {
  date: Temporal.PlainDate;
  setDate: (date: Temporal.PlainDate) => void;
  toggleQuickPlan?: () => void;
};

const buttonClasses =
  "btn btn-ghost !text-sm text-nowrap hover:bg-base-200 hover:border-base-200";

export const DayNav = ({ date, setDate, toggleQuickPlan }: TDayNavProps) => {
  return (
    <Toolbar
      onClickNext={() => setDate(date.add({ days: 1 }))}
      onClickPrevious={() => setDate(date.subtract({ days: 1 }))}
      toggleQuickPlan={toggleQuickPlan}
    >
      {date.toString() === Temporal.Now.plainDateISO().toString() ? (
        <ButtonWithPopover
          buttonClassName={buttonClasses}
          buttonVariant="none"
          onChange={(value) => value && setDate(Temporal.PlainDate.from(value))}
          popoverId="today-day-picker"
          selectedDate={date.toString()}
          variant="calendar"
        >
          {formatDate(date)}
        </ButtonWithPopover>
      ) : (
        <div
          className={buttonClasses}
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
      <div className={buttonClasses} onClick={() => setWeeksOffset(0)}>
        Week {offsetDate.weekOfYear}, {offsetDate.year}
      </div>
    </Toolbar>
  );
};

type TTextToolbarProps = {
  title: string;
  toggleQuickPlan?: () => void;
};

export const TextToolbar = ({ title, toggleQuickPlan }: TTextToolbarProps) => (
  <Toolbar toggleQuickPlan={toggleQuickPlan}>
    <p className={buttonClasses}> {title} </p>
  </Toolbar>
);

type TArrowButtonProps = { onClick: () => void; variant: "previous" | "next" };

const ArrowButton = ({ onClick, variant }: TArrowButtonProps) => (
  <div className={buttonClasses} onClick={onClick}>
    {variant === "previous" ? <CaretLeft /> : <CaretRight />}
  </div>
);

const formatDate = (date: Temporal.PlainDate) =>
  date.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
