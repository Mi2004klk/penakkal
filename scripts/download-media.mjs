import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const DATA_PATH = path.resolve('src/data/articles.json');
const WP_UPLOADS_DIR = path.resolve('source-data/uploads');
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
      
      // Generate main cover (max width 1024)
      await image
        .resize(1024, null, { withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(outputPath);
        
      processedCount++;
    } catch (e) {
      console.warn(`Missing cover image: ${sourceFilePath}`);
      article.coverImage = null; // Reset if missing
      missingCount++;
    }
    
    // Process content images
    if (article.content) {
      // Find all image sources that were rewritten to /media/content/
      const imgRegex = /src=["']\/media\/content\/(.*?)["']/g;
      let match;
      while ((match = imgRegex.exec(article.content)) !== null) {
        const localRelativePath = match[1];
        const sourceFilePath = path.join(WP_UPLOADS_DIR, localRelativePath);
        const outputPath = path.join(path.resolve('public/media/content'), localRelativePath);
        
        try {
          await fs.access(sourceFilePath);
          await ensureDir(path.dirname(outputPath));
          
          // Generate WebP instead of just copying
          await sharp(sourceFilePath)
            .resize(800, null, { withoutEnlargement: true }) // content images can be smaller max-width
            .webp({ quality: 75 })
            .toFile(outputPath.replace(/\.[^/.]+$/, '.webp')); // change extension
            
          // We need to rewrite the JSON content to point to the .webp
          article.content = article.content.replace(match[1], match[1].replace(/\.[^/.]+$/, '.webp'));
          
        } catch (e) {
          console.warn(`Missing content image: ${sourceFilePath}`);
          // Remove the entire figure or img tag from the content
          // The image might be wrapped in a <figure class="article-figure">...<img>...</figure>
          // Since we are operating on raw HTML string here, let's use a regex to strip the figure that contains this image
          const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const safeUrl = escapeRegExp(match[1]);
          // Regex to match the figure containing the image, or just the image itself
          const tagRegex = new RegExp(`<figure[^>]*>.*?<img[^>]*src=["']\\/media\\/content\\/${safeUrl}["'][^>]*>.*?<\\/figure>|<img[^>]*src=["']\\/media\\/content\\/${safeUrl}["'][^>]*>`, 'g');
          article.content = article.content.replace(tagRegex, '');
        }
      }
    }
  }
  
  await fs.writeFile(DATA_PATH, JSON.stringify(articles, null, 2));
  console.log(`Media processing complete! Covers Processed: ${processedCount}, Missing Covers: ${missingCount}`);
}

run().catch(console.error);
