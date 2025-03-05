import { Link } from "react-router";
import {
  Gear,
  List,
  Moon,
  SquaresFour,
  Strategy,
  Sun,
} from "@phosphor-icons/react";

const navItems = [
  { Icon: Sun, route: "/" },
  { Icon: Moon, route: "/review" },
  { Icon: Strategy, route: "/week" },
  { Icon: SquaresFour, route: "/prioritize" },
  { Icon: List, route: "/lists" },
  { Icon: Gear, route: "/settings", bottom: true },
];

export const Nav = () => (
  <nav
    className="bg-base-300 overflow-hidden h-screen p-4 w-24"
    aria-label="Main navigation"
  >
    <div className="flex flex-col gap-4 text-base-content h-full">
      {navItems.map((item) => (
        <div
          key={item.route}
          className={`bg-base-100 rounded-2xl shadow-md hover:shadow-lg transition-shadow ${
            item.bottom ? "mt-auto" : ""
          }`}
        >
          <Link
            to={item.route}
            className="flex items-center justify-center h-16 w-16"
          >
            {<item.Icon size={32} />}
          </Link>
        </div>
      ))}
    </div>
  </nav>
);
