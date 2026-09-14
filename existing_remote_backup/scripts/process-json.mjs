import fs from 'fs/promises';
import path from 'path';
import he from 'he';
import { convert } from 'html-to-text';
import readingTime from 'reading-time';

const SOURCE_PATH = path.resolve('../backup-penakkal.com-8-14-2022/app/public/blog_export.json');
const OUTPUT_DIR = path.resolve('src/data');
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'articles.json');

function extractAuthor(content) {
  const match = content.match(/–\s*([^<]+)$/);
  if (match) {
    return match[1].trim();
  }
  return 'பேனாக்கல்';
}

function normalizeDate(dateStr) {
  if (!dateStr) return new Date('2020-01-01T00:00:00Z').toISOString();
  
  const regex = /^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2}):(\d{2})$/;
  const match = dateStr.match(regex);
  if (match) {
    const [, day, month, year, hours, minutes, seconds] = match;
    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}+05:30`).toISOString();
  }
  
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return new Date('2020-01-01T00:00:00Z').toISOString();
  return d.toISOString();
}

function sanitizeContent(html) {
  if (!html) return '';
  
  let cleaned = html;
  
  // 1. Strip WordPress shortcodes like [caption ...], [gallery], etc.
  cleaned = cleaned.replace(/\[\/?(caption|gallery|embed|playlist|audio|video).*?\]/g, '');
  
  // 2. Decode entities
  cleaned = he.decode(cleaned);
  
  // 3. Remove empty paragraphs and tracking pixels (1x1 images)
  cleaned = cleaned.replace(/<p>\s*<\/p>/g, '');
  cleaned = cleaned.replace(/<img[^>]*width=["']1["'][^>]*>/g, '');
  
  // 4. Rewrite image URLs from penakkal.local to local paths
  cleaned = cleaned.replace(/(src=["'])http:\/\/penakkal\.local\/wp-content\/uploads\/(.*?)["']/g, '$1/media/content/$2"');
  
  // 5. Wrap Arabic text in span (basic heuristic for Arabic unicode block)
  // Match contiguous blocks of Arabic characters, numbers, and spaces
  cleaned = cleaned.replace(/([\u0600-\u06FF\s0-9]{10,})/g, '<span dir="rtl" lang="ar" class="arabic-text">$1</span>');
  
  // 6. External links: target="_blank" rel="noopener noreferrer"
  cleaned = cleaned.replace(/<a (?!href=["'](\/|#|http:\/\/penakkal\.local|https:\/\/penakkal\.com))([^>]*)>/g, '<a $2 target="_blank" rel="noopener noreferrer">');
  
  // 7. Headings hierarchy: replace H1 with H2
  cleaned = cleaned.replace(/<h1(.*?)>(.*?)<\/h1>/gi, '<h2$1>$2</h2>');
  
  return cleaned;
}

function extractReferences(text) {
  const quranRefs = [];
  const hadithRefs = [];
  
  // Simple heuristics for quran refs e.g., (2:185) or குர்ஆன் 2:185
  const quranMatches = text.match(/குர்ஆன்\s*(\d+:\d+)/g) || [];
  quranMatches.forEach(m => quranRefs.push(m));
  
  // Simple heuristics for hadith refs
  const hadithMatches = text.match(/(புகாரி|முஸ்லிம்|திர்மிதி|அபூதாவூத்)\s*(\d+)/g) || [];
  hadithMatches.forEach(m => hadithRefs.push(m));
  
  return { quranRefs, hadithRefs };
}

async function run() {
  console.log('Processing JSON...');
  
  const rawData = await fs.readFile(SOURCE_PATH, 'utf-8');
  const articles = JSON.parse(rawData);
  
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  
  const processed = [];
  let skipped = 0;
  
  for (const article of articles) {
    if (!article.content) {
      skipped++;
      continue;
    }
    
    let title = he.decode(article.title || '');
    title = title.replace(/<\/?[^>]+(>|$)/g, '').trim();
    
    let slug = decodeURIComponent(article.slug || '');
    slug = slug.toLowerCase().replace(/\s+/g, '-');
    
    let excerpt = '';
    if (article.excerpt) {
      excerpt = he.decode(article.excerpt).replace(/<\/?[^>]+(>|$)/g, '').trim();
    } else {
      excerpt = convert(article.content, { wordwrap: 160 }).substring(0, 160).trim() + '...';
    }
    
    const plainTextForStats = convert(article.content, { wordwrap: false });
    const stats = readingTime(plainTextForStats, { wordsPerMinute: 200 });
    
    const sanitizedContent = sanitizeContent(article.content);
    const { quranRefs, hadithRefs } = extractReferences(plainTextForStats);
    
    processed.push({
      id: article.id,
      title,
      slug,
      content: sanitizedContent,
      excerpt,
      publishedAt: normalizeDate(article.published_date),
      updatedAt: normalizeDate(article.modified_date),
      author: extractAuthor(plainTextForStats),
      coverImage: article.featured_image ? `/media/covers/${slug}.webp` : null,
      coverSourceUrl: article.featured_image,
      readingTime: Math.ceil(stats.minutes),
      wordCount: stats.words,
      lang: plainTextForStats.match(/[\u0600-\u06FF]/) ? (plainTextForStats.match(/[\u0B80-\u0BFF]/) ? 'ta-ar' : 'ar') : 'ta',
      quranRefs,
      hadithRefs,
      featured: false,
    });
  }
  
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(processed, null, 2));
  console.log(`Processed ${processed.length} articles. Skipped ${skipped}.`);
}

run().catch(console.error);
