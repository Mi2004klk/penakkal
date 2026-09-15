"use server";

import { prisma } from "@/lib/content/prisma";
import { auth, requireRole } from "@/lib/auth";
import { withAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export async function createCategory(data: any) {
  const session = await auth();
  requireRole(session?.user?.role as string, ["OWNER", "ADMIN", "EDITOR"]);

  return withAudit(
    "category.create",
    "Category",
    async () => {
      const category = await prisma.category.create({
        data: {
          nameTamil: data.nameTamil,
          nameEnglish: data.nameEnglish,
          slug: data.slug,
          description: data.description,
          parentId: data.parentId || null,
          sortOrder: data.sortOrder || 0,
        }
      });
      revalidatePath('/admin/categories');
      return { success: true, id: category.id };
    },
    { userId: session?.user?.id as string, diff: data }
  );
}

export async function updateCategoryOrders(updates: { id: string; sortOrder: number; parentId: string | null }[]) {
  const session = await auth();
  requireRole(session?.user?.role as string, ["OWNER", "ADMIN", "EDITOR"]);

  return withAudit(
    "category.reorder",
    "Category",
    async () => {
      for (const update of updates) {
        await prisma.category.update({
          where: { id: update.id },
          data: { sortOrder: update.sortOrder, parentId: update.parentId }
        });
      }
      revalidatePath('/admin/categories');
      return { success: true };
    },
    { userId: session?.user?.id as string }
  );
}

export async function createTag(data: any) {
  const session = await auth();
  requireRole(session?.user?.role as string, ["OWNER", "ADMIN", "EDITOR"]);

  return withAudit(
    "tag.create",
    "Tag",
    async () => {
      const tag = await prisma.tag.create({
        data: {
          name: data.name,
          slug: data.slug,
        }
      });
      revalidatePath('/admin/tags');
      return { success: true, id: tag.id };
    },
    { userId: session?.user?.id as string, diff: data }
  );
}
