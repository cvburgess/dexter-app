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
    </View>
  );
};
