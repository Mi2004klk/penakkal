export const siteUrl = "https://penakkal.com";

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "பேனாக்கள்",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "description": "தமிழ் முஸ்லிம்களுக்கான இஸ்லாமிய அறிவு வலைப்பூ"
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "பேனாக்கள்",
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}

export function getArticleSchema(article: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.coverImage ? `${siteUrl}${article.coverImage}` : undefined,
    "datePublished": article.date,
    "dateModified": article.date,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "பேனாக்கள்",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    }
  };
}

export function getCollectionSchema(title: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": title,
    "description": description,
    "url": `${siteUrl}${url}`
  };
}

export function getSearchResultsSchema(query: string, resultsCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    "name": `"${query}" தேடல் முடிவுகள்`,
    "url": `${siteUrl}/search?q=${encodeURIComponent(query)}`
  };
}
