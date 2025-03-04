import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router";

import App from "./App.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { Today } from "./routes/Today.tsx";
import { Review } from "./routes/Review.tsx";
import { Week } from "./routes/Week.tsx";
import { Prioritize } from "./routes/Prioritize.tsx";
import { Lists } from "./routes/Lists.tsx";
import { Settings } from "./routes/Settings.tsx";
import { Login } from "./routes/Login.tsx";

const router = createHashRouter([
  { path: "login", element: <Login /> },
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
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
