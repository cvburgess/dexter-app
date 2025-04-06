import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, Outlet, RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { AuthProvider } from "./hooks/useAuth.tsx";
import { Goals } from "./routes/Goals.tsx";
import { Lists } from "./routes/Lists.tsx";
import { Login } from "./routes/Login.tsx";
import { Prioritize } from "./routes/Prioritize.tsx";
import { Review } from "./routes/Review.tsx";
import { Settings } from "./routes/Settings/index.tsx";
import { Today } from "./routes/Today.tsx";
import { Week } from "./routes/Week.tsx";

import { Nav } from "./components/Nav.tsx";
import { useTheme } from "./hooks/useTheme.ts";

const App = () => {
  const theme = useTheme();

  return (
    <main
      className="flex max-sm:flex-col-reverse h-screen w-full overflow-hidden"
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
      { index: true, element: <Today /> },
      { path: "week", element: <Week /> },
      { path: "review", element: <Review /> },
      { path: "prioritize", element: <Prioritize /> },
      { path: "goals", element: <Goals /> },
      { path: "lists", element: <Lists /> },
      { path: "settings", element: <Settings /> },
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
