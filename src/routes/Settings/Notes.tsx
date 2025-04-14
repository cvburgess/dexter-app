import { LexicalEditor } from "../../components/LexicalEditor";
import { SettingsOption } from "../../components/SettingsOption";

import { usePreferences } from "../../hooks/usePreferences";

export const Notes = () => {
  const [preferences, { updatePreferences }] = usePreferences();

  return (
    <>
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
      {preferences.enableNotes && (
        <fieldset className="fieldset grow flex flex-col w-full">
          <legend className="fieldset-legend ml-2 text-sm">
            Daily Notes Template
          </legend>
          <div className="w-full min-h-full h-fit border-2 border-base-200 rounded-box p-4">
            <LexicalEditor
              onChange={(templateNote) => updatePreferences({ templateNote })}
              text={preferences.templateNote}
            />
          </div>
        </fieldset>
      )}
    </>
  );
};
