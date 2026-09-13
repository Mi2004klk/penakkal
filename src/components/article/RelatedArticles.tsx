import ArticleCard from "./ArticleCard";
import { Article } from "@/types/article";
import { Badge } from "../ui/Badge";

export default function RelatedArticles({ sourceArticle, articles }: { sourceArticle?: Article, articles: Article[] }) {
  if (!articles || articles.length === 0) return null;
  
  return (
    <div className="mt-8 pt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((article) => {
          let reason = "";
          if (sourceArticle) {
            if (article.category === sourceArticle.category) reason = "ஒரே வகை";
            else if (article.tags.some(t => sourceArticle.tags.includes(t))) reason = "தொடர்புடைய குறிச்சொல்";
            else if (article.author === sourceArticle.author) reason = "அதே எழுத்தாளர்";
          }
          
          return (
            <div key={article.id} className="relative pt-6">
              {reason && (
                <div className="absolute top-0 left-4 z-10 -translate-y-1/2">
                  <Badge variant="outline" className="border-moss text-text-link hover:border-moss hover:text-text-link bg-surface-card rounded-full shadow-none">
                    {reason}
                  </Badge>
                </div>
              )}
              <ArticleCard article={article} viewMode="grid" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
