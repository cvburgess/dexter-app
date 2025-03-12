import { useState } from "react";
import { CaretLeft, CaretRight, MagnifyingGlass } from "@phosphor-icons/react";

import { TTask } from "../api/tasks.ts";
import { taskFilters, useTasks } from "../hooks/useTasks.tsx";

import { Column } from "./Column.tsx";
import { InputWithIcon } from "./InputWithIcon.tsx";
import classNames from "classnames";

export const QuickPlanner = () => {
  const [search, setSearch] = useState<string>("");
  const [filteredTasks] = useTasks(taskFilters.unscheduled);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const searchTasks = (tasks: TTask[]) =>
    tasks.filter((task): boolean =>
      task.title.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div
      className={classNames(
        "fixed top-0 bottom-0 right-0 z-100 flex transition-all duration-300 ease-in-out",
        isOpen ? "" : "translate-x-79",
      )}
    >
      <div
        className="self-center h-20 p-1 bg-base-100 text-xs rounded-l-[var(--radius-box)] z-101 flex items-center justify-center border-2 border-base-300 border-r-base-100 mr-[-2px] text-base-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <label className="swap swap-rotate">
          <CaretRight
            size={18}
            weight="bold"
            className={classNames(isOpen ? "swap-off" : "swap-on")}
          />
          <CaretLeft
            size={18}
            weight="bold"
            className={classNames(isOpen ? "swap-on" : "swap-off")}
          />
        </label>
      </div>

      <div
        className={classNames(
          "p-4 overflow-x-hidden overflow-y-scroll bg-base-100 border-l-2 border-base-300",
          { "shadow-[-4px_0px_4px_0px_rgba(0,0,0,0.05)]": isOpen },
        )}
      >
        <div className="join max-w-70">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn join-item p-4 h-[51px] bg-base-300 border-none text-xs"
            >
              Unscheduled
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
              <li>
                <a className="bg-base-300">
                  <span>📆</span>
                  <span>Unscheduled</span>
                </a>
              </li>
              <li>
                <a>
                  <span>⌛</span>
                  <span>Overdue</span>
                </a>
              </li>
              <li>
                <a>
                  <span>⏳</span>
                  <span>Due soon</span>
                </a>
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
          tasks={searchTasks(filteredTasks)}
        />
      </div>
    </div>
  );
};
