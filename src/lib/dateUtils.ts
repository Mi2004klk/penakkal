/**
 * Centralized date utility to ensure consistent formatting across schemas and feeds.
 */

/**
 * Returns an ISO 8601 string suitable for JSON-LD and Schema.org
 */
export function formatISODate(dateString: string | Date): string {
  return new Date(dateString).toISOString();
}

/**
 * Returns a UTC string suitable for RSS feeds
 */
export function formatRSSDate(dateString: string | Date): string {
  return new Date(dateString).toUTCString();
}
