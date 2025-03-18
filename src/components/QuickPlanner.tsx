import { useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import classNames from "classnames";

import { ButtonWithPopover, TOption } from "./ButtonWithPopover.tsx";
import { Column } from "./Column.tsx";
import { InputWithIcon } from "./InputWithIcon.tsx";

import { TTask } from "../api/tasks.ts";
import { TQueryFilter } from "../api/applyFilters.ts";
import { taskFilters, useTasks } from "../hooks/useTasks.tsx";

type TQuickPlannerProps = {
  baseFilters?: TQueryFilter[];
  className?: string;
};

export const QuickPlanner = ({
  baseFilters = [],
  className,
}: TQuickPlannerProps) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const options = makeFilterOptions(selectedFilter);
  const selected = options.find((option) => option.isSelected);
  const activeFilters = taskFilters?.[selectedFilter] ?? [];

  const [search, setSearch] = useState<string>("");
  const [filteredTasks] = useTasks([...baseFilters, ...activeFilters]);

  const searchTasks = (tasks: TTask[]) =>
    tasks.filter((task): boolean =>
      task.title.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div
      className={classNames(
        "overflow-x-hidden overflow-y-scroll no-scrollbar",
        className,
      )}
    >
      <div className="p-4 sticky top-0 z-10 bg-base-100">
        <div className="join max-w-70">
          <ButtonWithPopover
            buttonVariant="left-join"
            onChange={(id) => setSelectedFilter(id as string)}
            options={options}
            variant="menu"
          >
            {selected.title}
          </ButtonWithPopover>

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
      <div className="px-4">
        <Column
          // cardSize="compact-h"
          id="scheduledFor:null"
          tasks={searchTasks(filteredTasks)}
          topSpacing="top-0"
        />
      </div>
    </div>
  );
};

type TQuickDrawerProps = TQuickPlannerProps & {
  isOpen: boolean;
};

export const QuickDrawer = ({ isOpen, ...props }: TQuickDrawerProps) => (
  <div
    className={classNames(
      "bg-base-100 border-l-2 border-base-300 overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out flex-shrink-0",
      isOpen ? "w-[300px]" : "w-0 mr-[-300px]"
    )}
  >
    {isOpen && <QuickPlanner {...props} />}
  </div>
);

const makeFilterOptions = (selectedFilter: string): TOption[] => [
  {
    id: "all",
    title: "All",
    emoji: "📥",
    isSelected: selectedFilter === "all",
  },
  {
    id: "leftBehind",
    title: "Left Behind",
    emoji: "📆",
    isSelected: selectedFilter === "leftBehind",
  },
  {
    id: "unscheduled",
    title: "Unscheduled",
    emoji: "🗓️",
    isSelected: selectedFilter === "unscheduled",
  },
  {
    id: "overdue",
    title: "Overdue",
    emoji: "⌛",
    isSelected: selectedFilter === "overdue",
  },
  {
    id: "dueSoon",
    title: "Due Soon",
    emoji: "⏳",
    isSelected: selectedFilter === "dueSoon",
  },
];
