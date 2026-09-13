export const dynamic = "force-static";

import { absoluteUrl, siteUrl } from "@/lib/seo";
import { formatRSSDate } from "@/lib/dateUtils";
import { getAllArticles } from "@/lib/articles";
import { Article } from "@/types/article";

export async function GET() {
  const articles = await getAllArticles();
  const latestArticles = articles.slice(0, 50); // Top 50 for feed
  
  const feed = `<?xml version="1.0" encoding="utf-8"?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>பேனாக்கள் — இஸ்லாமிய தமிழ் வலைப்பூ</title>
      <link>${siteUrl}</link>
      <description>தமிழ் முஸ்லிம்களுக்கான இஸ்லாமிய அறிவு வலைப்பூ. குர்ஆன், ஹதீஸ், மற்றும் இஸ்லாமிய வரலாற்றை தேடிக் கற்கும் தளம்.</description>
      <language>ta</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <ttl>60</ttl>
      <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
      ${latestArticles
        .map(
          (article: Article) => `
        <item>
          <title><![CDATA[${article.title}]]></title>
          <link>${absoluteUrl(`/blog/${article.slug}`)}</link>
          <guid isPermaLink="true">${absoluteUrl(`/blog/${article.slug}`)}</guid>
          <pubDate>${formatRSSDate(article.publishedAt)}</pubDate>
          <description><![CDATA[${article.excerpt}]]></description>
          <category><![CDATA[${article.categoryTamil || article.category}]]></category>
          ${article.tags && article.tags.length > 0 ? article.tags.map((tag: string) => `<category><![CDATA[${tag}]]></category>`).join('\n          ') : ""}
          ${article.author ? `<author>noreply@penakkal.com (${article.author})</author>` : ""}
          ${article.coverImage ? `<enclosure url="${siteUrl}${article.coverImage}" type="image/webp" />` : ""}
        </item>`
        )
        .join("")}
    </channel>
  </rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=1200, stale-while-revalidate=600",
    },
  });
}
