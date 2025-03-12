import { useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";

import { TTask } from "../api/tasks.ts";
import { taskFilters, useTasks } from "../hooks/useTasks.tsx";

import { Column } from "./Column.tsx";
import { InputWithIcon } from "./InputWithIcon.tsx";

export const QuickPlanner = () => {
  const [search, setSearch] = useState<string>("");
  const [unscheduledTasks] = useTasks(taskFilters.unscheduled);

  const searchTasks = (tasks: TTask[]) =>
    tasks.filter((task): boolean =>
      task.title.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="fixed p-4 overflow-x-hidden overflow-y-scroll top-0 bottom-0 right-0 z-100 bg-base-100 shadow-[-8px_0px_8px_0px_rgba(0,0,0,0.1)]">
      <InputWithIcon
        type="text"
        placeholder="Search"
        onChange={(event) => setSearch(event.target.value)}
        value={search}
      >
        <MagnifyingGlass />
      </InputWithIcon>
      <Column
        // cardSize="compact-h"
        id="scheduledFor:null"
        tasks={searchTasks(unscheduledTasks)}
      />
    </div>
  );
};
