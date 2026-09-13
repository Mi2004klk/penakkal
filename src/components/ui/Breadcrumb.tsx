import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumb({ category, categoryTamil, title }: { category: string, categoryTamil: string, title: string }) {
  return (
    <nav aria-label="வழிசெலுத்தல்" className="flex items-center font-ui text-body-sm text-muted-text mb-6 overflow-x-auto snap-x hide-scrollbar whitespace-nowrap font-bold min-w-0">
      <Link href="/" aria-label="முகப்பு" className="hover:text-text-link flex items-center transition-colors rounded-buttons flex-shrink-0 snap-start touch-target">
        <Home className="w-4 h-4" aria-hidden="true" focusable="false" />
      </Link>
      <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 opacity-50" aria-hidden="true" focusable="false" />
      <Link href="/blog" className="hover:text-text-link transition-colors rounded-buttons flex-shrink-0 snap-start">
        கட்டுரைகள்
      </Link>
      <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 opacity-50" aria-hidden="true" focusable="false" />
      <Link href={`/category/${category}`} className="hover:text-text-link transition-colors rounded-buttons flex-shrink-0 snap-start">
        {categoryTamil}
      </Link>
      <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 opacity-50" aria-hidden="true" focusable="false" />
      <span className="text-heading truncate min-w-0 snap-start" title={title} aria-current="page">
        {title}
      </span>
    </nav>
  );
}
