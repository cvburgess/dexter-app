import { Temporal } from "@js-temporal/polyfill";

export const weekStartEnd = (weeksOffset = 0) => {
  const today = Temporal.Now.plainDateISO();

  const mostRecentMonday = today
    .add({ weeks: weeksOffset })
    .subtract({ days: today.dayOfWeek - 1 });

  const sunday = mostRecentMonday.add({ days: 6 });

  return { monday: mostRecentMonday, sunday };
};
