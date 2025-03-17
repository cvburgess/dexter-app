import React from "react";
import ReactDOM from "react-dom/client";
import {
  createHashRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { AuthProvider } from "./hooks/useAuth.tsx";
import { Today } from "./routes/Today.tsx";
import { Review } from "./routes/Review.tsx";
import { Week } from "./routes/Week.tsx";
import { Prioritize } from "./routes/Prioritize.tsx";
import { Lists } from "./routes/Lists.tsx";
import { Settings } from "./routes/Settings.tsx";
import { Login } from "./routes/Login.tsx";

import { Nav } from "./components/Nav.tsx";
import { useTheme } from "./hooks/useTheme.ts";

const App = () => {
  const theme = useTheme();

  return (
    <main className="flex h-screen w-full" data-theme={theme}>
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
      { index: true, element: <Today /> },
      { path: "week", element: <Week /> },
      { path: "review", element: <Review /> },
      { path: "prioritize", element: <Prioritize /> },
      { path: "lists", element: <Lists /> },
      { path: "settings", element: <Settings /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
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
