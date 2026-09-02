import Link from "next/link";

interface TagChipProps {
  tag: string;
}

export default function TagChip({ tag }: TagChipProps) {
  return (
    <Link 
      href={`/tag/${encodeURIComponent(tag)}`}
      className="inline-block px-3 py-1 font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] font-bold bg-[color:var(--color-surface-page)] text-[color:var(--color-body-text)] rounded-[length:var(--radius-chips)] border border-[color:var(--color-border-default)] hover:text-[color:var(--color-moss)] dark:hover:text-[color:var(--color-lime-sprout)] hover:border-[color:var(--color-moss)] dark:hover:border-[color:var(--color-lime-sprout)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-moss)]"
    >
      #{tag}
    </Link>
  );
}
