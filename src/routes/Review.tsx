import { useState } from "react";
import { CaretRight, CheckCircle, XCircle } from "@phosphor-icons/react";
import { Temporal } from "@js-temporal/polyfill";
import classNames from "classnames";

import { Board } from "../components/Board.tsx";
import { CardList } from "../components/CardList.tsx";
import { Journal } from "../components/Journal.tsx";
import { QuickPlanner } from "../components/QuickPlanner.tsx";
import { DayNav } from "../components/Toolbar.tsx";
import { View } from "../components/View.tsx";

import { taskFilters, useTasks } from "../hooks/useTasks.tsx";
import { ETaskStatus, TTask } from "../api/tasks.ts";
import { makeOrFilter } from "../api/applyFilters.ts";

export const Review = () => {
  const [date, setDate] = useState<Temporal.PlainDate>(
    Temporal.Now.plainDateISO(),
  );

  const nextDay = date.add({ days: 1 });

  const [tasks] = useTasks([["scheduledFor", "eq", date.toString()]]);
  const [nextDaysTasks] = useTasks([[
    "scheduledFor",
    "eq",
    nextDay.toString(),
  ]]);

  const completeTasks = tasks.filter((task) =>
    task.status === ETaskStatus.DONE || task.status === ETaskStatus.WONT_DO
  );
  const incompleteTasks = tasks.filter((task) =>
    task.status === ETaskStatus.TODO || task.status === ETaskStatus.IN_PROGRESS
  );

  return (
    <View className="flex-col">
      <DayNav date={date} setDate={setDate} />

      <div className="carousel carousel-center rounded-box w-full h-full space-x-8 p-8">
        <CarouselItem
          title="Reflect"
          subtitle="Take a deep breath and check in with yourself - clear priorities start with a clear mind"
        >
          <Journal date={date.toString()} />
        </CarouselItem>
        <CarouselItem
          title="Review"
          subtitle="Mark any incomplete items as done, won't do, rescheduled, or unscheduled"
        >
          <CardListWithTitle tasks={incompleteTasks} variant="incomplete" />
          <Divider />
          <CardListWithTitle tasks={completeTasks} variant="complete" />
        </CarouselItem>
        <CarouselItem
          title="Plan"
          subtitle="Make time and space for the things that matter most"
        >
          <QuickPlanner
            baseFilters={makeBaseFiltersForDate(nextDay)}
          />
          <Divider />
          <Board
            canCreateTasks
            columns={[{ id: nextDay.toString(), tasks: nextDaysTasks }]}
            groupBy="scheduledFor"
          />
        </CarouselItem>
      </div>
    </View>
  );
};

type TCarouselItemProps = {
  children: React.ReactNode;
  subtitle: string;
  title: string;
};

const CarouselItem = ({ children, subtitle, title }: TCarouselItemProps) => (
  <div id="slide1" className="carousel-item">
    <div className="flex flex-col rounded-box w-[80vw] min-w-[810px] border-1 border-base-200 shadow-xl items-center justify-center p-16">
      <h1 className="text-4xl font-black opacity-80">{title}</h1>
      <p className="text-xs italic opacity-40 mt-2 mb-8">{subtitle}</p>
      <div className="flex flex-wrap w-full h-full justify-center overflow-auto no-scrollbar">
        {children}
      </div>
    </div>
  </div>
);

const Divider = () => (
  <div className="divider divider-horizontal max-h-[50vh] pt-10">
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
    <div className="flex flex-col items-center gap-4 min-w-70">
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
