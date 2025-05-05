import { NavLink, Outlet, useLocation } from "react-router";
import classNames from "classnames";

import { TextToolbar } from "../../components/Toolbar.tsx";
import { ScrollableContainer, View } from "../../components/View.tsx";

const Panel = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col border-2 border-base-200 w-full rounded-box my-4 p-4 gap-4 overflow-auto">
      {children}
    </div>
  );
};

export const Settings = () => {
  const location = useLocation();

  const panels = [
    "account",
    "tasks",
    "calendar",
    "habits",
    "journal",
    "notes",
    "theme",
    "about",
  ];

  const noArticle = ["account", "theme", "about"];

  const currentPanel = location.pathname.split("/").at(-1);

  const articleUrl = noArticle.includes(currentPanel)
    ? undefined
    : `https://dexterplanner.com/tips/${currentPanel}`;

  return (
    <View>
      <TextToolbar articleUrl={articleUrl} title="Settings" />
      <ScrollableContainer>
        <ul className="menu bg-base-100 rounded-box w-standard mt-4">
          {panels.map((panel) => (
            <li className="my-1" key={panel}>
              <NavLink
                className={({ isActive }) =>
                  classNames("capitalize", {
                    "bg-base-content/80 text-base-100": isActive,
                  })
                }
                to={panel}
              >
                {panel}
              </NavLink>
            </li>
          ))}
        </ul>
        <Panel>
          <Outlet />
        </Panel>
      </ScrollableContainer>
    </View>
  );
};
