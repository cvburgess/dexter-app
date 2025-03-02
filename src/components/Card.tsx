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
    <div
      className={`shadow-md rounded-lg p-4 m-4 w-sm ${colors}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <StatusButton status={status} />
          <h3 className="text-lg font-semibold">
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

const StatusButton = (
  { status }: { status: TaskStatus },
) => (
  <button
    type="button"
    className="w-5 h-5 rounded-full border mr-2 focus:ring-2 focus:ring-offset-2 border-current/50 hover:bg-current/25"
  />
);

const ListButton = ({ list }: { list: string }) => (
  <button
    type="button"
    className="w-5 h-5 rounded-full border mr-2 focus:ring-2 focus:ring-offset-2 flex items-center justify-center text-xs border-current/50 hover:bg-current/25"
  >
    {list}
  </button>
);

const getColors = (priority: TaskPriority | null) => {
  switch (priority) {
    case TaskPriority.IMPORTANT_AND_URGENT:
      return "bg-warning/80 hover:bg-warning/90 text-warning-content";

    case TaskPriority.IMPORTANT:
      return "bg-info/80 hover:bg-info/90 text-info-content";

    case TaskPriority.URGENT:
      return "bg-error/80 hover:bg-error/90 text-error-content";

    case TaskPriority.NEITHER:
      return "bg-neutral/80 hover:bg-neutral/90 text-neutral-content";

    default:
      return "bg-base-100/80 hover:bg-base-100/90 text-base-content";
  }
};
