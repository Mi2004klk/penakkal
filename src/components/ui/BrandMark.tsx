import Link from "next/link";
import Image from "next/image";

interface BrandMarkProps {
  variant: "header" | "footer" | "drawer";
  onClick?: () => void;
}

export default function BrandMark({ variant, onClick }: BrandMarkProps) {
  const sizes = {
    header: "h-8 md:h-10 w-auto",
    footer: "h-10 w-auto",
    drawer: "h-8 w-auto",
  };

  return (
    <Link 
      href="/" 
      onClick={onClick} 
      aria-label="பேனாக்கள் முகப்பு" 
      className={variant === 'footer' ? 'inline-block mb-6' : 'flex items-center gap-2'}
    >
      <Image
        src="/logo-header.png"
        alt="பேனாக்கள் லோகோ"
        width={150}
        height={40}
        priority={variant === "header"}
        className={`${sizes[variant]} object-contain   transition-all`}
      />
    </Link>
  );
}
