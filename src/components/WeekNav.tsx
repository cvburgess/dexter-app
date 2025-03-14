import { CaretLeft, CaretRight } from "@phosphor-icons/react";

type TWeekNavProps = {
  weeksOffset: number;
  setWeeksOffset: (value: number) => void;
};

export const WeekNav = ({ weeksOffset, setWeeksOffset }: TWeekNavProps) => {
  return (
    <div className="flex items-center justify-center p-4 pb-0 sticky top-0 left-0 z-20 bg-base-100">
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
        Week {weeksOffset + 20}, 2025
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
