import { useState } from "react";
import { CheckCircle, XCircle } from "@phosphor-icons/react";
import { Temporal } from "@js-temporal/polyfill";
import classNames from "classnames";

import { ECardSize } from "../components/Card.tsx";
import { CardList } from "../components/CardList.tsx";
import { Column } from "../components/Column.tsx";
import { QuickDrawer } from "../components/QuickPlanner.tsx";
import { DayNav } from "../components/Toolbar.tsx";
import { DraggableView, DrawerContainer } from "../components/View.tsx";

import { useCardSize } from "../hooks/useCardSize.tsx";
import { useTasks } from "../hooks/useTasks.tsx";
import { useToggle } from "../hooks/useToggle.tsx";

import { ETaskStatus, TTask } from "../api/tasks.ts";
import { makeBaseFiltersForDate } from "../utils/makeBaseFiltersForDate.ts";

export const Review = () => {
  const [cardSize, toggleCardSize] = useCardSize(ECardSize.STANDARD);
  const [isOpen, toggle] = useToggle();
  const [date, setDate] = useState<Temporal.PlainDate>(
    Temporal.Now.plainDateISO(),
  );

  const nextDay = date.add({ days: 1 });

  const [tasks] = useTasks({
    filters: [["scheduledFor", "eq", date.toString()]],
  });
  const [nextDaysTasks] = useTasks({
    filters: [["scheduledFor", "eq", nextDay.toString()]],
  });

  const completeTasks = tasks.filter(
    (task) =>
      task.status === ETaskStatus.DONE || task.status === ETaskStatus.WONT_DO,
  );
  const incompleteTasks = tasks.filter(
    (task) =>
      task.status === ETaskStatus.TODO ||
      task.status === ETaskStatus.IN_PROGRESS,
  );

  const title = incompleteTasks.length ? "Review today" : "Plan tomorrow";
  const subtitle = incompleteTasks.length
    ? "Mark any incomplete items as done, won't do, rescheduled, or unscheduled"
    : "Make time and space for the things that matter most... tomorrow";

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
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 pt-12 min-h-[calc(100vh-6rem)] overflow-auto">
          <Title text={title} />
          <Subtitle text={subtitle} />
          <div className="flex gap-8 flex-wrap max-desktop:flex-col w-full h-full justify-center max-desktop:items-center overflow-auto no-scrollbar">
            <CardListWithTitle
              cardSize={cardSize}
              isVisible={incompleteTasks.length > 0}
              tasks={incompleteTasks}
              variant="incomplete"
            />
            <CardListWithTitle
              cardSize={cardSize}
              isVisible
              tasks={completeTasks}
              variant="complete"
            />
            <div
              className={classNames(
                "transition-all duration-300",
                incompleteTasks.length === 0
                  ? "opacity-100 w-standard"
                  : "opacity-0 w-0 min-w-0",
              )}
            >
              <Column
                canCreateTasks
                cardSize={cardSize}
                id={`scheduledFor:${nextDay.toString()}`}
                tasks={nextDaysTasks}
              />
            </div>
          </div>
        </div>
        <QuickDrawer
          baseFilters={makeBaseFiltersForDate(nextDay)}
          columnId="scheduledFor:null"
          isOpen={isOpen}
        />
      </DrawerContainer>
    </DraggableView>
  );
};

const Title = ({ text }: { text: string }) => (
  <h1 className="text-4xl font-black opacity-80">{text}</h1>
);

const Subtitle = ({ text }: { text: string }) => (
  <p className="text-xs text-center italic opacity-40 mt-2 mb-8">{text}</p>
);

type TCardListWithTItleProps = {
  cardSize: ECardSize;
  isVisible: boolean;
  tasks: TTask[];
  variant: "complete" | "incomplete";
};

const CardListWithTitle = ({
  cardSize,
  isVisible,
  tasks,
  variant,
}: TCardListWithTItleProps) => {
  const Icon = variant === "complete" ? CheckCircle : XCircle;

  return (
    <div
      className={classNames(
        "flex flex-col items-center gap-4 transition-all duration-300",
        isVisible ? "opacity-100 w-standard" : "opacity-0 w-0 min-w-0",
      )}
    >
      <p className="text-xl font-bold opacity-60 inline-flex items-center pr-5 mt-4 capitalize">
        <Icon
          className={classNames("mr-4", {
            "text-success": variant === "complete",
            "text-error": variant === "incomplete",
          })}
        />
        {variant}
      </p>
      <CardList cardSize={cardSize} tasks={tasks} />
    </div>
  );
};
