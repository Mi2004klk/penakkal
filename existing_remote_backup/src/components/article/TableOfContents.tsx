"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { List, X } from "lucide-react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ selector = ".prose" }: { selector?: string }) {
  const [items, setItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false); // For mobile

  useEffect(() => {
    // Wait for content to render
    const timer = setTimeout(() => {
      const elements = Array.from(document.querySelectorAll(`${selector} h2, ${selector} h3`));
      
      if (elements.length === 0) return;

      const tocItems: TOCItem[] = elements.map((el) => {
        if (!el.id) {
          // Generate ID if missing
          el.id = el.textContent?.trim().toLowerCase().replace(/\s+/g, '-') || `heading-${Math.random().toString(36).substr(2, 9)}`;
        }
        return {
          id: el.id,
          text: el.textContent || "",
          level: parseInt(el.tagName.replace("H", "")),
        };
      });

      setItems(tocItems);

      // Setup Intersection Observer
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        { rootMargin: "-100px 0% -80% 0%" }
      );

      elements.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }, 500);

    return () => clearTimeout(timer);
  }, [selector]);

  if (items.length === 0) return null;

  const TocList = () => (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li 
          key={item.id} 
          style={{ paddingLeft: `${(item.level - 2) * 1}rem` }}
        >
          <a
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              setIsOpen(false);
            }}
            className={`block font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] border-l-2 pl-3 py-1 transition-colors ${
              activeId === item.id 
                ? "border-[color:var(--color-moss)] text-[color:var(--color-moss)] dark:border-[color:var(--color-lime-sprout)] dark:text-[color:var(--color-lime-sprout)] font-bold" 
                : "border-[color:var(--color-border-default)] text-[color:var(--color-body-text)] hover:border-[color:var(--color-moss)] hover:text-[color:var(--color-moss)] dark:hover:border-[color:var(--color-lime-sprout)] dark:hover:text-[color:var(--color-lime-sprout)]"
            }`}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Desktop Sidebar TOC */}
      <div className="hidden xl:block w-64 flex-shrink-0">
        <div className="sticky top-[calc(var(--header-height)+2rem)] p-5 bg-[color:var(--color-surface-card)] rounded-[length:var(--radius-cards)] border border-[color:var(--color-border-default)]">
          <h3 className="font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] font-bold tracking-wider uppercase mb-4 text-[color:var(--color-heading)]">உள்ளடக்கம்</h3>
          <TocList />
        </div>
      </div>

      {/* Mobile Floating TOC Button */}
      <button 
        className="xl:hidden fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-4 z-40 p-3 bg-[color:var(--color-moss)] dark:bg-[color:var(--color-lime-sprout)] text-[color:var(--color-surface-page)] dark:text-[color:var(--color-midnight-ink)] rounded-full shadow-[var(--shadow-dropdown)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]"
        onClick={() => setIsOpen(true)}
        aria-label="உள்ளடக்கத்தைத் திற"
      >
        <List className="w-5 h-5" />
      </button>

      {/* Mobile TOC Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 xl:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-[color:var(--color-surface-card)] w-full max-h-[80vh] rounded-t-3xl overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6 border-b border-[color:var(--color-border-default)] pb-4">
                <h3 className="font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] font-bold tracking-wider uppercase text-[color:var(--color-heading)]">உள்ளடக்கம்</h3>
                <button onClick={() => setIsOpen(false)} aria-label="உள்ளடக்கத்தை மூடு" className="p-2 bg-[color:var(--color-surface-page)] rounded-full text-[color:var(--color-muted-text)] hover:text-[color:var(--color-heading)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <TocList />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
