import { getFirstGrapheme } from "@/lib/utils";

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ name, size = 'md', className = '' }: AvatarProps) {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-20 h-20 text-2xl",
  };

  return (
    <div className={`flex-shrink-0 relative ${sizes[size]} ${className}`}>
      <div className="rounded-full bg-moss opacity-20 absolute inset-0 z-0"></div>
      <div className="rounded-full w-full h-full flex items-center justify-center text-forest-stage dark:text-lime-sprout font-bold border-2 border-moss relative z-10 font-ui">
        {getFirstGrapheme(name)}
      </div>
    </div>
  );
}
