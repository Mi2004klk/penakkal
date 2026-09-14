"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function ReadingProgress({ title }: { title?: string }) {
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      if (latest > 300) {
        setShowTitle(true);
      } else {
        setShowTitle(false);
      }
    });
  }, [scrollY]);

  return (
    <div className="fixed top-[var(--header-height)] left-0 right-0 z-[49] h-1 md:h-1.5 bg-transparent">
      <motion.div
        className="h-full bg-[color:var(--color-moss)] origin-left"
        style={{ scaleX }}
      />
      {/* Title bar that drops down on scroll */}
      {title && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: showTitle ? 0 : -50, opacity: showTitle ? 1 : 0 }}
          className="absolute top-full left-0 right-0 bg-[color:var(--color-surface-card)] border-b border-[color:var(--color-border-default)] px-4 py-3 hidden md:flex items-center justify-center pointer-events-none shadow-sm"
        >
          <span className="font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] font-bold truncate max-w-2xl text-[color:var(--color-heading)]">{title}</span>
        </motion.div>
      )}
    </div>
  );
}
