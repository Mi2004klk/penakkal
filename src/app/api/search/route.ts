import { prisma } from "@/lib/content/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim() || '';
  const page = parseInt(searchParams.get('page') || '1');
  
  if (!q) {
    return Response.json({ results: [], page, total: 0 });
  }

  // Very basic search using Prisma for the scaffold, 
  // real implementation would use Postgres full text search or trigrams
  const results = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { excerpt: { contains: q, mode: 'insensitive' } },
      ]
    },
    take: 20,
    skip: (page - 1) * 20,
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
    }
  });

  const total = await prisma.article.count({
    where: {
      status: 'PUBLISHED',
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { excerpt: { contains: q, mode: 'insensitive' } },
      ]
    }
  });
  
  return Response.json({ results, page, total });
}
