export default function MetaSeparator({ className = "bg-moss/40 " }: { className?: string }) {
  return <span className={`w-1 h-1 rounded-full shrink-0 ${className}`}></span>;
}
