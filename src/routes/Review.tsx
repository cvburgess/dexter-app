import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Temporal } from "@js-temporal/polyfill";

import { DayNav } from "../components/Toolbar.tsx";
import { View } from "../components/View.tsx";

import { Json } from "../api/database.types.ts";
import { TJournalPrompt, TUpsertDay } from "../api/days.ts";
import { useTasks } from "../hooks/useTasks.tsx";
import { useDays } from "../hooks/useDays.tsx";

export const Review = () => {
  const [date, setDate] = useState<Temporal.PlainDate>(
    Temporal.Now.plainDateISO(),
  );

  const [_tasks] = useTasks([["scheduledFor", "eq", date.toString()]]);
  const [{ prompts }, { upsertDay }] = useDays(date.toString());

  return (
    <View className="flex-col">
      <DayNav date={date} setDate={setDate} />

      <div className="carousel carousel-center rounded-box w-full h-full space-x-8 p-8">
        <CarouselItem
          title="Reflect"
          subtitle="Take a deep breath and check in with yourself"
        >
          <Journal
            prompts={prompts as TJournalPrompt[]}
            upsertDay={upsertDay}
          />
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

type TJournalProps = {
  prompts: TJournalPrompt[];
  upsertDay: (diff: Omit<TUpsertDay, "date">) => void;
};

const Journal = ({ prompts, upsertDay }: TJournalProps) => {
  return prompts.map(({ prompt, response }, index) => (
    <div key={index} className="flex flex-col w-full space-y-4 mt-4">
      <label className="text-md font-bold text-center opacity-80">
        {prompt}
      </label>
      <ResponseInput
        response={response}
        onChange={(newResponse) => {
          const diff = [...prompts];
          diff[index].response = newResponse;
          upsertDay({ prompts: diff as Json[] });
        }}
      />
    </div>
  ));
};

type TResponseInputProps = {
  response: string;
  onChange: (newResponse: string) => void;
};

const ResponseInput = ({ response, onChange }: TResponseInputProps) => {
  const [newResponse, setNewResponse] = useState<string>(response);
  const [debounced] = useDebounce(newResponse, 1000);

  // When props reflow into the component, update local state
  useEffect(() => {
    setNewResponse(response);
  }, [response]);

  useEffect(() => {
    if (debounced !== response) onChange(debounced);
  }, [debounced]);

  return (
    <input
      className="w-full border-b-1 border-base-300 focus:outline-0 text-center text-xs"
      value={newResponse}
      onChange={(e) => setNewResponse(e.target.value)}
    />
  );
};
