import { Temporal } from "@js-temporal/polyfill";

import { useDays } from "../hooks/useDays";

import { LexicalEditor } from "./LexicalEditor";

type TNotesProps = { date: Temporal.PlainDate };

export const Notes = ({ date }: TNotesProps) => {
  const [{ notes, ...rest }, { isLoading, upsertDay }] = useDays(
    date.toString(),
  );

  console.log({ date, notes, isLoading });

  if (isLoading) return null;

  return (
    <LexicalEditor
      key={date.toString()}
      onChange={(text) => {
        if (text !== notes) upsertDay({ ...rest, notes: text });
      }}
      text={notes}
    />
  );
};
