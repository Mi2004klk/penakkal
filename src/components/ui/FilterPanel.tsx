"use client";

import { Filter, X, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { Drawer } from "./Drawer";
import { Button } from "./Button";

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
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
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
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="right"
      aria-labelledby="filter-panel-title"
      className="w-full sm:w-80 border-l border-border-default flex flex-col"
    >
      <div className="p-5 border-b border-border-default flex justify-between items-center sticky top-0 bg-surface-pure-white-card z-10 flex-shrink-0">
              <h2 id="filter-panel-title" className="text-subheading font-bold flex items-center gap-2 text-heading">
                <Filter className="w-5 h-5 text-text-link" />
                வடிகட்டி
              </h2>
              <button onClick={onClose} aria-label="மூடு" className="p-2 bg-surface-page rounded-full text-muted-text hover:text-heading transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              <h3 className="font-bold mb-4 text-heading-md text-heading">வகைகள்</h3>
              <div className="space-y-3" role="group" aria-label="வகைகள்">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center justify-between cursor-pointer group p-1 -m-1 rounded-buttons focus-within:ring-2 focus-within:ring-moss focus-within:outline-none">
                    <div className="flex items-center gap-3 relative">
                      <input 
                        type="checkbox"
                        className="sr-only"
                        checked={localCats.includes(cat.id)}
                        onChange={() => toggleCat(cat.id)}
                        aria-label={cat.label}
                      />
                      <div className={`w-5 h-5 rounded-buttons flex items-center justify-center border transition-colors ${
                        localCats.includes(cat.id) 
                          ? "bg-moss border-moss text-pure-white" 
                          : "border-border-default group-hover:border-moss"
                      }`} aria-hidden="true">
                        {localCats.includes(cat.id) && <Check className="w-3 h-3" />}
                      </div>
                      <span className="text-body-text group-hover:text-heading transition-colors">{cat.label}</span>
                    </div>
                    <span className="text-xs bg-surface-page px-2 py-1 rounded-buttons text-muted-text font-medium">
                      {cat.count}
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-8">
                <Button 
                  onClick={handleApply}
                  className="w-full flex items-center justify-center gap-2"
                >
                  முடிவுகளை காட்டு {localCats.length > 0 && <span className="bg-pure-white/20 px-2 py-0.5 rounded-full text-xs">{localCats.length}</span>}
                </Button>
                {localCats.length > 0 && (
                  <Button 
                    onClick={handleClear}
                    variant="secondary"
                    className="w-full mt-3"
                  >
                    அனைத்தையும் அழி
                  </Button>
                )}
              </div>
            </div>
    </Drawer>
  );
}
