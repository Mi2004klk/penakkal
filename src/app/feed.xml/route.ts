export const dynamic = "force-static";

import { getAllArticles } from "@/lib/articles";

export async function GET() {
  const articles = await getAllArticles();
  const latestArticles = articles.slice(0, 20); // Top 20 for feed
  
  const siteUrl = "https://penakkal.com";
  
  const feed = `<?xml version="1.0" encoding="utf-8"?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>பேனாக்கல் — இஸ்லாமிய தமிழ் வலைப்பூ</title>
      <link>${siteUrl}</link>
      <description>தமிழ் முஸ்லிம்களுக்கான இஸ்லாமிய அறிவு வலைப்பூ. குர்ஆன், ஹதீஸ், மற்றும் இஸ்லாமிய வரலாற்றை தேடிக் கற்கும் தளம்.</description>
      <language>ta</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
      ${latestArticles
        .map(
          (article) => `
        <item>
          <title><![CDATA[${article.title}]]></title>
          <link>${siteUrl}/blog/${article.slug}</link>
          <guid isPermaLink="true">${siteUrl}/blog/${article.slug}</guid>
          <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
          <description><![CDATA[${article.excerpt}]]></description>
          ${article.categoryTamil ? `<category><![CDATA[${article.categoryTamil}]]></category>` : ""}
          ${article.author ? `<author>${article.author}</author>` : ""}
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
