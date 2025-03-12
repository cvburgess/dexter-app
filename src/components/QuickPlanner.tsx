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
      <div className="join max-w-70">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn join-item p-4 h-[51px] bg-base-300"
          >
            Filter
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
          >
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </div>

        <InputWithIcon
          // className="join-item"
          type="text"
          placeholder="Search"
          onChange={(event) => setSearch(event.target.value)}
          wrapperClassName="join-item"
          value={search}
        >
          <MagnifyingGlass />
        </InputWithIcon>
      </div>
      <Column
        // cardSize="compact-h"
        id="scheduledFor:null"
        tasks={searchTasks(unscheduledTasks)}
      />
    </div>
  );
};
