import Image from "next/image";

export default function AuthorInfoCard({ authorName }: { authorName: string }) {
  // Mock author description based on name, in a real app this would come from a CMS
  const authorDesc = "இஸ்லாமிய கட்டுரைகள் மற்றும் வரலாற்று குறிப்புகளை எழுதும் எழுத்தாளர். குர்ஆன் மற்றும் ஹதீஸ் ஒளியில் சமூக சிந்தனைகளை பகிர்ந்து வருகிறார்.";
  
  return (
    <div className="flex flex-col sm:flex-row gap-6 p-6 bg-[color:var(--color-surface-card)] border border-[color:var(--color-border-default)] rounded-[length:var(--radius-cards)]">
      <div className="flex-shrink-0">
        <div className="w-20 h-20 rounded-full bg-[color:var(--color-moss)] opacity-10 flex items-center justify-center text-[color:var(--color-moss)] text-2xl font-bold border-2 border-[color:var(--color-moss)]">
          {authorName.charAt(0)}
        </div>
      </div>
      <div>
        <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-subheading)] font-bold text-[color:var(--color-heading)] mb-2">
          {authorName}
        </h3>
        <p className="font-[family-name:var(--font-body)] text-[length:var(--text-body)] text-[color:var(--color-body-text)] leading-relaxed">
          {authorDesc}
        </p>
      </div>
    </div>
  );
}
