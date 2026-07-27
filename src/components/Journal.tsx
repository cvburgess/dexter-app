import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Temporal } from "@js-temporal/polyfill";

import { useJournals } from "../hooks/useJournals.tsx";

type TJournalProps = { date: Temporal.PlainDate };

export const Journal = ({ date }: TJournalProps) => {
  const [{ prompts }, { isLoading, upsertJournal }] = useJournals(
    date.toString(),
  );

  if (isLoading) return null;

  return prompts.map(({ prompt, response }, index) => (
    <div
      className="flex flex-col w-full mb-8"
      key={`${date.toString()}-${index}`}
    >
      <label className="text-md font-bold opacity-80 mb-4">{prompt}</label>

      <ResponseInput
        onChange={(newResponse) => {
          // Map rather than mutate a shallow copy — `[...prompts][index]` is
          // the very object React Query has cached.
          upsertJournal({
            prompts: prompts.map((entry, i) =>
              i === index ? { ...entry, response: newResponse } : entry,
            ),
          });
        }}
        response={response}
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
  const [debounced] = useDebounce(newResponse, 500);

  // When props reflow into the component, update local state
  useEffect(() => {
    setNewResponse(response);
  }, [response]);

  useEffect(() => {
    if (debounced !== response) onChange(debounced);
  }, [debounced]);

  return (
    <input
      className="w-full border-b-1 border-base-content/15 border-dashed focus:outline-0 text-sm"
      // Guarded like the debounce above: blurring an untouched input would
      // otherwise save a journal of empty responses, and an all-empty write is
      // exactly what must not create a `journals` row.
      onBlur={() => {
        if (newResponse !== response) onChange(newResponse);
      }}
      onChange={(e) => setNewResponse(e.target.value)}
      value={newResponse}
    />
  );
};
