const navItems = [
  { title: "H", href: "/" },
  { title: "A", href: "/about" },
  { title: "S", href: "/services" },
  { title: "C", href: "/contact" },
];

export const Nav = () => (
  <nav
    className="bg-base-300 overflow-hidden h-screen p-4 w-24"
    aria-label="Main navigation"
  >
    <ul className="flex flex-col gap-4 text-base-content">
      {navItems.map((item) => (
        <li
          key={item.href}
          className="bg-base-100 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
        >
          <a
            href={item.href}
            className="flex items-center justify-center h-16 w-16"
          >
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);
