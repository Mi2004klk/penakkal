import { prisma } from '../../src/lib/content/prisma';
import fs from 'fs/promises';
import path from 'path';

async function main() {
  console.log('Importing taxonomy (categories and tags)...');
  const metaPath = path.join(process.cwd(), 'src/data/articles-meta.json');
  const metaContent = await fs.readFile(metaPath, 'utf-8');
  const articlesMeta = JSON.parse(metaContent);

  const categories = new Set<string>();
  const tags = new Set<string>();

  for (const meta of articlesMeta) {
    if (meta.category) categories.add(meta.category);
    if (meta.tags) {
      meta.tags.forEach((t: string) => tags.add(t));
    }
  }

  // Create Categories
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat },
      update: {},
      create: {
        slug: cat,
        nameTamil: cat, // Need proper mapping for nameTamil
      },
    });
  }

  // Create Tags
  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag },
      update: {},
      create: {
        slug: tag,
        name: tag,
      },
    });
  }

  console.log(`Finished importing ${categories.size} categories and ${tags.size} tags.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
