import { Panel } from "../../components/Panel";
import { SettingsOption } from "../../components/SettingsOption";

import { usePreferences } from "../../hooks/usePreferences.tsx";
import { THEMES } from "../../hooks/useTheme.ts";

import { EThemeMode } from "../../api/preferences.ts";

export const Theme = () => {
  // const selectedClassNames = "outline-2 outline-offset-2 outline-base-content";
  const [preferences] = usePreferences();

  const lightThemes = THEMES.filter((theme) => theme.mode === "light").map(
    ({ name }) => ({
      id: name,
      title: name,
      isSelected: preferences.lightTheme === name,
    }),
  );
  const darkThemes = THEMES.filter((theme) => theme.mode === "dark").map(
    ({ name }) => ({
      id: name,
      title: name,
      isSelected: preferences.darkTheme === name,
    }),
  );
  const themeModeOptions = [
    {
      id: EThemeMode.SYSTEM,
      title: "System",
      isSelected: preferences.themeMode === EThemeMode.SYSTEM,
    },
    {
      id: EThemeMode.LIGHT,
      title: "Light",
      isSelected: preferences.themeMode === EThemeMode.LIGHT,
    },
    {
      id: EThemeMode.DARK,
      title: "Dark",
      isSelected: preferences.themeMode === EThemeMode.DARK,
    },
  ];

  return (
    <Panel>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4">
        <SettingsOption
          options={themeModeOptions}
          setting="themeMode"
          title="Theme Mode"
        />

        {(preferences.themeMode === EThemeMode.SYSTEM ||
          preferences.themeMode === EThemeMode.LIGHT) && (
          <SettingsOption
            options={lightThemes}
            setting="lightTheme"
            title="Light Theme"
          />
        )}

        {(preferences.themeMode === EThemeMode.SYSTEM ||
          preferences.themeMode === EThemeMode.DARK) && (
          <SettingsOption
            options={darkThemes}
            setting="darkTheme"
            title="Dark Theme"
          />
        )}
      </div>

      <div className="divider divider-start text-sm mx-2 my-6">
        Preview Themes
      </div>

      <details className="collapse collapse-arrow bg-base-100 border border-base-300 mb-4">
        <summary className="collapse-title font-semibold text-sm min-h-0">
          Light Themes
        </summary>
        <div className="collapse-content">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
            {lightThemes.map((theme) => (
              <ThemeOption key={theme.id} theme={theme.id} />
            ))}
          </div>
        </div>
      </details>

      <details className="collapse collapse-arrow bg-base-100 border border-base-300">
        <summary className="collapse-title font-semibold text-sm min-h-0">
          Dark Themes
        </summary>
        <div className="collapse-content">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
            {darkThemes.map((theme) => (
              <ThemeOption key={theme.id} theme={theme.id} />
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
