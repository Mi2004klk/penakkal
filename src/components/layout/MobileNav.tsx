"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Home, Search, Library, Bookmark, History } from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "முகப்பு", href: "/", icon: Home },
    { name: "தேடல்", href: "/search", icon: Search },
    { name: "வகைகள்", href: "/category", icon: Library },
    { name: "சேமிப்பு", href: "/saved", icon: Bookmark },
    { name: "வரலாறு", href: "/history", icon: History },
  ];

  useEffect(() => {
    // Ensure body has padding to prevent content being hidden behind the fixed bottom nav
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      document.body.style.paddingBottom = "calc(4rem + env(safe-area-inset-bottom))";
    }
    
    const handleResize = () => {
      if (window.innerWidth < 768) {
        document.body.style.paddingBottom = "calc(4rem + env(safe-area-inset-bottom))";
      } else {
        document.body.style.paddingBottom = "";
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.paddingBottom = "";
    };
  }, []);

  return (
    <nav role="navigation" aria-label="மொபைல் வழிசெலுத்தல்" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[color:var(--color-surface-card)] border-t border-[color:var(--color-border-default)] pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center w-full h-full min-w-[44px] min-h-[44px] space-y-1 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)] ${
                isActive 
                  ? "text-[color:var(--color-moss)] dark:text-[color:var(--color-lime-sprout)]" 
                  : "text-[color:var(--color-muted-text)] hover:text-[color:var(--color-heading)]"
              }`}
            >
              <div className="relative flex items-center justify-center">
                <item.icon className="w-6 h-6" />
                {isActive && (
                  <item.icon className="w-6 h-6 absolute fill-current opacity-20" />
                )}
                {isActive && (
                  <span className="absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full bg-[color:var(--color-moss)] dark:bg-[color:var(--color-lime-sprout)]"></span>
                )}
              </div>
              <span className="text-[11px] font-medium font-[family-name:var(--font-ui)]">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
