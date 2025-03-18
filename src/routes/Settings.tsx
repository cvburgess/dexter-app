import { Toolbar } from "../components/Toolbar.tsx";
import { View } from "../components/View.tsx";

import { useAuth } from "../hooks/useAuth.tsx";

export const Settings = () => {
  const { signOut } = useAuth();

  return (
    <View>
      <Toolbar>
        <p className="btn btn-ghost">Settings</p>
      </Toolbar>
      <button
        type="button"
        className="btn"
        onClick={async () => await signOut()}
      >
        Sign out
      </button>
    </View>
  );
};
