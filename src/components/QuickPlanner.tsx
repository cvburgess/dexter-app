import // @ts-types="react"
React, { useState } from "react";
import { CaretLeft, CaretRight, MagnifyingGlass } from "@phosphor-icons/react";
import classNames from "classnames";

import { TTask } from "../api/tasks.ts";
import { TQueryFilter } from "../api/applyFilters.ts";
import { taskFilters, useTasks } from "../hooks/useTasks.tsx";

import { Column } from "./Column.tsx";
import { InputWithIcon } from "./InputWithIcon.tsx";

type TQuickPlannerProps = {
  baseFilters?: TQueryFilter[];
};

export const QuickPlanner = ({ baseFilters = [] }: TQuickPlannerProps) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const filters = makeFilters(selectedFilter);
  const selected = filters.find((filter) => filter.isSelected)!;

  const [search, setSearch] = useState<string>("");
  const [filteredTasks] = useTasks([...baseFilters, ...selected.filters]);

  const searchTasks = (tasks: TTask[]) =>
    tasks.filter((task): boolean =>
      task.title.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <Drawer>
      <div className="overflow-x-hidden overflow-y-scroll bg-base-100 border-l-2 border-base-300 shadow-[-4px_0px_4px_0px_rgba(0,0,0,0.05)]">
        <div className="p-4 sticky top-0 z-10 bg-base-100">
          <div className="join max-w-70">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn join-item p-4 h-[51px] min-w-20 bg-base-300 border-none text-xs"
              >
                {selected.title}
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-70 p-2 shadow-sm text-base-content"
              >
                {filters.map((option, index) => (
                  <li key={index}>
                    <a
                      className={classNames("flex items-center gap-2", {
                        "bg-base-300": option.isSelected,
                      })}
                      onClick={() => setSelectedFilter(option.id)}
                    >
                      <span>{option.icon}</span>
                      <span>{option.title}</span>
                    </a>
                  </li>
                ))}
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
        </div>
        <div className="p-4 pt-0">
          <Column
            // cardSize="compact-h"
            id="scheduledFor:null"
            tasks={searchTasks(filteredTasks)}
          />
        </div>
      </div>
    </Drawer>
  );
};

const Drawer = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div
      className={classNames(
        "fixed top-0 bottom-0 right-0 z-100 flex transition-all duration-300 ease-in-out",
        { "translate-x-79": !isOpen },
      )}
    >
      <div
        className="self-center h-20 p-1 bg-base-100 text-xs rounded-l-[var(--radius-box)] z-101 flex items-center justify-center border-2 border-base-300 border-r-base-100 mr-[-2px] text-base-content/40"
        onClick={() => setIsOpen(!isOpen)}
      >
        <label className="swap swap-rotate">
          <CaretRight
            size={18}
            weight="bold"
            className={classNames(isOpen ? "swap-on" : "swap-off")}
          />
          <CaretLeft
            size={18}
            weight="bold"
            className={classNames(isOpen ? "swap-off" : "swap-on")}
          />
        </label>
      </div>
      {children}
    </div>
  );
};

const makeFilters = (selectedFilter: string) => [
  {
    id: "all",
    title: "All",
    icon: "📥",
    filters: [],
    isSelected: selectedFilter === "all",
  },
  {
    id: "unscheduled",
    title: "Unscheduled",
    icon: "📆",
    filters: taskFilters.unscheduled,
    isSelected: selectedFilter === "unscheduled",
  },
  {
    id: "overdue",
    title: "Overdue",
    icon: "⌛",
    filters: taskFilters.overdue,
    isSelected: selectedFilter === "overdue",
  },
  {
    id: "dueSoon",
    title: "Due Soon",
    icon: "⏳",
    filters: taskFilters.dueSoon,
    isSelected: selectedFilter === "dueSoon",
  },
];
