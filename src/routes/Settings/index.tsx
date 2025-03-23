import { useState } from "react";
import classNames from "classnames";

import { TextToolbar } from "../../components/Toolbar.tsx";
import { ScrollableContainer, View } from "../../components/View.tsx";

import { About } from "./About.tsx";
import { Account } from "./Account.tsx";
import { Features } from "./Features.tsx";
import { Theme } from "./Theme.tsx";

export const Settings = () => {
  const [activePanel, setActivePanel] = useState<string>("Account");
  const panels = ["Account", "Features", "Theme", "About"];

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
        {activePanel === "Features" && <Features />}
        {activePanel === "About" && <About />}
      </ScrollableContainer>
    </View>
  );
};
