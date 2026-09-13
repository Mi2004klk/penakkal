import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const PUBLIC_DIR = path.resolve('public');

async function checkExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function run() {
  console.log('Building static assets...');

  const logoPath = path.join(PUBLIC_DIR, 'logo.png');
  const faviconPath = path.join(PUBLIC_DIR, 'favicon.png');

  if (await checkExists(logoPath)) {
    console.log('Generating logo variants...');
    // logo-512.png (max 512x512)
    await sharp(logoPath)
      .resize(512, 512, { fit: 'inside', withoutEnlargement: true })
      .png({ compressionLevel: 9 })
      .toFile(path.join(PUBLIC_DIR, 'logo-512.png'));

    // logo-header.png (~480x128)
    await sharp(logoPath)
      .resize(480, 128, { fit: 'inside', withoutEnlargement: true })
      .png({ compressionLevel: 9 })
      .toFile(path.join(PUBLIC_DIR, 'logo-header.png'));
  } else {
    console.warn('logo.png not found, skipping logo generation.');
  }

  if (await checkExists(faviconPath)) {
    console.log('Generating favicon variants...');
    // favicon-32.png
    await sharp(faviconPath)
      .resize(32, 32)
      .png({ compressionLevel: 9 })
      .toFile(path.join(PUBLIC_DIR, 'favicon-32.png'));
    
    // apple-touch-icon.png
    await sharp(faviconPath)
      .resize(180, 180)
      .png({ compressionLevel: 9 })
      .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));

    // icon-192x192.png
    await sharp(faviconPath)
      .resize(192, 192)
      .png({ compressionLevel: 9 })
      .toFile(path.join(PUBLIC_DIR, 'icon-192x192.png'));

    // icon-512x512.png
    await sharp(faviconPath)
      .resize(512, 512)
      .png({ compressionLevel: 9 })
      .toFile(path.join(PUBLIC_DIR, 'icon-512x512.png'));

    // maskable-icon-512.png (adding padding for maskable)
    await sharp(faviconPath)
      .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toFile(path.join(PUBLIC_DIR, 'maskable-icon-512.png'));
  } else {
    console.warn('favicon.png not found, skipping favicon generation.');
  }

  console.log('Finished generating static assets.');
}

run().catch(console.error);
