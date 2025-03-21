import { useState } from "react";

import { TextToolbar } from "../components/Toolbar.tsx";
import { ScrollableContainer, View } from "../components/View.tsx";

import { useAuth } from "../hooks/useAuth.tsx";

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
