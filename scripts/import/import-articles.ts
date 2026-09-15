import { prisma } from '../../src/lib/content/prisma';
import fs from 'fs/promises';
import path from 'path';

async function main() {
  console.log('Importing articles...');
  const metaPath = path.join(process.cwd(), 'src/data/articles-meta.json');
  const contentDir = path.join(process.cwd(), 'src/data/articles-content');

  const metaContent = await fs.readFile(metaPath, 'utf-8');
  const articlesMeta = JSON.parse(metaContent);

  // We need to fetch the single OWNER user to assign createdBy
  const adminUser = await prisma.user.findFirst();
  if (!adminUser) {
    throw new Error('No admin user found. Run import-settings first (or seed an admin user).');
  }

  for (const meta of articlesMeta) {
    let contentHtml = '';
    try {
      const contentFile = await fs.readFile(path.join(contentDir, `${meta.slug}.json`), 'utf-8');
      contentHtml = JSON.parse(contentFile).content;
    } catch (e) {
      console.warn(`Could not read content for slug: ${meta.slug}`);
    }

    // Find author
    let authorId = adminUser.id; // Fallback
    const authorSlug = meta.authorSlug || (meta.author ? meta.author.toLowerCase().replace(/\s+/g, '-') : null);
    if (authorSlug) {
      const author = await prisma.author.findUnique({ where: { slug: authorSlug } });
      if (author) authorId = author.id;
    }

    await prisma.article.upsert({
      where: { slug: meta.slug },
      update: {
        title: meta.title,
        excerpt: meta.excerpt,
        contentHtml,
        publishedAt: new Date(meta.publishedAt),
        readingTime: meta.readingTime,
        status: 'PUBLISHED',
      },
      create: {
        slug: meta.slug,
        title: meta.title,
        excerpt: meta.excerpt,
        contentHtml,
        publishedAt: new Date(meta.publishedAt),
        readingTime: meta.readingTime,
        status: 'PUBLISHED',
        authorId: authorId,
        createdById: adminUser.id,
      },
    });
  }
  
  console.log('Finished importing articles.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
