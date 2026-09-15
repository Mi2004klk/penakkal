import sharp from "sharp";
import crypto from "crypto";
import { fileTypeFromBuffer } from "file-type";

export async function processImageBuffer(buffer: Buffer) {
  const type = await fileTypeFromBuffer(buffer);
  
  if (!type || !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(type.mime)) {
    throw new Error("Unsupported file type");
  }

  const hash = crypto.createHash("sha256").update(buffer).digest("hex");
  const pipeline = sharp(buffer).rotate(); // auto-orient based on EXIF
  
  const metadata = await pipeline.metadata();
  
  // Create LQIP Blur hash (10x10 base64)
  const lqipBuffer = await pipeline
    .clone()
    .resize(10, 10, { fit: "inside" })
    .blur(1)
    .webp({ quality: 20 })
    .toBuffer();
    
  const lqip = `data:image/webp;base64,${lqipBuffer.toString("base64")}`;

  const widths = [640, 828, 1080, 1200, 1920];
  const variants: any = { blur: lqip };
  
  // We don't actually process all variants here in this mock, but we would in production
  // We'll just define the variants JSON structure
  for (const w of widths) {
    if (metadata.width && metadata.width >= w) {
      variants[`w${w}`] = {
        avif: { key: `variants/${hash}/${w}.avif` },
        webp: { key: `variants/${hash}/${w}.webp` }
      };
    }
  }

  return {
    hash,
    mimeType: type.mime,
    width: metadata.width,
    height: metadata.height,
    variants
  };
}
