// deno-lint-ignore-file no-unused-vars
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
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <StatusButton status={status} />
          <h3 className={`text-lg font-semibold ${colors.text}`}>
            {title}
          </h3>
        </div>
        <div className="flex items-center">
          <ListButton list="🐶" />
          <ListButton list="🐶" />
          <ListButton list="🐶" />
          <ListButton list="🐶" />
        </div>
      </div>
    </div>
  );
};

const StatusButton = ({ status }: { status: TaskStatus }) => (
  <button
    type="button"
    className="w-5 h-5 rounded-full border border-current/50 mr-2 hover:bg-opacity-20 hover:bg-current focus:outline-none focus:ring-2 focus:ring-offset-2"
  />
);

const ListButton = ({ list }: { list: string }) => (
  <button
    type="button"
    className="w-5 h-5 rounded-full border border-current/50 mr-2 hover:bg-opacity-20 hover:bg-current focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center text-xs"
  >
    {list}
  </button>
);

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
