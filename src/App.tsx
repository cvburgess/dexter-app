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
import { AuthProvider } from "./hooks/useAuth.tsx";
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
import { Review } from "./routes/Review.tsx";
import { Settings } from "./routes/Settings/index.tsx";
import { Theme } from "./routes/Settings/Theme.tsx";
import { Week } from "./routes/Week.tsx";

import { Nav } from "./components/Nav.tsx";
import { useTheme } from "./hooks/useTheme.ts";

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
      { path: "review", element: <Review /> },
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
