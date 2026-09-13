export function getHijriDate(date: Date = new Date()): string | null {
  try {
    const formatter = new Intl.DateTimeFormat('ta-IN', {
      calendar: 'islamic-umalqura',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    if (formatter.resolvedOptions().calendar !== 'islamic-umalqura') {
      return null;
    }

    let formatted = formatter.format(date);
    
    // Remove "AH" Latin suffix on Tamil output
    formatted = formatted.replace(/\s*AH/ig, '');

    return formatted.trim() + ' ஹிஜ்ரி';
  } catch (e) {
    // Fallback for older browsers (e.g. some Safari versions)
    return null;
  }
}
