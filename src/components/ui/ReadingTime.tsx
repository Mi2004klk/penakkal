export default function ReadingTime({ minutes, className = "" }: { minutes: number; className?: string }) {
  return (
    <span className={className}>
      {minutes} நிமிட வாசிப்பு
    </span>
  );
}
