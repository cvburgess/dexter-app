import { Temporal } from "@js-temporal/polyfill";

import { useNotes } from "../hooks/useNotes";

import { LexicalEditor } from "./LexicalEditor";

type TNotesProps = { date: Temporal.PlainDate };

export const Notes = ({ date }: TNotesProps) => {
  const [{ content }, { isLoading, upsertNote }] = useNotes(date.toString());

  if (isLoading) return null;

  return (
    <LexicalEditor
      key={date.toString()}
      onChange={(text) => {
        if (text !== content) upsertNote({ content: text });
      }}
      text={content}
    />
  );
};
