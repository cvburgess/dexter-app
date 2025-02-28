import "./App.css";
import { Card } from "./components/Card.tsx";
import { Nav } from "./components/Nav.tsx";

const tasks = [
  {
    id: "001-abc-000",
    status: 0,
    priority: 0,
    title: "Complete first task",
    subtasks: [],
  },
  {
    id: "002-abc-000",
    status: 1,
    priority: 1,
    title: "Make another task",
    subtasks: [],
  },
  {
    id: "003-abc-000",
    description: "All files in Dropbox",
    status: 2,
    priority: 1,
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
    priority: null,
    title: "Build the app",
    subtasks: [],
  },
  {
    id: "006-abc-000",
    description: "Recruiter is Angela",
    status: 0,
    priority: null,
    title: "Submit resume",
    subtasks: [],
  },
];

function App() {
  return (
    <main className="flex">
      <Nav />
      <div>
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
      </div>
    </main>
  );
}

export default App;
