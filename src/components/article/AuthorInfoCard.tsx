import { Card } from "../ui/Card";
import { Avatar } from "../ui/Avatar";
import Link from "next/link";

export default function AuthorInfoCard({ authorName, authorSlug, bio }: { authorName: string, authorSlug?: string, bio?: string }) {
  // Use provided bio or fallback to a generic description
  const authorDesc = bio || "இவரது கட்டுரைகள்";
  
  return (
    <Card className="flex flex-col sm:flex-row gap-6 p-6">
      {authorSlug ? (
        <Link href={`/author/${authorSlug}`} className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss rounded-full">
          <Avatar name={authorName} size="lg" />
        </Link>
      ) : (
        <div className="shrink-0">
          <Avatar name={authorName} size="lg" />
        </div>
      )}
      <div>
        <h3 className="font-display text-subheading font-bold text-heading mb-2">
          {authorSlug ? (
            <Link href={`/author/${authorSlug}`} className="hover:text-text-link transition-colors focus-visible:outline-none focus-visible:underline">
              {authorName}
            </Link>
          ) : (
            authorName
          )}
        </h3>
        <p className="font-body text-body text-body-text leading-relaxed">
          {authorDesc}
        </p>
      </div>
    </Card>
  );
}
