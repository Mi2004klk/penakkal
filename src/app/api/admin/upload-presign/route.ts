import { auth, requireRole } from "@/lib/auth";
import { R2StorageAdapter } from "@/lib/media/storage-r2";
import { prisma } from "@/lib/content/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  
  try {
    requireRole(session.user?.role as string, ["OWNER", "ADMIN", "EDITOR", "AUTHOR"]);
  } catch {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { filename, contentType, size } = await req.json();
  
  if (size > 25 * 1024 * 1024) {
    return new NextResponse("File too large", { status: 400 });
  }

  const storage = new R2StorageAdapter();
  const date = new Date();
  const prefix = `originals/${date.getUTCFullYear()}/${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
  
  // Safe filename
  const safeName = filename.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
  const hash = crypto.randomBytes(4).toString('hex');
  const storageKey = `${prefix}/${hash}-${safeName}`;

  const uploadUrl = await storage.sign(storageKey, 3600);

  const pendingMedia = await prisma.media.create({
    data: {
      checksum: `pending-${hash}`,
      storageKey,
      filename: safeName,
      originalName: filename,
      mimeType: contentType,
      size,
      status: 'ACTIVE',
      uploadedById: session.user?.id
    }
  });

  return NextResponse.json({
    mediaId: pendingMedia.id,
    uploadUrl,
    storageKey,
  });
}
