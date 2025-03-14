import { useState } from "react";
import { Temporal } from "@js-temporal/polyfill";

import { DayNav } from "../components/Toolbar.tsx";
import { View } from "../components/View.tsx";

import { useTasks } from "../hooks/useTasks.tsx";
import { Journal } from "../components/Journal.tsx";

export const Review = () => {
  const [date, setDate] = useState<Temporal.PlainDate>(
    Temporal.Now.plainDateISO(),
  );

  const [_tasks] = useTasks([["scheduledFor", "eq", date.toString()]]);

  return (
    <View className="flex-col">
      <DayNav date={date} setDate={setDate} />

      <div className="carousel carousel-center rounded-box w-full h-full space-x-8 p-8">
        <CarouselItem
          title="Reflect"
          subtitle="Take a deep breath and check in with yourself"
        >
          <Journal date={date.toString()} />
        </CarouselItem>
        <CarouselItem
          title="Review"
          subtitle="Look back at the day and decide what to do next"
        >
          TODO
        </CarouselItem>
        <CarouselItem
          title="Plan"
          subtitle="Make time and space for the things that matter most"
        >
          TODO
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
    <div className="flex flex-col rounded-box w-[80vw] border-1 border-base-200 shadow-xl items-center justify-center py-8 px-16">
      <h1 className="text-4xl font-black opacity-80">{title}</h1>
      <p className="text-xs italic opacity-40 mt-2 mb-4">{subtitle}</p>
      <div className="flex flex-wrap w-full min-h-[66%] items-center justify-center overflow-auto">
        {children}
      </div>
    </div>
  </div>
);
