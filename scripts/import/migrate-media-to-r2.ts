import { prisma } from '../../src/lib/content/prisma';
import { R2StorageAdapter } from '../../src/lib/media/storage-r2';
import fs from 'fs/promises';
import path from 'path';

async function main() {
  console.log('Migrating local media to R2...');
  
  if (!process.env.R2_ACCOUNT_ID) {
    throw new Error('R2 credentials missing');
  }

  const storage = new R2StorageAdapter();
  const mediaDir = path.join(process.cwd(), 'public/media/covers');
  
  let count = 0;
  const files = await fs.readdir(mediaDir);
  
  for (const file of files) {
    if (!file.endsWith('.webp')) continue;
    
    const filePath = path.join(mediaDir, file);
    const buffer = await fs.readFile(filePath);
    
    const storageKey = `legacy/covers/${file}`;
    
    console.log(`Uploading ${storageKey}...`);
    await storage.put(storageKey, buffer, 'image/webp');
    count++;
  }
  
  console.log(`Successfully migrated ${count} media files to R2.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
