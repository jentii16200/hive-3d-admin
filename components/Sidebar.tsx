// components/BaseLayout.tsx
"use client";

import { Banknote, Home, Menu, Settings, Shirt, Users, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", icon: Home, href: "/dashboard" },
    { name: "Users", icon: Users, href: "/users" },
    { name: "Designs", icon: Shirt, href: "/designs" },
    { name: "Orders", icon: Banknote, href: "/orders" },
    { name: "Settings", icon: Settings, href: "/settings" },
  ];

  // Hide sidebar on login page
  if (pathname === "/login") {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "w-64" : "w-20"
        } bg-yellow-300 text-black flex flex-col transition-all`}
      >
        <div className="flex items-center justify-between p-4 font-bold text-xl group">
          {isOpen ? (
            <Image
              src="/images/logo1.png"
              alt="logo"
              width={100}
              height={100}
            />
          ) : (
            <Image src="/images/logo1.png" alt="logo" width={50} height={50} />
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded hover:bg-yellow-400 ml-[16px]"
          >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </span>
          </button>
        </div>
        <nav className="flex-1 px-2">
          <ul className="space-y-2">
            {navItems.map(({ name, icon: Icon, href }) => (
              <li key={name}>
                <a
                  href={href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition ${
                    pathname === href
                      ? "bg-yellow-400 font-semibold"
                      : "hover:bg-yellow-300"
                  }`}
                >
                  <Icon size={20} />
                  {isOpen && <span>{name}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
