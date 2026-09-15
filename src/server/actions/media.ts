"use server";

import { prisma } from "@/lib/content/prisma";
import { auth, requireRole } from "@/lib/auth";
import { withAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export async function updateMediaMetadata(id: string, data: any) {
  const session = await auth();
  requireRole(session?.user?.role as string, ["OWNER", "ADMIN", "EDITOR", "AUTHOR"]);

  return withAudit(
    "media.updateMeta",
    "Media",
    async () => {
      await prisma.media.update({
        where: { id },
        data: {
          altText: data.altText,
          caption: data.caption,
          credit: data.credit,
          title: data.title,
          focalX: data.focalX,
          focalY: data.focalY,
        }
      });
      revalidatePath('/admin/media');
      return { success: true };
    },
    { userId: session?.user?.id as string, entityId: id, diff: data }
  );
}

export async function trashMedia(id: string) {
  const session = await auth();
  requireRole(session?.user?.role as string, ["OWNER", "ADMIN", "EDITOR"]);

  return withAudit(
    "media.trash",
    "Media",
    async () => {
      await prisma.media.update({
        where: { id },
        data: {
          status: 'TRASHED',
          trashedAt: new Date()
        }
      });
      revalidatePath('/admin/media');
      return { success: true };
    },
    { userId: session?.user?.id as string, entityId: id }
  );
}
