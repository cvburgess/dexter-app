import { createContext, useContext, useEffect, useState } from "react";
import {
  AuthError,
  AuthResponse,
  AuthTokenResponsePassword,
  createClient,
  OAuthResponse,
  Session,
  SupabaseClient,
  UserResponse,
} from "@supabase/supabase-js";

import { Database } from "../api/database.types.ts";

const { VITE_SUPABASE_URL, VITE_SUPABASE_KEY } = import.meta.env;
// Create a single supabase client for interacting with your database
const supabase = createClient<Database>(VITE_SUPABASE_URL, VITE_SUPABASE_KEY);

type TResetResponse = { data: unknown | null; error: AuthError | null };

type EResetState = null | "recovering" | "recovered";

type AuthContextType = {
  initializing: boolean;
  resetPassword: ({ email }: { email: string }) => Promise<TResetResponse>;
  resetPasswordState: EResetState;
  session: Session | null;
  signUp: ({ email, password }: EmailPassword) => Promise<AuthResponse>;
  signIn: ({
    email,
    password,
  }: EmailPassword) => Promise<AuthTokenResponsePassword>;
  signInWithGoogle: () => Promise<OAuthResponse>;
  signOut: () => Promise<{ error: AuthError | null }>;
  supabase: SupabaseClient;
  updatePassword?: ({
    password,
  }: {
    password: string;
  }) => Promise<UserResponse>;
  userId?: string;
};

/**
 * Step 1: Send the user an email to get a password reset token.
 * This email contains a link which sends the user back to your application.
 */

const signUp = ({ email, password }: EmailPassword) =>
  supabase.auth.signUp({ email, password });

const signIn = ({ email, password }: EmailPassword) =>
  supabase.auth.signInWithPassword({ email, password });

const signInWithGoogle = () =>
  supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "dexter://auth-callback",
      skipBrowserRedirect: true,
    },
  });

export const signOut = () => supabase.auth.signOut({ scope: "local" });

export const updatePassword = ({ password }: { password: string }) =>
  supabase.auth.updateUser({ password });

const AuthContext = createContext<AuthContextType>({
  initializing: true,
  resetPassword: null,
  resetPasswordState: null,
  session: null,
  signIn,
  signInWithGoogle,
  signOut,
  signUp,
  supabase,
});

type EmailPassword = { email: string; password: string };

export type TToken = {
  access_token: string;
  refresh_token: string;
  type: string;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [resetPasswordState, setResetPasswordState] =
    useState<EResetState>(null);

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
      if (event === "PASSWORD_RECOVERY") {
        setResetPasswordState("recovered");
      }
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Add the event listener
    const removeListener = window.electron.onSupabaseAuthCallback(
      async (token: TToken) => {
        if (token.type === "recovery") {
          setResetPasswordState("recovered");
          await supabase.auth.setSession(token);
        } else {
          window.location.replace("/");
          await supabase.auth.setSession(token);
        }
      },
    );

    // Clean up the event listener when the component unmounts
    return () => {
      if (removeListener) removeListener();
    };
  }, []);

  const resetPassword = ({ email }: { email: string }) => {
    setResetPasswordState("recovering");
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "dexter://auth-callback",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        initializing,
        resetPassword,
        resetPasswordState,
        session,
        signIn,
        signInWithGoogle,
        signOut,
        signUp,
        supabase,
        updatePassword,
        userId: session?.user.id,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
