"use server";

import { prisma } from "@/lib/content/prisma";
import { auth, requireRole } from "@/lib/auth";
import { withAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { saveRevision } from "@/lib/revisions";

export async function createArticle(data: { title: string }) {
  const session = await auth();
  requireRole(session?.user?.role as string, ["OWNER", "ADMIN", "EDITOR", "AUTHOR"]);

  const slug = slugify(data.title, { lower: true, strict: true }) + '-' + Math.random().toString(36).substring(2, 8);

  return withAudit(
    "article.create",
    "Article",
    async () => {
      const article = await prisma.article.create({
        data: {
          title: data.title,
          slug,
          status: "DRAFT",
          lang: "ta",
          authorId: session?.user?.id as string,
          createdById: session?.user?.id as string,
        }
      });
      revalidatePath('/admin/articles');
      return { success: true, id: article.id };
    },
    { userId: session?.user?.id as string, diff: { title: data.title } }
  );
}

export async function updateArticle(id: string, data: any, saveAsRevision = true) {
  const session = await auth();
  requireRole(session?.user?.role as string, ["OWNER", "ADMIN", "EDITOR", "AUTHOR"]);

  return withAudit(
    "article.update",
    "Article",
    async () => {
      if (saveAsRevision && data.contentHtml) {
        await saveRevision(id, data.contentHtml, data.title, session?.user?.id as string);
      }

      await prisma.article.update({
        where: { id },
        data: {
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          contentHtml: data.contentHtml,
          status: data.status,
          publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
          authorId: data.authorId,
          updatedById: session?.user?.id as string,
        }
      });
      revalidatePath('/admin/articles');
      revalidatePath(`/article/${data.slug}`);
      return { success: true };
    },
    { userId: session?.user?.id as string, entityId: id, diff: { title: data.title, status: data.status } }
  );
}
