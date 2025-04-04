import { createContext, useContext, useEffect, useState } from "react";
import { createClient, Session } from "@supabase/supabase-js";

import { Database } from "../api/database.types.ts";

const { VITE_SUPABASE_URL, VITE_SUPABASE_KEY } = import.meta.env;

// ---------- TYPES ----------

export type TToken = {
  access_token: string;
  refresh_token: string;
  type: string;
  user?: {
    email: string;
  };
};

type AuthContextType = {
  initializing: boolean;
  session: Session | null;
  userId?: string;
};

// ---------- HELPER EXPORTS ----------

const redirectTo = window.electron
  ? "dexter://auth-callback"
  : window.location.origin;

export const supabase = createClient<Database>(
  VITE_SUPABASE_URL,
  VITE_SUPABASE_KEY,
);

export const signInWithEmail = (email: string) =>
  supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });

export const signInWithGoogle = () =>
  window.electron
    ? supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo, skipBrowserRedirect: true },
      })
    : supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo, skipBrowserRedirect: false },
      });

export const signOut = () => supabase.auth.signOut({ scope: "local" });

export const updatePassword = ({ password }: { password: string }) =>
  supabase.auth.updateUser({ password });

export const deleteAccount = async () => {
  await supabase.rpc("delete_user");
  await supabase.auth.signOut();
};

// ---------- HOOK ----------

const AuthContext = createContext<AuthContextType>({
  initializing: true,
  session: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      })
      .finally(() => {
        setInitializing(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Add the event listener
    const removeListener = window.electron?.onSupabaseAuthCallback(
      async (token: TToken) => {
        await supabase.auth.setSession(token);
      },
    );

    // Clean up the event listener when the component unmounts
    return () => {
      if (removeListener) removeListener();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        initializing,
        session,
        userId: session?.user.id,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
