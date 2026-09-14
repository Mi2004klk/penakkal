"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Moon, Sun, Monitor, Menu, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { usePathname } from "next/navigation";
import FontSizeControl from "../ui/FontSizeControl";
import SearchModal from "../search/SearchModal";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isMac, setIsMac] = useState(true); // Default to mac for SSR
  
  const pathname = usePathname();
  
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);
  const isSearchOpen = useStore((state) => state.isSearchModalOpen);
  const setIsSearchOpen = useStore((state) => state.setIsSearchModalOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsCategoryMenuOpen(false);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Detect OS for shortcut display
    if (typeof window !== "undefined") {
      setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <header
      className={`fixed top-0 w-full z-[var(--z-header)] transition-all duration-300 bg-[color:var(--color-surface-card)] border-b border-[color:var(--color-border-default)] ${
        isScrolled ? "shadow-sm" : "shadow-none"
      }`}
    >
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-[color:var(--color-surface-pure-white-card)] dark:focus:bg-[color:var(--color-midnight-ink)] focus:text-[color:var(--color-true-black)] dark:focus:text-[color:var(--color-cream-paper)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-moss)] font-[family-name:var(--font-ui)] font-normal shadow-[var(--shadow-modal)] rounded-br-[length:var(--radius-cards)]"
      >
        முக்கிய உள்ளடக்கத்திற்குச் செல்ல
      </a>
      <div className="container mx-auto px-4 max-w-[var(--page-max-width)] h-[var(--header-height)] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="பேனாக்கள் முகப்பு">
          <Image
            src="/logo.png"
            alt="பேனாக்கள் லோகோ"
            width={150}
            height={40}
            priority
            className="h-8 md:h-10 w-auto object-contain dark:brightness-0 dark:invert"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-[length:var(--text-body)] font-[family-name:var(--font-ui)] font-normal" aria-label="முக்கிய வழிசெலுத்தல்">
          <Link href="/" className={`text-[color:var(--color-heading)] hover:text-[color:var(--color-moss)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)] rounded-sm ${pathname === "/" ? "font-bold text-[color:var(--color-moss)]" : ""}`} aria-current={pathname === "/" ? "page" : undefined}>
            முகப்பு
          </Link>
          <Link href="/blog" className={`text-[color:var(--color-heading)] hover:text-[color:var(--color-moss)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)] rounded-sm ${pathname === "/blog" ? "font-bold text-[color:var(--color-moss)]" : ""}`} aria-current={pathname === "/blog" ? "page" : undefined}>
            கட்டுரைகள்
          </Link>
          <div 
            className="relative"
            onMouseEnter={() => setIsCategoryMenuOpen(true)}
            onMouseLeave={() => setIsCategoryMenuOpen(false)}
          >
            <button className="flex items-center gap-1 text-[color:var(--color-heading)] hover:text-[color:var(--color-moss)] transition-colors py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)] rounded-sm" aria-haspopup="true" aria-expanded={isCategoryMenuOpen}>
              வகைகள் <ChevronDown className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {isCategoryMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  style={{ willChange: "transform, opacity" }}
                  className="absolute top-full left-0 w-max min-w-[280px] bg-[color:var(--color-surface-card)] shadow-[var(--shadow-modal)] rounded-[length:var(--radius-cards)] border border-[color:var(--color-border-default)] p-4 grid grid-cols-2 gap-2 z-[60]"
                >
                  <Link href="/category/quran-tafsir" className="p-2 text-[color:var(--color-body-text)] hover:bg-[color:var(--color-surface-page)] dark:hover:bg-[color:var(--color-slate)] hover:text-[color:var(--color-moss)] rounded-[length:var(--radius-buttons)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]">குர்ஆன் தப்சீர்</Link>
                  <Link href="/category/hadith" className="p-2 text-[color:var(--color-body-text)] hover:bg-[color:var(--color-surface-page)] dark:hover:bg-[color:var(--color-slate)] hover:text-[color:var(--color-moss)] rounded-[length:var(--radius-buttons)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]">ஹதீஸ்</Link>
                  <Link href="/category/fiqh" className="p-2 text-[color:var(--color-body-text)] hover:bg-[color:var(--color-surface-page)] dark:hover:bg-[color:var(--color-slate)] hover:text-[color:var(--color-moss)] rounded-[length:var(--radius-buttons)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]">பிக்ஹ்</Link>
                  <Link href="/category/seerah" className="p-2 text-[color:var(--color-body-text)] hover:bg-[color:var(--color-surface-page)] dark:hover:bg-[color:var(--color-slate)] hover:text-[color:var(--color-moss)] rounded-[length:var(--radius-buttons)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]">சீரா</Link>
                  <Link href="/category/history" className="p-2 text-[color:var(--color-body-text)] hover:bg-[color:var(--color-surface-page)] dark:hover:bg-[color:var(--color-slate)] hover:text-[color:var(--color-moss)] rounded-[length:var(--radius-buttons)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]">வரலாறு</Link>
                  <Link href="/category/spirituality" className="p-2 text-[color:var(--color-body-text)] hover:bg-[color:var(--color-surface-page)] dark:hover:bg-[color:var(--color-slate)] hover:text-[color:var(--color-moss)] rounded-[length:var(--radius-buttons)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]">ஆன்மீகம்</Link>
                  <Link href="/category" className="p-2 text-[color:var(--color-moss)] hover:bg-[color:var(--color-surface-page)] dark:hover:bg-[color:var(--color-slate)] rounded-[length:var(--radius-buttons)] transition-colors col-span-2 text-center mt-2 border-t border-[color:var(--color-border-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]">அனைத்து வகைகளும் →</Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Link href="/about" className={`text-[color:var(--color-heading)] hover:text-[color:var(--color-moss)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)] rounded-sm ${pathname === "/about" ? "font-bold text-[color:var(--color-moss)]" : ""}`} aria-current={pathname === "/about" ? "page" : undefined}>
            பற்றி
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <FontSizeControl />
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 hover:bg-[color:var(--color-fog)] dark:hover:bg-[color:var(--color-slate)] rounded-full transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]"
            aria-label="தேடல் சாளரத்தைத் திற (Ctrl+K / ⌘K)"
          >
            <Search className="w-5 h-5 text-[color:var(--color-muted-text)]" />
            <span className="hidden lg:flex items-center justify-center bg-[color:var(--color-surface-page)] border border-[color:var(--color-border-default)] rounded px-1.5 py-0.5 text-[10px] font-bold text-[color:var(--color-muted-text)]">
              {isMac ? "⌘K" : "Ctrl+K"}
            </span>
          </button>
          <button onClick={toggleTheme} className="p-2 hover:bg-[color:var(--color-fog)] dark:hover:bg-[color:var(--color-slate)] rounded-full transition-colors hidden md:block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]" aria-label="தீம் மாற்றவும்">
            {theme === "light" ? (
              <Moon className="w-5 h-5 text-[color:var(--color-muted-text)]" />
            ) : theme === "dark" ? (
              <Sun className="w-5 h-5 text-[color:var(--color-muted-text)]" />
            ) : (
              <Monitor className="w-5 h-5 text-[color:var(--color-muted-text)]" />
            )}
          </button>
          
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-[color:var(--color-heading)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="மெனுவைத் திற"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] md:hidden"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              style={{ willChange: "transform, opacity" }}
              className="fixed inset-y-0 left-0 w-[80%] max-w-sm z-[100] bg-[color:var(--color-surface-card)] p-6 md:hidden shadow-[var(--shadow-modal)] flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="மொபைல் மெனு"
            >
              <div className="flex justify-between items-center mb-8">
                <Image
                  src="/logo.png"
                  alt="பேனாக்கள் லோகோ"
                  width={120}
                  height={32}
                  className="h-8 w-auto object-contain dark:invert"
                />
                <button onClick={() => setIsMobileMenuOpen(false)} aria-label="மெனுவை மூடு" className="p-2 -mr-2 rounded-full hover:bg-[color:var(--color-fog)] dark:hover:bg-[color:var(--color-slate)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]">
                  <X className="w-6 h-6 text-[color:var(--color-muted-text)]" />
                </button>
              </div>
              <nav className="flex flex-col gap-6 text-[length:var(--text-body)] font-[family-name:var(--font-ui)] font-normal flex-grow overflow-y-auto" aria-label="மொபைல் வழிசெலுத்தல்">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={`text-[color:var(--color-heading)] hover:text-[color:var(--color-moss)] transition-colors ${pathname === "/" ? "font-bold text-[color:var(--color-moss)]" : ""}`}>முகப்பு</Link>
                <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className={`text-[color:var(--color-heading)] hover:text-[color:var(--color-moss)] transition-colors ${pathname === "/blog" ? "font-bold text-[color:var(--color-moss)]" : ""}`}>கட்டுரைகள்</Link>
                
                <div className="pt-4 border-t border-[color:var(--color-border-subtle)]">
                  <span className="text-[length:var(--text-body-sm)] text-[color:var(--color-muted-text)] mb-4 block uppercase tracking-wider">வகைகள்</span>
                  <div className="flex flex-col gap-4 pl-4">
                    <Link href="/category/quran-tafsir" onClick={() => setIsMobileMenuOpen(false)} className="text-[color:var(--color-heading)] hover:text-[color:var(--color-moss)] transition-colors">குர்ஆன் தப்சீர்</Link>
                    <Link href="/category/hadith" onClick={() => setIsMobileMenuOpen(false)} className="text-[color:var(--color-heading)] hover:text-[color:var(--color-moss)] transition-colors">ஹதீஸ்</Link>
                    <Link href="/category/fiqh" onClick={() => setIsMobileMenuOpen(false)} className="text-[color:var(--color-heading)] hover:text-[color:var(--color-moss)] transition-colors">பிக்ஹ்</Link>
                    <Link href="/category/seerah" onClick={() => setIsMobileMenuOpen(false)} className="text-[color:var(--color-heading)] hover:text-[color:var(--color-moss)] transition-colors">சீரா</Link>
                    <Link href="/category/history" onClick={() => setIsMobileMenuOpen(false)} className="text-[color:var(--color-heading)] hover:text-[color:var(--color-moss)] transition-colors">வரலாறு</Link>
                    <Link href="/category/spirituality" onClick={() => setIsMobileMenuOpen(false)} className="text-[color:var(--color-heading)] hover:text-[color:var(--color-moss)] transition-colors">ஆன்மீகம்</Link>
                    <Link href="/category" onClick={() => setIsMobileMenuOpen(false)} className="text-[color:var(--color-moss)] hover:text-[color:var(--color-heading)] transition-colors pt-2">அனைத்து வகைகளும் →</Link>
                  </div>
                </div>

                <div className="pt-4 border-t border-[color:var(--color-border-subtle)]">
                  <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-[color:var(--color-heading)] hover:text-[color:var(--color-moss)] transition-colors">பற்றி</Link>
                </div>
              </nav>
              
              <div className="pt-6 border-t border-[color:var(--color-border-subtle)] flex items-center justify-between">
                <span className="text-[length:var(--text-body-sm)] text-[color:var(--color-heading)] font-bold">அமைப்புகள்</span>
                <div className="flex gap-2">
                  <FontSizeControl />
                  <button onClick={toggleTheme} className="p-3 bg-[color:var(--color-surface-page)] border border-[color:var(--color-border-default)] rounded-full hover:border-[color:var(--color-moss)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]" aria-label="தீம் மாற்றவும்">
                    {theme === "light" ? (
                      <Moon className="w-5 h-5 text-[color:var(--color-muted-text)]" />
                    ) : theme === "dark" ? (
                      <Sun className="w-5 h-5 text-[color:var(--color-muted-text)]" />
                    ) : (
                      <Monitor className="w-5 h-5 text-[color:var(--color-muted-text)]" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
