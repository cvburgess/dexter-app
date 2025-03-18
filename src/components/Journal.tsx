import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

import { useDays } from "../hooks/useDays.tsx";

type TJournalProps = { date: string };

export const Journal = ({ date }: TJournalProps) => {
  const [{ prompts }, { upsertDay }] = useDays(date);

  return prompts.map(({ prompt, response }, index) => (
    <div key={index} className="flex flex-col w-full space-y-4 mt-4">
      <label className="text-md font-bold text-center opacity-80">
        {prompt}
      </label>

      <ResponseInput
        response={response}
        onChange={(newResponse) => {
          const diff = [...prompts];
          diff[index].response = newResponse;
          upsertDay({ prompts: diff });
        }}
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
      className="w-full border-b-1 border-base-content/20 focus:outline-0 text-center text-xs"
      value={newResponse}
      onChange={(e) => setNewResponse(e.target.value)}
    />
  );
};
