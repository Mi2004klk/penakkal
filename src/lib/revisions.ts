import { prisma } from "./content/prisma";

export async function saveRevision(articleId: string, html: string, title: string, userId: string, label?: string) {
  await prisma.articleRevision.create({
    data: {
      articleId,
      docJson: {}, // We can store the TipTap JSON here if we pass it, empty object for now
      docHtml: html,
      title,
      editedById: userId,
      label
    }
  });

  // Keep only last 20 revisions
  const revisions = await prisma.articleRevision.findMany({
    where: { articleId },
    orderBy: { createdAt: 'desc' },
    select: { id: true },
  });

  if (revisions.length > 20) {
    const toDelete = revisions.slice(20).map(r => r.id);
    await prisma.articleRevision.deleteMany({
      where: { id: { in: toDelete } }
    });
  }
}
