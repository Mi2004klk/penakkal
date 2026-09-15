import { auth, requireRole } from "@/lib/auth";
import { prisma } from "@/lib/content/prisma";
import { NextResponse } from "next/server";
import { processImageBuffer } from "@/lib/media/process";
import { R2StorageAdapter } from "@/lib/media/storage-r2";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  
  try {
    requireRole(session.user?.role as string, ["OWNER", "ADMIN", "EDITOR", "AUTHOR"]);
  } catch {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const mediaId = params.id;
  const media = await prisma.media.findUnique({ where: { id: mediaId } });
  
  if (!media) return new NextResponse("Not found", { status: 404 });

  try {
    const storage = new R2StorageAdapter();
    const buffer = await storage.get(media.storageKey);
    
    const processed = await processImageBuffer(buffer);
    
    // In a real app we'd upload the variants back to R2 here
    
    await prisma.media.update({
      where: { id: mediaId },
      data: {
        checksum: processed.hash,
        mimeType: processed.mimeType,
        width: processed.width,
        height: processed.height,
        variants: processed.variants,
      }
    });

    return NextResponse.json({ success: true, processed });
  } catch (error: any) {
    console.error("Media processing failed", error);
    return new NextResponse(error.message, { status: 500 });
  }
}
