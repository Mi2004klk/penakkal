import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { htmlToText } from 'html-to-text';
import readingTime from 'reading-time';

const DATA_PATH = path.resolve('src/data/articles.json');
const PUBLIC_DIR = path.resolve('public');
const DATA_DIR = path.resolve('src/data');
const CONTENT_DIR = path.join(DATA_DIR, 'articles-content');

// Helper to transliterate Tamil to Roman (simple approximation for slugs)
const charMap = {
  'அ': 'a', 'ஆ': 'aa', 'இ': 'i', 'ஈ': 'ee', 'உ': 'u', 'ஊ': 'uu', 'எ': 'e', 'ஏ': 'ee', 'ஐ': 'ai', 'ஒ': 'o', 'ஓ': 'oo', 'ஔ': 'au',
  'க': 'k', 'ங': 'ng', 'ச': 's', 'ஞ': 'nj', 'ட': 't', 'ண': 'n', 'த': 'th', 'ந': 'n', 'ப': 'p', 'ம': 'm', 'ய': 'y', 'ர': 'r', 'ல': 'l', 'வ': 'v', 'ழ': 'zh', 'ள': 'l', 'ற': 'r', 'ன': 'n',
  'க்': 'k', 'ங்': 'ng', 'ச்': 's', 'ஞ்': 'nj', 'ட்': 't', 'ண்': 'n', 'த்': 'th', 'ந்': 'n', 'ப்': 'p', 'ம்': 'm', 'ய்': 'y', 'ர்': 'r', 'ல்': 'l', 'வ்': 'v', 'ழ்': 'zh', 'ள்': 'l', 'ற்': 'r', 'ன்': 'n',
  'ா': 'aa', 'ி': 'i', 'ீ': 'ee', 'ு': 'u', 'ூ': 'uu', 'ெ': 'e', 'ே': 'ee', 'ை': 'ai', 'ொ': 'o', 'ோ': 'oo', 'ௌ': 'au',
  'ஜ': 'j', 'ஷ': 'sh', 'ஸ': 's', 'ஹ': 'h', 'க்ஷ': 'ksh',
  'ஜ்': 'j', 'ஷ்': 'sh', 'ஸ்': 's', 'ஹ்': 'h',
};

function transliterate(str) {
  if (!/[^\x00-\x7F]/.test(str)) return str;
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    result += charMap[char] || char;
  }
  return result.replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase();
}

async function run() {
  const rawData = await fs.readFile(DATA_PATH, 'utf-8');
  let articles = JSON.parse(rawData);
  
  await fs.mkdir(CONTENT_DIR, { recursive: true });

  for (const a of articles) {
    // 1. Fix missing coverImage (id 7651)
    if (!a.coverImage || a.id === 7651) {
      a.coverImage = '/covers/default.webp';
    }

    // 2. Transliterate Unicode Slugs
    if (/[^\x00-\x7F]/.test(a.slug)) {
      a.slug = transliterate(a.slug);
    }
    
    // Clean up author
    if (a.author) {
      let cleaned = a.author.replace(/[\r\n*?:"<>|\\/]/g, ' ').replace(/\s+/g, ' ').trim();
      if (cleaned.length > 80) {
        cleaned = cleaned.substring(0, 80).replace(/\s\S*$/, '');
      }
      a.author = cleaned || 'பேனாக்கல்';
      a.authorTamil = cleaned || 'பேனாக்கல்';
      let aslug = transliterate(a.author);
      if (aslug.length > 50) aslug = aslug.substring(0, 50).replace(/-+$/, '');
      a.authorSlug = aslug;
      if (a.author === 'Abusheik Muhammed') {
          a.author = 'அபூஷேக் முஹம்மத்';
          a.authorTamil = 'அபூஷேக் முஹம்மத்';
          a.authorSlug = 'abusheik-muhammed';
      }
    }

    // 3. Generate coverBlur using sharp
    if (a.coverImage && a.coverImage.startsWith('/')) {
      const imagePath = path.join(PUBLIC_DIR, a.coverImage);
      try {
        const buffer = await fs.readFile(imagePath);
        const { data, info } = await sharp(buffer)
          .resize(10, 10, { fit: 'inside' })
          .webp({ quality: 20 })
          .toBuffer({ resolveWithObject: true });
        a.coverBlur = `data:image/webp;base64,${data.toString('base64')}`;
      } catch (err) {
        console.warn(`Could not generate blur for ${a.coverImage}: ${err.message}`);
      }
    }
    
    // 4. CRX-8: Recalculate metrics
    const textContent = htmlToText(a.content, { wordwrap: false });
    const stats = readingTime(textContent);
    a.wordCount = stats.words;
    a.readingTime = Math.max(1, Math.ceil(stats.minutes));

    // Handle empty excerpts
    if (!a.excerpt || a.excerpt === '...' || a.excerpt.trim() === '') {
      let fallback = textContent.replace(/\n+/g, ' ').trim();
      fallback = fallback.split('. ')[0]; // first sentence roughly
      a.excerpt = fallback ? fallback.substring(0, 150) + '...' : '';
    }

    // Handle empty bodies (media only articles)
    if (textContent.trim().length < 10) {
      a.content += '\n<p><em>இந்தக் கட்டுரை படங்கள்/காணொளி அடிப்படையிலானது.</em></p>';
    }

    // Write individual content file (include fields not in meta)
    const contentData = { 
      content: a.content,
      quranRefs: a.quranRefs,
      hadithRefs: a.hadithRefs,
      lang: a.lang,
      wordCount: a.wordCount,
      coverSourceUrl: a.coverSourceUrl
    };
    await fs.writeFile(path.join(CONTENT_DIR, `${a.slug}.json`), JSON.stringify(contentData));
  }
  
  // Save updated articles.json with new slugs, authors, blur hashes
  await fs.writeFile(DATA_PATH, JSON.stringify(articles, null, 2));

  const searchManifest = articles.map(a => ({
    s: a.slug,
    t: a.title,
    c: a.categoryTamil,
    tg: a.tags,
    r: a.readingTime,
  }));
  
  const articlesMeta = articles.map(a => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    publishedAt: a.publishedAt,
    updatedAt: a.updatedAt,
    author: a.author,
    authorTamil: a.authorTamil,
    authorSlug: a.authorSlug,
    authorBio: a.authorBio,
    coverImage: a.coverImage,
    coverBlur: a.coverBlur,
    readingTime: a.readingTime,
    category: a.category,
    categoryTamil: a.categoryTamil,
    tags: a.tags,
    featured: a.featured
  }));
  
  await fs.writeFile(path.join(PUBLIC_DIR, 'search-manifest.json'), JSON.stringify(searchManifest));
  await fs.writeFile(path.join(DATA_DIR, 'articles-meta.json'), JSON.stringify(articlesMeta));
  
  console.log(`Generated search-manifest.json, articles-meta.json, and ${articles.length} content files`);
}

run().catch(console.error);
