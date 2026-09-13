import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const PUBLIC_DIR = path.resolve('public');
const COVERS_DIR = path.join(PUBLIC_DIR, 'covers');
const MEDIA_DIR = path.join(PUBLIC_DIR, 'media');

async function processDirectory(directory) {
  try {
    await fs.access(directory);
  } catch (err) {
    console.log(`Directory not found: ${directory}`);
    return;
  }

  const files = await fs.readdir(directory);
  let totalSaved = 0;
  let processed = 0;

  for (const file of files) {
    if (!file.match(/\.(jpg|jpeg|png|webp)$/i)) continue;
    
    const filePath = path.join(directory, file);
    const stat = await fs.stat(filePath);
    const originalSize = stat.size;

    try {
      const image = sharp(filePath);
      const metadata = await image.metadata();

      let op = image;
      if (metadata.width && metadata.width > 1600) {
        op = op.resize(1600, null, { withoutEnlargement: true });
      }

      const tempPath = filePath + '.tmp';
      
      if (file.toLowerCase().endsWith('.webp')) {
        await op.webp({ quality: 72, effort: 4 }).toFile(tempPath);
      } else if (file.toLowerCase().endsWith('.png')) {
        await op.png({ quality: 72, compressionLevel: 8 }).toFile(tempPath);
      } else {
        await op.jpeg({ quality: 72, mozjpeg: true }).toFile(tempPath);
      }

      const newStat = await fs.stat(tempPath);
      
      if (newStat.size < originalSize) {
        await fs.rename(tempPath, filePath);
        totalSaved += (originalSize - newStat.size);
        processed++;
        console.log(`Optimized ${file}: ${(originalSize / 1024).toFixed(1)}KB -> ${(newStat.size / 1024).toFixed(1)}KB`);
      } else {
        await fs.unlink(tempPath);
        console.log(`Skipped ${file} (already optimal)`);
      }
    } catch (err) {
      console.error(`Error processing ${file}: ${err.message}`);
    }
  }

  if (processed > 0) {
    console.log(`\nCompleted ${path.basename(directory)}: Saved ${(totalSaved / 1024 / 1024).toFixed(2)} MB across ${processed} files.`);
  }
}

async function run() {
  console.log('Starting image corpus optimization...');
  await processDirectory(COVERS_DIR);
  await processDirectory(MEDIA_DIR);
  console.log('Done.');
}

run().catch(console.error);
