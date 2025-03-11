import { snakeCase } from "../utils/changeCase.ts";

export type TQueryFilter = [string, "eq" | "gt" | "lt" | "in", unknown];

// https://github.com/orgs/supabase/discussions/2733
// https://www.reddit.com/r/Supabase/comments/1e8ewjm/typescript_type_of_a_supabase_query_the_query/
// @ts-ignore no-explicit-any
// deno-lint-ignore no-explicit-any
export const applyFilters = (query: any, filters: TQueryFilter[] = []) => {
  for (const [column, operation, value] of filters) {
    query = query[operation](snakeCase(column) as string, value);
  }
};
