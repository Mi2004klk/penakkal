import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const DATA_PATH = path.resolve('src/data/articles.json');
const WP_UPLOADS_DIR = path.resolve('../backup-penakkal.com-8-14-2022/public_html/wp-content/uploads');
const OUTPUT_DIR = path.resolve('public/media/covers');

async function ensureDir(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function run() {
  console.log('Processing media...');
  const rawData = await fs.readFile(DATA_PATH, 'utf-8');
  const articles = JSON.parse(rawData);
  
  await ensureDir(OUTPUT_DIR);
  
  let processedCount = 0;
  let missingCount = 0;
  
  for (const article of articles) {
    if (!article.coverSourceUrl) continue;
    
    // Extract the year/month/filename part from the URL
    // e.g. http://penakkal.local/wp-content/uploads/2016/10/hhe2830-migration-prophet.jpg
    const match = article.coverSourceUrl.match(/uploads\/(.*)$/);
    if (!match) {
      missingCount++;
      continue;
    }
    
    const localRelativePath = match[1];
    const sourceFilePath = path.join(WP_UPLOADS_DIR, localRelativePath);
    
    try {
      await fs.access(sourceFilePath);
      
      const outputPath = path.join(OUTPUT_DIR, `${article.slug}.webp`);
      
      // Generate WebP and LQIP
      const image = sharp(sourceFilePath);
      
      // Generate 20px blur placeholder
      const lqipBuffer = await image
        .clone()
        .resize(20)
        .webp({ quality: 20 })
        .toBuffer();
      
      article.coverBlur = `data:image/webp;base64,${lqipBuffer.toString('base64')}`;
      
      // Generate main cover (max width 1200)
      await image
        .resize(1200, null, { withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(outputPath);
        
      processedCount++;
    } catch (e) {
      console.warn(`Missing source image: ${sourceFilePath}`);
      article.coverImage = null; // Reset if missing
      missingCount++;
    }
  }
  
  await fs.writeFile(DATA_PATH, JSON.stringify(articles, null, 2));
  console.log(`Media processing complete! Processed: ${processedCount}, Missing: ${missingCount}`);
}

run().catch(console.error);
