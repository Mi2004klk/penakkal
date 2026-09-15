"use server";

import { prisma } from "@/lib/content/prisma";
import { auth, requireRole } from "@/lib/auth";
import { withAudit } from "@/lib/audit";
import * as argon2 from "@node-rs/argon2";
import { revalidatePath } from "next/cache";

export async function createUser(data: any) {
  const session = await auth();
  requireRole(session?.user?.role as string, ["OWNER"]);

  const passwordHash = await argon2.hash(data.password);

  return withAudit(
    "user.create",
    "User",
    async () => {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          passwordHash,
          role: data.role,
        }
      });
      revalidatePath('/admin/users');
      return { success: true, id: user.id };
    },
    { userId: session?.user?.id as string, diff: { email: data.email, role: data.role } }
  );
}

export async function updateUser(id: string, data: any) {
  const session = await auth();
  requireRole(session?.user?.role as string, ["OWNER"]);

  const updateData: any = {
    name: data.name,
    email: data.email,
    role: data.role,
    isActive: data.isActive,
  };

  if (data.password) {
    updateData.passwordHash = await argon2.hash(data.password);
  }

  return withAudit(
    "user.update",
    "User",
    async () => {
      await prisma.user.update({
        where: { id },
        data: updateData
      });
      revalidatePath('/admin/users');
      return { success: true };
    },
    { userId: session?.user?.id as string, entityId: id, diff: { email: data.email, role: data.role, isActive: data.isActive } }
  );
}
