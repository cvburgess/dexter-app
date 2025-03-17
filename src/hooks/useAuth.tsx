import { createContext, useContext, useEffect, useState } from "react";
import {
  AuthError,
  AuthResponse,
  AuthTokenResponsePassword,
  createClient,
  OAuthResponse,
  Session,
  SupabaseClient,
} from "@supabase/supabase-js";

import { Database } from "../api/database.types.ts";

const { VITE_SUPABASE_URL, VITE_SUPABASE_KEY } = import.meta.env;
// Create a single supabase client for interacting with your database
const supabase = createClient<Database>(VITE_SUPABASE_URL, VITE_SUPABASE_KEY);

type AuthContextType = {
  initializing: boolean;
  session: Session | null;
  signUp: ({ email, password }: EmailPassword) => Promise<AuthResponse>;
  signIn: ({
    email,
    password,
  }: EmailPassword) => Promise<AuthTokenResponsePassword>;
  signInWithGoogle: () => Promise<OAuthResponse>;
  signOut: () => Promise<{ error: AuthError | null }>;
  supabase: SupabaseClient;
  userId?: string;
};

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

const AuthContext = createContext<AuthContextType>({
  initializing: true,
  session: null,
  signIn,
  signInWithGoogle,
  signOut,
  signUp,
  supabase,
});

type EmailPassword = {
  email: string;
  password: string;
};

export type TToken = {
  access_token: string;
  refresh_token: string;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
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
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Add the event listener
    const removeListener = window.electron.onSupabaseAuthCallback(
      async (token: TToken) => {
        await supabase.auth.setSession(token);
        window.location.replace("/");
      }
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
        signIn,
        signInWithGoogle,
        signOut,
        signUp,
        supabase,
        userId: session?.user.id,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
