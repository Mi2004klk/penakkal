import Link from "next/link";
import { Book, Heart, History, Moon, Star } from "lucide-react";

export default function CategoryQuickLinks() {
  const categories = [
    { id: "quran-tafsir", label: "குர்ஆன்", icon: Book, color: "text-[color:var(--color-moss)]" },
    { id: "hadith", label: "ஹதீஸ்", icon: Star, color: "text-[color:var(--color-ember-coral)]" },
    { id: "history", label: "வரலாறு", icon: History, color: "text-[color:var(--color-moss)]" },
    { id: "spirituality", label: "ஆன்மீகம்", icon: Heart, color: "text-[color:var(--color-ember-coral)]" },
    { id: "fiqh", label: "பிக்ஹ்", icon: Moon, color: "text-[color:var(--color-moss)]" },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-2 snap-x hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
      {categories.map((cat) => {
        const Icon = cat.icon;
        return (
          <Link
            key={cat.id}
            href={`/category/${cat.id}`}
            className="flex-shrink-0 flex items-center gap-3 px-6 py-3 rounded-full bg-[color:var(--color-surface-card)] border border-[color:var(--color-border-default)] hover:border-[color:var(--color-moss)] transition-all snap-start group min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]"
          >
            <div className={`p-1 transition-transform group-hover:scale-110 ${cat.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="font-[family-name:var(--font-ui)] font-bold text-[length:var(--text-body)] text-[color:var(--color-heading)] group-hover:text-[color:var(--color-moss)] transition-colors">
              {cat.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
