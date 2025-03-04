import { SupabaseClient } from "@supabase/supabase-js";

export const getTasks = async (_supabase: SupabaseClient) => {
  // const { data, error } = await supabase
  //   .from("tasks")
  //   .select("*")
  //   .order("created_at");

  // if (error) throw error;
  // return data;
  return await Promise.resolve(tasks);
};

const tasks = [
  {
    id: "001-abc-000",
    status: 0,
    priority: 0,
    title: "Send resume to recruiter",
    dueOn: "2025-03-03",
    scheduledFor: "2025-03-03",
    subtasks: [],
  },
  {
    id: "002-abc-000",
    status: 1,
    priority: 1,
    title: "Prep talk for Friday",
    dueOn: "2025-03-07",
    scheduledFor: "2025-03-05",
    subtasks: [],
  },
  {
    id: "003-abc-000",
    description: "All files in Dropbox",
    dueOn: "2025-04-15",
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
    dueOn: "2025-03-01",
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
