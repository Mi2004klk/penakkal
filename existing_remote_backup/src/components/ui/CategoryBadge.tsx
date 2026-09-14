"use client";

import Link from "next/link";

interface CategoryBadgeProps {
  category: string;
  categoryTamil: string;
}

export default function CategoryBadge({ category, categoryTamil }: CategoryBadgeProps) {
  return (
    <Link 
      href={`/category/${category}`}
      className="inline-block px-3 py-1 bg-[color:var(--color-primary-green-light)] dark:bg-[color:var(--color-surface-alt)] text-[color:var(--color-primary-green-dark)] dark:text-[color:var(--color-lime-sprout)] text-[length:var(--text-body-sm)] font-bold rounded-[length:var(--radius-sm)] hover:bg-[color:var(--color-primary-green)] hover:text-[color:var(--color-surface-pure-white-card)] dark:hover:bg-[color:var(--color-lime-sprout)] dark:hover:text-[color:var(--color-forest-stage)] transition-colors font-[family-name:var(--font-ui)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary-green)]"
      onClick={(e) => e.stopPropagation()} // Prevent card click
    >
      {categoryTamil}
    </Link>
  );
}
