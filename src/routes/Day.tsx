import { useState } from "react";
import { Temporal } from "@js-temporal/polyfill";

import { Calendar } from "../components/Calendar.tsx";
import { ECardSize } from "../components/Card.tsx";
import { Column } from "../components/Column.tsx";
import { DayNav } from "../components/Toolbar.tsx";
import { Journal } from "../components/Journal.tsx";
import { Notes } from "../components/Notes.tsx";
import { QuickDrawer } from "../components/QuickPlanner.tsx";
import {
  DraggableView,
  DrawerContainer,
  ScrollableContainer,
} from "../components/View.tsx";

import { useCardSize } from "../hooks/useCardSize.tsx";
import { usePreferences } from "../hooks/usePreferences.tsx";
import { useTasks } from "../hooks/useTasks.tsx";
import { useToggle } from "../hooks/useToggle.tsx";

import { makeBaseFiltersForDate } from "../utils/makeBaseFiltersForDate.ts";

export const Day = () => {
  const [cardSize, toggleCardSize] = useCardSize(ECardSize.STANDARD);
  const [isOpen, toggle] = useToggle();
  const [date, setDate] = useState<Temporal.PlainDate>(
    Temporal.Now.plainDateISO(),
  );
  const [preferences] = usePreferences();

  const [{ enableJournal, enableNotes }] = usePreferences();

  const [tasks] = useTasks({
    filters: [["scheduledFor", "eq", date.toString()]],
  });

  return (
    <DraggableView>
      <DayNav
        cardSize={cardSize}
        date={date}
        setDate={setDate}
        toggleCardSize={toggleCardSize}
        toggleQuickPlan={toggle}
      />

      <DrawerContainer>
        <ScrollableContainer>
          <Column
            canCreateTasks
            cardSize={cardSize}
            id={`scheduledFor:${date.toString()}`}
            showHabits={preferences.enableHabits}
            tasks={tasks}
          />
          <Tabs enabled={enableNotes || enableJournal}>
            <Tab defaultChecked enabled={enableNotes} title="Notes">
              <Notes date={date} />
            </Tab>
            <Tab
              defaultChecked={!enableNotes}
              enabled={enableJournal}
              title="Journal"
            >
              <Journal date={date} />
            </Tab>
          </Tabs>
          <Calendar date={date} />
        </ScrollableContainer>
        <QuickDrawer
          baseFilters={makeBaseFiltersForDate(date)}
          columnId="scheduledFor:null"
          isOpen={isOpen}
        />
      </DrawerContainer>
    </DraggableView>
  );
};

type TTabsProps = {
  children: React.ReactNode;
  enabled: boolean;
};

const Tabs = ({ children, enabled }: TTabsProps) => {
  if (!enabled) return null;
  return (
    <div className="tabs tabs-lift py-4 h-[calc(100vh-6rem)] flex-2">
      {children}
    </div>
  );
};

type TTabProps = {
  children: React.ReactNode;
  defaultChecked: boolean;
  enabled: boolean;
  title: string;
};

const Tab = ({ children, defaultChecked, enabled, title }: TTabProps) => {
  if (!enabled) return null;
  return (
    <>
      <input
        aria-label={title}
        className="tab"
        defaultChecked={defaultChecked}
        name="today-tabs"
        type="radio"
      />
      <div className="tab-content bg-base-100 border-base-300 p-4 min-w-40 h-full overflow-y-scroll">
        {children}
      </div>
    </>
  );
};
