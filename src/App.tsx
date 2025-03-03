import { Outlet } from "react-router";

import "./app.css";
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

export default App;
