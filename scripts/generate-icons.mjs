import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const LOGO_PATH = path.resolve('public/logo.png');
const PUBLIC_DIR = path.resolve('public');

async function generateIcons() {
  console.log('Generating PWA icons and favicons...');
  try {
    await fs.access(LOGO_PATH);
  } catch (err) {
    console.error(`Source logo not found at ${LOGO_PATH}`);
    process.exit(1);
  }

  const sizes = [
    { name: 'favicon-32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'icon-192x192.png', size: 192 },
    { name: 'icon-512x512.png', size: 512 }
  ];

  for (const { name, size } of sizes) {
    await sharp(LOGO_PATH)
      .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(PUBLIC_DIR, name));
    console.log(`Generated ${name}`);
  }

  const manifest = {
    name: 'Penakkal',
    short_name: 'Penakkal',
    description: 'Islamic articles, history, and deep-reads in Tamil.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FBF8F1',
    theme_color: '#0A2E1F',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  };

  await fs.writeFile(
    path.join(PUBLIC_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('Generated manifest.json');
}

generateIcons().catch(console.error);
