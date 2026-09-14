export function getHijriDate(date: Date = new Date()): string {
  // A simple approximation for UI purposes without heavy libraries.
  // Using Intl.DateTimeFormat with 'islamic' calendar
  return new Intl.DateTimeFormat('ta-IN', {
    calendar: 'islamic-umalqura',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}
