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
      <legend className="fieldset-legend ml-2 text-base">{title}</legend>
      <ButtonWithPopover
        buttonClassName="w-full"
        buttonVariant="none"
        onChange={(value) => updatePreferences({ [setting]: value })}
        options={options}
        popoverId={setting}
        title={title}
        variant="menu"
      >
        <span className="btn h-standard text-sm justify-start capitalize w-full">
          {selected.title} <CaretDown className="ml-auto" />
        </span>
      </ButtonWithPopover>
    </fieldset>
  );
};
