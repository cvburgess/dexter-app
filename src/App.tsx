import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  createHashRouter,
  Outlet,
  RouterProvider,
  useNavigate,
} from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { AuthProvider } from "./hooks/useAuth.tsx";
import { Goals } from "./routes/Goals.tsx";
import { Lists } from "./routes/Lists.tsx";
import { Login } from "./routes/Login.tsx";
import { Priorities } from "./routes/Priorities.tsx";
import { Review } from "./routes/Review.tsx";
import { Settings } from "./routes/Settings/index.tsx";
import { About } from "./routes/Settings/About.tsx";
import { Account } from "./routes/Settings/Account.tsx";
import { Features } from "./routes/Settings/Features.tsx";
import { Theme } from "./routes/Settings/Theme.tsx";
import { Day } from "./routes/Day.tsx";
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
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Day /> },
      { path: "week", element: <Week /> },
      { path: "review", element: <Review /> },
      { path: "priorities", element: <Priorities /> },
      { path: "goals", element: <Goals /> },
      { path: "lists", element: <Lists /> },
      {
        path: "settings",
        children: [
          { path: "account", element: <Account />, index: true },
          { path: "theme", element: <Theme /> },
          { path: "features", element: <Features /> },
          { path: "about", element: <About /> },
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
