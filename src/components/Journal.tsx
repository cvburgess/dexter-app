import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Temporal } from "@js-temporal/polyfill";

import { useDays } from "../hooks/useDays.tsx";

type TJournalProps = { date: Temporal.PlainDate };

export const Journal = ({ date }: TJournalProps) => {
  const [{ prompts }, { upsertDay }] = useDays(date.toString());

  return prompts.map(({ prompt, response }, index) => (
    <div className="flex flex-col w-full mb-8" key={index}>
      <label className="text-md font-bold opacity-80 mb-4">{prompt}</label>

      <ResponseInput
        onChange={(newResponse) => {
          const diff = [...prompts];
          diff[index].response = newResponse;
          upsertDay({ prompts: diff });
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
  const [debounced] = useDebounce(newResponse, 1000);

  // When props reflow into the component, update local state
  useEffect(() => {
    setNewResponse(response);
  }, [response]);

  useEffect(() => {
    if (debounced !== response) onChange(debounced);
  }, [debounced]);

  return (
    <input
      className="w-full border-b-1 border-base-content/15 border-dashed focus:outline-0 text-xs"
      onChange={(e) => setNewResponse(e.target.value)}
      value={newResponse}
    />
  );
};
