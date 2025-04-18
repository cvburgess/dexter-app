import { useState } from "react";
import {
  CalendarBlank,
  CalendarDots,
  HourglassLow,
  HourglassMedium,
  ListHeart,
  MagnifyingGlass,
  SquaresFour,
  Trophy,
} from "@phosphor-icons/react";
import classNames from "classnames";

import { ButtonWithPopover, TOption } from "./ButtonWithPopover.tsx";
import { Column, TGrouping } from "./Column.tsx";
import { InputWithIcon } from "./InputWithIcon.tsx";

import { useGoals } from "../hooks/useGoals.tsx";
import { useLists } from "../hooks/useLists.tsx";
import { taskFilters, useTasks } from "../hooks/useTasks.tsx";

import { TGoal } from "../api/goals.ts";
import { TList } from "../api/lists.ts";
import { ETaskPriority, TTask } from "../api/tasks.ts";
import { TQueryFilter } from "../api/applyFilters.ts";

type TQuickPlannerProps = {
  baseFilters?: TQueryFilter[];
  columnId: string;
};

export const QuickPlanner = ({
  baseFilters = [],
  columnId,
}: TQuickPlannerProps) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("none");
  const [selectedGroup, setSelectedGroup] = useState<string>("none");
  const [search, setSearch] = useState<string>("");

  const filterOptions = makeFilterOptions(selectedFilter);
  const filterTitle = filterOptions.find((option) => option.isSelected).title;
  const activeFilters = taskFilters?.[selectedFilter] ?? [];

  const groupOptions = makeGroupOptions(selectedGroup);
  const groupingTitle = groupOptions.find((option) => option.isSelected).title;

  const [goals] = useGoals();
  const [lists] = useLists();

  const groupings = makeGroupings({
    goals,
    lists,
  });
  const activeGrouping =
    groupings.find((group) => group.prop === selectedGroup) || undefined;

  const [filteredTasks] = useTasks({
    filters: [...baseFilters, ...activeFilters],
  });

  const searchTasks = (tasks: TTask[]) =>
    tasks.filter((task): boolean =>
      task.title.toLowerCase().includes(search.toLowerCase()),
    );

  return (
    <Column
      grouping={activeGrouping}
      id={columnId}
      tasks={searchTasks(filteredTasks)}
      titleComponent={
        <div className="flex flex-wrap gap-2">
          <ButtonWithPopover
            buttonClassName="btn w-full"
            buttonVariant="none"
            onChange={(id) => setSelectedFilter(id as string)}
            options={filterOptions}
            popoverId="quick-planner-filter"
            variant="menu"
            wrapperClassName="flex-1"
          >
            {filterTitle}
          </ButtonWithPopover>

          <ButtonWithPopover
            buttonClassName="btn w-full"
            buttonVariant="none"
            onChange={(id) => setSelectedGroup(id as string)}
            options={groupOptions}
            popoverId="quick-planner-group"
            variant="menu"
            wrapperClassName="flex-1"
          >
            {groupingTitle}
          </ButtonWithPopover>

          <InputWithIcon
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search"
            type="text"
            value={search}
            wrapperClassName="w-full"
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
    id: "none",
    icon: <span className="w-3" />,
    title: "No Filter",
    isSelected: selectedFilter === "none",
  },
  {
    id: "overdue",
    title: "Overdue",
    icon: <HourglassLow />,
    isSelected: selectedFilter === "overdue",
  },
  {
    id: "dueSoon",
    title: "Due Soon",
    icon: <HourglassMedium />,
    isSelected: selectedFilter === "dueSoon",
  },
  {
    id: "leftBehind",
    title: "Left Behind",
    icon: <CalendarDots />,
    isSelected: selectedFilter === "leftBehind",
  },
  {
    id: "unscheduled",
    title: "Unscheduled",
    icon: <CalendarBlank />,
    isSelected: selectedFilter === "unscheduled",
  },
];

const makeGroupOptions = (selectedGroup: string): TOption[] => [
  {
    id: "none",
    icon: <span className="w-3" />,
    title: "No Grouping",
    isSelected: selectedGroup === "none",
  },
  {
    id: "listId",
    title: "By List",
    icon: <ListHeart />,
    isSelected: selectedGroup === "listId",
  },
  {
    id: "priority",
    title: "By Priority",
    icon: <SquaresFour />,
    isSelected: selectedGroup === "priority",
  },
  {
    id: "goalId",
    title: "By Goal",
    icon: <Trophy />,
    isSelected: selectedGroup === "goalId",
  },
];

const makeGroupings = ({
  goals,
  lists,
}: {
  goals: TGoal[];
  lists: TList[];
}): TGrouping[] => [
  {
    prop: "goalId",
    options: goals.map((goal: TGoal) => ({
      id: goal.id,
      title: goal.title,
    })),
  },
  {
    prop: "listId",
    options: lists.map((list: TList) => ({
      id: list.id,
      title: list.title,
    })),
  },
  {
    prop: "priority",
    options: [
      { id: ETaskPriority.IMPORTANT_AND_URGENT, title: "Important & Urgent" },
      { id: ETaskPriority.URGENT, title: "Urgent" },
      { id: ETaskPriority.IMPORTANT, title: "Important" },
      { id: ETaskPriority.NEITHER, title: "Neither" },
      { id: ETaskPriority.UNPRIORITIZED, title: "Unprioritized" },
    ],
  },
];
