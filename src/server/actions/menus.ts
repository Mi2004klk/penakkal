"use server";

import { prisma } from "@/lib/content/prisma";
import { auth, requireRole } from "@/lib/auth";
import { withAudit } from "@/lib/audit";
import { revalidatePath, revalidateTag } from "next/cache";

export async function saveMenuStructure(menuLocation: string, items: any[]) {
  const session = await auth();
  requireRole(session?.user?.role as string, ["OWNER", "ADMIN"]);

  return withAudit(
    "menu.update",
    "Menu",
    async () => {
      // Find or create the menu
      let menu = await prisma.menu.findUnique({ where: { slug: menuLocation } });
      if (!menu) {
        menu = await prisma.menu.create({
          data: { slug: menuLocation, location: menuLocation }
        });
      }

      // Delete existing items
      await prisma.menuItem.deleteMany({ where: { menuId: menu.id } });

      // Create new structure
      for (const item of items) {
        await prisma.menuItem.create({
          data: {
            menuId: menu.id,
            label: item.label,
            url: item.url,
            sortOrder: item.sortOrder,
            parentId: item.parentId || null,
          }
        });
      }

      revalidateTag("menus");
      revalidatePath('/admin/menus');
      return { success: true };
    },
    { userId: session?.user?.id as string, diff: { menuLocation, itemsCount: items.length } }
  );
}
