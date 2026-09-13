import Link from "next/link";
import { Book, Heart, History, Moon, Star, LucideIcon } from "lucide-react";

import { getNavCategories } from "@/lib/articles";

export default async function CategoryQuickLinks() {
  const navCategories = await getNavCategories();
  const iconMap: Record<string, { icon: LucideIcon, color: string }> = {
    "quran-tafsir": { icon: Book, color: "text-text-link" },
    "hadith": { icon: Star, color: "text-ember-coral" },
    "history": { icon: History, color: "text-text-link" },
    "spirituality": { icon: Heart, color: "text-ember-coral" },
    "fiqh": { icon: Moon, color: "text-text-link" },
    "seerah": { icon: Book, color: "text-text-link" },
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-2 snap-x hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
      {navCategories.map((cat) => {
        const fallback = { icon: Book, color: "text-text-link" };
        const { icon: Icon, color } = iconMap[cat.id] || fallback;
        return (
          <Link
            key={cat.id}
            href={`/category/${cat.id}`}
            className="flex-shrink-0 flex items-center gap-3 px-6 py-3 rounded-full bg-surface-card border border-border-default hover:border-moss transition-all snap-start group min-h-[44px] min-w-[44px]"
          >
            <div className={`p-1 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="font-ui font-bold text-body text-heading group-hover:text-text-link transition-colors">
              {cat.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
