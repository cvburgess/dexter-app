import "./app.css";
import { Card } from "./components/Card.tsx";
import { Nav } from "./components/Nav.tsx";
import { View } from "./components/View.tsx";

const App = () => (
  <main className="flex h-screen w-full" data-theme="light">
    <Nav />
    <View className="flex-col">
      {tasks.map((task) => (
        <Card
          description={task.description}
          key={task.id}
          priority={task.priority}
          status={task.status}
          title={task.title}
          subtasks={task.subtasks}
        />
      ))}
    </View>
  </main>
);

const tasks = [
  {
    id: "001-abc-000",
    status: 0,
    priority: 0,
    title: "Send resume to recruiter",
    subtasks: [],
  },
  {
    id: "002-abc-000",
    status: 1,
    priority: 1,
    title: "Prep talk for Friday",
    subtasks: [],
  },
  {
    id: "003-abc-000",
    description: "All files in Dropbox",
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
    id: "006-abc-000",
    description: "321-752-2222 x7062",
    status: 0,
    priority: 2,
    title: "Call bank about truck",
    subtasks: [],
  },
  {
    id: "006-abc-000",
    status: 0,
    priority: null,
    title: "Exchange air filter",
    subtasks: [],
  },
];

export default App;
