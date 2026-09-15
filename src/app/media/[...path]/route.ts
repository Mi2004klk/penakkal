import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { path: string[] } }) {
  const filePath = params.path.join('/');
  
  // Legacy media redirect to R2 bucket
  const r2Url = process.env.R2_PUBLIC_URL || "https://media.penakkal.com";
  
  // Example: /media/covers/article.webp -> https://r2.../legacy/covers/article.webp
  const redirectUrl = `${r2Url}/legacy/${filePath}`;
  
  return NextResponse.redirect(redirectUrl, {
    status: 301,
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}
