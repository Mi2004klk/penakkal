"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import HijriDate from "../ui/HijriDate";
import { useStore } from "@/store/useStore";

const popularCategories = [
  { name: "குர்ஆன் தப்சீர்", slug: "quran-tafsir" },
  { name: "ஹதீஸ்", slug: "hadith" },
  { name: "இஸ்லாமிய வரலாறு", slug: "history" },
  { name: "பிக்ஹ்", slug: "fiqh" },
  { name: "ஆன்மீகம்", slug: "spirituality" },
];

export default function Sidebar() {
  const setIsSearchModalOpen = useStore((state) => state.setIsSearchModalOpen);
  
  return (
    <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-8 sticky top-[calc(var(--header-height)+1rem)] h-fit">
      {/* Search Widget */}
      <div className="bg-[color:var(--color-surface-pure-white-card)] dark:bg-[color:var(--color-midnight-ink)] rounded-[length:var(--radius-cards)] p-5 border border-[color:var(--color-ash)] dark:border-[color:var(--color-slate)]">
        <h3 className="font-[family-name:var(--font-display)] font-bold text-[length:var(--text-subheading)] mb-4 text-[color:var(--color-true-black)] dark:text-[color:var(--color-cream-paper)]">தேடுங்கள்</h3>
        <button 
          className="w-full flex items-center justify-between px-4 py-3 bg-[color:var(--color-surface-cream-paper)] dark:bg-[color:var(--color-slate)] rounded-[length:var(--radius-buttons)] text-[color:var(--color-stone)] dark:text-[color:var(--color-ash)] hover:text-[color:var(--color-moss)] dark:hover:text-[color:var(--color-lime-sprout)] transition-colors border border-transparent hover:border-[color:var(--color-moss)] dark:hover:border-[color:var(--color-lime-sprout)] group"
          onClick={() => setIsSearchModalOpen(true)}
        >
          <span className="font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)]">கட்டுரைகளை தேடுங்கள்...</span>
          <div className="flex items-center gap-2">
            <kbd className="hidden lg:inline-block font-[family-name:var(--font-ui)] text-[10px] bg-[color:var(--color-surface-pure-white-card)] dark:bg-[color:var(--color-midnight-ink)] px-2 py-1 rounded-[8px] border border-[color:var(--color-ash)] dark:border-[color:var(--color-stone)] group-hover:border-[color:var(--color-moss)]/50 transition-colors">Ctrl K</kbd>
            <Search className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* Hijri Date Widget */}
      <div className="bg-gradient-to-br from-[color:var(--color-surface-pure-white-card)] to-[color:var(--color-surface-cream-paper)] dark:from-[color:var(--color-slate)] dark:to-[color:var(--color-midnight-ink)] rounded-[length:var(--radius-cards)] p-5 border border-[color:var(--color-moss)]/30 dark:border-[color:var(--color-stone)] text-center">
        <div className="text-[color:var(--color-ember-coral)] dark:text-[color:var(--color-lime-sprout)] mb-2">
          <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
        </div>
        <HijriDate className="font-[family-name:var(--font-display)] font-bold text-[color:var(--color-moss)] dark:text-[color:var(--color-lime-sprout)] text-[length:var(--text-subheading)]" />
      </div>

      {/* Popular Categories */}
      <div className="bg-[color:var(--color-surface-pure-white-card)] dark:bg-[color:var(--color-midnight-ink)] rounded-[length:var(--radius-cards)] p-5 border border-[color:var(--color-ash)] dark:border-[color:var(--color-slate)]">
        <h3 className="font-[family-name:var(--font-display)] font-bold text-[length:var(--text-subheading)] mb-4 flex items-center gap-2 text-[color:var(--color-true-black)] dark:text-[color:var(--color-cream-paper)]">
          <div className="w-1 h-5 bg-[color:var(--color-moss)] dark:bg-[color:var(--color-lime-sprout)] rounded-full"></div>
          பிரபலமான வகைகள்
        </h3>
        <ul className="flex flex-col gap-3">
          {popularCategories.map((cat) => (
            <li key={cat.slug}>
              <Link 
                href={`/category/${cat.slug}`}
                className="flex items-center justify-between group"
              >
                <span className="font-[family-name:var(--font-ui)] text-[color:var(--color-stone)] dark:text-[color:var(--color-ash)] group-hover:text-[color:var(--color-moss)] dark:group-hover:text-[color:var(--color-lime-sprout)] transition-colors text-[length:var(--text-body-sm)] font-medium">
                  {cat.name}
                </span>
                <span className="text-[color:var(--color-ash)] dark:text-[color:var(--color-stone)] group-hover:text-[color:var(--color-moss)] dark:group-hover:text-[color:var(--color-lime-sprout)] transition-colors">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/category" className="block mt-5 text-[length:var(--text-body-sm)] text-center text-[color:var(--color-moss)] dark:text-[color:var(--color-lime-sprout)] font-bold font-[family-name:var(--font-ui)] bg-[color:var(--color-fog)] dark:bg-[color:var(--color-slate)] py-2 rounded-[length:var(--radius-buttons)] hover:bg-[color:var(--color-surface-page)] dark:hover:bg-[color:var(--color-midnight-ink)] transition-colors border border-transparent hover:border-[color:var(--color-moss)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]">
          அனைத்து வகைகளையும் காண்க →
        </Link>
      </div>
    </aside>
  );
}
