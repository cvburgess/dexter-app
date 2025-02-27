import "./App.css";
import { Card } from "./components/Card.tsx";

const tasks = [
  { id: "001-abc-000", status: 0, priority: 0 },
  { id: "002-abc-000", status: 1, priority: 1 },
  { id: "003-abc-000", status: 2, priority: 1 },
  { id: "004-abc-000", status: 3, priority: 3 },
  { id: "005-abc-000", status: 1, priority: null },
  { id: "006-abc-000", status: 0, priority: null },
];

function App() {
  return (
    <main className="">
      {tasks.map((task) => (
        <Card
          key={task.id}
          priority={task.priority}
          status={task.status}
        />
      ))}
    </main>
  );
}

export default App;
