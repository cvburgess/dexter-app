type Task = {
  description?: string;
  priority: TaskPriority | null;
  status: TaskStatus;
  subtasks: Task[];
  title: string;
};

enum TaskPriority {
  IMPORTANT_AND_URGENT,
  IMPORTANT,
  URGENT,
  NEITHER,
}

enum TaskStatus {
  TODO,
  IN_PROGRESS,
  DONE,
  WONT_DO,
}

export const Card = (
  { description, priority, status, subtasks, title }: Task,
) => {
  return (
    <div className="bg-card-bg shadow-md rounded-lg p-4 m-4 w-sm">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-card-text mb-2">{description}</p>
      <p className="text-card-text">
        Status: {status} | Priority: {priority} | Subtasks: {subtasks.length}
      </p>
    </div>
  );
};
