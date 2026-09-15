import { prisma } from "../content/prisma";

export async function registerUsage(mediaId: string, entityType: string, entityId: string, field: string) {
  await prisma.mediaUsage.upsert({
    where: {
      mediaId_entityType_entityId_field: {
        mediaId,
        entityType,
        entityId,
        field
      }
    },
    update: {},
    create: {
      mediaId,
      entityType,
      entityId,
      field
    }
  });
}

export async function removeUsage(mediaId: string, entityType: string, entityId: string, field: string) {
  await prisma.mediaUsage.delete({
    where: {
      mediaId_entityType_entityId_field: {
        mediaId,
        entityType,
        entityId,
        field
      }
    }
  }).catch(() => {
    // Ignore if not found
  });
}

export async function getUsages(mediaId: string) {
  return prisma.mediaUsage.findMany({
    where: { mediaId }
  });
}
