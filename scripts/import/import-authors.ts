import { prisma } from '../../src/lib/content/prisma';
import fs from 'fs/promises';
import path from 'path';

async function main() {
  console.log('Importing authors...');
  const metaPath = path.join(process.cwd(), 'src/data/articles-meta.json');
  const metaContent = await fs.readFile(metaPath, 'utf-8');
  const articlesMeta = JSON.parse(metaContent);

  const authors = new Map<string, string>();

  for (const meta of articlesMeta) {
    const slug = meta.authorSlug || (meta.author ? meta.author.toLowerCase().replace(/\s+/g, '-') : null);
    const name = meta.author;
    if (slug && name) {
      authors.set(slug, name);
    }
  }

  for (const [slug, name] of authors.entries()) {
    let normalizedName = name;
    if (name === 'பேனாக்கள்') normalizedName = 'பேனாக்கல்'; // Normalize brand spelling

    // Skip junk names > 60 chars or containing sentence punctuation
    if (normalizedName.length > 60 || /[.!?]/.test(normalizedName)) {
      console.warn(`Skipping junk author: ${normalizedName}`);
      continue;
    }

    await prisma.author.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        nameTamil: normalizedName,
      },
    });
  }

  console.log(`Finished importing ${authors.size} authors.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
