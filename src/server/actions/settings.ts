"use server";

import { prisma } from "@/lib/content/prisma";
import { auth, requireRole } from "@/lib/auth";
import { withAudit } from "@/lib/audit";
import { revalidateTag } from "next/cache";

export async function updateSettings(group: string, data: any) {
  const session = await auth();
  requireRole(session?.user?.role as string, ["OWNER", "ADMIN"]);

  return withAudit(
    "settings.update",
    "Setting",
    async () => {
      // Data is typically an object of key-value pairs for the group
      for (const [key, value] of Object.entries(data)) {
        await prisma.setting.upsert({
          where: { key },
          update: { value: value as any, updatedById: session?.user?.id },
          create: { key, group, value: value as any, updatedById: session?.user?.id }
        });
      }
      
      revalidateTag("settings");
      return { success: true };
    },
    { userId: session?.user?.id as string, diff: { group, keys: Object.keys(data) } }
  );
}
