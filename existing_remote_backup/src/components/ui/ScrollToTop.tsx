"use client";

import { useState, useEffect } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-24 right-6 md:bottom-6 lg:bottom-10 lg:right-10 p-3 rounded-full bg-[color:var(--color-moss)] text-white dark:bg-[color:var(--color-lime-sprout)] dark:text-[color:var(--color-forest-stage)] shadow-lg hover:shadow-[var(--shadow-halo)] hover:scale-110 transition-all z-40 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]"
      aria-label="முன்பக்கத்திற்கு செல்ல (Scroll to top)"
    >
      <svg className="w-6 h-6 transition-transform group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
}
