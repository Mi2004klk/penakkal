import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

const PUBLIC_DIR = path.resolve('public');
const LOGO_PATH = path.join(PUBLIC_DIR, 'logo.png');

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {}
}

async function generateAssets() {
  await ensureDir(path.join(PUBLIC_DIR, 'covers'));

  // 1. Generate default.webp cover (1200x630)
  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 13, g: 84, b: 43, alpha: 1 } // --color-forest-stage
    }
  })
    .composite([
      { input: await sharp(LOGO_PATH).resize({ width: 600 }).toBuffer(), gravity: 'center' }
    ])
    .webp({ quality: 80 })
    .toFile(path.join(PUBLIC_DIR, 'covers', 'default.webp'));

  // 2. Generate PWA Icons
  const iconSizes = [192, 512];
  for (const size of iconSizes) {
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 13, g: 84, b: 43, alpha: 1 }
      }
    })
      .composite([
        { input: await sharp(LOGO_PATH).resize({ width: Math.floor(size * 0.7) }).toBuffer(), gravity: 'center' }
      ])
      .png()
      .toFile(path.join(PUBLIC_DIR, `icon-${size}x${size}.png`));
  }

  // 3. Maskable Icon (512x512 with safe zone)
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 13, g: 84, b: 43, alpha: 1 }
    }
  })
    .composite([
      { input: await sharp(LOGO_PATH).resize({ width: 300 }).toBuffer(), gravity: 'center' }
    ])
    .png()
    .toFile(path.join(PUBLIC_DIR, 'maskable-icon-512.png'));

  // 4. Apple Touch Icon (180x180)
  await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 13, g: 84, b: 43, alpha: 1 }
    }
  })
    .composite([
      { input: await sharp(LOGO_PATH).resize({ width: 120 }).toBuffer(), gravity: 'center' }
    ])
    .png()
    .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));

  // 5. Favicon 32x32
  await sharp({
    create: {
      width: 32,
      height: 32,
      channels: 4,
      background: { r: 13, g: 84, b: 43, alpha: 1 }
    }
  })
    .composite([
      { input: await sharp(LOGO_PATH).resize({ width: 24 }).toBuffer(), gravity: 'center' }
    ])
    .png()
    .toFile(path.join(PUBLIC_DIR, 'favicon-32.png'));
    
  // 6. logo-header.png
  await sharp(LOGO_PATH)
    .resize({ height: 128 })
    .png()
    .toFile(path.join(PUBLIC_DIR, 'logo-header.png'));

  // 7. og-default.png (1200x630)
  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 13, g: 84, b: 43, alpha: 1 }
    }
  })
    .composite([
      { input: await sharp(LOGO_PATH).resize({ width: 600 }).toBuffer(), gravity: 'center' }
    ])
    .png()
    .toFile(path.join(PUBLIC_DIR, 'og-default.png'));

  console.log("All assets generated successfully.");
}

generateAssets().catch(console.error);
