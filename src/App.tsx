import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  createHashRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useNavigate,
} from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { About } from "./routes/Settings/About.tsx";
import { Account } from "./routes/Settings/Account.tsx";
import { AuthProvider, useAuth } from "./hooks/useAuth.tsx";
import { Calendar } from "./routes/Settings/Calendar.tsx";
import { Day } from "./routes/Day.tsx";
import { Goals } from "./routes/Goals.tsx";
import { Habits } from "./routes/Settings/Habits.tsx";
import { Journal } from "./routes/Settings/Journal.tsx";
import { Lists } from "./routes/Lists.tsx";
import { Login } from "./routes/Login.tsx";
import { Notes } from "./routes/Settings/Notes.tsx";
import { Priorities } from "./routes/Priorities.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { Settings } from "./routes/Settings/index.tsx";
import { Tasks } from "./routes/Settings/Tasks.tsx";
import { Theme } from "./routes/Settings/Theme.tsx";
import { Week } from "./routes/Week.tsx";

import { Nav } from "./components/Nav.tsx";
import { useTheme } from "./hooks/useTheme.ts";

// AuthCallback component to handle auth redirects gracefully
const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { initializing, session } = useAuth();

  useEffect(() => {
    // For web auth, we need to give Supabase time to process the tokens in the URL
    if (!window.electron) {
      const url = window.location.href;
      const hasAuthParams =
        url.includes("access_token") || url.includes("refresh_token");

      if (hasAuthParams) {
        // The session will be set by Supabase's onAuthStateChange in the AuthProvider
        console.log(
          "Auth callback detected with auth params, waiting for session",
        );
      }
    }

    if (!initializing) {
      // Only redirect when we're done initializing
      if (session || window.electron) {
        // If we have a session, go to the main app
        // For Electron, redirect to day anyway as auth is handled differently
        navigate("/day", { replace: true });
      } else {
        // If we don't have a session after initializing, go to login
        navigate("/login", { replace: true });
      }
    }
  }, [navigate, initializing, session]);

  return null;
};

const App = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    // Add the event listener
    const removeListener = window.electron?.onGoToRoute((route: string) => {
      navigate(route);
    });

    // Clean up the event listener when the component unmounts
    return () => {
      if (removeListener) removeListener();
    };
  }, []);

  return (
    <main
      className="flex flex-col-reverse desktop:flex-row h-screen w-full overflow-hidden"
      data-theme={theme}
    >
      <Nav />
      <Outlet />
    </main>
  );
};

const router = createHashRouter([
  { path: "login", element: <Login /> },
  // Add dedicated routes for auth callback paths
  { path: "auth-callback", element: <AuthCallback /> },
  // Handle hash fragments with authentication tokens
  // This special loader pattern helps intercept auth callbacks before showing "not found"
  { path: "*", element: <AuthCallback /> },
  {
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate replace to="day" /> },
      { path: "day", element: <Day /> },
      { path: "goals", element: <Goals /> },
      { path: "lists", element: <Lists /> },
      { path: "priorities", element: <Priorities /> },
      { path: "week", element: <Week /> },
      {
        path: "settings",
        children: [
          { index: true, element: <Navigate replace to="account" /> },
          { path: "about", element: <About /> },
          { path: "account", element: <Account /> },
          { path: "calendar", element: <Calendar /> },
          { path: "habits", element: <Habits /> },
          { path: "journal", element: <Journal /> },
          { path: "notes", element: <Notes /> },
          { path: "tasks", element: <Tasks /> },
          { path: "theme", element: <Theme /> },
        ],
        element: <Settings />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>,
);
