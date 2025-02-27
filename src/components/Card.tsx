type Task = {
  priority: TaskPriority | null;
  status: TaskStatus;
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

export const Card = ({ priority, status }: Task) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 m-4 w-sm">
      <h3 className="text-lg font-semibold mb-2">Card Title</h3>
      <p className="text-gray-700">Status: {status} | Priority: {priority}</p>
    </div>
  );
};
