import { CaretDown } from "@phosphor-icons/react";

import {
  ButtonWithPopover,
  TOption,
} from "../components/ButtonWithPopover.tsx";

import { usePreferences } from "../hooks/usePreferences.tsx";

type TSettingsOptionProps = {
  options: TOption[];
  setting: string;
  title: string;
};

export const SettingsOption = ({
  options,
  setting,
  title,
}: TSettingsOptionProps) => {
  const [_, { updatePreferences }] = usePreferences({ skipQuery: true });
  const selected = options.find((option) => option.isSelected);

  return (
    <fieldset className="fieldset w-full">
      <legend className="fieldset-legend ml-2 text-sm">{title}</legend>
      <ButtonWithPopover
        buttonVariant="none"
        onChange={(value) => updatePreferences({ [setting]: value })}
        options={options}
        popoverId={setting}
        variant="menu"
      >
        <button className="btn text-xs justify-start capitalize w-full">
          {selected.title} <CaretDown className="ml-auto" />
        </button>
      </ButtonWithPopover>
    </fieldset>
  );
};
