import { useState } from "react";
import { CaretRight, CheckCircle, XCircle } from "@phosphor-icons/react";
import { Temporal } from "@js-temporal/polyfill";
import classNames from "classnames";

import { CardList } from "../components/CardList.tsx";
import { Column } from "../components/Column.tsx";
import { QuickDrawer } from "../components/QuickPlanner.tsx";
import { DayNav } from "../components/Toolbar.tsx";
import { View } from "../components/View.tsx";

import { taskFilters, useTasks } from "../hooks/useTasks.tsx";
import { ETaskStatus, TTask } from "../api/tasks.ts";
import { makeOrFilter } from "../api/applyFilters.ts";

export const Review = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [date, setDate] = useState<Temporal.PlainDate>(
    Temporal.Now.plainDateISO(),
  );

  const nextDay = date.add({ days: 1 });

  const [tasks] = useTasks([["scheduledFor", "eq", date.toString()]]);
  const [nextDaysTasks] = useTasks([
    ["scheduledFor", "eq", nextDay.toString()],
  ]);

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
    <View>
      <DayNav
        date={date}
        setDate={setDate}
        toggleQuickPlan={() => setIsOpen(!isOpen)}
      />
      <div className="flex flex-1 relative overflow-hidden">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 pt-12 min-h-[calc(100vh-6rem)] overflow-auto">
          <h1 className="text-4xl font-black opacity-80">{title}</h1>
          <p className="text-xs text-center italic opacity-40 mt-2 mb-8">
            {subtitle}
          </p>
          <div className="flex md:flex-wrap max-sm:flex-col w-full h-full justify-center overflow-auto no-scrollbar">
            {incompleteTasks.length ? (
              <>
                <CardListWithTitle
                  tasks={incompleteTasks}
                  variant="incomplete"
                />
                <Divider />
                <CardListWithTitle tasks={completeTasks} variant="complete" />
              </>
            ) : (
              <>
                <CardListWithTitle tasks={completeTasks} variant="complete" />
                <Divider />
                <Column
                  canCreateTasks
                  id={`scheduledFor:${nextDay.toString()}`}
                  tasks={nextDaysTasks}
                />
              </>
            )}
          </div>
        </div>
        <QuickDrawer
          isOpen={isOpen}
          baseFilters={makeBaseFiltersForDate(date)}
        />
      </div>
    </View>
  );
};

const Divider = () => (
  <div className="divider py-8 max-sm:px-8 sm:divider-horizontal sm:max-h-[75vh] sm:sticky sm:top-0">
    <CaretRight className="text-current/40" size={48} />
  </div>
);

type TCardListWithTItleProps = {
  tasks: TTask[];
  variant: "complete" | "incomplete";
};

const CardListWithTitle = ({ tasks, variant }: TCardListWithTItleProps) => {
  const Icon = variant === "complete" ? CheckCircle : XCircle;

  return (
    <div className="flex flex-col items-center gap-4 min-w-standard">
      <p className="text-xl font-bold opacity-60 inline-flex items-center pr-5 mt-4 capitalize">
        <Icon
          className={classNames("mr-4", {
            "text-success": variant === "complete",
            "text-error": variant === "incomplete",
          })}
        />
        {variant}
      </p>
      <CardList tasks={tasks} />
    </div>
  );
};

const makeBaseFiltersForDate = (date: Temporal.PlainDate) => [
  makeOrFilter([
    ["scheduledFor", "neq", date.toString()],
    ["scheduledFor", "is", null],
  ]),
  ...taskFilters.incomplete,
];
