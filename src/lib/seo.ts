import { Article } from '@/types/article';

export const siteUrl = "https://penakkal.com";
import { formatISODate } from './dateUtils';

export function absoluteUrl(path: string): string {
  let normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // URL encode segments to handle Tamil characters safely
  normalizedPath = normalizedPath
    .split('/')
    .map(segment => segment ? encodeURIComponent(decodeURIComponent(segment)) : '')
    .join('/');
    
  // Ensure trailing slash is present (Next.js config: trailingSlash: true)
  if (normalizedPath !== '/' && !normalizedPath.endsWith('/')) {
    normalizedPath += '/';
  }
  
  return `${siteUrl}${normalizedPath}`;
}

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "பேனாக்கள்",
    "url": siteUrl,
    "logo": `${siteUrl}/logo-512.png`,
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

export function getArticleSchema(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blog/${article.slug}`)
    },
    "headline": article.title,
    "description": article.excerpt,
    "image": article.coverImage ? `${siteUrl}${article.coverImage}` : `${siteUrl}/logo-512.png`,
    "datePublished": formatISODate(article.publishedAt),
    "dateModified": formatISODate(article.updatedAt || article.publishedAt),
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "பேனாக்கள்",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo-512.png`
      }
    },
    "inLanguage": "ta",
    "articleSection": article.categoryTamil || article.category,
    "keywords": article.tags ? article.tags.join(", ") : undefined,
    "isPartOf": {
      "@type": "Blog",
      "@id": absoluteUrl("/blog")
    }
  };
}

export function getBreadcrumbSchema(items: { name: string, url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`
    }))
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
