import { useState } from "react";
import { Temporal } from "@js-temporal/polyfill";

import { DayNav } from "../components/Toolbar.tsx";
import { View } from "../components/View.tsx";

import { useTasks } from "../hooks/useTasks.tsx";

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
        />
        <CarouselItem
          title="Review"
          subtitle="Look back at the day and decide what to do next"
        />
        <CarouselItem
          title="Plan"
          subtitle="Make time and space for the things that matter most"
        />
      </div>
    </View>
  );
};

type TCarouselItemProps = {
  subtitle: string;
  title: string;
};

const CarouselItem = ({ subtitle, title }: TCarouselItemProps) => (
  <div id="slide1" className="carousel-item">
    <div className="flex flex-col rounded-box w-[80vw] border-1 border-base-200 shadow-xl items-center justify-center p-8">
      <h1 className="text-4xl font-black opacity-80">{title}</h1>
      <p className="text-xs italic opacity-40 mt-2 mb-4">{subtitle}</p>
      <div className="flex w-full min-h-[66%]" />
    </div>
  </div>
);
