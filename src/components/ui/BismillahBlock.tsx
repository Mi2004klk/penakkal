"use client";

import { motion } from "framer-motion";

export default function BismillahBlock() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center justify-center my-8 text-center"
    >
      <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-[color:var(--color-border-default)] to-transparent mb-4"></div>
      <span className="font-[family-name:var(--font-quran)] text-[length:var(--text-display)] text-[color:var(--color-ember-coral)] leading-loose text-3xl md:text-4xl">
        بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
      </span>
      <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-[color:var(--color-border-default)] to-transparent mt-4"></div>
    </motion.div>
  );
}
