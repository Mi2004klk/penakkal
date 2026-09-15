"use client";

import { Menu, Search, UserCircle, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function Topbar({ setSidebarOpen }: { setSidebarOpen: (val: boolean) => void }) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border-default bg-surface-card px-4 md:px-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 text-muted-text hover:text-heading hover:bg-surface-page rounded-buttons transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="hidden md:flex items-center text-sm font-ui text-muted-text border border-border-default rounded-buttons px-3 py-1.5 bg-surface-page">
          <Search className="w-4 h-4 mr-2" />
          <span>Search admin (⌘K)</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end mr-2">
          <span className="text-body-sm font-bold text-heading">{session?.user?.name || 'Admin'}</span>
          <span className="text-xs text-muted-text uppercase tracking-wider font-bold">{session?.user?.role || 'Role'}</span>
        </div>
        
        <button 
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="p-2 text-muted-text hover:text-semantic-error hover:bg-surface-page rounded-buttons transition-colors"
          title="Sign out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
