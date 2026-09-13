"use client";

import { Search } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useIsMac } from "@/hooks/useIsMac";

export default function SidebarSearchButton() {
  const setIsSearchModalOpen = useStore((state) => state.setIsSearchModalOpen);
  const isMac = useIsMac();
  
  return (
    <button 
      className="w-full flex items-center justify-between px-4 py-3 bg-surface-page rounded-buttons text-body-text hover:text-text-link transition-colors border border-transparent hover:border-moss group"
      onClick={() => setIsSearchModalOpen(true)}
    >
      <span className="font-ui text-body-sm">கட்டுரைகளை தேடுங்கள்...</span>
      <div className="flex items-center gap-2">
        <kbd className="hidden lg:inline-block font-ui text-caption bg-surface-card px-2 py-1 rounded-buttons border border-border-default group-hover:border-moss/50 transition-colors">{isMac ? "⌘K" : "Ctrl+K"}</kbd>
        <Search className="w-4 h-4" />
      </div>
    </button>
  );
}
