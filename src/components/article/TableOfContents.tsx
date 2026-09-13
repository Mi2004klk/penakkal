"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { List, X } from "lucide-react";
import { Drawer } from "../ui/Drawer";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ selector = ".prose-article" }: { selector?: string }) {
  const [items, setItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false); // For mobile
  const [mounted, setMounted] = useState(false);
  const headingElementsRef = useRef<Record<string, IntersectionObserverEntry>>({});

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    
    const scanElements = () => {
      const elements = Array.from(document.querySelectorAll(`${selector} h2, ${selector} h3`));
      if (elements.length === 0) return false;

      const tocItems: TOCItem[] = elements
        .filter(el => el.id)
        .map((el) => ({
          id: el.id,
          text: el.textContent || "",
          level: parseInt(el.tagName.replace("H", "")),
        }));

      setItems(tocItems);

      observer = new IntersectionObserver(
        (entries) => {
          // Update the state dictionary with new entries
          entries.forEach((entry) => {
            headingElementsRef.current[entry.target.id] = entry;
          });

          // Find all currently intersecting elements
          const visibleHeadings = tocItems.filter(
            (item) => headingElementsRef.current[item.id]?.isIntersecting
          );

          if (visibleHeadings.length > 0) {
            // If multiple headings are visible, pick the one closest to the top
            const closestToTop = visibleHeadings.reduce((prev, current) => {
              const prevRect = headingElementsRef.current[prev.id].boundingClientRect;
              const currentRect = headingElementsRef.current[current.id].boundingClientRect;
              return prevRect.top < currentRect.top ? prev : current;
            });
            setActiveId(closestToTop.id);
          }
        },
        { rootMargin: "-100px 0px -80% 0px" }
      );

      elements.forEach((el) => {
        headingElementsRef.current[el.id] = { isIntersecting: false, boundingClientRect: el.getBoundingClientRect() } as unknown as IntersectionObserverEntry;
        observer!.observe(el);
      });
      return true;
    };

    // Scan immediately
    const found = scanElements();
    
    // Fallback scan for dynamic content (like mdx/html mounting)
    let idleId: number;
    if (!found && typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = (window as Window & { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(() => {
        if (!observer) scanElements();
      });
    } else if (!found) {
      idleId = window.setTimeout(() => {
        if (!observer) scanElements();
      }, 500);
    }

    return () => {
      if (idleId && 'cancelIdleCallback' in window) {
        (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
      } else {
        clearTimeout(idleId);
      }
      if (observer) observer.disconnect();
    };
  }, [selector]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (items.length === 0) return null;

  // Render function (not a nested component) — a nested component type would
  // remount the list on every activeId change and destroy keyboard focus.
  const renderTocList = () => (
    <nav aria-label="உள்ளடக்கம்">
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: `${(item.level - 2) * 1}rem` }}
          >
            <a
              href={`#${item.id}`}
              aria-current={activeId === item.id ? "location" : undefined}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(item.id);
                if (el) {
                  window.history.replaceState(null, "", `#${item.id}`);
                  el.setAttribute("tabindex", "-1");
                  el.focus();
                  el.scrollIntoView({
                    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
                    block: 'start'
                  });
                }
                setIsOpen(false);
              }}
              className={`block font-ui text-body-sm border-l-2 pl-3 py-1 transition-colors ${
                activeId === item.id
                  ? "border-moss text-text-link   font-bold"
                  : "border-border-default text-body-text hover:border-moss hover:text-text-link  "
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar TOC */}
      <div className="hidden xl:block w-64 flex-shrink-0">
        <div className="sticky top-[calc(var(--header-height)+2rem)] p-5 bg-surface-card rounded-cards border border-border-default animate-fade-in-up">
          <h2 className="section-eyebrow mb-4">உள்ளடக்கம்</h2>
          {renderTocList()}
        </div>
      </div>

      {/* Mobile Floating TOC Button */}
      {mounted && document.getElementById('floating-dock') 
        ? createPortal(
            <button 
              className="xl:hidden p-3 bg-moss text-surface-page rounded-full shadow-dropdown pointer-events-auto transition-transform"
              onClick={() => setIsOpen(true)}
              aria-expanded={isOpen}
              aria-controls="toc-drawer"
              aria-label="உள்ளடக்கத்தைத் திற"
            >
              <List className="w-5 h-5" aria-hidden="true" focusable="false" />
            </button>,
            document.getElementById('floating-dock')!
          )
        : null}

      {/* Mobile TOC Drawer */}
      <Drawer
        id="toc-drawer"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        position="right"
        aria-label="உள்ளடக்க அட்டவணை"
        className="w-full sm:w-[400px] h-[70vh] sm:h-full sm:right-0 sm:left-auto"
      >
        <div className="flex justify-between items-center mb-6 border-b border-border-default pb-4">
                <h2 className="section-eyebrow">உள்ளடக்கம்</h2>
                <button onClick={() => setIsOpen(false)} aria-label="உள்ளடக்கத்தை மூடு" className="touch-target p-2 bg-surface-page rounded-full text-muted-text hover:text-heading transition-colors">
                  <X className="w-5 h-5" aria-hidden="true" focusable="false" />
                </button>
              </div>
        {renderTocList()}
      </Drawer>
    </>
  );
}
