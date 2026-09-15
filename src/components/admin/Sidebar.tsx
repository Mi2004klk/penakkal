"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  FileText,
  Image as ImageIcon,
  FolderTree,
  History
} from "lucide-react";
import { useSession } from "next-auth/react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Articles", href: "/admin/articles", icon: FileText },
  { name: "Media", href: "/admin/media", icon: ImageIcon },
  { name: "Categories", href: "/admin/categories", icon: FolderTree },
  { name: "Users", href: "/admin/users", icon: Users, roles: ["OWNER"] },
  { name: "Settings", href: "/admin/settings", icon: Settings, roles: ["OWNER", "ADMIN"] },
  { name: "Audit Log", href: "/admin/audit", icon: History, roles: ["OWNER", "ADMIN"] },
];

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role as string;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-true-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface-card border-r border-border-default transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center px-6 border-b border-border-default">
            <Link href="/admin" className="text-xl font-display font-bold text-heading">
              பேனாக்கள்
            </Link>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {navigation.map((item) => {
              if (item.roles && !item.roles.includes(role)) return null;
              
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-buttons font-ui text-body-sm transition-colors ${
                    isActive 
                      ? 'bg-moss/10 text-moss font-bold' 
                      : 'text-body-text hover:bg-surface-page hover:text-heading'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-moss' : 'text-muted-text'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
