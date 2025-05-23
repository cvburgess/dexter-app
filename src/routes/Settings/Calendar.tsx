import { useEffect, useState } from "react";
import { Plus, Trash } from "@phosphor-icons/react";
import { useDebounce } from "use-debounce";

import { InputWithIcon } from "../../components/InputWithIcon";
import { SettingsOption } from "../../components/SettingsOption";

import { usePreferences } from "../../hooks/usePreferences";

export const Calendar = () => {
  const [preferences, { updatePreferences }] = usePreferences();

  const addUrl = (value: string) =>
    updatePreferences({
      calendarUrls: [...preferences.calendarUrls, value],
    });

  const deleteUrl = (index: number) =>
    updatePreferences({
      calendarUrls: preferences.calendarUrls.filter((_, i) => i !== index),
    });

  const updateUrl = (index: number, value: string) =>
    updatePreferences({
      calendarUrls: preferences.calendarUrls.map((url, i) =>
        i === index ? value : url,
      ),
    });

  return (
    <>
      <SettingsOption
        options={[
          {
            id: "true",
            title: "Enabled",
            isSelected: preferences.enableCalendar,
          },
          {
            id: "false",
            title: "Disabled",
            isSelected: !preferences.enableCalendar,
          },
        ]}
        setting="enableCalendar"
        title="Calendar"
      />

      {preferences.enableCalendar && (
        <div className="flex gap-4">
          <SettingsOption
            options={makeHours(0, 11, preferences.calendarStartTime)}
            setting="calendarStartTime"
            title="Calendar Start Time"
          />

          <SettingsOption
            options={makeHours(16, 24, preferences.calendarEndTime)}
            setting="calendarEndTime"
            title="Calendar End Time"
          />
        </div>
      )}

      {preferences.enableCalendar && (
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend ml-2">iCal URLs</legend>
          {preferences.calendarUrls.map((url, index) => (
            <UrlInput
              deleteUrl={deleteUrl}
              index={index}
              key={index}
              updateUrl={updateUrl}
              url={url}
            />
          ))}

          <InputWithIcon
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.currentTarget.value.trim()) {
                addUrl(e.currentTarget.value.trim());
                e.currentTarget.value = "";
              }
            }}
            type="text"
          >
            <Plus />
          </InputWithIcon>
        </fieldset>
      )}
    </>
  );
};

const makeHours = (start: number, end: number, selected: string) => {
  const hours = [];
  for (let i = start; i <= end; i++) {
    hours.push(i);
  }

  return hours.map((hour) => {
    const paddedHour = hour.toString().padStart(2, "0");
    return {
      id: `${paddedHour}:00:00`,
      title: `${paddedHour}:00`,
      isSelected: selected === `${paddedHour}:00:00`,
    };
  });
};

type TUrlInputProps = {
  deleteUrl: (index: number) => void;
  index: number;
  url: string;
  updateUrl: (index: number, value: string) => void;
};

const UrlInput = ({ deleteUrl, index, updateUrl, url }: TUrlInputProps) => {
  const [value, setValue] = useState<string>(url);
  const [debounced] = useDebounce(value, 500);

  // When props reflow into the component, update local state
  useEffect(() => {
    setValue(url);
  }, [url]);

  useEffect(() => {
    if (debounced !== url) updateUrl(index, debounced);
  }, [debounced]);

  return (
    <label className="input w-full h-standard bg-base-100 focus-within:outline-none shadow-none focus-within:shadow-none rounded-field border-1 border-base-200">
      <input
        className="text-sm"
        onChange={(e) => setValue(e.target.value)}
        type="text"
        value={value}
      />
      <span className="btn btn-link px-2" onClick={() => deleteUrl(index)}>
        <Trash className="text-base-content/60 hover:text-error" />
      </span>
    </label>
  );
};
