import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumb({ category, categoryTamil, title }: { category: string, categoryTamil: string, title: string }) {
  const truncatedTitle = title.length > 30 ? title.substring(0, 30) + '...' : title;
  
  return (
    <nav aria-label="breadcrumb" className="flex items-center font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] text-[color:var(--color-muted-text)] mb-6 overflow-hidden whitespace-nowrap font-bold">
      <Link href="/" className="hover:text-[color:var(--color-moss)] dark:hover:text-[color:var(--color-lime-sprout)] flex items-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--color-moss)] rounded-sm">
        <Home className="w-4 h-4" />
      </Link>
      <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 opacity-50" />
      <Link href="/blog" className="hover:text-[color:var(--color-moss)] dark:hover:text-[color:var(--color-lime-sprout)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--color-moss)] rounded-sm">
        கட்டுரைகள்
      </Link>
      <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 opacity-50" />
      <Link href={`/category/${category}`} className="hover:text-[color:var(--color-moss)] dark:hover:text-[color:var(--color-lime-sprout)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--color-moss)] rounded-sm">
        {categoryTamil}
      </Link>
      <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0 opacity-50" />
      <span className="text-[color:var(--color-heading)] truncate" title={title}>
        {truncatedTitle}
      </span>
    </nav>
  );
}
