const navItems = [
  { title: "H", href: "/" },
  { title: "A", href: "/about" },
  { title: "S", href: "/services" },
  { title: "C", href: "/contact" },
];

export const Nav = () => (
  <nav className="h-screen p-4 bg-nav-bg" aria-label="Main navigation">
    <ul className="flex flex-col gap-4 text-nav-text">
      {navItems.map((item) => (
        <li
          key={item.href}
          className="bg-nav-item-bg rounded-2xl shadow-md hover:shadow-lg transition-shadow"
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
