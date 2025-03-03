import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router";

import App from "./App.tsx";
import { Today } from "./routes/Today.tsx";
import { Week } from "./routes/Week.tsx";
import { Prioritize } from "./routes/Prioritize.tsx";
import { Lists } from "./routes/Lists.tsx";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Today />,
      },
      {
        path: "week",
        element: <Week />,
      },
      {
        path: "prioritize",
        element: <Prioritize />,
      },
      {
        path: "lists",
        element: <Lists />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
