import { Badge } from "./Badge";

interface CategoryBadgeProps {
  category: string;
  categoryTamil: string;
}

export default function CategoryBadge({ category, categoryTamil }: CategoryBadgeProps) {
  return (
    <Badge href={`/category/${category}`} variant="solid">
      {categoryTamil}
    </Badge>
  );
}
