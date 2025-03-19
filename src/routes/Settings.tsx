import { TextToolbar } from "../components/Toolbar.tsx";
import { View } from "../components/View.tsx";

import { useAuth } from "../hooks/useAuth.tsx";

export const Settings = () => {
  const { signOut } = useAuth();

  return (
    <View>
      <TextToolbar title="Settings" />
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
