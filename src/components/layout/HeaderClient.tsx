"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Search, Moon, Sun, Monitor, Menu, ChevronDown, X, Bookmark, History } from "lucide-react";
import dynamic from "next/dynamic";
import { useStore } from "@/store/useStore";
import { usePathname } from "next/navigation";
import { useIsMac } from "@/hooks/useIsMac";
import FontSizeControl from "../ui/FontSizeControl";
import BrandMark from "../ui/BrandMark";
import { useRafScroll } from "@/hooks/useRafScroll";

const SearchModal = dynamic(() => import("../search/SearchModal"), { ssr: false });
const Drawer = dynamic(() => import("../ui/Drawer").then(mod => mod.Drawer), { ssr: false });
import { fetchManifest } from "@/hooks/useSearch";

export default function HeaderClient({ navCategories }: { navCategories: { id: string; name: string }[] }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const isMac = useIsMac();
  const [mounted, setMounted] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const categoryTriggerRef = useRef<HTMLButtonElement>(null);
  
  const pathname = usePathname();
  
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);
  const isSearchOpen = useStore((state) => state.isSearchModalOpen);
  const setIsSearchOpen = useStore((state) => state.setIsSearchModalOpen);

  useRafScroll((scrollY) => {
    setIsScrolled(scrollY > 20);
    
    // Hide header on scroll down, show on scroll up (only on mobile)
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      if (scrollY > lastScrollY.current + 10 && scrollY > 100) {
        setIsHidden(true);
      } else if (scrollY < lastScrollY.current - 10 || scrollY < 50) {
        setIsHidden(false);
      }
    } else {
      setIsHidden(false); // Never hide on desktop
    }
    lastScrollY.current = scrollY;
  });

  useEffect(() => {
    setMounted(true);
    
    // Idle prefetch search manifest
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => fetchManifest().catch(() => {}));
    } else {
      setTimeout(() => fetchManifest().catch(() => {}), 2000);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        useStore.getState().setIsSearchModalOpen(true);
      }
      if (e.key === "Escape") {
        if (!isCategoryMenuOpen) return;
        setIsCategoryMenuOpen(false);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen, isCategoryMenuOpen]);

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <header
      className={`fixed top-0 w-full z-[var(--z-nav)] transition-all duration-300 bg-surface-card border-b border-border-default ${
        isScrolled ? "shadow-card" : "shadow-none"
      } ${isHidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:z-drawer focus:p-4 focus:bg-surface-pure-white-card focus:text-heading focus:outline-none focus:ring-2 focus:ring-moss font-ui font-normal shadow-modal rounded-br-[length:var(--radius-cards)]"
      >
        முக்கிய உள்ளடக்கத்திற்குச் செல்ல
      </a>
      <div className="container mx-auto px-4 lg:px-8 max-w-[var(--page-max-width)] h-[var(--header-height)] flex items-center justify-between">
        <BrandMark variant="header" />

        <nav className="hidden md:flex items-center gap-8 text-body font-ui font-normal" aria-label="முக்கிய வழிசெலுத்தல்">
          <Link href="/" className={`text-heading hover:text-text-link transition-colors rounded-buttons ${pathname === "/" ? "font-bold text-text-link" : ""}`} aria-current={pathname === "/" ? "page" : undefined}>
            முகப்பு
          </Link>
          <Link href="/blog" className={`text-heading hover:text-text-link transition-colors rounded-buttons ${pathname === "/blog" ? "font-bold text-text-link" : ""}`} aria-current={pathname === "/blog" ? "page" : undefined}>
            கட்டுரைகள்
          </Link>
          <div 
            className="relative"
            onMouseEnter={() => {
              if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) setIsCategoryMenuOpen(true);
            }}
            onMouseLeave={() => {
              if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) setIsCategoryMenuOpen(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape' && isCategoryMenuOpen) {
                setIsCategoryMenuOpen(false);
                categoryTriggerRef.current?.focus();
                e.stopPropagation();
                return;
              }
              
              if (!isCategoryMenuOpen && e.key === 'ArrowDown' && e.target === categoryTriggerRef.current) {
                e.preventDefault();
                setIsCategoryMenuOpen(true);
                setTimeout(() => categoryMenuRef.current?.querySelector('a')?.focus(), 50);
                return;
              }
              
              if (isCategoryMenuOpen && categoryMenuRef.current) {
                const links = Array.from(categoryMenuRef.current.querySelectorAll('a'));
                const currentIndex = links.indexOf(document.activeElement as HTMLAnchorElement);
                
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  if (currentIndex === -1) links[0]?.focus();
                  else links[currentIndex < links.length - 1 ? currentIndex + 1 : 0]?.focus();
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  if (currentIndex === -1) links[links.length - 1]?.focus();
                  else links[currentIndex > 0 ? currentIndex - 1 : links.length - 1]?.focus();
                } else if (e.key === 'Home') {
                  e.preventDefault();
                  links[0]?.focus();
                } else if (e.key === 'End') {
                  e.preventDefault();
                  links[links.length - 1]?.focus();
                }
              }
            }}
          >
            <button 
              ref={categoryTriggerRef}
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              className="flex items-center gap-1 text-heading hover:text-text-link transition-colors py-2 rounded-buttons" 
              aria-haspopup="true" 
              aria-expanded={isCategoryMenuOpen}
              aria-controls="category-dropdown-menu"
            >
              வகைகள் <ChevronDown className="w-4 h-4" aria-hidden="true" focusable="false" />
            </button>
            <div
              id="category-dropdown-menu"
              ref={categoryMenuRef}
              className={`absolute top-full left-0 w-max min-w-[280px] bg-surface-card shadow-modal rounded-cards border border-border-default p-4 grid grid-cols-2 gap-2 z-dropdown transition-all duration-200 origin-top-left ${
                isCategoryMenuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-2 invisible pointer-events-none"
              }`}
            >
              {navCategories.map((category: { id: string; name: string }) => (
                <Link key={category.id} href={`/category/${category.id}`} onClick={() => setIsCategoryMenuOpen(false)} className="p-2 text-body-text hover:bg-surface-cream-paper hover:text-text-link rounded-buttons transition-colors">{category.name}</Link>
              ))}
              <Link href="/category" onClick={() => setIsCategoryMenuOpen(false)} className="p-2 text-text-link hover:bg-surface-cream-paper rounded-buttons transition-colors col-span-2 text-center mt-2 border-t border-border-subtle">அனைத்து வகைகளும் →</Link>
            </div>
          </div>
          <Link href="/about" className={`text-heading hover:text-text-link transition-colors rounded-buttons ${pathname === "/about" ? "font-bold text-text-link" : ""}`} aria-current={pathname === "/about" ? "page" : undefined}>
            பற்றி
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <FontSizeControl />
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 hover:bg-surface-cream-paper rounded-full transition-colors flex items-center gap-2"
            aria-label="தேடல் சாளரத்தைத் திற (Ctrl+K / ⌘K)"
          >
            <Search className="w-5 h-5 text-muted-text" aria-hidden="true" focusable="false" />
            <span className="hidden lg:flex items-center justify-center bg-surface-page border border-border-default rounded-buttons px-1.5 py-0.5 text-caption font-bold text-muted-text">
              {isMac ? "⌘K" : "Ctrl+K"}
            </span>
          </button>
          
          <Link href="/saved" className="hidden md:flex p-2 hover:bg-surface-cream-paper rounded-full transition-colors text-muted-text hover:text-text-link" aria-label="சேமித்தவை">
            <Bookmark className="w-5 h-5" aria-hidden="true" focusable="false" />
          </Link>
          <Link href="/history" className="hidden md:flex p-2 hover:bg-surface-cream-paper rounded-full transition-colors text-muted-text hover:text-text-link" aria-label="வரலாறு">
            <History className="w-5 h-5" aria-hidden="true" focusable="false" />
          </Link>
          <button onClick={toggleTheme} className="p-2 hover:bg-surface-cream-paper rounded-full transition-colors hidden md:block" aria-label={!mounted ? "தீம் மாற்றவும்" : theme === "light" ? "இருள் பயன்முறை" : theme === "dark" ? "கணினி அமைப்பு" : "ஒளிர் பயன்முறை"}>
            {!mounted ? (
              <Monitor className="w-5 h-5 text-muted-text" />
            ) : theme === "light" ? (
              <Moon className="w-5 h-5 text-muted-text" />
            ) : theme === "dark" ? (
              <Sun className="w-5 h-5 text-muted-text" />
            ) : (
              <Monitor className="w-5 h-5 text-muted-text" />
            )}
          </button>
          
          <button
            className="md:hidden p-2 text-heading"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="மெனுவைத் திற"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu className="w-6 h-6" aria-hidden="true" focusable="false" />
          </button>
        </div>
      </div>

      {mounted && (
        <Drawer
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          position="right"
          aria-label="மொபைல் மெனு"
          className="w-4/5 max-w-sm flex flex-col"
        >
          <div className="flex justify-between items-center mb-8">
            <BrandMark variant="drawer" onClick={() => setIsMobileMenuOpen(false)} />
            <button onClick={() => setIsMobileMenuOpen(false)} aria-label="மெனுவை மூடு" className="p-2 -mr-2 rounded-full hover:bg-surface-cream-paper transition-colors">
              <X className="w-6 h-6 text-muted-text" aria-hidden="true" focusable="false" />
            </button>
          </div>
          <nav className="flex flex-col gap-6 text-body font-ui font-normal flex-grow overflow-y-auto" aria-label="மொபைல் வழிசெலுத்தல்">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={`text-heading hover:text-text-link transition-colors ${pathname === "/" ? "font-bold text-text-link" : ""}`}>முகப்பு</Link>
            <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className={`text-heading hover:text-text-link transition-colors ${pathname === "/blog" ? "font-bold text-text-link" : ""}`}>கட்டுரைகள்</Link>
            
            <div className="pt-4 border-t border-border-subtle">
              <span className="text-body-sm text-muted-text mb-4 block">வகைகள்</span>
              <div className="flex flex-col gap-4 pl-4">
                {navCategories.map((cat: { id: string; name: string }) => (
                  <Link key={cat.id} href={`/category/${cat.id}`} onClick={() => setIsMobileMenuOpen(false)} className="text-heading hover:text-text-link transition-colors">{cat.name}</Link>
                ))}
                <Link href="/category" onClick={() => setIsMobileMenuOpen(false)} className="text-text-link hover:text-heading transition-colors pt-2">அனைத்து வகைகளும் →</Link>
              </div>
            </div>

            <div className="pt-4 border-t border-border-subtle">
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-heading hover:text-text-link transition-colors">பற்றி</Link>
            </div>
          </nav>
          
          <div className="pt-6 border-t border-border-subtle flex items-center justify-between">
            <span className="text-body-sm text-heading font-bold">அமைப்புகள்</span>
            <div className="flex gap-2">
              <FontSizeControl />
              <button onClick={toggleTheme} className="p-3 bg-surface-page border border-border-default rounded-full hover:border-moss transition-colors" aria-label={!mounted ? "தீம் மாற்றவும்" : theme === "light" ? "இருள் பயன்முறை" : theme === "dark" ? "கணினி அமைப்பு" : "ஒளிர் பயன்முறை"}>
                {theme === "light" ? (
                  <Moon className="w-5 h-5 text-muted-text" />
                ) : theme === "dark" ? (
                  <Sun className="w-5 h-5 text-muted-text" />
                ) : (
                  <Monitor className="w-5 h-5 text-muted-text" />
                )}
              </button>
            </div>
          </div>
        </Drawer>
      )}
      
      {mounted && (
        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      )}
    </header>
  );
}
