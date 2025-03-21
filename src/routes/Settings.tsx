import { useState } from "react";
import classNames from "classnames";

// import {
//   ButtonWithPopover,
//   TOption,
// } from "../components/ButtonWithPopover.tsx";
import { TextToolbar } from "../components/Toolbar.tsx";
import { ScrollableContainer, View } from "../components/View.tsx";

import { useAuth } from "../hooks/useAuth.tsx";
import { THEMES } from "../hooks/useTheme.ts";

export const Settings = () => {
  const [activePanel, setActivePanel] = useState<string>("Account");
  const panels = ["Account", "Theme", "About"];

  return (
    <View>
      <TextToolbar title="Settings" />
      <ScrollableContainer>
        <ul className="menu bg-base-100 rounded-box w-standard mt-4">
          {panels.map((panel) => (
            <li className="my-1" key={panel}>
              <a
                className={classNames({ "bg-base-200": activePanel === panel })}
                onClick={() => setActivePanel(panel)}
              >
                {panel}
              </a>
            </li>
          ))}
        </ul>
        {activePanel === "Account" && <Account />}
        {activePanel === "Theme" && <Theme />}
      </ScrollableContainer>
    </View>
  );
};

const Panel = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="border-2 border-base-200 w-full h-[calc(100vh-5.5rem)] rounded-box mt-4 p-4 overflow-auto">
      {children}
    </div>
  );
};

const Account = () => {
  const { signOut } = useAuth();

  return (
    <Panel>
      <button
        type="button"
        className="btn"
        onClick={async () => await signOut()}
      >
        Sign out
      </button>
      <button
        type="button"
        className="btn"
        onClick={async () => await signOut()}
      >
        Delete account
      </button>
    </Panel>
  );
};

const Theme = () => {
  // const selectedClassNames = "outline-2 outline-offset-2 outline-base-content";

  const lightThemes = THEMES.filter((theme) => theme.mode === "light").map(
    ({ name }) => ({ id: name, title: name }),
  );
  const darkThemes = THEMES.filter((theme) => theme.mode === "dark").map(
    ({ name }) => ({ id: name, title: name }),
  );
  const themeModeOptions = [
    { id: "system", title: "System" },
    { id: "light", title: "Light" },
    { id: "dark", title: "Dark" },
  ];

  return (
    <Panel>
      {/* <ButtonWithPopover
        buttonVariant="none"
        variant="menu"
        options={lightThemes.map(
          ({ name }) => ({ id: name, title: name }) as TOption,
        )}
        onChange={(name) => console.log(name as string)}
      >
        <button className="btn text-xs">Light Theme</button>
      </ButtonWithPopover>
      <ButtonWithPopover
        buttonVariant="none"
        variant="menu"
        options={darkThemes.map(
          ({ name }) => ({ id: name, title: name }) as TOption,
        )}
        onChange={(name) => console.log(name as string)}
      >
        <button className="btn text-xs">Dark Theme</button>
      </ButtonWithPopover>
      <ButtonWithPopover
        buttonVariant="none"
        variant="menu"
        options={themeModeOptions}
        onChange={(name) => console.log(name as string)}
      >
        <button className="btn text-xs">Theme Mode</button>
      </ButtonWithPopover> */}

      {/* <div className="divider" /> */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4">
        <SettingsOption
          options={lightThemes}
          selected="dexter"
          title="Light Theme"
        />
        <SettingsOption
          options={darkThemes}
          selected="dark"
          title="Dark Theme"
        />
        <SettingsOption
          options={themeModeOptions}
          selected="dark"
          title="Theme Mode"
        />
      </div>

      <div className="divider divider-start text-xs mx-2">Preview Themes</div>

      <details className="collapse collapse-arrow bg-base-100 border border-base-300 mb-4">
        <summary className="collapse-title font-semibold">Light Themes</summary>
        <div className="collapse-content">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
            {lightThemes.map((theme) => (
              <ThemeOption theme={theme.id} />
            ))}
          </div>
        </div>
      </details>

      <details className="collapse collapse-arrow bg-base-100 border border-base-300">
        <summary className="collapse-title font-semibold">Dark Themes</summary>
        <div className="collapse-content">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
            {darkThemes.map((theme) => (
              <ThemeOption theme={theme.id} />
            ))}
          </div>
        </div>
      </details>
    </Panel>
  );
};

const ThemeOption = ({ theme }: { theme: string }) => (
  <div className="min-w-compact flex-1 border-1 border-base-content/20 hover:border-base-content/40 overflow-hidden rounded-box">
    <div
      className="bg-base-100 text-base-content w-full cursor-pointer font-sans"
      data-theme={theme}
    >
      <div className="grid grid-cols-5 grid-rows-2">
        <div className="bg-base-200 col-start-1 row-span-1 row-start-1"></div>
        <div className="bg-base-300 col-start-1 row-start-2"></div>
        <div className="bg-base-100 col-span-4 col-start-2 row-span-2 row-start-1 flex flex-col gap-1 p-2">
          <div className="font-bold capitalize">{theme}</div>
          <div className="flex flex-wrap gap-1">
            <div className="bg-base-content/80 flex aspect-square w-6 items-center justify-center rounded">
              <div className="text-base-100 text-sm font-bold">A</div>
            </div>
            <div className="bg-warning flex aspect-square w-6 items-center justify-center rounded">
              <div className="text-warning-content text-sm font-bold">A</div>
            </div>
            <div className="bg-error flex aspect-square w-6 items-center justify-center rounded">
              <div className="text-error-content text-sm font-bold">A</div>
            </div>
            <div className="bg-info flex aspect-square w-6 items-center justify-center rounded">
              <div className="text-info-content text-sm font-bold">A</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

type TSettingsOptionProps = {
  options: { id: string; title: string }[];
  selected: string;
  title: string;
};

const SettingsOption = ({ options, selected, title }: TSettingsOptionProps) => (
  <fieldset className="fieldset w-full">
    <legend className="fieldset-legend ml-2">{title}</legend>
    <select defaultValue={selected} className="select capitalize">
      {options.map(({ id, title }) => (
        <option value={id}>{title}</option>
      ))}
    </select>
  </fieldset>
);
