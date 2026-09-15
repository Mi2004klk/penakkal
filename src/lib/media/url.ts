import { Media } from "@prisma/client";

export function mediaUrl(media: Media | null, variant?: string): string {
  if (!media) return "";
  
  const baseUrl = process.env.NEXT_PUBLIC_R2_URL || "https://media.penakkal.com";
  
  // Legacy paths from WordPress import
  if (media.storageKey.startsWith("legacy/")) {
    return `${baseUrl}/${media.storageKey}`;
  }

  if (variant && media.variants && (media.variants as any)[variant]) {
    return `${baseUrl}/${(media.variants as any)[variant].key}`;
  }
  
  return `${baseUrl}/${media.storageKey}`;
}
