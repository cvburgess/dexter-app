import { useAuth } from "../hooks/useAuth.tsx";
import { View } from "../components/View.tsx";

export const Settings = () => {
  const { supabase } = useAuth();

  const signOut = async () => {
    await supabase.auth.signOut({ scope: "local" });
  };

  return (
    <View>
      <h1>Settings</h1>
      <button type="button" className="btn" onClick={signOut}>
        Sign out
      </button>
    </View>
  );
};
