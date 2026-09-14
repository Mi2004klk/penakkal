"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, Check } from "lucide-react";
import { useState, useEffect } from "react";

interface CategoryCount {
  id: string;
  label: string;
  count: number;
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryCount[];
  selectedCats: string[];
  onApply: (cats: string[]) => void;
}

export default function FilterPanel({ isOpen, onClose, categories, selectedCats: initialCats, onApply }: FilterPanelProps) {
  const [localCats, setLocalCats] = useState<string[]>(initialCats);

  useEffect(() => {
    setLocalCats(initialCats);
  }, [initialCats, isOpen]);

  const toggleCat = (id: string) => {
    setLocalCats(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [id] // limit to single category for now
    );
  };

  const handleApply = () => {
    onApply(localCats);
    onClose();
  };

  const handleClear = () => {
    setLocalCats([]);
    onApply([]);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-80 bg-[color:var(--color-surface-pure-white-card)] dark:bg-[color:var(--color-midnight-ink)] z-50 border-l border-[color:var(--color-border-default)] overflow-y-auto"
          >
            <div className="p-5 border-b border-[color:var(--color-border-default)] flex justify-between items-center sticky top-0 bg-[color:var(--color-surface-card)] z-10">
              <h2 className="text-subheading font-bold flex items-center gap-2 text-[color:var(--color-heading)]">
                <Filter className="w-5 h-5 text-[color:var(--color-moss)]" />
                வடிகட்டி
              </h2>
              <button onClick={onClose} aria-label="Close" className="p-2 bg-[color:var(--color-surface-page)] rounded-full text-[color:var(--color-muted-text)] hover:text-[color:var(--color-heading)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              <h3 className="font-bold mb-4 text-[color:var(--color-heading)]">வகைகள்</h3>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center justify-between cursor-pointer group" onClick={() => toggleCat(cat.id)}>
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                        localCats.includes(cat.id) 
                          ? "bg-[color:var(--color-moss)] border-[color:var(--color-moss)] text-white" 
                          : "border-[color:var(--color-border-default)] group-hover:border-[color:var(--color-moss)]"
                      }`}>
                        {localCats.includes(cat.id) && <Check className="w-3 h-3" />}
                      </div>
                      <span className="text-[color:var(--color-body-text)] group-hover:text-[color:var(--color-heading)] transition-colors">{cat.label}</span>
                    </div>
                    <span className="text-xs bg-[color:var(--color-surface-page)] px-2 py-1 rounded text-[color:var(--color-muted-text)] font-medium">
                      {cat.count}
                    </span>
                  </label>
                ))}
              </div>

              {/* Apply Button */}
              <div className="mt-8">
                <button 
                  onClick={handleApply}
                  className="w-full py-3 bg-[color:var(--color-moss)] hover:bg-[color:var(--color-forest-stage)] text-[color:var(--color-surface-pure-white-card)] font-bold rounded-[length:var(--radius-buttons)] transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-lime-sprout)]"
                >
                  முடிவுகளை காட்டு {localCats.length > 0 && <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">1</span>}
                </button>
                {localCats.length > 0 && (
                  <button 
                    onClick={handleClear}
                    className="w-full mt-3 py-2 text-sm text-[color:var(--color-muted-text)] hover:text-[color:var(--color-moss)] transition-colors focus-visible:outline-none focus-visible:underline"
                  >
                    அனைத்தையும் அழி
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
