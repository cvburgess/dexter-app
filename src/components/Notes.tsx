import { Temporal } from "@js-temporal/polyfill";

import { useDays } from "../hooks/useDays";

import { LexicalEditor } from "./LexicalEditor";

type TNotesProps = { date: Temporal.PlainDate };

export const Notes = ({ date }: TNotesProps) => {
  const [{ notes, ...rest }, { isLoading, upsertDay }] = useDays(
    date.toString(),
  );

  if (isLoading) return null;

  return (
    <LexicalEditor
      onChange={(notes) => upsertDay({ ...rest, notes })}
      text={notes}
    />
  );
};

// # Heading h1

// This is a \`Markdown\` file.

// ## This is a Heading h2

// This is the text under it

// ## Emphasis

// *This text will be italic*
// _This will also be italic_

// **This text will be bold**
// __This will also be bold__

// _You **can** combine them_

// ~~You can change your mind, too~~
