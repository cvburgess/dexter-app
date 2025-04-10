import { SettingsOption } from "../../components/SettingsOption";

import { usePreferences } from "../../hooks/usePreferences";

export const Notes = () => {
  const [preferences] = usePreferences();

  return (
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
  );
};
