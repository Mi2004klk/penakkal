import { format } from "date-fns";
import { ta } from "date-fns/locale";

/**
 * Gets the first grapheme of a string, properly handling complex scripts like Tamil
 * where a single visual character (grapheme) might consist of multiple code points.
 */
export function getFirstGrapheme(str: string): string {
  if (!str) return "?";
  
  const trimmed = str.trim();
  if (!trimmed) return "?";
  
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('ta', { granularity: 'grapheme' });
    const segments = segmenter.segment(trimmed);
    for (const { segment } of segments) {
      return segment;
    }
  }
  
  return [...trimmed][0] ?? "?";
}

export function cleanAuthor(authorName: string | undefined | null): string {
  if (!authorName) return 'பேனாக்கல்';
  let cleaned = authorName.replace(/<\/?[^>]+(>|$)/g, ''); // strip HTML
  cleaned = cleaned.replace(/[\r\n*?:"<>|\\/]/g, ' ').replace(/\s+/g, ' ').trim();
  if (cleaned.length > 80) {
    cleaned = cleaned.substring(0, 80).replace(/\s\S*$/, '') + '...';
  }
  return cleaned || 'பேனாக்கல்';
}

/**
 * Formats a date string or Date object using the Tamil locale.
 * @param date The date to format
 * @param style "short" (e.g., "12 ஜன 2024") or "long" (e.g., "12 ஜனவரி 2024")
 */
export function formatDate(date: string | Date, style: "short" | "long" = "short"): string {
  if (!date) return "";
  const d = typeof date === 'string' ? new Date(date) : date;
  
  try {
    const pattern = style === "long" ? "dd MMMM yyyy" : "dd MMM yyyy";
    return format(d, pattern, { locale: ta });
  } catch (e) {
    return "";
  }
}

export function slugify(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\u0B80-\u0BFF]+/g, '-') // Allow Tamil block + english alphanumeric
    .replace(/(^-|-$)/g, '');
}

export function pluralizeTa(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
