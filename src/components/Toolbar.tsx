import { Temporal } from "@js-temporal/polyfill";
import {
  CaretLeft,
  CaretRight,
  Resize,
  SquareHalf,
} from "@phosphor-icons/react";

import { ButtonWithPopover } from "./ButtonWithPopover.tsx";
import { ECardSize } from "./Card.tsx";

type TToolbarProps = {
  children: React.ReactNode;
  cardSize?: ECardSize;
  onClickNext?: () => void;
  onClickPrevious?: () => void;
  toggleCardSize?: () => void;
  toggleQuickPlan?: () => void;
  tooltipNoun?: string;
};

const buttonClasses =
  "btn btn-ghost !text-sm text-nowrap hover:bg-base-200 hover:border-base-200";
const compactButtonClasses = `${buttonClasses} px-2`;

export const Toolbar = ({
  children,
  cardSize,
  onClickNext,
  onClickPrevious,
  toggleCardSize,
  toggleQuickPlan,
  tooltipNoun,
}: TToolbarProps) => {
  return (
    <div className="flex items-center p-2 w-full h-14 bg-base-100 border-b-2 border-base-200">
      {onClickPrevious && (
        <ArrowButton
          onClick={onClickPrevious}
          title={`Previous ${tooltipNoun}`}
          variant="previous"
        />
      )}
      {children}
      {onClickNext && (
        <ArrowButton
          onClick={onClickNext}
          title={`Next ${tooltipNoun}`}
          variant="next"
        />
      )}
      <div className="flex-grow w-full h-full app-draggable" />
      {cardSize && (
        <button
          className={buttonClasses}
          onClick={toggleCardSize}
          title="Card size"
        >
          <Resize />
        </button>
      )}
      {toggleQuickPlan && (
        <button
          className={buttonClasses}
          onClick={toggleQuickPlan}
          title="Quick planner"
        >
          <SquareHalf />
        </button>
      )}
    </div>
  );
};

type TDayNavProps = Partial<TToolbarProps> & {
  date: Temporal.PlainDate;
  setDate: (date: Temporal.PlainDate) => void;
};

export const DayNav = ({ date, setDate, ...rest }: TDayNavProps) => {
  return (
    <Toolbar
      onClickNext={() => setDate(date.add({ days: 1 }))}
      onClickPrevious={() => setDate(date.subtract({ days: 1 }))}
      tooltipNoun="day"
      {...rest}
    >
      {date.toString() === Temporal.Now.plainDateISO().toString() ? (
        <ButtonWithPopover
          buttonClassName={compactButtonClasses}
          buttonVariant="none"
          onChange={(value) => value && setDate(Temporal.PlainDate.from(value))}
          popoverId="today-day-picker"
          selectedDate={date.toString()}
          title="Change date"
          variant="calendar"
        >
          {formatDate(date)}
        </ButtonWithPopover>
      ) : (
        <div
          className={buttonClasses}
          onClick={() => setDate(Temporal.Now.plainDateISO())}
          title="Go to today"
        >
          {formatDate(date)}
        </div>
      )}
    </Toolbar>
  );
};

type TWeekNavProps = Partial<TToolbarProps> & {
  weeksOffset: number;
  setWeeksOffset: (value: number) => void;
};

export const WeekNav = ({
  weeksOffset,
  setWeeksOffset,
  ...rest
}: TWeekNavProps) => {
  const today = Temporal.Now.plainDateISO();
  const offsetDate = today.add({ weeks: weeksOffset });

  return (
    <Toolbar
      onClickNext={() => setWeeksOffset(weeksOffset + 1)}
      onClickPrevious={() => setWeeksOffset(weeksOffset - 1)}
      tooltipNoun="week"
      {...rest}
    >
      <div
        className={compactButtonClasses}
        onClick={() => setWeeksOffset(0)}
        title={weeksOffset !== 0 ? "Back to this week" : undefined}
      >
        Week {offsetDate.weekOfYear}, {offsetDate.year}
      </div>
    </Toolbar>
  );
};

type TTextToolbarProps = Partial<TToolbarProps> & {
  title: string;
};

export const TextToolbar = ({ title, ...rest }: TTextToolbarProps) => (
  <Toolbar {...rest}>
    <p className={buttonClasses}> {title} </p>
  </Toolbar>
);

type TArrowButtonProps = {
  onClick: () => void;
  title: string;
  variant: "previous" | "next";
};

const ArrowButton = ({ onClick, title, variant }: TArrowButtonProps) => (
  <div className={compactButtonClasses} onClick={onClick} title={title}>
    {variant === "previous" ? <CaretLeft /> : <CaretRight />}
  </div>
);

const formatDate = (date: Temporal.PlainDate) =>
  date.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
