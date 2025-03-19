import { useState } from "react";
import { Temporal } from "@js-temporal/polyfill";

import { DayNav, TextToolbar, WeekNav } from "../components/Toolbar.tsx";
import { QuickDrawer } from "../components/QuickPlanner.tsx";
import { DraggableView } from "../components/View.tsx";

import { TQueryFilter } from "../api/applyFilters.ts";

type TViewWithToolbarProps = {
  children: React.ReactNode;
  quickPlan?: boolean;
  quickPlanFilters?: TQueryFilter[];
  toolbarVariant: "week" | "day" | "text";
  toolbarTitle?: string;
};

export const ViewWithToolbar = ({
  children,
  quickPlan,
  quickPlanFilters,
  toolbarTitle,
  ...props
}: TViewWithToolbarProps) => {
  const [isQuickPlanOpen, setIsQuickPlanOpen] = useState<boolean>(false);

  // Used by Week
  const [weeksOffset, setWeeksOffset] = useState<number>(0);

  // Used by Today and Review
  const [date, setDate] = useState<Temporal.PlainDate>(
    Temporal.Now.plainDateISO(),
  );

  const toggleQuickPlan = quickPlan
    ? () => setIsQuickPlanOpen(!isQuickPlanOpen)
    : undefined;

  return (
    <DraggableView>
      {props.toolbarVariant === "day" && (
        <DayNav
          date={date}
          setDate={setDate}
          toggleQuickPlan={toggleQuickPlan}
        />
      )}
      {props.toolbarVariant === "week" && (
        <WeekNav
          weeksOffset={weeksOffset}
          setWeeksOffset={setWeeksOffset}
          toggleQuickPlan={toggleQuickPlan}
        />
      )}
      {props.toolbarVariant === "text" && (
        <TextToolbar title={toolbarTitle} toggleQuickPlan={toggleQuickPlan} />
      )}

      <div className="flex flex-1 relative overflow-hidden">
        <div className="flex flex-1 gap-4 px-4 overflow-auto bg-base-100 transition-all duration-300 ease-in-out">
          {children}
        </div>

        {quickPlan && (
          <QuickDrawer
            isOpen={isQuickPlanOpen}
            baseFilters={quickPlanFilters}
          />
        )}
      </div>
    </DraggableView>
  );
};
