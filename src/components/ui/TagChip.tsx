import { Badge } from "./Badge";

interface TagChipProps {
  tag: string;
}

export default function TagChip({ tag }: TagChipProps) {
  return (
    <Badge href={`/tag/${encodeURIComponent(tag)}`} variant="outline">
      #{tag}
    </Badge>
  );
}
