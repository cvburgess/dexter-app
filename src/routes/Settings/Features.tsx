import { useEffect, useState } from "react";
import { Plus, Trash } from "@phosphor-icons/react";
import { useDebounce } from "use-debounce";

import { Panel } from "../../components/Panel";
import { SettingsOption } from "../../components/SettingsOption";

import { usePreferences } from "../../hooks/usePreferences";

export const Features = () => {
  const [preferences, { updatePreferences }] = usePreferences();

  const addPrompt = (value: string) =>
    updatePreferences({
      templatePrompts: [...preferences.templatePrompts, value],
    });

  const deletePrompt = (index: number) =>
    updatePreferences({
      templatePrompts: preferences.templatePrompts.filter(
        (_, i) => i !== index,
      ),
    });

  const updatePrompt = (index: number, value: string) =>
    updatePreferences({
      templatePrompts: preferences.templatePrompts.map((prompt, i) =>
        i === index ? value : prompt,
      ),
    });

  return (
    <Panel>
      <SettingsOption
        options={[
          {
            id: "true",
            title: "Enabled",
            isSelected: preferences.enableNotes,
          },
          {
            id: "false",
            title: "Disabled",
            isSelected: !preferences.enableNotes,
          },
        ]}
        setting="enableNotes"
        title="Daily Notes"
      />

      <div className="mt-4">
        <SettingsOption
          options={[
            {
              id: "true",
              title: "Enabled",
              isSelected: preferences.enableJournal,
            },
            {
              id: "false",
              title: "Disabled",
              isSelected: !preferences.enableJournal,
            },
          ]}
          setting="enableJournal"
          title="Journal"
        />
      </div>

      {preferences.enableJournal && (
        <fieldset className="fieldset w-full mt-4">
          <legend className="fieldset-legend ml-2 text-sm">
            Journal Prompts
          </legend>
          {preferences.templatePrompts.map((prompt, index) => (
            <PromptInput
              deletePrompt={deletePrompt}
              index={index}
              key={index}
              prompt={prompt}
              updatePrompt={updatePrompt}
            />
          ))}

          <label className="input w-full bg-base-200 focus-within:outline-none shadow-none focus-within:shadow-none rounded-field border-1 border-base-200">
            <span>
              <Plus className="text-base-content/60" />
            </span>
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  addPrompt(e.currentTarget.value.trim());
                  e.currentTarget.value = "";
                }
              }}
              type="text"
            />
          </label>
        </fieldset>
      )}
    </Panel>
  );
};

type TPromptInputProps = {
  deletePrompt: (index: number) => void;
  index: number;
  prompt: string;
  updatePrompt: (index: number, value: string) => void;
};

const PromptInput = ({
  deletePrompt,
  index,
  prompt,
  updatePrompt,
}: TPromptInputProps) => {
  const [value, setValue] = useState<string>(prompt);
  const [debounced] = useDebounce(value, 1000);

  // When props reflow into the component, update local state
  useEffect(() => {
    setValue(prompt);
  }, [prompt]);

  useEffect(() => {
    if (debounced !== value) updatePrompt(index, debounced);
  }, [debounced]);

  return (
    <label className="input w-full bg-base-100 focus-within:outline-none shadow-none focus-within:shadow-none rounded-field border-1 border-base-200">
      <input
        className="text-xs"
        onChange={(e) => setValue(e.target.value)}
        type="text"
        value={value}
      />
      <span className="btn btn-link px-2" onClick={() => deletePrompt(index)}>
        <Trash className="text-base-content/60 hover:text-error" />
      </span>
    </label>
  );
};
