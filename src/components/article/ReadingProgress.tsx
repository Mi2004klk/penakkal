"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { SPRING } from "@/lib/motion";
import { useEffect, useState } from "react";

export default function ReadingProgress({ title }: { title?: string }) {
  const { scrollYProgress, scrollY } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: SPRING.stiffness,
    damping: SPRING.damping,
    restDelta: 0.001
  });
  // Use raw progress if reduced motion is preferred
  const progress = shouldReduceMotion ? scrollYProgress : scaleX;

  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    let ticking = false;
    return scrollY.on("change", (latest) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setShowTitle(prev => {
            const shouldShow = latest > 300;
            return prev !== shouldShow ? shouldShow : prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    });
  }, [scrollY]);

  return (
    <div className="fixed top-[var(--header-height)] left-0 right-0 z-progress h-1 md:h-1.5 bg-transparent">
      <motion.div
        className="h-full bg-moss origin-left"
        style={{ scaleX: progress }}
      />
      {/* Title bar that drops down on scroll */}
      {title && (
        <motion.div
          initial={{ y: shouldReduceMotion ? 0 : -50, opacity: 0 }}
          animate={{ y: showTitle || shouldReduceMotion ? 0 : -50, opacity: showTitle ? 1 : 0 }}
          className="absolute top-full left-0 right-0 bg-surface-card border-b border-border-default px-4 py-3 hidden md:flex items-center justify-center pointer-events-none shadow-card"
        >
          <span className="font-ui text-body-sm font-bold truncate max-w-2xl text-heading">{title}</span>
        </motion.div>
      )}
    </div>
  );
}
