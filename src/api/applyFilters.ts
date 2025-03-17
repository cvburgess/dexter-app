import { snakeCase } from "../utils/changeCase.ts";

export type TQueryFilter = [
  string,
  (
    | "eq"
    | "gt"
    | "gte"
    | "ilike"
    | "in"
    | "is"
    | "like"
    | "lt"
    | "lte"
    | "neq"
    | "or"
    | "textSearch"
  ),
  unknown
];

// https://github.com/orgs/supabase/discussions/2733
// https://www.reddit.com/r/Supabase/comments/1e8ewjm/typescript_type_of_a_supabase_query_the_query/
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const applyFilters = (query: any, filters: TQueryFilter[] = []) => {
  for (const [column, operation, value] of filters) {
    if (operation === "or") {
      query.or(value);
    } else {
      query = query[operation](snakeCase(column) as string, value);
    }
  }
};

export const makeOrFilter = (filters: TQueryFilter[]): TQueryFilter => {
  return [
    "",
    "or",
    filters
      .map((filter) => {
        const [column, operation, value] = filter;
        return `${snakeCase(column)}.${operation}.${value}`;
      })
      .join(","),
  ];
};
