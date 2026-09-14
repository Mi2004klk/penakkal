"use client";

import { useStore } from "@/store/useStore";
import { Grid, LayoutList, List, AlignJustify } from "lucide-react";
import { motion } from "framer-motion";

export default function ViewToggle() {
  const { viewMode, setViewMode } = useStore();

  const views = [
    { id: 'grid', icon: Grid, label: 'Grid' },
    { id: 'magazine', icon: LayoutList, label: 'Magazine' },
    { id: 'list', icon: List, label: 'List' },
    { id: 'compact', icon: AlignJustify, label: 'Compact' },
  ] as const;

  return (
    <div className="flex items-center gap-1 bg-[color:var(--color-surface-pure-white-card)] dark:bg-[color:var(--color-midnight-ink)] p-1 rounded-[length:var(--radius-buttons)] border border-[color:var(--color-ash)] dark:border-[color:var(--color-slate)]">
      {views.map((view) => {
        const isActive = viewMode === view.id;
        return (
          <button
            key={view.id}
            onClick={() => setViewMode(view.id)}
            className={`relative p-2 rounded-md transition-colors ${
              isActive ? "text-[color:var(--color-moss)] dark:text-[color:var(--color-lime-sprout)]" : "text-[color:var(--color-stone)] hover:text-[color:var(--color-true-black)] dark:text-[color:var(--color-ash)] dark:hover:text-[color:var(--color-cream-paper)]"
            }`}
            title={view.label}
            aria-label={`View as ${view.label}`}
          >
            {isActive && (
              <motion.div
                layoutId="viewToggle"
                className="absolute inset-0 bg-[color:var(--color-surface-cream-paper)] dark:bg-[color:var(--color-slate)] rounded-md border border-[color:var(--color-ash)] dark:border-[color:var(--color-slate)]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <view.icon className="w-4 h-4 relative z-10" />
          </button>
        );
      })}
    </div>
  );
}
