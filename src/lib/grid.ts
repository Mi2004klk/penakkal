export function getGridClass(itemCount: number): string {
  if (itemCount === 0) return '';
  if (itemCount === 1) return 'grid-cols-1 max-w-2xl mx-auto';
  if (itemCount === 2) return 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto';
  return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
}
