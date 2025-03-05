import { useAuth } from "../hooks/useAuth.tsx";
import { View } from "../components/View.tsx";

export const Settings = () => {
  const { signOut } = useAuth();

  return (
    <View>
      <h1>Settings</h1>
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
