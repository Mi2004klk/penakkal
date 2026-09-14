import ArticleCard from "./ArticleCard";
import { Article } from "@/types/article";

export default function RelatedArticles({ articles }: { articles: Article[] }) {
  if (!articles || articles.length === 0) return null;
  
  return (
    <div className="mt-8 pt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} viewMode="grid" />
        ))}
      </div>
    </div>
  );
}
