import { Panel } from "../../components/Panel";
import { SettingsOption } from "../../components/SettingsOption";

export const Features = () => {
  return (
    <Panel>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4">
        <SettingsOption
          options={[
            { id: "true", title: "Enabled", isSelected: true },
            { id: "false", title: "Disabled", isSelected: false },
          ]}
          setting="notes"
          title="Daily Notes"
        />
        <SettingsOption
          options={[
            { id: "true", title: "Enabled", isSelected: true },
            { id: "false", title: "Disabled", isSelected: false },
          ]}
          setting="journal"
          title="Journal"
        />
      </div>
    </Panel>
  );
};
