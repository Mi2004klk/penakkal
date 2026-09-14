import fs from 'fs/promises';
import path from 'path';

const DATA_PATH = path.resolve('src/data/articles.json');
const OUTPUT_DIR = path.resolve('public');

async function run() {
  const rawData = await fs.readFile(DATA_PATH, 'utf-8');
  const articles = JSON.parse(rawData);
  
  const searchManifest = articles.map(a => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    categoryTamil: a.categoryTamil,
    tags: a.tags,
    readingTime: a.readingTime,
  }));
  
  const articlesMeta = articles.map(a => ({
    slug: a.slug,
    category: a.category,
    tags: a.tags,
    author: a.author,
    publishedAt: a.publishedAt,
  }));
  
  await fs.writeFile(path.join(OUTPUT_DIR, 'search-manifest.json'), JSON.stringify(searchManifest));
  await fs.writeFile(path.join(OUTPUT_DIR, 'articles-meta.json'), JSON.stringify(articlesMeta));
  
  console.log(`Generated search-manifest.json and articles-meta.json for ${articles.length} articles`);
}

run().catch(console.error);
