import fs from 'fs/promises';
import path from 'path';
import he from 'he';
import { convert } from 'html-to-text';
import readingTime from 'reading-time';
import sanitizeHtml from 'sanitize-html';
import * as cheerio from 'cheerio';

const SOURCE_PATH = path.resolve('source-data/blog_export.json');
const OUTPUT_DIR = path.resolve('src/data');
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'articles.json');

function extractAuthor(content) {
  // Find a dash followed by some text, ending at newline or string end
  // The original regex /–\s*([^<]+)$/ grabbed everything to the end of the document if there was no newline
  const match = content.match(/–\s*(.+?)(?:\n|$)/);
  if (match) {
    let author = match[1].trim();
    // Strip HTML just in case
    author = author.replace(/<\/?[^>]+(>|$)/g, '');
    if (author.length > 80) {
      author = author.substring(0, 80).replace(/\s\S*$/, '');
    }
    return author || 'பேனாக்கல்';
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

  // 4b. Fix CRX-2 mangled WordPress images & apply CRX-3 rules via Cheerio
  const $ = cheerio.load(cleaned, null, false);
  
  $('img').each((i, el) => {
    const $img = $(el);
    let src = $img.attr('src') || '';
    
    // CRX-2: If src contains the mangled token, or the next siblings are the mangled text nodes
    if (src.includes('_<span dir=')) {
      src = src.split('_<span dir=')[0] + '.jpg';
      $img.attr('src', src);
    }
    
    // Sometimes cheerio parses the broken tag such that the next nodes are the stray string fragments.
    let next = el.next;
    while (next && (next.type === 'text' || next.type === 'tag')) {
      if (next.type === 'text' && /^\d+_$/.test(next.data)) {
        const toRemove = next;
        next = next.next;
        $(toRemove).remove();
        continue;
      }
      if (next.type === 'tag' && next.name === 'span' && next.attribs.dir === 'rtl') {
        const toRemove = next;
        next = next.next;
        $(toRemove).remove();
        continue;
      }
      if (next.type === 'text' && /^_n\.jpg/.test(next.data)) {
        const toRemove = next;
        next = next.next;
        $(toRemove).remove();
        
        // Also cleanup the src attribute of the image itself
        if (src.includes('__gda__=')) {
           $img.attr('src', src.split('__gda__=')[0] + '.jpg');
        }
        continue;
      }
      break;
    }
    
    // CRX-3 Rules: Add alt, lazy loading, and wrap in figure
    if (!$img.attr('alt')) {
      $img.attr('alt', ''); // decorative fallback
    }
    $img.attr('loading', 'lazy');
    $img.attr('decoding', 'async');
    
    // Wrap in figure if not already wrapped
    if ($img.parent().get(0)?.tagName !== 'figure') {
      $img.wrap('<figure class="article-figure"></figure>');
    }
  });

  // 5. Wrap Arabic text in span (basic heuristic for Arabic unicode block)
  // Iterate over all text nodes using Cheerio to avoid corrupting HTML attributes
  function processTextNodes(node) {
    if (node.type === 'text') {
      const text = node.data;
      if (/[\u0600-\u06FF]/.test(text)) {
        // If it contains Arabic, wrap contiguous blocks of Arabic/numbers/spaces
        const replaced = text.replace(/([\u0600-\u06FF\s0-9]{10,})/g, '<span dir="rtl" lang="ar" class="arabic-text">$1</span>');
        if (replaced !== text) {
           $(node).replaceWith(replaced);
        }
      }
    } else if (node.type === 'tag' && node.name !== 'span') {
      // recursively process children, skip already processed spans
      node.children.forEach(processTextNodes);
    }
  }
  
  $('body').children().each((i, el) => {
    processTextNodes(el);
  });
  
  // CRX-5b: Promote pseudo-headings (<p><strong>...</strong></p>) to <h2>
  $('p').each((i, el) => {
    const $p = $(el);
    const text = $p.text().trim();
    if (text.length > 0 && text.length <= 60) {
      // Check if it contains a strong or b tag whose text is exactly the paragraph's text
      const $strong = $p.find('strong, b');
      if ($strong.length > 0 && $strong.text().trim() === text) {
        $p.replaceWith(`<h2>${text}</h2>`);
      }
    }
  });

  // CRX-5b: Generate deterministic, collision-free index-based IDs
  let headingIndex = 1;
  $('h1, h2, h3').each((i, el) => {
    // Convert h1 to h2 per existing rule
    if (el.tagName === 'h1') {
      el.tagName = 'h2';
    }
    const $h = $(el);
    if (!$h.attr('id')) {
      $h.attr('id', `s-${headingIndex++}`);
    }
  });

  // CRX-6: YouTube iframes - strip fixed dimensions, add loading lazy
  $('iframe').each((i, el) => {
    const $iframe = $(el);
    $iframe.removeAttr('width');
    $iframe.removeAttr('height');
    $iframe.attr('loading', 'lazy');
    $iframe.addClass('embed-16x9');
  });
  
  cleaned = $.html();
  
  // 6. External links: target="_blank" rel="noopener noreferrer"
  cleaned = cleaned.replace(/<a (?!href=["'](\/|#|http:\/\/penakkal\.local|https:\/\/penakkal\.com))([^>]*)>/g, '<a $2 target="_blank" rel="noopener noreferrer">');
  
  // 9. Sanitize HTML
  cleaned = sanitizeHtml(cleaned, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'iframe', 'span', 'h2', 'h3']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      'img': ['src', 'alt', 'width', 'height', 'loading'],
      'iframe': ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen', 'loading'],
      'span': ['dir', 'lang', 'class'],
      'h2': ['id'],
      'h3': ['id'],
      'a': ['href', 'target', 'rel']
    },
    allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com']
  });
  
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
    title = title.replace(/<\/?[^>]+(>|$)/g, '').trim().replace(/\s{2,}/g, ' ');
    
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
