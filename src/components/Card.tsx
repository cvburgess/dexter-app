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
  const colors = getColors(priority);

  return (
    <div className={`shadow-md rounded-lg p-4 m-4 w-sm ${colors.bg}`}>
      <h3 className={`text-lg font-semibold mb-2 ${colors.text}`}>
        {title}
      </h3>
      <p className={`mb-2 ${colors.text}`}>{description}</p>
      <p className={colors.text}>
        Status: {status} | Priority: {priority} | Subtasks: {subtasks.length}
      </p>
    </div>
  );
};

const getColors = (priority: TaskPriority | null) => {
  switch (priority) {
    case TaskPriority.IMPORTANT_AND_URGENT:
      return {
        bg: "bg-card-p0-bg",
        text: "text-card-p0-text",
      };

    case TaskPriority.IMPORTANT:
      return {
        bg: "bg-card-p1-bg",
        text: "text-card-p1-text",
      };

    case TaskPriority.URGENT:
      return {
        bg: "bg-card-p2-bg",
        text: "text-card-p2-text",
      };

    case TaskPriority.NEITHER:
      return {
        bg: "bg-card-p3-bg",
        text: "text-card-p3-text",
      };

    default:
      return {
        bg: "bg-card-none-bg",
        text: "text-card-none-text",
      };
  }
};
