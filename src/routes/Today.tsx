import { useState } from "react";
import { Temporal } from "@js-temporal/polyfill";

import { Column } from "../components/Column.tsx";
import { DayNav } from "../components/Toolbar.tsx";
import { Journal } from "../components/Journal.tsx";
import { QuickDrawer } from "../components/QuickPlanner.tsx";
import {
  DraggableView,
  DrawerContainer,
  ScrollableContainer,
} from "../components/View.tsx";

import { taskFilters, useTasks } from "../hooks/useTasks.tsx";

export const Today = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [date, setDate] = useState<Temporal.PlainDate>(
    Temporal.Now.plainDateISO(),
  );

  const [tasks] = useTasks([["scheduledFor", "eq", date.toString()]]);

  return (
    <DraggableView>
      <DayNav
        date={date}
        setDate={setDate}
        toggleQuickPlan={() => setIsOpen(!isOpen)}
      />

      <DrawerContainer>
        <ScrollableContainer>
          <Column
            canCreateTasks
            id={`scheduledFor:${date.toString()}`}
            tasks={tasks}
          />
          <div className="tabs tabs-lift py-4 h-[calc(100vh-6rem)] sticky top-0 w-full">
            <input
              aria-label="Notes"
              className="tab"
              defaultChecked
              name="today-tabs"
              type="radio"
            />
            <div className="tab-content bg-base-100 border-base-300 p-4 min-w-standard h-full"></div>

            <input
              aria-label="Journal"
              className="tab"
              name="today-tabs"
              type="radio"
            />
            <div className="tab-content bg-base-100 border-base-300 p-4 min-w-standard h-full">
              <Journal date={date} />
            </div>
          </div>
        </ScrollableContainer>
        <QuickDrawer baseFilters={taskFilters.notToday} isOpen={isOpen} />
      </DrawerContainer>
    </DraggableView>
  );
};
