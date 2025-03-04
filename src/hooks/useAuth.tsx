import { createContext, useContext, useEffect, useState } from "react";
import { createClient, Session, SupabaseClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  "https://isreileykodwkyedcewv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzcmVpbGV5a29kd2t5ZWRjZXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMzc1NTQsImV4cCI6MjA1NjYxMzU1NH0.7Q2qSOCNuX0-J5pg0NDCqB2F0FwjadEoNN4NEnaH57w",
);

type AuthContextType = {
  initializing: boolean;
  session: Session | null;
  supabase: SupabaseClient;
};

const AuthContext = createContext<AuthContextType>({
  initializing: true,
  session: null,
  supabase,
});

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
    <AuthContext.Provider value={{ initializing, session, supabase }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
