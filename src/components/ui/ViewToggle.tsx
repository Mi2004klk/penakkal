"use client";

import { useStore } from "@/store/useStore";
import { Grid, LayoutList, List, AlignJustify } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";

export default function ViewToggle() {
  const viewMode = useStore((s) => s.viewMode);
  const setViewMode = useStore((s) => s.setViewMode);
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  useEffect(() => setMounted(true), []);

  const views = [
    { id: 'grid', icon: Grid, label: 'கட்டமைப்பு (Grid)' },
    { id: 'magazine', icon: LayoutList, label: 'இதழ் (Magazine)' },
    { id: 'list', icon: List, label: 'பட்டியல் (List)' },
    { id: 'compact', icon: AlignJustify, label: 'சிறிய (Compact)' },
  ] as const;

  return (
    <div className="flex items-center gap-1 bg-surface-pure-white-card p-1 rounded-buttons border border-border-default">
      {views.map((view) => {
        const isActive = mounted ? viewMode === view.id : view.id === 'grid';
        return (
          <button
            key={view.id}
            onClick={() => setViewMode(view.id)}
            className={`relative p-2 touch-target rounded-buttons transition-colors ${
              isActive ? "text-text-link " : "text-muted-text hover:text-heading "
            }`}
            title={view.label}
            aria-label={`காட்சி வகை: ${view.label}`}
            aria-pressed={isActive}
          >
            {isActive && (
              <motion.div
                layoutId="viewToggle"
                className="absolute inset-0 bg-surface-cream-paper rounded-buttons border border-border-default"
                transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <view.icon className="w-4 h-4 relative z-10" aria-hidden="true" focusable="false" />
          </button>
        );
      })}
    </div>
  );
}
