import { NavLink, Outlet } from "react-router";
import classNames from "classnames";

import { TextToolbar } from "../../components/Toolbar.tsx";
import { ScrollableContainer, View } from "../../components/View.tsx";

export const Settings = () => {
  const panels = ["account", "features", "theme", "about"];

  return (
    <View>
      <TextToolbar title="Settings" />
      <ScrollableContainer>
        <ul className="menu bg-base-100 rounded-box w-standard mt-4">
          {panels.map((panel) => (
            <li className="my-1" key={panel}>
              <NavLink
                className={({ isActive }) =>
                  classNames("capitalize", { "bg-base-200": isActive })
                }
                to={`/settings/${panel}`}
              >
                {panel}
              </NavLink>
            </li>
          ))}
        </ul>
        <Outlet />
      </ScrollableContainer>
    </View>
  );
};
