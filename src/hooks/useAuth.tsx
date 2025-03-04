// deno-lint-ignore-file
import { createContext, useContext, useEffect, useState } from "react";
import {
  AuthError,
  AuthResponse,
  AuthTokenResponsePassword,
  createClient,
  OAuthResponse,
  Session,
} from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  "https://isreileykodwkyedcewv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzcmVpbGV5a29kd2t5ZWRjZXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMzc1NTQsImV4cCI6MjA1NjYxMzU1NH0.7Q2qSOCNuX0-J5pg0NDCqB2F0FwjadEoNN4NEnaH57w",
);

type AuthContextType = {
  initializing: boolean;
  session: Session | null;
  signUp: ({ email, password }: EmailPassword) => Promise<AuthResponse>;
  signIn: (
    { email, password }: EmailPassword,
  ) => Promise<AuthTokenResponsePassword>;
  signInWithGoogle: () => Promise<OAuthResponse>;
  signOut: () => Promise<{ error: AuthError | null }>;
};

const signUp = ({ email, password }: EmailPassword) =>
  supabase.auth.signUp({ email, password });

const signIn = ({ email, password }: EmailPassword) =>
  supabase.auth.signInWithPassword({ email, password });

const signInWithGoogle = () =>
  supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin },
  });

export const signOut = () => supabase.auth.signOut({ scope: "local" });

const AuthContext = createContext<AuthContextType>({
  initializing: true,
  session: null,
  signIn,
  signInWithGoogle,
  signOut,
  signUp,
});

type EmailPassword = {
  email: string;
  password: string;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    }).finally(() => {
      setInitializing(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      },
    );

    return () => subscription.unsubscribe();
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
