import { Temporal } from "@js-temporal/polyfill";

import { taskFilters } from "../hooks/useTasks.tsx";
import { makeOrFilter } from "../api/applyFilters.ts";

export const makeBaseFiltersForDate = (date: Temporal.PlainDate) => [
  makeOrFilter([
    ["scheduledFor", "neq", date.toString()],
    ["scheduledFor", "is", null],
  ]),
  ...taskFilters.incomplete,
];
