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
  columnId: string;
};

export const QuickPlanner = ({
  baseFilters = [],
  columnId,
}: TQuickPlannerProps) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const options = makeFilterOptions(selectedFilter);
  const selected = options.find((option) => option.isSelected);
  const activeFilters = taskFilters?.[selectedFilter] ?? [];

  const [search, setSearch] = useState<string>("");
  const [filteredTasks] = useTasks({
    filters: [...baseFilters, ...activeFilters],
  });

  const searchTasks = (tasks: TTask[]) =>
    tasks.filter((task): boolean =>
      task.title.toLowerCase().includes(search.toLowerCase()),
    );

  return (
    <Column
      id={columnId}
      tasks={searchTasks(filteredTasks)}
      titleComponent={
        <div className="join w-standard">
          <ButtonWithPopover
            buttonClassName="min-w-20"
            buttonVariant="left-join"
            onChange={(id) => setSelectedFilter(id as string)}
            options={options}
            popoverId="quick-planner"
            variant="menu"
          >
            {selected.title}
          </ButtonWithPopover>

          <InputWithIcon
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search"
            type="text"
            value={search}
            wrapperClassName="join-item h-standard"
          >
            <MagnifyingGlass />
          </InputWithIcon>
        </div>
      }
    />
  );
};

type TQuickDrawerProps = TQuickPlannerProps & { isOpen: boolean };

export const QuickDrawer = ({ isOpen, ...props }: TQuickDrawerProps) => (
  <div
    className={classNames(
      "flex flex-col bg-base-100 border-l-2 border-base-200 overflow-x-hidden overflow-y-scroll flex-shrink-0 transition-all duration-300 ease-in-out no-scrollbar",
      isOpen ? "w-78 px-4" : "w-0",
    )}
  >
    <QuickPlanner {...props} />
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
