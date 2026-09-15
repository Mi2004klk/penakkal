import { prisma } from '../../src/lib/content/prisma';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

async function hashFile(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath);
  const hash = crypto.createHash('sha256');
  hash.update(content);
  return hash.digest('hex');
}

async function main() {
  console.log('Importing media inventory...');
  const mediaDir = path.join(process.cwd(), 'public/media/covers');
  
  try {
    const files = await fs.readdir(mediaDir);
    let count = 0;

    for (const file of files) {
      if (!file.endsWith('.webp')) continue;
      
      const filePath = path.join(mediaDir, file);
      const checksum = await hashFile(filePath);
      const stat = await fs.stat(filePath);

      await prisma.media.upsert({
        where: { checksum },
        update: {},
        create: {
          checksum,
          storageKey: `legacy/covers/${file}`,
          filename: file,
          originalName: file,
          mimeType: 'image/webp',
          size: stat.size,
          status: 'ACTIVE',
        },
      });
      count++;
    }
    console.log(`Finished importing ${count} media files.`);
  } catch (error) {
    console.warn('Could not read media directory, skipping media import.');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
