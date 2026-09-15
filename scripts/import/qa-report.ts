import { prisma } from '../../src/lib/content/prisma';

async function main() {
  console.log('Generating QA Report...');

  const articleCount = await prisma.article.count();
  const categoryCount = await prisma.category.count();
  const tagCount = await prisma.tag.count();
  const authorCount = await prisma.author.count();
  const mediaCount = await prisma.media.count();

  console.log('-----------------------------------');
  console.log('QA Report');
  console.log('-----------------------------------');
  console.log(`Articles:   ${articleCount}`);
  console.log(`Categories: ${categoryCount}`);
  console.log(`Tags:       ${tagCount}`);
  console.log(`Authors:    ${authorCount}`);
  console.log(`Media:      ${mediaCount}`);
  console.log('-----------------------------------');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
