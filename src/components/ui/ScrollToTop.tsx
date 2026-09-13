"use client";

import { useState } from "react";
import { useRafScroll } from "@/hooks/useRafScroll";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useRafScroll((scrollY) => {
    setIsVisible(scrollY > 300);
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? "auto" : "smooth"
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`p-3 rounded-full bg-moss text-pure-white   shadow-modal hover:shadow-halo transition-all group pointer-events-auto ${!isVisible ? 'opacity-0 invisible pointer-events-none scale-90' : 'opacity-100 visible scale-100'}`}
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      aria-label="மேலே செல்லவும்"
    >
      <ArrowUp className="w-6 h-6 transition-transform group-hover:-translate-y-1" aria-hidden="true" focusable="false" />
    </button>
  );
}
