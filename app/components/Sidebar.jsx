// components/Sidebar.jsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Accept isOpen prop and an onClose function for mobile usage (optional but good practice)
export default function Sidebar({ user, isOpen, onClose }) {
  const pathname = usePathname();

  const navEmployee = [
    { href: "/dashboard/customers", label: "Customers" },
    { href: "/dashboard/admin/billing", label: "Billing" },
    { href: "/dashboard/admin/settings", label: "Settings" },
  ];

  const navAdmin = [
    ...navEmployee,
    { href: "/dashboard/admin", label: "Overview" },
    { href: "/dashboard/admin/users", label: "Users" },
  ];

  return (
    // Updated classes:
    // - Always render with specific mobile styles applied when isOpen is true.
    // - Use fixed positioning for mobile overlay.
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 p-6 z-30 transform transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:h-auto md:block md:w-64`}
    >
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {user.role === "admin" && "ISP Admin"}
          {user.role === "employee" && "Employee Panel"}
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          {user?.email}
        </div>
      </div>

      <nav className="space-y-2">
        {user.role === "admin" &&
          navAdmin.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              // Add onClick to close the sidebar automatically after clicking a link on mobile
              onClick={onClose}
              className={`block px-3 py-2 rounded ${
                pathname === n.href
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {n.label}
            </Link>
          ))}

        {user.role === "employee" &&
          navEmployee.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              // Add onClick to close the sidebar automatically after clicking a link on mobile
              onClick={onClose}
              className={`block px-3 py-2 rounded ${
                pathname === n.href
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {n.label}
            </Link>
          ))}
      </nav>
    </aside>
  );
}
