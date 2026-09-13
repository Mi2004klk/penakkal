"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Library, Bookmark, History } from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "முகப்பு", href: "/", icon: Home },
    { name: "தேடல்", href: "/search", icon: Search },
    { name: "பிரிவுகள்", href: "/category", icon: Library },
    { name: "சேமிப்பு", href: "/saved", icon: Bookmark },
    { name: "வரலாறு", href: "/history", icon: History },
  ];

  return (
    <nav aria-label="மொபைல் வழிசெலுத்தல்" className="md:hidden fixed bottom-0 left-0 right-0 z-nav bg-surface-card border-t border-border-default pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex flex-col items-center justify-center w-full h-full min-w-[44px] min-h-[44px] space-y-1 transition-colors rounded-buttons ${
                isActive 
                  ? "text-text-link " 
                  : "text-muted-text hover:text-heading"
              }`}
            >
              <div className="relative flex items-center justify-center">
                <item.icon className="w-6 h-6" aria-hidden="true" focusable="false" />
                {isActive && (
                  <item.icon className="w-6 h-6 absolute fill-current opacity-20" aria-hidden="true" focusable="false" />
                )}
                {isActive && (
                  <span className="absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full bg-moss"></span>
                )}
              </div>
              <span className="text-caption font-medium font-ui">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
