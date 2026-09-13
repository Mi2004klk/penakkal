export const dynamic = "force-static";
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    host: 'https://penakkal.com',
    sitemap: 'https://penakkal.com/sitemap.xml',
  };
}
