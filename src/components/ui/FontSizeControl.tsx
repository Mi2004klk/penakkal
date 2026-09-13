"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Type } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function FontSizeControl() {
  const [isOpen, setIsOpen] = useState(false);
  const fontSize = useStore((state) => state.fontSize);
  const setFontSize = useStore((state) => state.setFontSize);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleClose = useCallback((returnFocus = false) => {
    setIsOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        handleClose();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        handleClose(true);
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

  const handleRadioKeyDown = (e: React.KeyboardEvent) => {
    const radios = Array.from(
      dropdownRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]') ?? []
    );
    const currentIndex = radios.indexOf(document.activeElement as HTMLButtonElement);
    let nextIndex = -1;

    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % radios.length;
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      nextIndex = currentIndex === -1 ? radios.length - 1 : (currentIndex - 1 + radios.length) % radios.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = radios.length - 1;
    }

    if (nextIndex >= 0) {
      e.preventDefault();
      radios[nextIndex]?.focus();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 touch-target hover:bg-surface-cream-paper rounded-full transition-colors"
        aria-label="எழுத்துரு அளவு"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Type className="w-5 h-5 text-muted-text" aria-hidden="true" focusable="false" />
      </button>

      {isOpen && (
        <div
          role="radiogroup"
          aria-label="எழுத்துரு அளவுகள்"
          onKeyDown={handleRadioKeyDown}
          className="absolute top-full mt-2 right-0 bg-surface-card border border-border-default rounded-cards w-40 z-dropdown overflow-hidden shadow-dropdown"
        >
          {sizes.map((size) => (
            <button
              key={size.id}
              role="radio"
              aria-checked={fontSize === size.id}
              tabIndex={fontSize === size.id ? 0 : -1}
              onClick={() => {
                setFontSize(size.id);
                handleClose();
              }}
              className={`w-full text-left px-4 py-3 min-h-[44px] transition-colors focus-visible:outline-none focus-visible:bg-surface-cream-paper ${
                fontSize === size.id
                  ? "text-text-link  font-bold bg-moss/10 "
                  : "text-heading hover:bg-surface-cream-paper"
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
