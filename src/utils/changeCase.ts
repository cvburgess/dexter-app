import camelCaseKeys from "camelcase-keys";
import snakeCaseKeys from "decamelize-keys";

const snakeCaseString = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const snakeCase = (
  value:
    | string
    | Record<string, unknown>
    | ReadonlyArray<Record<string, unknown>>,
) =>
  typeof value === "string" ? snakeCaseString(value) : snakeCaseKeys(value);

const camelCaseString = (str: string) =>
  str.replace(/_./g, (letter) => letter[1].toUpperCase());

export const camelCase = (
  value:
    | string
    | Record<string, unknown>
    | ReadonlyArray<Record<string, unknown>>,
) =>
  typeof value === "string" ? camelCaseString(value) : camelCaseKeys(value);
