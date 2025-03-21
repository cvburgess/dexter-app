import { useState } from "react";

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
        <ul className="menu bg-base-100 rounded-box w-56 mt-4">
          {panels.map((panel) => (
            <li key={panel}>
              <a onClick={() => setActivePanel(panel)}>{panel}</a>
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
    <div className="border-2 border-base-200 w-full h-[calc(100vh-5.5rem)] rounded-box mt-4 p-4">
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

  const lightThemes = THEMES.filter((theme) => theme.mode === "light");
  const darkThemes = THEMES.filter((theme) => theme.mode === "dark");

  return (
    <Panel>
      <div className="flex flex-wrap gap-4">
        {lightThemes.map((theme) => (
          <ThemeOption theme={theme} />
        ))}
        {darkThemes.map((theme) => (
          <ThemeOption theme={theme} />
        ))}
      </div>
    </Panel>
  );
};

const ThemeOption = ({ theme }: { theme: (typeof THEMES)[number] }) => (
  <div className="w-compact border-base-content/20 hover:border-base-content/40 overflow-hidden rounded-lg border">
    <div
      className="bg-base-100 text-base-content w-full cursor-pointer font-sans"
      data-theme={theme.name}
    >
      <div className="grid grid-cols-5 grid-rows-3">
        <div className="bg-base-200 col-start-1 row-span-2 row-start-1"></div>
        <div className="bg-base-300 col-start-1 row-start-3"></div>
        <div className="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2">
          <div className="font-bold">{theme.name}</div>
          <div className="flex flex-wrap gap-1">
            <div className="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
              <div className="text-primary-content text-sm font-bold">A</div>
            </div>
            <div className="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
              <div className="text-secondary-content text-sm font-bold">A</div>
            </div>
            <div className="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6">
              <div className="text-accent-content text-sm font-bold">A</div>
            </div>
            <div className="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6">
              <div className="text-neutral-content text-sm font-bold">A</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
