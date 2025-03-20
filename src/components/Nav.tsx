import { NavLink } from "react-router";
import {
  CalendarDots,
  Gear,
  List,
  Moon,
  SquaresFour,
  Sun,
} from "@phosphor-icons/react";
import classNames from "classnames";

import { taskFilters, useTasks } from "../hooks/useTasks.tsx";

const navItems = [
  { Icon: Sun, route: "/" },
  { Icon: Moon, route: "/review" },
  { Icon: CalendarDots, route: "/week" },
  { Icon: SquaresFour, route: "/prioritize" },
  { Icon: List, route: "/lists" },
  { Icon: Gear, route: "/settings", bottom: true },
];

export const Nav = () => {
  return (
    <nav
      className="bg-base-300 overflow-hidden h-screen w-19 pt-13.5 pb-4"
      aria-label="Main navigation"
    >
      <div className="flex flex-col gap-4 text-base-content h-full items-center">
        {navItems.map((item) => (
          <NavLink
            key={item.route}
            to={item.route}
            className={({ isActive }) =>
              classNames(
                "bg-base-100 rounded-box shadow-md hover:shadow-lg transition-shadow flex items-center justify-center size-12",
                {
                  "bg-base-content/80 text-base-100": isActive,
                  "mt-auto": item.bottom,
                  indicator: true,
                },
              )
            }
          >
            <Indicator route={item.route} />
            <item.Icon size={26} />
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

const Indicator = ({ route }: { route: string }) => {
  const [todaysTasks] = useTasks([
    ...taskFilters.today,
    ...taskFilters.incomplete,
  ]);
  const [unprioritizedTasks] = useTasks(taskFilters.unprioritized);

  switch (route) {
    case "/":
      return <Badge count={todaysTasks.length} />;
    case "/prioritize":
      return <Badge count={unprioritizedTasks.length} />;
    default:
      return null;
  }
};

const Badge = ({ count }: { count: number }) => {
  if (!count) return null;

  return (
    <span className="indicator-item indicator-middle indicator-center badge badge-warning w-0 rounded-box">
      {count}
    </span>
  );
};
