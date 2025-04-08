import { NavLink } from "react-router";
import {
  CalendarDots,
  Gear,
  ListHeart,
  Moon,
  SquaresFour,
  Sun,
  Trophy,
} from "@phosphor-icons/react";
import classNames from "classnames";

import { taskFilters, useTasks } from "../hooks/useTasks.tsx";
import { useFullScreen } from "../hooks/useFullscreen.tsx";
import { Tooltip } from "./Tooltip.tsx";

export const Nav = () => {
  return (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  );
};

const DesktopNav = () => {
  const isFullscreen = useFullScreen();

  return (
    <nav
      aria-label="Main navigation"
      className={classNames(
        "max-sm:hidden bg-base-200 h-screen w-19 pb-4",
        isFullscreen ? "pt-4" : "pt-10",
      )}
    >
      <div className="flex flex-col gap-4 text-base-content h-full items-center">
        {navItems.map((item) => (
          <Tooltip
            className={classNames({ "mt-auto": item.bottom })}
            key={item.route}
            position="right"
            text={item.title}
          >
            <NavLink
              className={({ isActive }) =>
                classNames(
                  "bg-base-100 rounded-box shadow-md hover:shadow-lg transition-shadow flex items-center justify-center size-12",
                  {
                    "bg-base-content/80 text-base-100": isActive,
                    indicator: true,
                  },
                )
              }
              to={item.route}
            >
              <Indicator route={item.route} />
              <item.Icon size={26} weight="light" />
            </NavLink>
          </Tooltip>
        ))}
      </div>
    </nav>
  );
};

const MobileNav = () => {
  return (
    <div className="dock sm:hidden bg-base-200 text-base-content/80">
      {navItems
        .filter((item) => item.showOnMobile)
        .map((item) => (
          <NavLink
            className={({ isActive }) =>
              classNames({ "font-medium text-primary": isActive })
            }
            key={item.route}
            to={item.route}
          >
            <item.Icon size={18} weight="fill" />
            <span className="dock-label">{item.title}</span>
          </NavLink>
        ))}
    </div>
  );
};

const navItems = [
  {
    title: "Day",
    Icon: Sun,
    route: "/",
    showOnMobile: true,
  },
  {
    title: "Review",
    Icon: Moon,
    route: "/review",
    showOnMobile: true,
  },
  {
    title: "Week",
    Icon: CalendarDots,
    route: "/week",
    showOnMobile: true,
  },
  {
    title: "Priorities",
    Icon: SquaresFour,
    route: "/priorities",
    showOnMobile: false,
  },
  {
    title: "Lists",
    Icon: ListHeart,
    route: "/lists",
    showOnMobile: false,
  },
  {
    title: "Goals",
    Icon: Trophy,
    route: "/goals",
    showOnMobile: false,
  },
  {
    title: "Settings",
    Icon: Gear,
    route: "/settings",
    bottom: true,
    showOnMobile: true,
  },
];

const Indicator = ({ route }: { route: string }) => {
  const [todaysTasks] = useTasks({
    filters: [...taskFilters.today, ...taskFilters.incomplete],
  });
  const [unprioritizedTasks] = useTasks({ filters: taskFilters.unprioritized });

  switch (route) {
    case "/":
      return <Badge count={todaysTasks.length} />;
    case "/priorities":
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
