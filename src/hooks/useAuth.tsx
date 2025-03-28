import { createContext, useContext, useEffect, useState } from "react";
import { createClient, Session } from "@supabase/supabase-js";

import { Database } from "../api/database.types.ts";

const { VITE_SUPABASE_URL, VITE_SUPABASE_KEY } = import.meta.env;

// ---------- TYPES ----------

type EmailPassword = { email: string; password: string };

export type TToken = {
  access_token: string;
  refresh_token: string;
  type: string;
};

type AuthContextType = {
  initializing: boolean;
  resetInProgress: boolean;
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

export const resetPassword = ({ email }: { email: string }) =>
  window.electron
    ? supabase.auth.resetPasswordForEmail(email, { redirectTo })
    : supabase.auth.resetPasswordForEmail(email);

export const signUp = ({ email, password }: EmailPassword) =>
  supabase.auth.signUp({ email, password });

export const signIn = ({ email, password }: EmailPassword) =>
  supabase.auth.signInWithPassword({ email, password });

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
  resetInProgress: false,
  session: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [resetInProgress, setResetInProgress] = useState<boolean>(false);

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
      console.log("onAuthStateChange", event, session);
      if (event === "PASSWORD_RECOVERY") {
        setResetInProgress(true);
      }
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Add the event listener
    const removeListener = window.electron?.onSupabaseAuthCallback(
      async (token: TToken) => {
        if (token.type === "recovery") {
          setResetInProgress(true);
          await supabase.auth.setSession(token);
        } else {
          await supabase.auth.setSession(token);
          window.location.replace("/");
        }
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
        resetInProgress,
        session,
        userId: session?.user.id,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
