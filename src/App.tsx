import { DragDropProvider } from "@dnd-kit/react";

import "./app.css";
import { Card } from "./components/Card.tsx";
import { Nav } from "./components/Nav.tsx";
import { View } from "./components/View.tsx";
import { useTheme } from "./hooks/useTheme.ts";
import React from "react";

const List = ({ children }: { children: React.ReactNode }) => (
  <DragDropProvider>
    {children}
  </DragDropProvider>
);

const App = () => {
  const theme = useTheme();
  return (
    <main className="flex h-screen w-full" data-theme={theme}>
      <Nav />
      <View>
        <List>
          {tasks.map((task, index) => (
            <Card index={index} key={task.id} task={task} />
          ))}
        </List>
      </View>
    </main>
  );
};

const tasks = [
  {
    id: "001-abc-000",
    status: 0,
    priority: 0,
    title: "Send resume to recruiter",
    dueBy: "2025-03-03",
    scheduledFor: "2025-03-03",
    subtasks: [],
  },
  {
    id: "002-abc-000",
    status: 1,
    priority: 1,
    title: "Prep talk for Friday",
    dueBy: "2025-03-07",
    scheduledFor: "2025-03-05",
    subtasks: [],
  },
  {
    id: "003-abc-000",
    description: "All files in Dropbox",
    dueBy: "2025-04-15",
    scheduledFor: "2025-04-01",
    status: 2,
    priority: 2,
    title: "File taxes",
    subtasks: [],
  },
  {
    id: "004-abc-000",
    status: 3,
    priority: 3,
    title: "Take out the trash",
    dueBy: "2025-03-01",
    scheduledFor: "2025-03-03",
    subtasks: [],
  },
  {
    id: "005-abc-000",
    status: 1,
    priority: 2,
    title: "Build the app",
    subtasks: [],
  },
  {
    id: "006-abc-000",
    status: 0,
    priority: null,
    title: "Call an old friend",
    subtasks: [],
  },
  {
    id: "007-abc-000",
    description: "321-752-2222 x7062",
    status: 0,
    priority: 2,
    title: "Call bank about truck",
    subtasks: [],
  },
  {
    id: "008-abc-000",
    status: 0,
    priority: null,
    title: "Exchange air filter",
    subtasks: [],
  },
];

export default App;
