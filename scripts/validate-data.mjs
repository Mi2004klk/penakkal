import fs from 'fs/promises';
import path from 'path';

const DATA_PATH = path.resolve('src/data/articles.json');

async function run() {
  const rawData = await fs.readFile(DATA_PATH, 'utf-8');
  const articles = JSON.parse(rawData);
  
  let errors = 0;
  const coverImages = new Set();
  
  for (const article of articles) {
    if (!article.slug) {
      console.error(`Article ${article.id} missing slug`);
      errors++;
    } else if (/[^\x00-\x7F]/.test(article.slug)) {
      console.error(`Article ${article.id} has unicode slug: ${article.slug}`);
      errors++;
    }
    
    if (!article.publishedAt) {
      console.error(`Article ${article.slug} missing publishedAt`);
      errors++;
    }
    
    if (!article.author) {
      console.error(`Article ${article.slug} missing author`);
      errors++;
    }
    
    if (!article.category || article.category === 'undefined') {
      console.error(`Article ${article.slug} missing or undefined category`);
      errors++;
    }
    
    if (!article.coverImage) {
      console.error(`Article ${article.slug} missing coverImage`);
      errors++;
    } else {
      if (coverImages.has(article.coverImage)) {
        // Warning about duplicate covers
        // console.warn(`Article ${article.slug} has duplicate coverImage: ${article.coverImage}`);
      }
      coverImages.add(article.coverImage);
    }
    
    if (!article.tags || article.tags.length === 0) {
      console.error(`Article ${article.slug} missing tags`);
      errors++;
    }
  }
  
  if (errors > 0) {
    console.error(`\n❌ Validation failed with ${errors} errors.`);
    process.exit(1);
  } else {
    console.log(`✅ Validation passed for ${articles.length} articles.`);
  }
}

run().catch(err => {
  console.error('Validation error:', err);
  process.exit(1);
});
