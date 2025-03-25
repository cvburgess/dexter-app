import { Panel } from "../../components/Panel";
import { SettingsOption } from "../../components/SettingsOption";

import { usePreferences } from "../../hooks/usePreferences";

export const Features = () => {
  const [preferences] = usePreferences();

  return (
    <Panel>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4">
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
    </Panel>
  );
};
