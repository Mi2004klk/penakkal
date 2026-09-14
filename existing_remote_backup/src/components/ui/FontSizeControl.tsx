"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Type } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function FontSizeControl() {
  const [isOpen, setIsOpen] = useState(false);
  const fontSize = useStore((state) => state.fontSize);
  const setFontSize = useStore((state) => state.setFontSize);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        handleClose();
      }
    }
    
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        handleClose();
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClose]);

  const sizes = [
    { id: "sm", label: "சிறிய" },
    { id: "md", label: "இயல்பான" },
    { id: "lg", label: "பெரிய" },
    { id: "xl", label: "மிகப் பெரிய" },
  ] as const;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-[color:var(--color-fog)] dark:hover:bg-[color:var(--color-slate)] rounded-full transition-colors hidden md:block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]"
        aria-label="எழுத்துரு அளவு"
        aria-expanded={isOpen}
      >
        <Type className="w-5 h-5 text-[color:var(--color-muted-text)]" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-[color:var(--color-surface-card)] border border-[color:var(--color-border-default)] rounded-[length:var(--radius-cards)] w-40 z-50 overflow-hidden shadow-sm">
          {sizes.map((size) => (
            <button
              key={size.id}
              onClick={() => {
                setFontSize(size.id);
                handleClose();
              }}
              className={`w-full text-left px-4 py-3 transition-colors focus-visible:outline-none focus-visible:bg-[color:var(--color-fog)] dark:focus-visible:bg-[color:var(--color-slate)] ${
                fontSize === size.id 
                  ? "text-[color:var(--color-moss)] dark:text-[color:var(--color-lime-sprout)] font-bold bg-[color:var(--color-moss)]/10 dark:bg-[color:var(--color-lime-sprout)]/10" 
                  : "text-[color:var(--color-heading)] hover:bg-[color:var(--color-fog)] dark:hover:bg-[color:var(--color-slate)]"
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
